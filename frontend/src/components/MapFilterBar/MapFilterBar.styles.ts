/* ============================================================
   MapFilterBar — ESTILO
   Faixa de pílulas de filtro sobre o mapa. Cada pílula é um
   MapFilterButton (estados próprios lá). Aqui só o container.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  /** Trilha de pílulas — rola na horizontal em telas estreitas.
   *  px/py dão respiro p/ a sombra das pills não ser recortada pelo
   *  overflow (quando um eixo não é `visible`, o outro também recorta). */
  bar: "flex items-center gap-3 overflow-x-auto px-4 py-6",
} as const;
