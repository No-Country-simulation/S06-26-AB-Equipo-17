/* ============================================================
   AlertDetailCard — ESTILO (estrutura fixa)
   Detalhe do alerta: cabeçalho (badge + hora), título, bloco de
   estatística, contexto, recomendação e ações.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-6 shadow-elev-2 ring-1 ring-line/70",

  header: "flex items-center justify-between gap-3",
  time: "text-caption text-ink-muted",

  title: "mt-4 text-title-2 text-ink",
  source: "mt-1 text-caption text-ink-muted",

  divider: "my-4 border-line",

  /** Bloco de destaque — cor de fundo vem do tom (states.ts). */
  stat: "flex items-baseline gap-2 rounded-card p-4",
  statValue: "text-display font-bold leading-none",
  statLabel: "text-body text-ink-muted",
  statMin: "mt-2 text-caption text-ink-muted",

  contextTitle: "text-caption font-medium text-ink-muted",
  contextList: "mt-3 flex flex-col gap-3",
  contextItem: "flex flex-col",
  contextLabel: "text-caption text-ink-muted",
  contextValue: "text-body font-medium text-ink",

  recommendation: "mt-4 rounded-card bg-primary-soft/40 p-4",
  recommendationTitle: "text-caption font-semibold text-primary",
  recommendationText: "mt-1 text-body text-ink",

  actionsTitle: "mt-5 text-caption font-medium text-ink-muted",
  actions: "mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2",
} as const;
