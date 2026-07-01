import type { ReactNode } from "react";
import { cx, styles } from "./LineChartCard.styles";

/* ---- Geometria do gráfico (coordenadas do viewBox) ---- */
const W = 320;
const H = 140;
const PAD_X = 6;
const PAD_Y = 16;
/** Linhas-guia tracejadas (frações da altura útil). */
const GRID = [0.2, 0.5, 0.8];

/** Mapeia os valores (y) para pontos [x,y] do viewBox, normalizando min→max. */
function toPoints(data: number[]): [number, number][] {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // evita divisão por zero (dados constantes)
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  return data.map((v, i) => {
    const x = PAD_X + (n === 1 ? 0 : (i / (n - 1)) * innerW);
    const y = PAD_Y + (1 - (v - min) / span) * innerH;
    return [x, y];
  });
}

/** Caminho SVG suave (Catmull-Rom → Bézier cúbica) por entre os pontos. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0][0]},${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(" ");
}

export type LineChartAction = {
  /** Ícone (ex.: <Paperclip size={18} />). */
  icon: ReactNode;
  /** Rótulo acessível. */
  label: string;
  onClick?: () => void;
};

export type LineChartCardProps = {
  /** Título do card (ex.: "Resumo da Região"). */
  title: string;
  /** Subtítulo (ex.: "Florianópolis · Visão Geral"). */
  subtitle?: string;
  /** Série de valores (y), distribuídos uniformemente no x. */
  data: number[];
  /** Ações do rodapé (ícones). Some se vazio. */
  actions?: LineChartAction[];
  className?: string;
};

/**
 * Card de gráfico de linha do dashboard: título + linha suave (SVG, sem
 * dependência) com guias tracejadas e uma barra de ações no rodapé.
 * Presentacional — dados por props.
 */
export function LineChartCard({ title, subtitle, data, actions, className }: LineChartCardProps) {
  const innerH = H - PAD_Y * 2;
  const path = smoothPath(toPoints(data));

  return (
    <div className={cx(styles.card, className)}>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.chart}
        preserveAspectRatio="none"
        role="img"
        aria-label={subtitle ? `${title} — ${subtitle}` : title}
      >
        {/* Guias horizontais tracejadas */}
        {GRID.map((frac) => {
          const y = PAD_Y + frac * innerH;
          return (
            <line
              key={frac}
              x1={PAD_X}
              y1={y}
              x2={W - PAD_X}
              y2={y}
              className={styles.gridLine}
              strokeWidth={1}
              strokeDasharray="2 5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Linha de dados (suave) */}
        <path
          d={path}
          className={styles.line}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {actions && actions.length > 0 && (
        <div className={styles.footer}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              aria-label={action.label}
              onClick={action.onClick}
              className={styles.action}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
