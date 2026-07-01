/* ============================================================
   AgentSummaryCard — ESTADOS
   Ícone + cor de cada item do checklist, por status. As cores são
   tokens do tema, legíveis sobre o azul do card.
   ============================================================ */

import type { ComponentType } from "react";
import { Check, Info, TriangleAlert } from "lucide-react";

export type AgentItemStatus = "success" | "warning" | "critical" | "info";

/** Ícone (lucide) por status. */
export const itemIcon: Record<
  AgentItemStatus,
  ComponentType<{ size?: number; className?: string }>
> = {
  success: Check,
  warning: TriangleAlert,
  critical: TriangleAlert,
  info: Info,
};

/** Cor do ícone por status (token do tema). */
export const itemIconColor: Record<AgentItemStatus, string> = {
  success: "text-success",
  warning: "text-warning",
  critical: "text-critical",
  info: "text-ink-inverse/80",
};
