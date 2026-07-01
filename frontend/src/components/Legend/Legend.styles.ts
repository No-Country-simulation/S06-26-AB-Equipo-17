/* ============================================================
   Legend — ESTILO (estrutura fixa)
   Cartão compacto: título + lista de itens (dot + rótulo).
   Cores dos dots em ./Legend.states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "rounded-card bg-surface p-3 shadow-elev-2 ring-1 ring-line/70",
  title: "mb-2 text-caption font-medium uppercase tracking-wide text-ink-muted",
  list: "space-y-1.5",
  item: "flex items-center gap-2 text-label text-ink",
  dot: "h-2.5 w-2.5 shrink-0 rounded-full",
} as const;
