/* ============================================================
   MetricCard — ESTADOS
   - Trend: seta + cor por direção (up=verde, down=vermelho).
   - Bar: cor do preenchimento por "tom" do indicador.
   ============================================================ */

import type { ComponentType } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export type TrendDirection = "up" | "down";
export type MetricTone = "success" | "warning" | "critical";

/** Ícone (lucide) da tendência. */
export const trendIcon: Record<
  TrendDirection,
  ComponentType<{ size?: number; className?: string }>
> = {
  up: ArrowUp,
  down: ArrowDown,
};

/** Cor do texto da tendência. */
export const trendColor: Record<TrendDirection, string> = {
  up: "text-success",
  down: "text-critical",
};

/** Cor do preenchimento da barra, por tom do indicador. */
export const barColor: Record<MetricTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  critical: "bg-critical",
};
