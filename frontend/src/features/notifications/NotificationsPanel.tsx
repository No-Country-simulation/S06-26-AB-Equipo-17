import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { MOCK_NOTIFICATIONS } from "./mock";
import type { Notification, NotificationSeverity, NotificationTab } from "./types";

const TABS: { value: NotificationTab; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "critical", label: "Críticos" },
  { value: "editais", label: "Editais" },
  { value: "sistema", label: "Sistema" },
];

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
  const [tab, setTab] = useState<NotificationTab>("all");

  const items = MOCK_NOTIFICATIONS;
  const filtered = tab === "all" ? items : items.filter((n) => n.category === tab);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 px-6 pt-6 pb-4">
          <SheetTitle className="text-title-2 text-ink">Alertas e Notificações</SheetTitle>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-critical px-1.5 text-caption font-bold text-ink-inverse">
            {items.length}
          </span>
        </div>
        <SheetDescription className="sr-only">
          Central de alertas e notificações do sistema
        </SheetDescription>

        {/* Abas (underline) */}
        <div className="flex gap-4 border-b border-line px-6">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`-mb-px border-b-2 pb-2 text-body transition-colors ${
                tab === t.value
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t.label}
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

/** Item da lista — barra de cor à esquerda + ponto + conteúdo + meta. */
function NotificationItem({ notification: n }: { notification: Notification }) {
  return (
    <div className={`relative ${n.unread ? "bg-surface-sec" : ""}`}>
      <span className={`absolute top-0 left-0 h-full w-1 ${SEVERITY_COLOR[n.severity]}`} />
      <div className="flex gap-2.5 py-4 pr-6 pl-6">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_COLOR[n.severity]}`} />
        <div className="min-w-0 flex-1">
          <p className="text-body font-semibold text-ink">{n.title}</p>
          <p className="text-body text-ink-muted">{n.description}</p>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
            <span className="text-caption text-ink-muted">{n.time}</span>
            {n.actionLabel && (
              <button type="button" className="text-label font-medium text-primary hover:underline">
                {n.actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
