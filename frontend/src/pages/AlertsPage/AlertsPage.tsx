import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertsListCard } from "@/components/AlertsListCard";
import { AlertDetailCard } from "@/components/AlertDetailCard";
import { AlertConfigCard } from "@/components/AlertConfigCard";
import { buildAlertConfig, buildAlertDetail, buildAlertsList, DEFAULT_ALERT_ID } from "./mocks";

/**
 * Página de Alertas (rota /app/alerts) — três colunas: lista de alertas
 * ativos (seleção), detalhe do alerta selecionado e configuração dos
 * alertas. Tudo MOCKADO (ver ./mocks.ts); textos via i18n (ns `alerts`).
 */
export function AlertsPage() {
  const { t } = useTranslation("alerts");
  const [selectedId, setSelectedId] = useState(DEFAULT_ALERT_ID);

  const list = useMemo(() => buildAlertsList(t), [t]);
  const selected = list.items.find((item) => item.id === selectedId) ?? list.items[0];
  const detail = useMemo(() => buildAlertDetail(t, selected), [t, selected]);
  const config = useMemo(() => buildAlertConfig(t), [t]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <AlertsListCard
          title={list.title}
          count={list.count}
          items={list.items}
          selectedId={selected.id}
          onSelect={setSelectedId}
        />
        <AlertDetailCard {...detail} />
        <AlertConfigCard {...config} />
      </div>
    </div>
  );
}
