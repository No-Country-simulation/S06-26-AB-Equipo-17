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

export type MapPinSize = "xs" | "sm" | "md";

/** Tamanho do ponto: `xs` (14px) p/ camadas com muitos pins (bairros/zonas
 *  do mapa) · `sm` (32px) · `md` (56px, DS). O anel branco afina no `xs`
 *  para não pesar sobre o mapa. O ícone interno opcional escala via [&_svg]. */
export const sizeStyles: Record<MapPinSize, string> = {
  xs: "h-3.5 w-3.5 ring-[1.5px] [&_svg]:size-2",
  sm: "h-8 w-8 ring-2 [&_svg]:size-3.5",
  md: "h-14 w-14 ring-2 [&_svg]:size-6",
};

/** Lado do pin em px por tamanho — usado no `iconSize`/`iconAnchor` do
 *  divIcon do Leaflet, para o ponto ficar centrado na coordenada. */
export const sizePx: Record<MapPinSize, number> = { xs: 14, sm: 32, md: 56 };
