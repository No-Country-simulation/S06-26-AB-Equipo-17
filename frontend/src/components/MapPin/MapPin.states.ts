/* ============================================================
   MapPin — ESTADOS
     default   -> Padrão      : cinza-claro, ícone cinza
     selected  -> Selecionado : azul, ícone branco + glow azul
     alert     -> Alerta      : vermelho, ícone branco + glow vermelho
   ============================================================ */

export type MapPinState = "default" | "selected" | "alert";

/** Classes (bg + ícone + glow) por estado, somadas a styles.pin. */
export const stateStyles: Record<MapPinState, string> = {
  default: "bg-surface-sec text-ink-muted ring-1 ring-line",
  selected: "bg-primary text-ink-inverse shadow-glow-primary",
  alert: "bg-critical text-ink-inverse shadow-glow-critical",
};
