/* ============================================================
   AIPrompt — ESTILO
   Prompt "hero" da IA: pílula branca elevada com badge (sparkle) +
   input + botão circular de enviar. Foco via focus-within.
   Sem variações de estado → não tem .states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Pílula branca elevada. */
  root: cx(
    "flex w-full items-center gap-3 rounded-pill bg-surface px-3 py-2.5",
    "shadow-elev-3 transition-shadow",
    "focus-within:ring-2 focus-within:ring-primary/40",
  ),
  /** Badge do sparkle — círculo azul-claro. */
  badge: "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary",
  /** Input transparente. */
  input: "min-w-0 flex-1 bg-transparent text-body-lg text-ink outline-none placeholder:text-ink-muted",
  /** Botão circular de enviar — azul sólido. */
  submit: cx(
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
    "bg-primary text-ink-inverse transition-colors hover:bg-primary/90",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    "disabled:pointer-events-none disabled:opacity-40",
  ),
} as const;
