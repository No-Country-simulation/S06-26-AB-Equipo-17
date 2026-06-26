/* ============================================================
   ENDPOINTS — uma função tipada por endpoint da API.
   As páginas NÃO chamam isto direto; usam os hooks (api/hooks).
   ============================================================ */

import type { HealthStatus, MapData, Paper, QueryRequest } from "../types";
import { api } from "./client";

/** GET /api/v1/health — checagem de saúde. */
export function getHealth() {
  return api.get<HealthStatus>("/health");
}

/** GET /api/v1/mapa — regiões + indicadores do mapa. */
export function getMapData() {
  return api.get<MapData>("/mapa");
}

/** POST /api/v1/dados — consulta de IA → mini-paper. */
export function postQuery(payload: QueryRequest) {
  return api.post<Paper>("/dados", payload);
}
