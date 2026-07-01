/* ============================================================
   Legend — ESTADOS
   Cor do "dot" de cada item, por tom (tokens do tema).
   ============================================================ */

export type LegendTone = "success" | "info" | "warning" | "orange" | "critical" | "neutral";

/** Cor do ponto por tom. `orange` é hex (não há token laranja no tema). */
export const dotColor: Record<LegendTone, string> = {
  success: "bg-success",
  info: "bg-primary",
  warning: "bg-warning",
  orange: "bg-[#f97316]",
  critical: "bg-critical",
  neutral: "bg-disabled-foreground",
};
