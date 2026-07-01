/* ============================================================
   JustificationsCard — ESTILO (estrutura fixa)
   Card "Justificativas de Editais": header (título + contagem) e
   lista de editais (código, prazo, título, status + Exportar).
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

  divider: "my-4 border-line",

  list: "flex flex-col gap-1",
  item: "rounded-card px-4 py-4",
  itemAlt: "bg-surface-sec",

  code: "text-caption font-medium uppercase tracking-wide text-primary",
  deadline: "mt-0.5 text-caption text-ink-muted",
  itemTitle: "mt-2 text-body-lg font-semibold text-ink",

  bottomRow: "mt-4 flex items-center justify-between gap-3",
  status: "text-caption text-ink-muted",
  exportButton:
    "inline-flex shrink-0 items-center rounded-pill bg-surface px-4 py-1.5 text-label font-medium text-primary shadow-elev-1 ring-1 ring-line transition-colors hover:bg-surface-sec focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
} as const;
