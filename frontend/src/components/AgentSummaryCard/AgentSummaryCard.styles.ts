/* ============================================================
   AgentSummaryCard — ESTILO (estrutura fixa)
   Card azul do dashboard: status do agente + KPI + checklist.
   Cores dos ícones de status em ./AgentSummaryCard.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Card com gradiente azul vertical (topo → base, mais escuro). */
  card: cx(
    "relative flex w-full flex-col rounded-card p-6",
    "bg-gradient-to-b from-[#3B88D6] to-[#2F6194]",
    "text-ink-inverse shadow-elev-3",
  ),

  header: "flex items-start justify-between gap-3",
  title: "text-title-3 font-semibold text-ink-inverse/90",

  /** Pílula de status (Online) — vidro translúcido sobre o azul. */
  badge:
    "inline-flex items-center gap-1.5 rounded-pill bg-ink-inverse/15 px-3 py-1 text-label font-medium text-ink-inverse",
  badgeDot: "h-1.5 w-1.5 rounded-full bg-success",

  value: "mt-3 text-display tabular-nums leading-none",
  label: "mt-1 text-body-lg text-ink-inverse/70",

  divider: "my-4 border-ink-inverse/20",

  /** Rodapé: checklist à esquerda + fontes alinhadas à base/direita. */
  footer: "flex items-end justify-between gap-4",
  list: "space-y-2",
  item: "flex items-center gap-2 text-body text-ink-inverse/85",
  itemIcon: "shrink-0",
  sources: "whitespace-nowrap text-caption text-ink-inverse/45",
} as const;
