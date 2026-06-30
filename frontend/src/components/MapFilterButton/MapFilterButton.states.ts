/* ============================================================
   MapFilterButton — ESTADOS
     Padrão -> 'default'  (pílula branca, texto neutro; hover eleva)
     Ativo  -> 'active'   (pílula branca, texto azul/negrito, mais sombra)
     Desabilitado -> 'disabled'
   ============================================================ */

export type MapFilterButtonState = "default" | "active" | "disabled";

/** Deriva o estado visual a partir das props. */
export function resolveState({
  active,
  disabled,
}: {
  active?: boolean;
  disabled?: boolean;
}): MapFilterButtonState {
  if (disabled) return "disabled";
  if (active) return "active";
  return "default";
}

/** Classes aplicadas por estado (somadas a styles.base). */
export const stateStyles: Record<MapFilterButtonState, string> = {
  // Padrão: texto neutro, sombra média (sombra fixa, sem mudar no hover).
  default: "cursor-pointer text-ink shadow-elev-2",
  // Ativo: texto azul em negrito, sombra mais marcada.
  active: "cursor-pointer font-semibold text-primary shadow-elev-3",
  // Desabilitado: esmaecido, sem interação.
  disabled: "cursor-not-allowed text-ink-muted opacity-50 shadow-elev-2",
};
