/* ============================================================
   useMapMobility — fluxos OD do GET /mapa/mobilidade.
   Fetch LAZY: só busca quando `enabled` (ex.: o filtro "Mobilidade"
   do mapa está selecionado). Refaz ao mudar `region`.
   ============================================================ */

import { getMapMobility } from "../endpoints";
import { useApi } from "./useApi";

/**
 * @param enabled só busca quando `true` (filtro selecionado).
 * @param region  filtra os fluxos que tocam a zona (opcional).
 * @returns { data, loading, error, refetch } com os fluxos de mobilidade.
 */
export function useMapMobility(enabled: boolean, region?: string) {
  return useApi(() => getMapMobility(region), [region], enabled);
}
