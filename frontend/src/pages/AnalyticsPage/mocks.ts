/* ============================================================
   AnalyticsPage — DADOS MOCKADOS (fake) + i18n
   Não há API ainda. O texto vem do namespace `analytics` (i18n);
   números/cores/séries ficam aqui. Quando a API existir, troca-se
   a origem por hooks em `api/` sem mexer nos componentes.
   ============================================================ */

import type { TFunction } from "i18next";
import type { AgentSummaryCardProps } from "@/components/AgentSummaryCard";
import type { GroupedBarChartCardProps } from "@/components/GroupedBarChartCard";
import type { MetricCardProps } from "@/components/MetricCard";
import type { OpportunityListCardProps } from "@/components/OpportunityListCard";

type T = TFunction<"analytics">;

/* ---- Dados estruturais (não-texto) ---- */

/** Série do gráfico de linha (Resumo da Região). */
export const regionTrend = [20, 20, 20, 24, 38, 56, 47, 50, 70, 80, 82, 82, 82];

const REGION_KEYS = ["center", "north", "east", "south", "mainland"] as const;
const REGION_VALUES: Record<(typeof REGION_KEYS)[number], number[]> = {
  center: [87, 18, 80],
  north: [76, 21, 70],
  east: [22, 40, 57],
  south: [68, 27, 69],
  mainland: [54, 30, 65],
};
/** Cores das séries (data-viz, derivadas do primary com alpha). */
const SERIES_COLORS = ["#2f6bff", "rgba(47,107,255,0.5)", "rgba(47,107,255,0.22)"] as const;

const OPPORTUNITIES = [
  { code: "MCTI #42/2026", key: "connectivity", deadline: 18, value: "R$ 2,4M", status: "generated", tone: "success" },
  { code: "MEC #18/2026", key: "techEducation", deadline: 32, value: "R$ 890K", status: "analyzing", tone: "warning" },
  { code: "SNAS #07/2026", key: "socialProtection", deadline: 45, value: "R$ 1,1M", status: "waitingIbge", tone: "neutral" },
] as const;

/* ---- Builders (texto via t) ---- */

export function buildAgentSummary(t: T): AgentSummaryCardProps {
  return {
    title: t("agent.title"),
    statusLabel: t("agent.status"),
    value: "1.247.893",
    label: t("agent.label"),
    sources: t("agent.sources"),
    items: [
      { status: "success", text: t("agent.items.justifications") },
      { status: "warning", text: t("agent.items.leste4g") },
      { status: "success", text: t("agent.items.report") },
    ],
  };
}

export function buildCoverageMetric(t: T): MetricCardProps {
  return {
    value: "68%",
    label: t("coverage.label"),
    progress: 68,
    trend: { value: "4.2%", period: t("trend.thisMonth"), direction: "up" },
    source: t("coverage.source"),
  };
}

export function buildRegionIndicators(t: T): GroupedBarChartCardProps {
  return {
    title: t("regions.title"),
    subtitle: t("regions.subtitle"),
    series: [
      { label: t("regions.series.coverage"), color: SERIES_COLORS[0] },
      { label: t("regions.series.vulnerability"), color: SERIES_COLORS[1] },
      { label: t("regions.series.employability"), color: SERIES_COLORS[2] },
    ],
    categories: REGION_KEYS.map((key) => ({
      label: t(`regions.names.${key}`),
      values: REGION_VALUES[key],
      highlight: key === "east",
    })),
  };
}

export function buildFederalOpportunities(t: T): OpportunityListCardProps {
  return {
    title: t("opportunities.title"),
    countLabel: t("opportunities.count", { n: OPPORTUNITIES.length }),
    items: OPPORTUNITIES.map((o) => ({
      code: o.code,
      title: t(`opportunities.items.${o.key}.title`),
      subtitle: t(`opportunities.items.${o.key}.subtitle`),
      deadline: t("opportunities.deadline", { n: o.deadline }),
      value: o.value,
      status: { label: t(`opportunities.status.${o.status}`), tone: o.tone },
    })),
  };
}
