import { cx, styles } from "./GroupedBarChartCard.styles";

/* ---- Geometria do gráfico (coordenadas do viewBox) ---- */
const W = 660;
const H = 340;
const M = { top: 28, right: 14, bottom: 40, left: 40 };
const PLOT = {
  x0: M.left,
  x1: W - M.right,
  y0: M.top,
  y1: H - M.bottom,
};
const PLOT_W = PLOT.x1 - PLOT.x0;
const PLOT_H = PLOT.y1 - PLOT.y0;
const TICKS = [0, 25, 50, 75, 100];

/** Path de uma barra com cantos superiores arredondados (base reta). */
function barPath(x: number, y: number, w: number, h: number, r = 3): string {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

export type BarSeries = {
  /** Rótulo da série (ex.: "Cobertura 4G"). */
  label: string;
  /** Cor da barra/legenda (hex/rgb) — data-viz, derivada do primary. */
  color: string;
};

export type BarCategory = {
  /** Rótulo do grupo (ex.: "Centro"). */
  label: string;
  /** Valores por série, na mesma ordem de `series`. */
  values: number[];
  /** Destaca o grupo (barra rotulada + textos em vermelho). */
  highlight?: boolean;
};

export type GroupedBarChartCardProps = {
  title: string;
  subtitle?: string;
  series: BarSeries[];
  categories: BarCategory[];
  /** Índice da série que recebe rótulo de valor no topo (default 0). */
  labeledSeries?: number;
  /** Cor da barra rotulada quando o grupo está destacado. */
  highlightColor?: string;
  /** Valor máximo do eixo Y (default 100). */
  max?: number;
  className?: string;
};

/**
 * Card de barras agrupadas do dashboard: N grupos × M séries, com guias,
 * rótulos de valor na série principal, destaque de grupo (vermelho) e
 * legenda. SVG sem dependência. Presentacional — dados por props.
 */
export function GroupedBarChartCard({
  title,
  subtitle,
  series,
  categories,
  labeledSeries = 0,
  highlightColor = "#1d3fb5",
  max = 100,
  className,
}: GroupedBarChartCardProps) {
  const n = categories.length;
  const s = series.length;
  const groupW = PLOT_W / n;
  const innerPad = groupW * 0.16;
  const barsAreaW = groupW - innerPad * 2;
  const gap = barsAreaW * 0.1;
  const barW = (barsAreaW - gap * (s - 1)) / s;

  const yOf = (v: number) => PLOT.y1 - (v / max) * PLOT_H;

  return (
    <div className={cx(styles.card, className)}>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.chart}
        role="img"
        aria-label={subtitle ? `${title} — ${subtitle}` : title}
      >
        {/* Guias horizontais + rótulos do eixo Y */}
        {TICKS.map((t) => {
          const y = yOf(t);
          return (
            <g key={t}>
              <line x1={PLOT.x0} y1={y} x2={PLOT.x1} y2={y} className={styles.grid} strokeWidth={1} />
              <text
                x={PLOT.x0 - 8}
                y={y + 3}
                textAnchor="end"
                fontSize={11}
                className={styles.axisLabel}
              >
                {t}%
              </text>
            </g>
          );
        })}

        {/* Grupos de barras */}
        {categories.map((cat, i) => {
          const gx0 = PLOT.x0 + i * groupW + innerPad;
          const cx0 = PLOT.x0 + i * groupW + groupW / 2;
          return (
            <g key={cat.label}>
              {series.map((serie, j) => {
                const v = cat.values[j] ?? 0;
                const h = (v / max) * PLOT_H;
                const x = gx0 + j * (barW + gap);
                const y = PLOT.y1 - h;
                const isLabeled = j === labeledSeries;
                const fill = cat.highlight && isLabeled ? highlightColor : serie.color;
                return (
                  <g key={serie.label}>
                    <path d={barPath(x, y, barW, h)} style={{ fill }} />
                    {isLabeled && (
                      <text
                        x={x + barW / 2}
                        y={y - 6}
                        textAnchor="middle"
                        fontSize={13}
                        fontWeight={700}
                        className={cat.highlight ? styles.valueLabelHighlight : styles.valueLabel}
                      >
                        {v}%
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Rótulo do grupo (eixo X) */}
              <text
                x={cx0}
                y={PLOT.y1 + 20}
                textAnchor="middle"
                fontSize={12}
                fontWeight={cat.highlight ? 700 : 400}
                className={cat.highlight ? styles.catLabelHighlight : styles.catLabel}
              >
                {cat.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legenda */}
      <div className={styles.legend}>
        {series.map((serie) => (
          <span key={serie.label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: serie.color }} />
            {serie.label}
          </span>
        ))}
      </div>
    </div>
  );
}
