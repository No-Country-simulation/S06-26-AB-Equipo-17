import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { MOCK_NOTIFICATIONS } from "./mock";
import type { Notification, NotificationSeverity, NotificationTab } from "./types";

const TAB_VALUES: NotificationTab[] = ["all", "critical", "editais", "sistema"];

/** Cor (barra lateral + ponto) por severidade. */
const SEVERITY_COLOR: Record<NotificationSeverity, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  info: "bg-primary",
  success: "bg-success",
};

export type NotificationsPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Painel lateral retrátil de alertas/notificações (Sheet). Dados mockados. */
export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const { t } = useTranslation("notifications");
  const [tab, setTab] = useState<NotificationTab>("all");

  const items = MOCK_NOTIFICATIONS;
  const filtered = tab === "all" ? items : items.filter((n) => n.category === tab);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 px-6 pt-6 pb-4">
          <SheetTitle className="text-title-2 text-ink">{t("title")}</SheetTitle>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-critical px-1.5 text-caption font-bold text-ink-inverse">
            {items.length}
          </span>
        </div>
        <SheetDescription className="sr-only">{t("srDescription")}</SheetDescription>

        {/* Abas (underline) */}
        <div className="flex gap-4 border-b border-line px-6">
          {TAB_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`-mb-px border-b-2 pb-2 text-body transition-colors ${
                tab === value
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t(`tabs.${value}`)}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Item da lista — barra de cor à esquerda + ponto + conteúdo + meta.
 *  Texto resolvido por `id` no i18n (ns `notifications`, `items.<id>`). */
function NotificationItem({ notification: n }: { notification: Notification }) {
  const { t } = useTranslation("notifications");
  return (
    <div className={`relative ${n.unread ? "bg-surface-sec" : ""}`}>
      <span className={`absolute top-0 left-0 h-full w-1 ${SEVERITY_COLOR[n.severity]}`} />
      <div className="flex gap-2.5 py-4 pr-6 pl-6">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_COLOR[n.severity]}`} />
        <div className="min-w-0 flex-1">
          <p className="text-body font-semibold text-ink">{t(`items.${n.id}.title`)}</p>
          <p className="text-body text-ink-muted">{t(`items.${n.id}.description`)}</p>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
            <span className="text-caption text-ink-muted">{t(`items.${n.id}.time`)}</span>
            {n.hasAction && (
              <button type="button" className="text-label font-medium text-primary hover:underline">
                {t(`items.${n.id}.action`)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
