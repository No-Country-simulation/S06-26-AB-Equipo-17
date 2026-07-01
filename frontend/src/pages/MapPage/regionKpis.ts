/* ============================================================
   Region KPIs — camada de dados por bairro (hover do mapa).
   MOCK por ora. No futuro, o GET /mapa deve trazer o payload
   (possivelmente tudo junto: bairros + dados); a SELEÇÃO/FILTRAGEM
   no front vive aqui, então trocar mock → endpoint não toca o
   componente nem a MapPage. Ver [[dados-dashboard-mocked]].
   ============================================================ */

import type { RegionKpiCardProps } from "@/components/RegionKpiCard";

/** Dado (mínimo) de um bairro. `name` casa com feature.properties.name. */
export type RegionKpi = {
  name: string;
  /** Total de residentes atendidos. */
  residents: number;
  /** Variação percentual (ex.: 12.4 sobe / -3.1 desce). */
  trendPct: number;
};

/** Hash estável do nome → mock determinístico (mesmo bairro = mesmos números). */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * MOCK do payload do mapa: gera um KPI por bairro a partir dos nomes.
 * Quando o endpoint existir, esta função sai e o payload real entra
 * (normalizado em `api/` → RegionKpi[]); o resto continua igual.
 */
export function mockRegionKpis(names: string[]): RegionKpi[] {
  return names.map((name) => {
    const h = hash(name);
    return {
      name,
      residents: 40_000 + (h % 1_260_000), // ~40k–1,3M
      trendPct: Number((((h % 260) - 80) / 10).toFixed(1)), // -8.0 … +17.9
    };
  });
}

/** Índice por nome — o "filtro no front": de uma lista plana → lookup O(1). */
export function indexByName(regions: RegionKpi[]): Record<string, RegionKpi> {
  return Object.fromEntries(regions.map((r) => [r.name, r]));
}

/** Adapta um RegionKpi (+ label traduzido) para os props do RegionKpiCard. */
export function toCardProps(kpi: RegionKpi, label: string): RegionKpiCardProps {
  const up = kpi.trendPct >= 0;
  return {
    value: kpi.residents.toLocaleString("pt-BR"),
    label,
    trend: {
      value: `${up ? "+" : "−"}${Math.abs(kpi.trendPct).toLocaleString("pt-BR")}%`,
      direction: up ? "up" : "down",
    },
  };
}
