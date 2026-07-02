import type { ReactNode } from "react";
import { cx, styles } from "./MapPin.styles";
import {
  sizeStyles,
  stateStyles,
  type MapPinSize,
  type MapPinState,
} from "./MapPin.states";

/** Ícone padrão do pin (quadrado arredondado). `currentColor` herda a cor do estado. */
function SquareGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <rect width="22" height="22" rx="6" />
    </svg>
  );
}

export type MapPinProps = {
  /** Estado do marcador (define cor, ícone e glow). */
  state?: MapPinState;
  /** Tamanho do círculo: `md` (56, DS) ou `sm` (32, camadas densas). */
  size?: MapPinSize;
  /** Rótulo acessível (aria-label). */
  label: string;
  /** Ícone interno (default: quadrado arredondado). */
  icon?: ReactNode;
  onClick?: () => void;
};

/**
 * Marcador do mapa — círculo com 3 estados (DS):
 *  - default   : cinza-claro
 *  - selected  : azul + glow azul
 *  - alert      : vermelho + glow vermelho
 */
export function MapPin({ state = "default", size = "md", label, icon, onClick }: MapPinProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={state === "selected"}
      onClick={onClick}
      className={cx(styles.pin, sizeStyles[size], stateStyles[state])}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <SquareGlyph />}
      </span>
    </button>
  );
}
