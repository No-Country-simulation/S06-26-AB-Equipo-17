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

/** POST /dados — payload da consulta de IA. */
export type QueryRequest = {
  question: string;
  // TODO: filtros (região, período...)
};

/** Status de uma linha de evidência (sinaleira). */
export type EvidenceStatus = "critical" | "warning" | "success";

/** Uma linha da tabela de evidência. */
export type EvidenceRow = {
  region: string;
  coverage4g: string;
  techTraining: string;
  status: EvidenceStatus;
};

/**
 * POST /dados — resultado da consulta ("paper", ADR-005):
 * afirmação → evidências → fontes.
 * TODO: alinhar com contrato-integracao.md quando o backend fechar.
 */
export type QueryResult = {
  claim: string;
  evidence: EvidenceRow[];
  sources: string[];
  /** Metadados da resposta. */
  responseTime: string;
  sourceCount: number;
};
