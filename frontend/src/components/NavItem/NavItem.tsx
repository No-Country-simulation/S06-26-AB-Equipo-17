import type { ReactNode } from 'react'
import { cx, styles } from './NavItem.styles'
import { resolveState, stateStyles } from './NavItem.states'

export type NavItemProps = {
  /** Texto exibido e usado como aria-label (ex.: "Mapa"). */
  label: string
  /** Ícone (SVG). Use `fill="currentColor"` para herdar a cor do estado. */
  icon: ReactNode
  /** Item selecionado (rota atual). */
  active?: boolean
  /** Desabilita o item (sem interação). */
  disabled?: boolean
  onClick?: () => void
}

/**
 * Item da barra lateral — 88×72, com 4 estados (DS):
 *  - Padrão       : neutro
 *  - Hover        : fundo cinza-claro (automático ao passar o mouse)
 *  - Ativo        : anel + fundo azul, ícone/rótulo azuis (via `active`)
 *  - Desabilitado : esmaecido, sem clique (via `disabled`)
 */
export function NavItem({ label, icon, active = false, disabled = false, onClick }: NavItemProps) {
  const s = stateStyles[resolveState({ active, disabled })]

  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cx(styles.root, s.root)}
    >
      <span className={cx(styles.icon, s.icon)} aria-hidden="true">
        {icon}
      </span>
      <span className={cx(styles.label, s.label)}>{label}</span>
    </button>
  )
}
