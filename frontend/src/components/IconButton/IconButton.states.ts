/* ============================================================
   IconButton — ESTADOS (variações visuais)
     Padrão -> 'default'  (+ hover automático via :hover)
     Hover  -> :hover do estado default
     Ativo  -> 'active'   (anel azul + fundo azul-claro)
   ============================================================ */

export type IconButtonState = 'default' | 'active'

/** Deriva o estado visual a partir das props. */
export function resolveState({ active }: { active?: boolean }): IconButtonState {
  return active ? 'active' : 'default'
}

/** Classes aplicadas por estado (somadas a styles.root). */
export const stateStyles: Record<IconButtonState, string> = {
  // Padrão: fundo branco + sombra suave, ícone cinza. Hover = fundo cinza-claro.
  default: 'bg-surface text-ink-muted shadow-elev-1 ring-1 ring-line hover:bg-surface-sec hover:text-ink',
  // Ativo: anel azul + fundo azul-claro, ícone azul.
  active: 'bg-primary-soft text-primary ring-2 ring-primary',
}
