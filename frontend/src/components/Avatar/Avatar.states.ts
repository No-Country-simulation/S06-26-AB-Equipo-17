/* ============================================================
   Avatar — ESTADOS
     sm -> Pequeno 32px
     md -> Médio   40px
     lg -> Grande  48px
   ============================================================ */

export type AvatarSize = "sm" | "md" | "lg";

/** Classes (círculo + tamanho da fonte) por tamanho, somadas a styles.root. */
export const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-sm", // 32px
  md: "h-10 w-10 text-base", // 40px
  lg: "h-12 w-12 text-lg", // 48px
};
