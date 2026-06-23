import type { ReactNode } from 'react'

type IconButtonProps = {
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
      className={[
        'inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60',
        active
          ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500'
          : 'bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-gray-100 hover:text-gray-700',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
