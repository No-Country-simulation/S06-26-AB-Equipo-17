/* ============================================================
   MapPin — ESTILO
   Ponto circular do mapa · preenchimento sólido colorido pelo tom
   (states.ts), com anel branco p/ contraste sobre as manchas do
   mapa e uma sombra suave de profundidade.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Ponto — dimensões vêm do tamanho e a cor do tom (states.ts). O anel
   *  branco separa o pin do fundo; a sombra dá relevo sobre o mapa. */
  pin: cx(
    "inline-flex items-center justify-center rounded-full text-ink-inverse",
    "ring-2 ring-white shadow-elev-2 transition-transform",
    "hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-primary",
  ),
  /** Marca o ponto selecionado — anel um pouco mais destacado. */
  selected: "ring-[3px] scale-110",
  /** Ícone interno opcional — herda a cor branca (SVG com fill="currentColor"). */
  icon: "inline-flex items-center justify-center",
} as const;
