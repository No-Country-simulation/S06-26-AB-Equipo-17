import type { PathOptions } from "leaflet";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

/**
 * Paleta pastel — tons suaves só para distinguir visualmente os bairros
 * (sem significado de dado). Inspirada no mapa temático de referência.
 */
const PALETTE = [
  "#a8c4d4", // azul acinzentado
  "#b8cdb0", // verde sálvia
  "#e6d9a8", // amarelo trigo
  "#d9a8a0", // terracota suave
  "#c2b6d6", // lavanda
  "#a9c9c4", // verde-água
  "#d6c2a8", // areia
  "#bcb0c9", // lilás
];

/** Hash estável de string → cor determinística (mesmo bairro = mesma cor). */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function colorForRegion(name: string): string {
  return PALETTE[hash(name) % PALETTE.length];
}

/** Estilo de cada bairro — preenchimento pastel + borda branca fina. */
export function regionStyle(feature?: Feature<Geometry, GeoJsonProperties>): PathOptions {
  const name = (feature?.properties?.name as string | undefined) ?? "";
  return {
    fillColor: colorForRegion(name),
    fillOpacity: 0.55,
    color: "#ffffff",
    weight: 1,
  };
}
