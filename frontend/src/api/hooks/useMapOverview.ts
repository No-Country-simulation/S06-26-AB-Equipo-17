/* ============================================================
   useMapOverview — referencial de bairros × monitoramento (GET
   /mapa/overview). Fetch LAZY: só busca quando o filtro está ativo.
   ============================================================ */

import { getMapOverview } from "../endpoints";
import { useApi } from "./useApi";

/** @param enabled só busca quando `true` (filtro "Visão Geral" selecionado). */
export function useMapOverview(enabled: boolean) {
  return useApi(() => getMapOverview(), [], enabled);
}
