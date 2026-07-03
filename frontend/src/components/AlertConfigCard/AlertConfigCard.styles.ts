/* ============================================================
   AlertConfigCard — ESTILO (estrutura fixa)
   Formulário "Configurar Alertas": selects, limite, canais
   (switches) e frequência (radios).
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

  /** Limite crítico — input com sufixo ("abaixo de") à direita. */
  thresholdWrap: "relative",
  thresholdInput:
    "w-full rounded-btn-sm bg-surface-sec px-4 py-3 pr-24 text-body text-ink outline-none ring-1 ring-line transition-colors focus:ring-2 focus:ring-primary",
  thresholdSuffix:
    "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-caption text-ink-muted",

  section: "mt-5",
  sectionLabel: "mb-3 block text-caption text-ink-muted",

  /** Canais (switches) */
  channels: "flex flex-col gap-3",
  channelRow: "flex items-center justify-between gap-3",
  channelLabel: "text-body text-ink",

  /** Frequência (radios) */
  radios: "flex flex-col gap-2.5",
  radioRow: "flex items-center gap-2.5",
  radioInput: "size-4 accent-primary",
  radioLabel: "text-body text-ink",

  save: "mt-6",
} as const;
