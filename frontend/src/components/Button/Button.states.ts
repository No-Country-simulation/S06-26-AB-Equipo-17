/* ============================================================
   Button — ESTADOS (variantes de cor)
     primary   -> azul sólido, texto branco
     secondary -> cinza-claro, texto azul (ex.: "Entrar com gov.br")
   (Hover automático via :hover · Desabilitado via disabled:)
   ============================================================ */

export type ButtonVariant = "primary" | "secondary";

/** Classes por variante, somadas a styles.base. */
export const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-ink-inverse hover:bg-primary/90",
  secondary: "bg-surface-sec text-primary ring-1 ring-line hover:bg-line",
};
