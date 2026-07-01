import type { ReactNode } from "react";
import { cx, styles } from "./BottomNav.styles";
import { resolveState, stateStyles } from "./BottomNav.states";

export type BottomNavItem = {
  /** Valor único do item (usado em activeValue/onNavigate) — ex.: caminho da rota. */
  value: string;
  /** Rótulo exibido e usado como aria-label. */
  label: string;
  /** Ícone (SVG). Use `currentColor` para herdar a cor do estado. */
  icon: ReactNode;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  /** Valor do item ativo (rota atual). */
  activeValue: string;
  onNavigate?: (value: string) => void;
  /** Rótulo acessível do conjunto de navegação. */
  "aria-label"?: string;
};

/**
 * Barra de navegação inferior (bottom tab bar) — versão mobile da SideAppBar.
 * Fixa no rodapé, alvos de toque >=56px, safe-area do iPhone. Renderizada só
 * abaixo de `md` pelo AppLayout (que a envolve num wrapper `md:hidden`).
 */
export function BottomNav({
  items,
  activeValue,
  onNavigate,
  "aria-label": ariaLabel,
}: BottomNavProps) {
  return (
    <nav aria-label={ariaLabel} className={styles.root}>
      {items.map((item) => {
        const active = item.value === activeValue;
        const s = stateStyles[resolveState({ active })];
        return (
          <button
            key={item.value}
            type="button"
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate?.(item.value)}
            className={styles.item}
          >
            <span className={cx(styles.icon, s.icon)} aria-hidden="true">
              {item.icon}
            </span>
            <span className={cx(styles.label, s.label)}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
