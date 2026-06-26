/* ============================================================
   Avatar — ESTILO
   Avatar circular do usuário (iniciais ou imagem). Os tamanhos
   ficam em ./Avatar.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Círculo azul com iniciais brancas (o tamanho vem do estado). */
  root: cx(
    "inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
    "rounded-full bg-primary font-bold leading-none text-ink-inverse",
  ),
  /** Imagem (quando há src) — cobre o círculo. */
  image: "h-full w-full object-cover",
} as const;
