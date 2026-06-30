/* ============================================================
   CLIENT — único ponto que fala HTTP com a API (axios).
   Base = VITE_API_URL + /api/v1. Normaliza erro em ApiError.
   App SEM autenticação: nenhum token/sessão aqui.
   ⚠️ VITE_API_URL é montada no build — rebuildar ao trocar (ver skill).
   endpoints.ts e hooks usam a fachada `api.get/api.post` — não conhecem axios.
   ============================================================ */

import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/** Erro de resposta da API (status != 2xx ou falha de rede). */
export class ApiError extends Error {
  /** Status HTTP (0 quando não houve resposta — ex.: rede/CORS). */
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const http = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  // A consulta de IA (POST /dados) demora ~20-30s
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

/* ---- Interceptor de RESPONSE: normaliza qualquer erro em ApiError ---- */
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const detail =
      (error.response?.data as { detail?: string } | undefined)?.detail ??
      error.message;

    return Promise.reject(new ApiError(status, detail || `HTTP ${status}`));
  },
);

/** Fachada tipada. Use nos endpoints (api/endpoints.ts). */
export const api = {
  get: <T>(path: string) => http.get<T>(path).then((r) => r.data),
  post: <T>(path: string, body?: unknown) =>
    http.post<T>(path, body).then((r) => r.data),
};
