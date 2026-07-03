/* ============================================================
   MapPin — ESTADOS
   O ponto do mapa espelha os TONS da legenda (componente Legend),
   então pin e legenda ficam sempre com a MESMA cor:
     success  -> Cobertura total    (verde)
     info     -> Em monitoramento   (azul)
     warning  -> Aviso              (âmbar)
     orange   -> Alta criticidade   (laranja)
     critical -> Sem cobertura      (vermelho)
     neutral  -> sem dado           (cinza)
   ============================================================ */

import type { LegendTone } from "@/components/Legend";

/** Tom do ponto — reaproveita os tons da Legend (fonte única). */
export type MapPinTone = LegendTone;

/** Cor de preenchimento por tom (tokens do tema; iguais aos da Legend).
 *  `orange` é hex (não há token laranja no tema). */
export const toneStyles: Record<MapPinTone, string> = {
  success: "bg-success",
  info: "bg-primary",
  warning: "bg-warning",
  orange: "bg-[#f97316]",
  critical: "bg-critical",
  neutral: "bg-disabled-foreground",
};

export type MapPinSize = "sm" | "md";

/** Tamanho do ponto: `sm` (32px) p/ camadas densas (muitos pins no mesmo
 *  enquadramento, ex.: zonas do GET /mapa) · `md` (56px, DS). O ícone interno
 *  opcional escala via [&_svg]. */
export const sizeStyles: Record<MapPinSize, string> = {
  sm: "h-8 w-8 [&_svg]:size-3.5",
  md: "h-14 w-14 [&_svg]:size-6",
};
