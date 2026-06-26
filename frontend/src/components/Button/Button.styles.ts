/* ============================================================
   Button — ESTILO (estrutura fixa)
   Botão de ação com rótulo. As variantes (cor) ficam em
   ./Button.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Base — a cor vem da variante; largura via prop fullWidth. */
  base: cx(
    "inline-flex h-14 items-center justify-center rounded-input px-5",
    "text-body-lg font-semibold transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
} as const;
