/* ============================================================
   AlertsListCard — ESTILO (estrutura fixa)
   Card "Alertas ativos": header com contador + lista rolável de
   alertas (barra de cor à esquerda, seleção destacada).
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col overflow-hidden rounded-card bg-surface shadow-elev-2 ring-1 ring-line/70",

  header: "flex items-center justify-between px-5 pt-5 pb-4",
  title: "text-title-3 font-bold text-ink",
  count:
    "inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-critical px-1.5 text-caption font-bold text-ink-inverse",

  list: "flex max-h-[32rem] flex-col overflow-y-auto",

  /** Item — botão de largura total; barra de cor à esquerda via ::before. */
  item:
    "relative w-full border-t border-line px-5 py-4 text-left transition-colors first:border-t-0 hover:bg-surface-sec focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50",
  itemSelected: "bg-primary-soft/40 hover:bg-primary-soft/40",

  /** Barra de severidade — faixa vertical à esquerda (altura total do item). */
  accent: "absolute inset-y-0 left-0 w-1",

  itemTitle: "text-body font-semibold text-ink",
  itemSubtitle: "mt-0.5 text-caption text-ink-muted",
  itemTime: "mt-3 block border-t border-line/70 pt-2 text-caption text-ink-muted",
} as const;
