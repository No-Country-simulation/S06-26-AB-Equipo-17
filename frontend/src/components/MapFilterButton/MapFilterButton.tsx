import type { ButtonHTMLAttributes } from "react";
import { cx, styles } from "./MapFilterButton.styles";
import { resolveState, stateStyles } from "./MapFilterButton.states";

export type MapFilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Marca a pílula como selecionada (texto azul + sombra). */
  active?: boolean;
};

/**
 * Pílula de filtro sobre o mapa — uma opção de tema (ex.: "Visão Geral",
 * "Educação"). O agrupamento e a seleção ficam no componente pai; aqui só
 * renderizamos um botão controlado por `active`.
 */
export function MapFilterButton({
  active = false,
  disabled,
  className,
  type = "button",
  ...props
}: MapFilterButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={active}
      className={cx(styles.base, stateStyles[resolveState({ active, disabled })], className)}
      {...props}
    />
  );
}
