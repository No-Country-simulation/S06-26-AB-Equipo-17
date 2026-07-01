/* ============================================================
   OpportunityListCard — ESTILO (estrutura fixa)
   Card branco: cabeçalho (título + contagem) e lista de editais,
   cada item com código, título, status e valor. Cores da pílula
   em ./OpportunityListCard.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-6 shadow-elev-2 ring-1 ring-line/70",

  header: "flex items-baseline justify-between gap-3",
  title: "text-title-3 font-bold text-ink",
  count: "text-caption text-ink-muted",

  list: "mt-2 flex flex-col",
  /** Item — divisor no topo a partir do 2º (via border-t). */
  item: "flex flex-col py-4",
  itemDivider: "border-t border-line",

  itemTop: "flex items-start justify-between gap-3",
  code: "text-caption font-medium uppercase tracking-wide text-primary",
  itemTitle: "mt-1 text-body-lg font-semibold text-ink",
  subtitle: "text-caption text-ink-muted",
  deadline: "shrink-0 text-caption text-ink-muted",

  itemBottom: "mt-3 flex items-center justify-between gap-3",
  pill: "inline-flex items-center rounded-pill px-3 py-1 text-label font-medium",
  value: "text-body-lg font-bold text-ink tabular-nums",
} as const;
