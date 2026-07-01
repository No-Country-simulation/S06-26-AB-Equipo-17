/* ============================================================
   IconButton — ESTILO (estrutura fixa, igual em todos os estados)
   Botão de ícone · 44×44 (mobile) / 40×40 (md+). Variações por estado em
   ./IconButton.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export const styles = {
  /** Container 40×40 — ícone centralizado. Cor/raio vêm da variante+estado. */
  root: cx(
    'inline-flex size-11 items-center justify-center transition-colors md:size-10',
    'outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
  ),
} as const
