/* ============================================================
   Coverage — dados reais do GET /mapa na MapPage.
   O payload traz ~4 leituras por zona monitorada do Vísent
   (períodos do dia, SEM rótulo de período) com a coordenada da
   antena que representou a agregação. Daqui saem DUAS visões:
     1. toCoverageZones — 1 pin por zona (camada "Cobertura de
        Rede", tema `network` do filtro);
     2. toBairroKpis   — valor por BAIRRO p/ o hover, via join
        HÍBRIDO zona→bairro (nome normalizado primeiro; espacial
        — antena dentro do polígono — como fallback).
   As zonas são da GRANDE Floripa (São José, Palhoça, Biguaçu...)
   e não cobrem todos os bairros — ausência de pin/card é
   informação ("sem cobertura de monitoramento").
   ============================================================ */

import type { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import type { MapPoint } from "@/types";

/* ---------------- agregação por zona ---------------- */

/** Uma zona monitorada (1 pin no mapa). */
export type CoverageZone = {
  /** Chave crua da zona no dataset (ex.: "SAO_JOSE_KOBRASOL"). */
  region: string;
  /** Nome apresentável (ex.: "Sao Jose Kobrasol"). */
  label: string;
  lat: number;
  lng: number;
  /** Maior leitura de usuários entre os períodos da zona. */
  peak: number;
};

/** Siglas do dataset que ficam em caixa alta no rótulo. */
const ACRONYMS = new Set(["CBD", "HLZ", "UFSC", "BR101", "SC401"]);

/** "SAO_JOSE_KOBRASOL" → "Sao Jose Kobrasol" (siglas preservadas). */
export function zoneLabel(region: string): string {
  return region
    .split("_")
    .map((word) => (ACRONYMS.has(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()))
    .join(" ");
}

function groupByRegion(points: MapPoint[]): Map<string, MapPoint[]> {
  const byRegion = new Map<string, MapPoint[]>();
  for (const point of points) {
    const list = byRegion.get(point.region) ?? [];
    list.push(point);
    byRegion.set(point.region, list);
  }
  return byRegion;
}

/**
 * Agrega as leituras por zona: coordenada = a mais frequente entre as
 * linhas (a antena que mais representa a zona; o payload pode variar a
 * coordenada entre períodos) · valor = pico entre as leituras.
 */
export function toCoverageZones(points: MapPoint[]): CoverageZone[] {
  return [...groupByRegion(points).entries()].map(([region, list]) => {
    const freq = new Map<string, { point: MapPoint; count: number }>();
    for (const point of list) {
      const key = `${point.lat},${point.lng}`;
      const entry = freq.get(key) ?? { point, count: 0 };
      entry.count += 1;
      freq.set(key, entry);
    }
    const anchor = [...freq.values()].sort((a, b) => b.count - a.count)[0].point;

    return {
      region,
      label: zoneLabel(region),
      lat: anchor.lat,
      lng: anchor.lng,
      peak: Math.max(...list.map((point) => point.value)),
    };
  });
}

/* ---------------- join híbrido zona → bairro ---------------- */

/** Ray casting: ponto [lng,lat] dentro de um anel do GeoJSON. */
function inRing([x, y]: Position, ring: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Ponto dentro da geometria (anel externo sim, buracos não). */
function inGeometry(point: Position, geometry: Polygon | MultiPolygon): boolean {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some(
    (rings) => inRing(point, rings[0]) && !rings.slice(1).some((hole) => inRing(point, hole)),
  );
}

/** Palavras vazias ignoradas na comparação de nomes. */
const STOPWORDS = new Set(["da", "de", "do", "das", "dos"]);

/** "Lagoa da Conceição" | "LAGOA_CONCEICAO" → ["lagoa","conceicao"]. */
function nameTokens(name: string): string[] {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[_\s]+/)
    .filter((token) => token && !STOPWORDS.has(token));
}

/**
 * Match por nome, nas duas direções:
 *  - zona é PREFIXO do bairro  → INGLESES casa "Ingleses do Rio Vermelho";
 *  - bairro é trecho CONTÍGUO da zona → CENTRO_HISTORICO casa "Centro",
 *    ESTREITO_CAPOEIRAS casa "Estreito" E "Capoeiras".
 */
function nameMatches(zoneTokens: string[], bairroTokens: string[]): boolean {
  const zoneIsPrefix = zoneTokens.every((token, i) => bairroTokens[i] === token);
  const bairroInZone = zoneTokens.some((_, start) =>
    bairroTokens.every((token, i) => zoneTokens[start + i] === token),
  );
  return zoneIsPrefix || bairroInZone;
}

/** Dado real de um bairro (hover): pico de usuários conectados. */
export type BairroKpi = {
  name: string;
  peak: number;
};

/**
 * Join HÍBRIDO zona→bairro:
 *  1. zonas sem NENHUMA antena dentro dos bairros são descartadas
 *     (continente: São José/Palhoça/Biguaçu — fora do GeoJSON);
 *  2. match por NOME normalizado (semântica correta — evita atribuir a
 *     zona ao bairro vizinho quando a antena fica na divisa);
 *  3. sem match de nome → fallback ESPACIAL (bairros que contêm alguma
 *     antena da zona; ex.: CBD_BEIRAMAR → Agronômica/Centro).
 * Bairro alcançado por várias zonas fica com o MAIOR pico (picos são de
 * períodos/antenas distintos; somar superestimaria).
 */
export function toBairroKpis(points: MapPoint[], bairros: FeatureCollection): BairroKpi[] {
  const features = bairros.features.flatMap((feature) => {
    const name = feature.properties?.name as string | undefined;
    const geometry = feature.geometry;
    if (!name || (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon")) return [];
    return [{ name, geometry, tokens: nameTokens(name) }];
  });

  const peaks = new Map<string, number>();
  for (const [region, list] of groupByRegion(points)) {
    const coords: Position[] = list.map((point) => [point.lng, point.lat]);
    const peak = Math.max(...list.map((point) => point.value));

    const spatial = features.filter((b) => coords.some((c) => inGeometry(c, b.geometry)));
    if (spatial.length === 0) continue; // zona do continente

    const zoneTokens = nameTokens(region);
    const byName = features.filter((b) => nameMatches(zoneTokens, b.tokens));
    const targets = byName.length > 0 ? byName : spatial;

    for (const b of targets) peaks.set(b.name, Math.max(peaks.get(b.name) ?? 0, peak));
  }

  return [...peaks.entries()].map(([name, peak]) => ({ name, peak }));
}

/** Índice por nome — o "filtro no front": lista plana → lookup O(1). */
export function indexByName<T extends { name: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.name, item]));
}
