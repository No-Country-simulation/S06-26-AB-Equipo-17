/* ============================================================
   AlertsListCard — ESTADOS
   Cor da barra lateral + ponto por severidade do alerta.
   Reaproveita a mesma paleta do NotificationsPanel/AlertBadge
   (tokens do tema) → lista e legenda ficam consistentes.
   ============================================================ */

import type { AlertStatus } from "@/components/AlertBadge";

/** Cor (barra à esquerda + ponto) por severidade. */
export const severityColor: Record<AlertStatus, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  info: "bg-primary",
  success: "bg-success",
};
