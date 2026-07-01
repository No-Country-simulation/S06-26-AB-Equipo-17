/* ============================================================
   ReportsPage — DADOS MOCKADOS (fake) + i18n
   Sem API: texto vem do namespace `reports`; a estrutura (quais
   itens, prazos, status, formatos) fica aqui. Quando houver API,
   troca-se a origem sem tocar nos componentes.
   ============================================================ */

import type { TFunction } from "i18next";
import type { ReportsListCardProps, ReportStatus } from "@/components/ReportsListCard";
import type { JustificationsCardProps } from "@/components/JustificationsCard";
import type { ReportGeneratorCardProps } from "@/components/ReportGeneratorCard";

type T = TFunction<"reports">;

/* ---- Estrutura (não-texto) ---- */

const REPORT_ITEMS = [
  { key: "jun2026", highlighted: true },
  { key: "compMaiJun" },
  { key: "vulnerability" },
  { key: "coverage", status: "generating" as ReportStatus },
  { key: "mai2026" },
  { key: "compAbrMai" },
] as const;

const JUSTIFICATIONS = [
  { key: "mcti", deadline: 18, status: "generated" },
  { key: "mec", deadline: 32, status: "reviewing" },
  { key: "snas", deadline: 45, status: "waiting" },
] as const;

const FIELD_KEYS = ["region", "period", "indicators"] as const;
const FORMATS = ["PDF", "XLSX", "CSV"];

/* ---- Builders (texto via t) ---- */

export function buildMyReports(t: T): ReportsListCardProps {
  return {
    title: t("myReports.title"),
    newLabel: t("myReports.new"),
    recentLabel: t("myReports.recent"),
    downloadLabel: t("myReports.download"),
    generatingLabel: t("myReports.generating"),
    items: REPORT_ITEMS.map((r) => ({
      title: t(`myReports.items.${r.key}.title`),
      subtitle: t(`myReports.items.${r.key}.subtitle`),
      date: t(`myReports.items.${r.key}.date`),
      status: "status" in r ? r.status : "ready",
      highlighted: "highlighted" in r ? r.highlighted : false,
    })),
  };
}

export function buildJustifications(t: T): JustificationsCardProps {
  return {
    title: t("justifications.title"),
    countLabel: t("justifications.count", { n: JUSTIFICATIONS.length }),
    exportLabel: t("justifications.export"),
    items: JUSTIFICATIONS.map((j) => ({
      code: t(`justifications.items.${j.key}.code`),
      deadline: t("justifications.deadline", { n: j.deadline }),
      title: t(`justifications.items.${j.key}.title`),
      status: t(`justifications.status.${j.status}`),
    })),
  };
}

export function buildGenerator(t: T): ReportGeneratorCardProps {
  return {
    title: t("generator.title"),
    fields: FIELD_KEYS.map((key) => ({
      label: t(`generator.fields.${key}.label`),
      options: t(`generator.fields.${key}.options`, { returnObjects: true }) as string[],
    })),
    formatLabel: t("generator.format"),
    formats: FORMATS,
    previewTitle: t("generator.preview.title"),
    previewText: t("generator.preview.text"),
    generateLabel: t("generator.generate"),
    recentLabel: t("generator.recent"),
    recents: t("generator.recents", { returnObjects: true }) as string[],
  };
}
