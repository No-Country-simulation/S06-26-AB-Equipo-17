/* ============================================================
   Overview — referencial de bairros × monitoramento (GET /mapa/overview).
   Faz o join do payload (por nome de bairro) com os bairros do GeoJSON
   (que têm o centroide) -> 1 pin por bairro na MapPage, colorido pela
   legenda (monitorado = azul "Em monitoramento", senao vermelho "Sem
   cobertura"). Bairro ausente no payload = tratado como nao monitorado.
   ============================================================ */

import type { BairroMonitoring } from "@/types";

/** "Lagoa da Conceicao" -> "lagoa da conceicao" (sem acento, minusculo). */
export function normalizeBairroName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Indice por nome normalizado - lookup O(1) pro join com os bairros do GeoJSON. */
export function indexMonitoringByBairro(
  bairros: BairroMonitoring[],
): Record<string, BairroMonitoring> {
  return Object.fromEntries(bairros.map((b) => [normalizeBairroName(b.bairro), b]));
}
