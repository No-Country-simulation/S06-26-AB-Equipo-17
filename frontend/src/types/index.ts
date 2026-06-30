/* ============================================================
   TIPOS DE DOMÍNIO — App BiT (Equipo 17)
   👉 ESQUELETO: ajustar conforme o contrato real
      (docs/contrato-integracao.md). Campos marcados com TODO.
   ============================================================ */

/** GET /health — checagem de saúde da API. */
export type HealthStatus = {
  status: "ok" | "degraded";
  // TODO: versão, uptime, etc.
};

/** Uma região do mapa. */
export type Region = {
  id: string;
  name: string;
  // TODO: coordenadas/geometria + indicador(es)
};

/** GET /mapa — dados para renderizar o mapa. */
export type MapData = {
  regions: Region[];
  // TODO: indicador selecionado, legenda, etc.
};

/**
 * Código de idioma enviado no corpo das requests (contrato da API).
 * Union-as-enum (não `enum` — proibido por erasableSyntaxOnly).
 * Mapeado a partir do idioma do app em `@/i18n` (toApiLanguage).
 */
export const API_LANGUAGES = ["pt", "en", "es"] as const;
export type ApiLanguage = (typeof API_LANGUAGES)[number];

/** POST /dados — payload da consulta de IA. */
export type QueryRequest = {
  question: string;
  /** Idioma desejado da resposta (setado no app). */
  language: ApiLanguage;
  // TODO: filtros (região, período...)
};

/** Nível de confiança da resposta (nivel_confianca: alta/media/baixa). */
export type ConfidenceLevel = "high" | "medium" | "low";

/** Uma evidência (evidencias[]). */
export type EvidenceItem = {
  /** Métrica/descrição (dado). */
  label: string;
  /** Valor (valor). */
  value: string;
  /** Região (regiao). */
  region: string;
  /** Período (periodo), ex.: "TARDE". */
  period: string;
  /** Fonte (fonte). */
  source: string;
};

/** Uma fonte citada (fontes[]). */
export type Source = {
  name: string;
  url: string | null;
  type: string;
};

/** Ponto da visualização no mapa (visualizacao.dados[]). */
export type MapPoint = {
  region: string;
  lat: number;
  lng: number;
  value: number;
};

/** Visualização sugerida pela resposta (visualizacao). */
export type Visualization = {
  type: string;
  points: MapPoint[];
};

/**
 * POST /dados — resultado da consulta ("paper", ADR-005), já mapeado do
 * formato do backend (PT) pro nosso domínio (EN) — ver `api/endpoints.ts`.
 */
export type QueryResult = {
  claim: string;
  evidence: EvidenceItem[];
  sources: Source[];
  confidence: ConfidenceLevel;
  visualization: Visualization | null;
  /** Tempo da resposta (medido no client). */
  responseTime: string;
};
