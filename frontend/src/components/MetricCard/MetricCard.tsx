import { cx, styles } from "./MetricCard.styles";
import {
  barColor,
  trendColor,
  trendIcon,
  type MetricTone,
  type TrendDirection,
} from "./MetricCard.states";

export type MetricTrend = {
  /** Valor da variação (ex.: "4.2%"). */
  value: string;
  /** Período/qualificador (ex.: "este mês"). */
  period?: string;
  /** Direção — define cor e seta (default: up). */
  direction?: TrendDirection;
};

export type MetricCardProps = {
  /** Valor em destaque (ex.: "68%"). */
  value: string;
  /** Descrição (ex.: "Cobertura 4G · Florianópolis"). */
  label: string;
  /** Preenchimento da barra, 0–100. */
  progress: number;
  /** Tom da barra (default: success). */
  tone?: MetricTone;
  /** Tendência opcional (texto verde/vermelho com seta). */
  trend?: MetricTrend;
  /** Fonte/data no rodapé (ex.: "Anatel · Jun 2026"). */
  source?: string;
  className?: string;
};

/**
 * Card de métrica do dashboard: valor + tendência, rótulo, barra de
 * progresso e fonte. Presentacional — dados por props.
 */
export function MetricCard({
  value,
  label,
  progress,
  tone = "success",
  trend,
  source,
  className,
}: MetricCardProps) {
  const width = Math.max(0, Math.min(100, progress));
  const direction = trend?.direction ?? "up";
  const TrendIcon = trendIcon[direction];

  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <p className={styles.value}>{value}</p>
        {trend && (
          <span className={cx(styles.trend, trendColor[direction])}>
            <TrendIcon size={14} />
            {trend.value}
            {trend.period ? ` ${trend.period}` : ""}
          </span>
        )}
      </div>

      <p className={styles.label}>{label}</p>

      <div className={styles.track}>
        <div className={cx(styles.fill, barColor[tone])} style={{ width: `${width}%` }} />
      </div>

      {source && <p className={styles.source}>{source}</p>}
    </div>
  );
}
