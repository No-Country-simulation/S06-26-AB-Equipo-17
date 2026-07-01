/* ============================================================
   LineChartCard — ESTILO (estrutura fixa)
   Card branco: título + subtítulo, gráfico de linha (SVG) e uma
   barra de ações no rodapé. Sem variações de estado → sem .states.ts.
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-5 shadow-elev-2 ring-1 ring-line/70",

  title: "text-title-3 font-bold text-ink",
  subtitle: "mt-0.5 text-body text-ink-muted",

  chart: "mt-4 w-full",
  gridLine: "stroke-line",
  line: "fill-none stroke-primary",

  // mt-auto fixa o rodapé na base quando o card estica (alturas iguais no grid).
  footer: "mt-auto flex items-center justify-around border-t border-line pt-3",
  action:
    "rounded-btn-sm p-2 text-ink-muted transition-colors hover:bg-surface-sec hover:text-ink",
} as const;
