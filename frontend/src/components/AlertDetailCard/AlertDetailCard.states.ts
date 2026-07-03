/* ============================================================
   AlertDetailCard — ESTADOS
   Tom do bloco de destaque (o "22%") conforme a severidade do
   alerta: fundo suave + cor do número (tokens do tema).
   ============================================================ */

import type { AlertStatus } from "@/components/AlertBadge";

export type StatTone = { box: string; value: string };

/** Fundo do bloco de estatística + cor do número, por severidade. */
export const statTone: Record<AlertStatus, StatTone> = {
  critical: { box: "bg-critical-soft", value: "text-critical" },
  warning: { box: "bg-warning/15", value: "text-warning" },
  info: { box: "bg-primary-soft/50", value: "text-primary" },
  success: { box: "bg-success-soft", value: "text-success" },
};
