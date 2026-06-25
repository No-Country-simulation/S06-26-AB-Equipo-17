import type { ReactNode } from 'react'
import { cx, styles } from './IconButton.styles'
import { resolveState, stateStyles } from './IconButton.states'

export type IconButtonProps = {
  /** Texto para acessibilidade (lido por leitores de tela). */
  label: string
  /** Estado selecionado/ativo (ex.: filtro ligado, aba selecionada). */
  active?: boolean
  onClick?: () => void
  /** Ícone (SVG). Use `fill="currentColor"` para herdar a cor do estado. */
  children: ReactNode
}

/**
 * Botão de ícone 40×40 com 3 estados:
 *  - Padrão : fundo branco + sombra suave, ícone cinza
 *  - Hover  : fundo cinza-claro, ícone mais escuro (automático ao passar o mouse)
 *  - Ativo  : anel azul + fundo azul-claro, ícone azul (controlado por `active`)
 */
export function IconButton({ label, active = false, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cx(styles.root, stateStyles[resolveState({ active })])}
    >
      {children}
    </button>
  )
}
