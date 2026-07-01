/* ============================================================
   ReportGeneratorCard — ESTILO (estrutura fixa)
   Card "Gerar Relatório": selects, formato (segmentado), prévia,
   botão e lista de recentes.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-6 shadow-elev-2 ring-1 ring-line/70",

  title: "text-title-3 font-bold text-ink",
  divider: "my-4 border-line",

  fields: "flex flex-col gap-4",
  fieldLabel: "mb-1.5 block text-caption text-ink-muted",
  selectWrap: "relative",
  select:
    "w-full appearance-none rounded-btn-sm bg-surface-sec px-4 py-3 pr-10 text-body text-ink outline-none ring-1 ring-line transition-colors focus:ring-2 focus:ring-primary",
  selectChevron:
    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted",

  formatSection: "mt-4",
  formatLabel: "mb-2 block text-caption text-ink-muted",
  formatRow: "flex gap-2",
  formatBtn:
    "rounded-btn-sm px-4 py-2 text-label font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
  formatBtnActive: "bg-primary text-ink-inverse",
  formatBtnIdle: "bg-surface text-ink ring-1 ring-line hover:bg-surface-sec",

  preview: "mt-4 rounded-card bg-primary-soft/40 p-4",
  previewTitle: "text-caption font-medium text-primary",
  previewText: "mt-0.5 text-caption text-ink-muted",

  generate: "mt-4",

  recentLabel: "mb-2 block text-caption text-ink-muted",
  recentList: "flex flex-col gap-2",
  recentItem: "flex items-center justify-between gap-3",
  recentText: "min-w-0 truncate text-caption text-ink-muted",
  recentAction:
    "shrink-0 text-primary transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded",
} as const;
