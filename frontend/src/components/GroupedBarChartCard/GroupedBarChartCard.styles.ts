/* ============================================================
   GroupedBarChartCard — ESTILO (estrutura fixa)
   Card branco: título + subtítulo, gráfico de barras agrupadas
   (SVG) e legenda. Cores das séries vêm por props (data-viz).
   ============================================================ */

/** Junta classes ignorando valores falsy (sem dependência externa). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  card: "flex w-full flex-col rounded-card bg-surface p-6 shadow-elev-2 ring-1 ring-line/70",

  title: "text-title-3 font-bold text-ink",
  subtitle: "mt-0.5 text-body text-ink-muted",

  chart: "mt-4 w-full",
  grid: "stroke-line",
  axisLabel: "fill-ink-muted",
  valueLabel: "fill-ink",
  valueLabelHighlight: "fill-critical",
  catLabel: "fill-ink-muted",
  catLabelHighlight: "fill-critical",

  legend: "mt-4 flex flex-wrap items-center gap-x-5 gap-y-2",
  legendItem: "inline-flex items-center gap-2 text-caption text-ink-muted",
  legendDot: "h-2.5 w-2.5 rounded-full",
} as const;
