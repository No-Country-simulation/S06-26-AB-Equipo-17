/* ============================================================
   MapBubble — símbolo proporcional (bolha) no mapa.
   Wrapper FINO do <CircleMarker> do react-leaflet: preenchimento
   translúcido + borda branca + card no hover (RegionKpiCard).
   ⚠️ É camada Leaflet (estilo via `pathOptions`, não Tailwind/className)
   → NÃO segue o padrão .styles/.states do design system; por isso vive
   co-localizado no MapPage, não em components/. Precisa estar dentro do
   <MapContainer> (usa o contexto do react-leaflet).
   O RAIO (∝ viagens) é calculado na página (depende do máximo do dataset).
   ============================================================ */

import { CircleMarker, Tooltip } from "react-leaflet";
import { RegionKpiCard } from "@/components/RegionKpiCard";

export type MapBubbleProps = {
  center: [number, number];
  /** Raio em px (já escalado pela página). */
  radius: number;
  /** Valor exibido no card de hover (já formatado). */
  value: string;
  /** Rótulo do card de hover (ex.: "Centro · Total de viagens"). */
  label: string;
  /** Cor de preenchimento (CSS crua — Leaflet não usa className). */
  color?: string;
};

export function MapBubble({ center, radius, value, label, color = "#2f6bff" }: MapBubbleProps) {
  return (
    <CircleMarker
      center={center}
      radius={radius}
      pathOptions={{ color: "#fff", weight: 1.5, fillColor: color, fillOpacity: 0.5 }}
    >
      <Tooltip direction="top" opacity={1} className="region-kpi-tooltip">
        <RegionKpiCard value={value} label={label} />
      </Tooltip>
    </CircleMarker>
  );
}
