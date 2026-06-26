/* ============================================================
   NavItem — ESTILO
   Barra lateral · 88×72. As variações por estado ficam em
   ./NavItem.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Container 88×72 — coluna centralizada (ícone em cima, rótulo embaixo). */
  root: cx(
    "group inline-flex h-[72px] w-[88px] flex-col items-center justify-center gap-1.5",
    "rounded-card transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
  ),
  /** Caixa do ícone — força o SVG a 28px (ícone maior). Herda a cor do estado. */
  icon: "inline-flex items-center justify-center [&>svg]:size-7",
  /** Rótulo "Mapa" — Legenda (12px), menor que o ícone. */
  label: "text-caption leading-none",
} as const;
