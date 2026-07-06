/* ============================================================
   Mobility — agrega os fluxos OD do GET /mapa/mobilidade em
   BOLHAS por zona (símbolos proporcionais).
   Métrica da bolha = "força" da zona: soma das viagens INCIDENTES
   (como origem + como destino). Fluxo interno (mesmo_cluster) conta 1×.
   ============================================================ */

import type { MobilityFlow } from "@/types";
import { zoneLabel } from "./coverage";

/** Uma zona agregada (1 bolha no mapa). */
export type MobilityBubble = {
  /** Chave crua do cluster (ex.: "CBD_BEIRAMAR"). */
  zone: string;
  /** Nome apresentável (ex.: "Cbd Beiramar"). */
  label: string;
  lat: number;
  lng: number;
  /** Total de viagens tocando a zona (origem + destino). */
  trips: number;
};

/**
 * Agrega os fluxos em 1 bolha por zona:
 *  - viagens = soma das viagens de todo fluxo que toca a zona (origem OU
 *    destino); fluxo interno (mesmo_cluster) soma só uma vez;
 *  - coordenada = a da zona (usa a de origem quando é origem, a de destino
 *    quando é destino — devem coincidir p/ o mesmo cluster; guarda a 1ª válida).
 * Zonas sem nenhuma coordenada válida são descartadas (não têm onde plotar).
 */
export function toMobilityBubbles(flows: MobilityFlow[]): MobilityBubble[] {
  const byZone = new Map<
    string,
    { lat: number | null; lng: number | null; trips: number }
  >();

  const add = (
    zone: string,
    lat: number | null,
    lng: number | null,
    trips: number,
  ) => {
    const entry = byZone.get(zone) ?? { lat: null, lng: null, trips: 0 };
    entry.trips += trips;
    if (entry.lat == null && lat != null && lng != null) {
      entry.lat = lat;
      entry.lng = lng;
    }
    byZone.set(zone, entry);
  };

  for (const flow of flows) {
    const trips = flow.trips ?? 0;
    add(flow.origin, flow.originLat, flow.originLng, trips);
    // Fluxo interno (origem = destino no mapa) → não soma duas vezes na zona.
    if (!flow.sameCluster)
      add(flow.destination, flow.destinationLat, flow.destinationLng, trips);
  }

  return [...byZone.entries()].flatMap(([zone, e]) =>
    e.lat == null || e.lng == null
      ? []
      : [
          {
            zone,
            label: zoneLabel(zone),
            lat: e.lat,
            lng: e.lng,
            trips: e.trips,
          },
        ],
  );
}
