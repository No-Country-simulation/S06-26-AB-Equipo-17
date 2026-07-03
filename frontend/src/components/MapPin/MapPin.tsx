import type { ReactNode } from "react";
import { cx, styles } from "./MapPin.styles";
import { sizeStyles, toneStyles, type MapPinSize, type MapPinTone } from "./MapPin.states";

export type MapPinProps = {
  /** Tom do ponto (cor) — espelha a legenda do mapa. Default "info". */
  tone?: MapPinTone;
  /** Tamanho do círculo: `sm` (32) p/ camadas densas ou `md` (56, DS). */
  size?: MapPinSize;
  /** Rótulo acessível (aria-label). */
  label: string;
  /** Ícone interno opcional (branco, centralizado). Sem ícone = ponto puro. */
  icon?: ReactNode;
  /** Destaca o ponto como selecionado (anel reforçado). */
  selected?: boolean;
  onClick?: () => void;
};

/**
 * Ponto do mapa — círculo sólido colorido pelo TOM (mesma paleta da legenda):
 *  success (verde) · info (azul) · warning (âmbar) · orange (laranja) ·
 *  critical (vermelho) · neutral (cinza). Componente puro (sem hooks) → pode
 *  ser serializado com renderToStaticMarkup para virar um divIcon do Leaflet.
 */
export function MapPin({
  tone = "info",
  size = "md",
  label,
  icon,
  selected = false,
  onClick,
}: MapPinProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={cx(styles.pin, sizeStyles[size], toneStyles[tone], selected && styles.selected)}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}
