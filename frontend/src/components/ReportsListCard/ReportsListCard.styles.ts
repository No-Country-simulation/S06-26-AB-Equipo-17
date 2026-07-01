/* ============================================================
   ReportsListCard — ESTILO (estrutura fixa)
   Card "Meus Relatórios": header (título + novo), rótulo e lista
   de relatórios (zebra + destaque + ação Baixar/Gerando).
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-6 shadow-elev-2 ring-1 ring-line/70",

  header: "flex items-center justify-between gap-3",
  title: "text-title-3 font-bold text-ink",
  newButton:
    "inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-label font-medium text-ink-inverse transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",

  divider: "my-4 border-line",
  recentLabel: "mb-2 text-caption text-ink-muted",

  list: "flex flex-col gap-1",
  /** Item — relative p/ o traço de destaque; padding uniforme. */
  item: "relative rounded-card px-4 py-3",
  itemAlt: "bg-surface-sec",
  accent: "absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-primary",

  itemRow: "flex items-center justify-between gap-3",
  itemInfo: "min-w-0",
  itemTitle: "text-body-lg font-semibold text-ink",
  itemSubtitle: "text-caption text-ink-muted",
  itemDate: "mt-2 text-caption text-ink-muted/70",

  download:
    "shrink-0 text-body font-medium text-primary transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded",
  generating: "shrink-0 text-body text-ink-muted",
} as const;
