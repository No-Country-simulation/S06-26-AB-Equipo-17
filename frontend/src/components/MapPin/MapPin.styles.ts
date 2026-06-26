/* ============================================================
   MapPin — ESTILO (estrutura fixa)
   Marcador circular do mapa · ícone centralizado. As cores por
   estado ficam em ./MapPin.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Círculo 56×56 — cor/glow vêm do estado. */
  pin: cx(
    "inline-flex h-14 w-14 items-center justify-center rounded-full transition-all",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
  ),
  /** Ícone interno — herda a cor do estado (use SVG com fill="currentColor"). */
  icon: "inline-flex items-center justify-center",
} as const;
