/* ============================================================
   AlertsPage — DADOS MOCKADOS (fake) + i18n
   Sem API: texto vem do namespace `alerts`; a estrutura (quais
   alertas, severidade, canais, frequência) fica aqui. Quando
   houver API, troca-se a origem sem tocar nos componentes.
   ============================================================ */

import type { TFunction } from "i18next";
import type { AlertStatus } from "@/components/AlertBadge";
import type { AlertListItem } from "@/components/AlertsListCard";
import type { AlertDetailCardProps } from "@/components/AlertDetailCard";
import type { AlertConfigCardProps } from "@/components/AlertConfigCard";

type T = TFunction<"alerts">;

/* ---- Estrutura (não-texto) ---- */

/** Alertas ativos: id (chave no i18n) + severidade (cor da barra).
 *  `as const` mantém os ids/severidades como literais → o i18n tipado
 *  valida as chaves montadas (`list.items.<id>.title`). */
const ALERT_ITEMS = [
  { id: "coverage", severity: "critical" },
  { id: "edital", severity: "warning" },
  { id: "ibge", severity: "warning" },
  { id: "report", severity: "info" },
  { id: "mec", severity: "success" },
  { id: "estimate", severity: "info" },
  { id: "analysis", severity: "success" },
] as const satisfies ReadonlyArray<{ id: string; severity: AlertStatus }>;

/** Alerta pré-selecionado ao abrir a página (o crítico, como no design). */
export const DEFAULT_ALERT_ID = "coverage";

/** Contador do card (destaque no header) — nº de alertas não lidos/novos.
 *  Mock: 4 (como no design). Quando houver API vem do backend. */
export const ALERTS_COUNT = 4;

/** Só o alerta "coverage" tem detalhe completo (stat/contexto/recomendação);
 *  os demais reaproveitam o corpo como mock, trocando só o cabeçalho. */
const RICH_DETAIL_ID = "coverage";

const CONTEXT_KEYS = ["region", "source", "affected", "history"] as const;
const CHANNELS = [
  { id: "panel", enabled: true },
  { id: "email", enabled: true },
  { id: "pdf", enabled: false },
] as const;
const FREQUENCY_KEYS = ["realtime", "hourly", "daily"] as const;

/* ---- Builders (texto via t) ---- */

export function buildAlertsList(t: T): { title: string; count: number; items: AlertListItem[] } {
  return {
    title: t("list.title"),
    count: ALERTS_COUNT,
    items: ALERT_ITEMS.map(({ id, severity }) => ({
      id,
      severity,
      title: t(`list.items.${id}.title`),
      subtitle: t(`list.items.${id}.subtitle`),
      time: t(`list.items.${id}.time`),
    })),
  };
}

export function buildAlertDetail(t: T, selected: AlertListItem): AlertDetailCardProps {
  const rich = selected.id === RICH_DETAIL_ID;
  return {
    severity: selected.severity,
    badgeLabel: t(`badge.${selected.severity}`),
    time: selected.time,
    // Cabeçalho segue o item selecionado; o corpo detalhado é o mock "coverage".
    title: rich ? t("detail.title") : selected.title,
    source: rich ? t("detail.source") : selected.subtitle,
    stat: {
      value: t("detail.stat.value"),
      label: t("detail.stat.label"),
      min: t("detail.stat.min"),
    },
    contextTitle: t("detail.context.title"),
    context: CONTEXT_KEYS.map((key) => ({
      label: t(`detail.context.items.${key}.label`),
      value: t(`detail.context.items.${key}.value`),
    })),
    recommendationTitle: t("detail.recommendation.title"),
    recommendationText: t("detail.recommendation.text"),
    actionsTitle: t("detail.actions.title"),
    mapLabel: t("detail.actions.map"),
    justificationLabel: t("detail.actions.justification"),
  };
}

export function buildAlertConfig(t: T): AlertConfigCardProps {
  return {
    title: t("config.title"),
    region: {
      label: t("config.region.label"),
      options: t("config.region.options", { returnObjects: true }) as string[],
    },
    indicator: {
      label: t("config.indicator.label"),
      options: t("config.indicator.options", { returnObjects: true }) as string[],
    },
    threshold: {
      label: t("config.threshold.label"),
      value: t("config.threshold.value"),
      suffix: t("config.threshold.suffix"),
    },
    notifyLabel: t("config.notify.label"),
    channels: CHANNELS.map((c) => ({
      id: c.id,
      label: t(`config.notify.channels.${c.id}`),
      enabled: c.enabled,
    })),
    frequencyLabel: t("config.frequency.label"),
    frequencyOptions: FREQUENCY_KEYS.map((id) => ({
      id,
      label: t(`config.frequency.options.${id}`),
    })),
    defaultFrequency: "realtime",
    saveLabel: t("config.save"),
  };
}
