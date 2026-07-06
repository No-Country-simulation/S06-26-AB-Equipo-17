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

/**
 * GET /mapa/rede — cobertura/qualidade de rede por zona monitorada (Vísent).
 * Backend devolve o schema `Visualizacao` (mesmo do `visualizacao` do POST
 * /dados): ~4 leituras por zona (períodos do dia, sem rótulo no payload) com a
 * coordenada da antena agregadora; `value` = congestionamento (pode ser `null`)
 * e `noData` = zona sem dado de rede (pin vermelho). Agrega por zona a página
 * (ver pages/MapPage/coverage.ts).
 */
export type MapData = {
  type: string;
  points: MapPoint[];
};

/**
 * GET /mapa/mobilidade — fluxos origem→destino (OD por cluster) do backend
 * (schema `VisualizacaoFluxos`), já mapeado pro domínio EN (ver `api/endpoints`).
 * Coordenadas/valores podem ser `null` (ausentes reais no OD). `sameCluster`
 * = fluxo interno (origem = destino no mapa) → não vira linha.
 */
export type MobilityFlow = {
  origin: string;
  destination: string;
  originCity: string | null;
  destinationCity: string | null;
  originLat: number | null;
  originLng: number | null;
  destinationLat: number | null;
  destinationLng: number | null;
  trips: number | null;
  users: number | null;
  distanceKm: number | null;
  period: string | null;
  sameCluster: boolean | null;
};

export type MobilityData = {
  type: string;
  flows: MobilityFlow[];
};

/**
 * GET /mapa/overview — referencial de bairros × monitoramento (schema
 * `VisualizacaoOverview`), mapeado pro domínio EN. Por bairro: se é monitorado
 * (tem zonas Vísent), quais zonas e quantas antenas dentro do polígono.
 */
export type BairroMonitoring = {
  bairro: string;
  monitored: boolean;
  zones: string[];
  antennas: number;
};

export type OverviewData = {
  type: string;
  totalAntennas: number;
  bairros: BairroMonitoring[];
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

/** Ponto da visualização no mapa (visualizacao.dados[] / PontoMapa). */
export type MapPoint = {
  region: string;
  lat: number;
  lng: number;
  /** Valor da leitura (ex.: congestionamento no /mapa/rede) — `null` = ausente. */
  value: number | null;
  /** Zona sem dado de rede (backend `sem_dados`) → pin vermelho. */
  noData: boolean;
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
