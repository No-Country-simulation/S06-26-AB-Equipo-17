/* ============================================================
   BottomNav — ESTADOS
     Padrão -> 'default'  (ícone/rótulo neutros)
     Ativo  -> 'active'   (ícone/rótulo azuis)
   Sem hover (mobile) e sem disabled (todas as rotas existem).
   ============================================================ */

export type BottomNavItemState = "default" | "active";

/** Deriva o estado visual a partir das props. */
export function resolveState({ active }: { active?: boolean }): BottomNavItemState {
  return active ? "active" : "default";
}

type StateClasses = { icon: string; label: string };

/** Classes aplicadas por estado (somadas às de BottomNav.styles.ts). */
export const stateStyles: Record<BottomNavItemState, StateClasses> = {
  default: {
    icon: "text-ink-muted",
    label: "text-ink-muted",
  },
  active: {
    icon: "text-primary",
    label: "text-primary font-medium",
  },
};
