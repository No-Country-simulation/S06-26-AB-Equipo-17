/* ============================================================
   OpportunityListCard — ESTADOS
   Pílula de status do edital (fundo suave por tom).
   ============================================================ */

export type OpportunityStatus = "success" | "warning" | "neutral";

/** Classes (bg + text) da pílula por status. */
export const pillStyles: Record<OpportunityStatus, string> = {
  // Justificativa gerada / pronto
  success: "bg-success-soft text-success",
  // Em análise / pendente
  warning: "bg-warning/20 text-ink/80",
  // Aguardando dado externo / neutro
  neutral: "bg-line text-ink-muted",
};
