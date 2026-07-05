import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTranslation } from "react-i18next";
import { GeoJSON, MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { AIPrompt } from "../../components/AIPrompt";
import { MapFilterBar, type MapFilterItem } from "../../components/MapFilterBar";
import { Legend } from "../../components/Legend";
import { MapPin } from "../../components/MapPin";
import { RegionKpiCard } from "../../components/RegionKpiCard";
import { QueryFlowModal } from "../../features/query-flow";
import { useMapNetwork, useMapMobility, useMapOverview } from "../../api/hooks";
import { MapBubble } from "./MapBubble";
import { regionStyle } from "./regions";
import { indexByName, toBairroKpis, toCoverageZones } from "./coverage";
import { toMobilityBubbles } from "./mobility";
import { indexMonitoringByBairro, normalizeBairroName } from "./overview";
import bairros from "./bairros.json";

// Corrige os ícones padrão do Leaflet com bundlers (Vite resolve as imagens
// como URLs; sem isso o marker fica quebrado). Mantido para os ícones de
// referência que serão renderizados sobre os bairros futuramente.
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/** Bairros de Florianópolis (fronteiras do OpenStreetMap, admin_level=10). */
const BAIRROS = bairros as FeatureCollection;

/** Enquadramento inicial = limites dos bairros de Florianópolis. Derivar dos
 *  dados é mais robusto que center/zoom fixos — abre sempre enquadrado em Floripa. */
const BOUNDS = L.geoJSON(BAIRROS).getBounds();

/** Rótulos fixos dos bairros — nome + centro do polígono + ícone (divIcon).
 *  Ficam num <Marker> não-interativo p/ não bloquear o hover dos polígonos.
 *  Pré-computados uma vez (BAIRROS é constante). */
const BAIRRO_LABELS = BAIRROS.features.flatMap((feature) => {
  const name = feature.properties?.name as string | undefined;
  if (!name) return [];
  const center = L.geoJSON(feature).getBounds().getCenter();
  // Dois ícones: centrado no centroide (padrão) e deslocado ~22px PRA BAIXO
  // (anchor y negativo) p/ não sobrepor o pin do overview, que fica no centroide.
  const mkIcon = (iconAnchor: [number, number]) =>
    L.divIcon({ className: "bairro-label", html: name, iconSize: [90, 16], iconAnchor });
  return [{ name, center, iconCentered: mkIcon([45, 8]), iconBelow: mkIcon([45, -22]) }];
});

/** Temas do mapa (filtro client-side; o `/mapa` traz tudo). Os rótulos vêm
 *  do i18n (namespace `map`) — ver `themes.*`. `network` liga a camada de
 *  pins das zonas monitoradas (dado real do GET /mapa; ver ./coverage.ts). */
const THEME_VALUES = ["overview", "network", "mobility", "education", "health", "housing", "employment"] as const;

/** Cor das bolhas de mobilidade — primary do DS (Leaflet exige cor CSS crua). */
const MOBILITY_COLOR = "#2f6bff";
/** Raio das bolhas (px): mín. + √(viagens/máx) → área ∝ viagens (proporcional). */
const BUBBLE_MIN_RADIUS = 10;
const BUBBLE_MAX_RADIUS = 44;

/** Congestionamento vem como taxa 0–1 → exibir como percentual ("35%"). */
function formatCongestion(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(value);
}

/**
 * Controla os rótulos dos bairros conforme o zoom (deve viver dentro do
 * <MapContainer> p/ acessar o `useMap`). CSS puro não enxerga o zoom do
 * Leaflet, então dirigimos por JS escrevendo no container do mapa:
 *  - `--bairro-label-size`: tamanho do texto = clamp(8, 11 + Δzoom×1.5, 16)px
 *    → afastado fica menor (menos sobreposição), aproximado fica maior.
 *  - classe `.bairro-labels-hidden`: no MOBILE, some com os 56 nomes na visão
 *    geral (evita o amontoado do print) e só reaparecem ao aproximar 2 níveis.
 *    No desktop os rótulos ficam sempre visíveis (há espaço).
 *  Base = zoom inicial (o mapa abre via `bounds`, então getZoom() é o "fit").
 */
function BairroLabelZoom() {
  const map = useMap();
  const baseZoomRef = useRef<number | null>(null);

  useEffect(() => {
    const el = map.getContainer();
    if (baseZoomRef.current === null) baseZoomRef.current = map.getZoom();
    const base = baseZoomRef.current;

    const update = () => {
      const zoom = map.getZoom();
      const size = Math.max(8, Math.min(16, 11 + (zoom - base) * 1.5));
      el.style.setProperty("--bairro-label-size", `${size}px`);
      // Limiar só no mobile (<768px); desktop nunca esconde.
      const isMobile = window.innerWidth < 768;
      el.classList.toggle("bairro-labels-hidden", isMobile && zoom < base + 2);
    };

    update();
    map.on("zoomend", update);
    return () => {
      map.off("zoomend", update);
    };
  }, [map]);

  return null;
}

/**
 * Tela inicial do app — mapa temático de Florianópolis: basemap claro sem
 * rótulos + bairros coloridos em tons pastel. O prompt da IA fica sobreposto.
 *
 * Estrutura preparada para receber, no futuro, uma camada de <Marker>/divIcon
 * com ícones de referência sobre os bairros (o markerPane do Leaflet já
 * renderiza ícones acima dos polígonos, sem ajuste de z-index).
 */
export function MapPage() {
  const [prompt, setPrompt] = useState("");
  const [flowOpen, setFlowOpen] = useState(false);
  // Muda a cada abertura → remonta o modal pegando o texto atual do prompt.
  const [flowSeed, setFlowSeed] = useState(0);
  // Tema selecionado — filtra os dados do mapa no cliente (TODO: aplicar quando
  // o contrato do /mapa expor o campo de tema/indicador).
  const [theme, setTheme] = useState("overview");

  const { t, i18n } = useTranslation("map");
  const locale = i18n.resolvedLanguage ?? i18n.language;
  // Rótulos dos temas vêm do i18n; reconstroem ao trocar de idioma.
  const themes: MapFilterItem[] = THEME_VALUES.map((value) => ({
    value,
    label: t(`themes.${value}`),
  }));

  // Camada "Cobertura de Rede" (tema `network`) — dado REAL do GET /mapa/rede.
  // Fetch LAZY: só busca quando o filtro está selecionado.
  const { data: networkData } = useMapNetwork(theme === "network");
  // 1 pin por zona (agregado em ./coverage.ts). O divIcon é pré-computado
  // aqui (e não no render dos Markers): a página re-renderiza a cada tecla
  // do prompt e recriar o icon faria o Leaflet re-montar os pins à toa.
  // MapPin é puro (sem hooks) → pode ser serializado com renderToStaticMarkup.
  // Zona SEM dado de rede (`noData`) → pin vermelho (tom `critical`).
  const coveragePins = useMemo(() => {
    if (!networkData) return [];
    return toCoverageZones(networkData.points).map((zone) => ({
      ...zone,
      icon: L.divIcon({
        className: "coverage-pin",
        html: renderToStaticMarkup(
          <MapPin
            size="sm"
            tone={zone.noData ? "critical" : "info"}
            label={`${t(zone.noData ? "coverage.noDataLabel" : "coverage.pinLabel")}: ${zone.label}`}
          />,
        ),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    }));
  }, [networkData, t]);

  // KPIs por bairro (hover) — dado real do GET /mapa/rede via join híbrido
  // zona→bairro (nome normalizado primeiro, espacial de fallback — ver
  // ./coverage.ts). Bairro sem zona monitorada fica SEM card (é informação).
  const regionKpis = useMemo(
    () => indexByName(networkData ? toBairroKpis(networkData.points, BAIRROS) : []),
    [networkData],
  );

  // Camada "Mobilidade" (tema `mobility`) — fluxos OD do GET /mapa/mobilidade.
  // Fetch LAZY: só busca quando o filtro está selecionado.
  const { data: mobilityData } = useMapMobility(theme === "mobility");
  // Agrega os fluxos em BOLHAS por zona (símbolos proporcionais — evita o
  // espaguete das linhas). Raio ∝ √viagens → ÁREA ∝ viagens.
  const mobilityBubbles = useMemo(() => {
    const bubbles = toMobilityBubbles(mobilityData?.flows ?? []);
    const maxTrips = Math.max(1, ...bubbles.map((b) => b.trips));
    return bubbles.map((b) => ({
      ...b,
      radius:
        BUBBLE_MIN_RADIUS + Math.sqrt(b.trips / maxTrips) * (BUBBLE_MAX_RADIUS - BUBBLE_MIN_RADIUS),
    }));
  }, [mobilityData]);

  // Camada "Visão Geral" (tema `overview`) — 1 pin por BAIRRO colorido pela
  // legenda: monitorado = azul (info, "Em monitoramento"), senão vermelho
  // (critical, "Sem cobertura"). Join do payload (por nome) com os centroides
  // dos bairros do GeoJSON. Fetch LAZY (overview é o tema inicial → busca já).
  const { data: overviewData } = useMapOverview(theme === "overview");
  const overviewPins = useMemo(() => {
    if (!overviewData) return [];
    const byBairro = indexMonitoringByBairro(overviewData.bairros);
    return BAIRRO_LABELS.map((b) => {
      const info = byBairro[normalizeBairroName(b.name)];
      const monitored = info?.monitored ?? false;
      const statusLabel = `${b.name} · ${t(monitored ? "legend.monitoring" : "legend.noCoverage")}`;
      return {
        name: b.name,
        center: b.center,
        monitored,
        antennas: info?.antennas ?? 0,
        statusLabel,
        icon: L.divIcon({
          className: "overview-pin",
          html: renderToStaticMarkup(
            <MapPin size="sm" tone={monitored ? "info" : "critical"} label={statusLabel} />,
          ),
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      };
    });
  }, [overviewData, t]);

  // Legenda montada uma vez e reutilizada em dois pontos (canto no desktop /
  // acima do prompt no tablet); só um deles fica visível por breakpoint.
  // Só os tons usados no mapa: azul (info) = monitorado/com dado · vermelho
  // (critical) = sem monitoramento/sem dado. Verde/laranja não são usados.
  const legend = (
    <Legend
      className="pointer-events-auto"
      title={t("legend.title")}
      items={[
        { tone: "info", label: t("legend.monitoring") },
        { tone: "critical", label: t("legend.noCoverage") },
      ]}
    />
  );

  return (
    <div className="relative isolate z-0 min-h-0 w-full flex-1">
      <MapContainer
        bounds={BOUNDS}
        boundsOptions={{ padding: [24, 24] }}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* Basemap claro sem nomes de rua — só o contexto água/terra (CARTO). */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />

        {/* Bairros — manchas pastel com borda branca. No hover, um card KPI
            (RegionKpiCard) segue o cursor com o dado REAL do GET /mapa.
            key = idioma + versão do dado → o bind do tooltip é imperativo e
            roda 1x na montagem; remonta ao trocar idioma OU quando o payload
            async chega. */}
        <GeoJSON
          key={`${i18n.language}:${theme}:${networkData ? "data" : "empty"}`}
          data={BAIRROS}
          style={regionStyle}
          onEachFeature={(feature, layer) => {
            // Hover de congestionamento por bairro só no tema `network` — nos
            // outros temas a informação vem dos pins/bolhas próprios.
            if (theme !== "network") return;
            const name = feature.properties?.name as string | undefined;
            const kpi = name ? regionKpis[name] : undefined;
            if (!kpi) return; // sem zona monitorada no bairro → sem card
            const html = renderToStaticMarkup(
              <RegionKpiCard
                value={formatCongestion(kpi.peak, locale)}
                label={t("coverage.congestionLabel")}
              />,
            );
            layer.bindTooltip(html, {
              sticky: true,
              direction: "top",
              opacity: 1,
              className: "region-kpi-tooltip",
            });
          }}
        />

        {/* Rótulos fixos com o nome de cada bairro (não-interativos). No tema
            `overview` o nome desce pra baixo do pin (que fica no centroide). */}
        {BAIRRO_LABELS.map((b) => (
          <Marker
            key={b.name}
            position={b.center}
            icon={theme === "overview" ? b.iconBelow : b.iconCentered}
            interactive={false}
          />
        ))}

        {/* Camada "Cobertura de Rede" (tema `network`) — um MapPin por zona
            monitorada do Vísent (GET /mapa/rede). Zona sem dado de rede =
            pin vermelho + "sem dados"; bairro sem pin = sem monitoramento.
            Tooltip declarativo do react-leaflet → re-traduz sozinho. */}
        {theme === "network" &&
          coveragePins.map((zone) => (
            <Marker key={zone.region} position={[zone.lat, zone.lng]} icon={zone.icon}>
              <Tooltip direction="top" offset={[0, -16]} opacity={1} className="region-kpi-tooltip">
                <RegionKpiCard
                  value={zone.noData ? "—" : formatCongestion(zone.peak, locale)}
                  label={`${zone.label} · ${t(zone.noData ? "coverage.noDataLabel" : "coverage.congestionLabel")}`}
                />
              </Tooltip>
            </Marker>
          ))}

        {/* Camada "Visão Geral" (tema `overview`) — 1 MapPin por bairro,
            colorido pela legenda (azul = monitorado, vermelho = sem cobertura).
            GET /mapa/overview cruzado com os centroides dos bairros. */}
        {theme === "overview" &&
          overviewPins.map((pin) => (
            <Marker key={pin.name} position={pin.center} icon={pin.icon}>
              <Tooltip direction="top" offset={[0, -16]} opacity={1} className="region-kpi-tooltip">
                <RegionKpiCard
                  value={pin.monitored ? pin.antennas.toLocaleString("pt-BR") : "—"}
                  label={pin.statusLabel}
                />
              </Tooltip>
            </Marker>
          ))}

        {/* Camada "Mobilidade" (tema `mobility`) — 1 bolha por zona, área ∝
            viagens totais (GET /mapa/mobilidade agregado). Hover: zona + total. */}
        {theme === "mobility" &&
          mobilityBubbles.map((bubble) => (
            <MapBubble
              key={bubble.zone}
              center={[bubble.lat, bubble.lng]}
              radius={bubble.radius}
              value={bubble.trips.toLocaleString("pt-BR")}
              label={`${bubble.label} · ${t("mobility.tripsLabel")}`}
              color={MOBILITY_COLOR}
            />
          ))}

        {/* Ajusta tamanho/visibilidade dos rótulos conforme o zoom. */}
        <BairroLabelZoom />
      </MapContainer>

      {/* Filtros temáticos sobrepostos — topo, centralizados. Mesma lógica de
          pointer-events do prompt: overlay não captura, faixa captura. */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] flex justify-center px-4 md:top-8">
        <MapFilterBar
          className="pointer-events-auto max-w-full"
          aria-label={t("filterLabel")}
          value={theme}
          onChange={setTheme}
          items={themes}
        />
      </div>

      {/* Legenda no DESKTOP (lg+) — ancorada no canto inferior-esquerdo, flush.
          Há espaço de sobra; o prompt centralizado não colide. */}
      <div className="pointer-events-none absolute bottom-8 left-4 z-[1000] hidden lg:block">
        {legend}
      </div>

      {/* Faixa inferior — prompt da IA; no TABLET (md) a legenda vem acima dele,
          na MESMA coluna centralizada (max-w-2xl) → compartilham a borda
          esquerda. No desktop essa cópia some (vai pro canto acima); no mobile
          some de vez. pointer-events-none no overlay deixa o mapa arrastável. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[1000] flex flex-col items-center gap-3 px-4 md:bottom-8">
        {/* Legenda — só no tablet (md); escondida no mobile e no desktop (lg). */}
        <div className="hidden w-full max-w-2xl md:flex lg:hidden">{legend}</div>

        <div className="pointer-events-auto w-full max-w-2xl">
          <AIPrompt
            value={prompt}
            onChange={setPrompt}
            onSubmit={() => {
              setFlowSeed((s) => s + 1);
              setFlowOpen(true);
            }}
          />
        </div>
      </div>

      {/* Fluxo de consulta — abre ao enviar o prompt, com o texto digitado. */}
      <QueryFlowModal
        key={flowSeed}
        open={flowOpen}
        onOpenChange={setFlowOpen}
        initialQuestion={prompt}
      />
    </div>
  );
}
