import type { ButtonHTMLAttributes } from "react";
import { cx, styles } from "./Button.styles";
import { variantStyles, type ButtonVariant } from "./Button.states";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Variante visual (default: primary). */
  variant?: ButtonVariant;
  /** Ocupa toda a largura disponível. */
  fullWidth?: boolean;
};

/**
 * Botão de ação — variantes primary / secondary.
 * Aceita todas as props nativas de <button> (onClick, disabled, type...).
 */
export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.base, variantStyles[variant], fullWidth && "w-full", className)}
      {...props}
    />
  );
}
