/* ============================================================
   NavItem — ESTILO (estrutura fixa, igual em todos os estados)
   Barra lateral · 88×72. As variações por estado ficam em
   ./NavItem.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export const styles = {
  /** Container 88×72 — coluna centralizada (ícone em cima, rótulo embaixo). */
  root: cx(
    'group inline-flex h-[72px] w-[88px] flex-col items-center justify-center gap-1.5',
    'rounded-card transition-colors',
    'outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
  ),
  /** Caixa do ícone — herda a cor do estado (use SVG com fill="currentColor"). */
  icon: 'inline-flex h-8 w-8 items-center justify-center',
  /** Rótulo "Mapa" — Rótulo Pequeno (13px/500). */
  label: 'text-label leading-none',
} as const
