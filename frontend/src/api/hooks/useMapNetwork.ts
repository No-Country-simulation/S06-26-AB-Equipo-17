/* ============================================================
   useMapNetwork — cobertura/qualidade de rede (GET /mapa/rede).
   Fetch LAZY: só busca quando o filtro "Cobertura de Rede" está ativo.
   ============================================================ */

import { getMapNetwork } from "../endpoints";
import { useApi } from "./useApi";

/** @param enabled só busca quando `true` (filtro `network` selecionado). */
export function useMapNetwork(enabled: boolean) {
  return useApi(() => getMapNetwork(), [], enabled);
}
