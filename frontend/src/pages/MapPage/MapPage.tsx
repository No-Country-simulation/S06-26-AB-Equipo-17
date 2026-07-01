import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTranslation } from "react-i18next";
import { GeoJSON, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { AIPrompt } from "../../components/AIPrompt";
import { MapFilterBar, type MapFilterItem } from "../../components/MapFilterBar";
import { Legend } from "../../components/Legend";
import { RegionKpiCard } from "../../components/RegionKpiCard";
import { QueryFlowModal } from "../../features/query-flow";
import { regionStyle } from "./regions";
import { indexByName, mockRegionKpis, toCardProps } from "./regionKpis";
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
  const icon = L.divIcon({
    className: "bairro-label",
    html: name,
    iconSize: [90, 16],
    iconAnchor: [45, 8],
  });
  return [{ name, center, icon }];
});

/** KPIs por bairro (hover) — índice por nome. MOCK hoje; no futuro o payload
 *  do GET /mapa entra em `mockRegionKpis` (ver ./regionKpis.ts). */
const REGION_KPIS = indexByName(
  mockRegionKpis(
    BAIRROS.features.flatMap((f) => {
      const name = f.properties?.name as string | undefined;
      return name ? [name] : [];
    }),
  ),
);

/** Temas do mapa (filtro client-side; o `/mapa` traz tudo). Os rótulos vêm
 *  do i18n (namespace `map`) — ver `themes.*`. */
const THEME_VALUES = ["overview", "education", "health", "housing", "employment"] as const;

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
  // Rótulos dos temas vêm do i18n; reconstroem ao trocar de idioma.
  const themes: MapFilterItem[] = THEME_VALUES.map((value) => ({
    value,
    label: t(`themes.${value}`),
  }));

  // Legenda montada uma vez e reutilizada em dois pontos (canto no desktop /
  // acima do prompt no tablet); só um deles fica visível por breakpoint.
  const legend = (
    <Legend
      className="pointer-events-auto"
      title={t("legend.title")}
      items={[
        { tone: "success", label: t("legend.fullCoverage") },
        { tone: "info", label: t("legend.monitoring") },
        { tone: "orange", label: t("legend.highCriticality") },
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
            (RegionKpiCard) segue o cursor. Dados MOCK por ora.
            key={i18n.language} → rebinda os tooltips ao trocar de idioma. */}
        <GeoJSON
          key={i18n.language}
          data={BAIRROS}
          style={regionStyle}
          onEachFeature={(feature, layer) => {
            const name = feature.properties?.name as string | undefined;
            const kpi = name ? REGION_KPIS[name] : undefined;
            if (!kpi) return; // sem dado p/ o bairro → sem card
            const html = renderToStaticMarkup(
              <RegionKpiCard {...toCardProps(kpi, t("hover.label"))} />,
            );
            layer.bindTooltip(html, {
              sticky: true,
              direction: "top",
              opacity: 1,
              className: "region-kpi-tooltip",
            });
          }}
        />

        {/* Rótulos fixos com o nome de cada bairro (não-interativos). */}
        {BAIRRO_LABELS.map((b) => (
          <Marker key={b.name} position={b.center} icon={b.icon} interactive={false} />
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
