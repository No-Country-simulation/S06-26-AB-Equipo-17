/* ============================================================
   ENDPOINTS — uma função tipada por endpoint da API.
   Aqui fica o "anti-corruption layer": o backend fala PT
   (consulta/idioma/afirmacao/evidencias...) e a gente mapeia
   pro nosso domínio em EN. As páginas usam os hooks (api/hooks).
   ============================================================ */

import type {
  BairroMonitoring,
  ConfidenceLevel,
  HealthStatus,
  MapData,
  MapPoint,
  MobilityData,
  MobilityFlow,
  OverviewData,
  QueryRequest,
  QueryResult,
} from "../types";
import { api } from "./client";

/** GET /api/v1/health — checagem de saúde. */
export function getHealth() {
  return api.get<HealthStatus>("/health");
}

/* ---- Wire DTOs (backend, chaves em PT). `Visualizacao` é o schema
   COMPARTILHADO (/mapa/rede + `visualizacao` do POST /dados); Overview e
   Mobilidade têm schema próprio (blocos abaixo); o POST /dados fecha o arquivo. ---- */

/** Schema `Visualizacao`/`PontoMapa` do backend — compartilhado pelo GET
 *  /mapa/rede e pelo `visualizacao` do POST /dados. `valor` pode ser null;
 *  `sem_dados` existe no schema em todos, mas só é relevante (true) no
 *  /mapa/rede — `false` nos demais. */
type VisualizacaoDTO = {
  tipo: string;
  dados: {
    regiao: string;
    lat: number;
    lng: number;
    valor: number | null;
    sem_dados?: boolean;
  }[];
};

function toMapPoints(dados: VisualizacaoDTO["dados"]): MapPoint[] {
  return dados.map((d) => ({
    region: d.regiao,
    lat: d.lat,
    lng: d.lng,
    value: d.valor,
    noData: d.sem_dados ?? false,
  }));
}

/** GET /api/v1/mapa/rede — cobertura/qualidade de rede por zona monitorada. */
export async function getMapNetwork(): Promise<MapData> {
  const dto = await api.get<VisualizacaoDTO>("/mapa/rede");
  return { type: dto.tipo, points: toMapPoints(dto.dados) };
}

/* ---- Overview (GET /mapa/overview) — schema `VisualizacaoOverview` ---- */

type BairroOverviewDTO = {
  bairro: string;
  monitorado: boolean;
  zonas: string[];
  antenas: number;
};

type VisualizacaoOverviewDTO = {
  tipo: string;
  total_antenas: number;
  dados: BairroOverviewDTO[];
};

function toBairroMonitoring(d: BairroOverviewDTO): BairroMonitoring {
  return { bairro: d.bairro, monitored: d.monitorado, zones: d.zonas, antennas: d.antenas };
}

/** GET /api/v1/mapa/overview — bairros × monitoramento (referencial da mancha). */
export async function getMapOverview(): Promise<OverviewData> {
  const dto = await api.get<VisualizacaoOverviewDTO>("/mapa/overview");
  return {
    type: dto.tipo,
    totalAntennas: dto.total_antenas,
    bairros: dto.dados.map(toBairroMonitoring),
  };
}

/* ---- Mobilidade (GET /mapa/mobilidade) — schema `VisualizacaoFluxos` ---- */

type FluxoMapaDTO = {
  origem: string;
  destino: string;
  municipio_origem: string | null;
  municipio_destino: string | null;
  lat_origem: number | null;
  lng_origem: number | null;
  lat_destino: number | null;
  lng_destino: number | null;
  viagens: number | null;
  usuarios: number | null;
  dist_km: number | null;
  periodo: string | null;
  mesmo_cluster: boolean | null;
};

type VisualizacaoFluxosDTO = { tipo: string; dados: FluxoMapaDTO[] };

function toMobilityFlow(d: FluxoMapaDTO): MobilityFlow {
  return {
    origin: d.origem,
    destination: d.destino,
    originCity: d.municipio_origem,
    destinationCity: d.municipio_destino,
    originLat: d.lat_origem,
    originLng: d.lng_origem,
    destinationLat: d.lat_destino,
    destinationLng: d.lng_destino,
    trips: d.viagens,
    users: d.usuarios,
    distanceKm: d.dist_km,
    period: d.periodo,
    sameCluster: d.mesmo_cluster,
  };
}

/**
 * GET /api/v1/mapa/mobilidade — fluxos origem→destino (OD por cluster).
 * Sem `region`: 80 maiores fluxos por viagens; com `region`: tudo que toca a zona.
 */
export async function getMapMobility(region?: string): Promise<MobilityData> {
  const dto = await api.get<VisualizacaoFluxosDTO>("/mapa/mobilidade", { regiao: region });
  return { type: dto.tipo, flows: dto.dados.map(toMobilityFlow) };
}

/* ---- Consulta (POST /dados) — wire + mapeamento pro QueryResult ---- */

type QueryResponseDTO = {
  afirmacao: string;
  evidencias: { dado: string; valor: string; regiao: string; periodo: string; fonte: string }[];
  fontes: { nome: string; url: string | null; tipo: string }[];
  nivel_confianca: string;
  visualizacao: VisualizacaoDTO | null;
};

const CONFIDENCE: Record<string, ConfidenceLevel> = {
  alta: "high",
  media: "medium",
  baixa: "low",
};

/** Mapeia a resposta do backend (PT) pro nosso QueryResult (EN). */
function toQueryResult(dto: QueryResponseDTO, responseTime: string): QueryResult {
  return {
    claim: dto.afirmacao,
    evidence: dto.evidencias.map((e) => ({
      label: e.dado,
      value: e.valor,
      region: e.regiao,
      period: e.periodo,
      source: e.fonte,
    })),
    sources: dto.fontes.map((f) => ({ name: f.nome, url: f.url, type: f.tipo })),
    confidence: CONFIDENCE[dto.nivel_confianca] ?? "medium",
    visualization: dto.visualizacao
      ? { type: dto.visualizacao.tipo, points: toMapPoints(dto.visualizacao.dados) }
      : null,
    responseTime,
  };
}

/** POST /api/v1/dados — consulta de IA → resultado ("paper"). */
export async function postQuery(payload: QueryRequest): Promise<QueryResult> {
  const startedAt = performance.now();
  const dto = await api.post<QueryResponseDTO>("/dados", {
    consulta: payload.question,
    idioma: payload.language,
  });
  const responseTime = `${((performance.now() - startedAt) / 1000).toFixed(1)}s`;
  return toQueryResult(dto, responseTime);
}
