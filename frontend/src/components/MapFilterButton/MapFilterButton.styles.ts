/* ============================================================
   MapFilterButton — ESTILO
   Pílula elevada (fundo branco + sombra) usada no seletor de
   temas sobre o mapa. Variações por estado em ./MapFilterButton.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Pílula branca elevada — Corpo Grande (16px/500). */
  base: cx(
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-pill bg-surface px-4 py-2 text-body-lg",
    "transition-[box-shadow,color] outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary/60",
  ),
} as const;
