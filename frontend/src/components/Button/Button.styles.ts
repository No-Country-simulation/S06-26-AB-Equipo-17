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
  /** Base — a cor vem da variante; largura via prop fullWidth.
   *  Disabled: sobrepõe a variante com cinza (fundo surface-sec + texto muted). */
  base: cx(
    "inline-flex h-14 items-center justify-center rounded-btn-sm px-5",
    "text-body-lg font-semibold transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground disabled:ring-0",
  ),
} as const;
