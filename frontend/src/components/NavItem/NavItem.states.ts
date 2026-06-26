/* ============================================================
   NavItem — ESTADOS
     Padrão       -> 'default'  (+ hover automático via :hover)
     Hover        -> :hover do estado default (fundo cinza-claro)
     Ativo        -> 'active'   (anel azul + fundo azul-claro)
     Desabilitado -> 'disabled'
   ============================================================ */

export type NavItemState = "default" | "active" | "disabled";

/** Deriva o estado visual a partir das props. */
export function resolveState({
  active,
  disabled,
}: {
  active?: boolean;
  disabled?: boolean;
}): NavItemState {
  if (disabled) return "disabled";
  if (active) return "active";
  return "default";
}

type StateClasses = { root: string; icon: string; label: string };

/** Classes aplicadas por estado (somadas às de NavItem.styles.ts). */
export const stateStyles: Record<NavItemState, StateClasses> = {
  // Padrão: ícone/rótulo neutros; Hover = fundo cinza-claro.
  default: {
    root: "cursor-pointer hover:bg-surface-sec",
    icon: "text-ink-muted",
    label: "text-ink",
  },
  // Ativo: tile elevado — fundo azul-claro + anel azul + sombra, ícone/rótulo azuis.
  active: {
    root: "bg-primary-soft ring-2 ring-primary shadow-elev-2",
    icon: "text-primary",
    label: "text-primary",
  },
  // Desabilitado: esmaecido, sem interação.
  disabled: {
    root: "cursor-not-allowed opacity-50",
    icon: "text-ink-muted",
    label: "text-ink-muted",
  },
};
