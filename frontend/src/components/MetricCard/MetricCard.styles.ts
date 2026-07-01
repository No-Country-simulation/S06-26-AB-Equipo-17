/* ============================================================
   MetricCard — ESTILO (estrutura fixa)
   Card branco: valor + trend, rótulo, barra de progresso e fonte.
   Cores (trend/barra) em ./MetricCard.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-5 shadow-elev-2 ring-1 ring-line/70",

  /** Topo: valor grande à esquerda + trend à direita. */
  header: "flex items-start justify-between gap-3",
  value: "text-display text-ink tabular-nums leading-none",
  trend: "inline-flex items-center gap-1 text-label font-medium",

  label: "mt-2 text-body text-ink-muted",

  /** Barra de progresso (trilho + preenchimento). */
  track: "mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-line",
  fill: "h-full rounded-pill transition-[width] duration-500",

  source: "mt-3 text-caption text-ink-muted",
} as const;
