/** Severidade — define a cor (barra lateral + ponto). */
export type NotificationSeverity = "critical" | "warning" | "info" | "success";

/** Categoria — usada nas abas (Críticos / Editais / Sistema). */
export type NotificationCategory = "critical" | "editais" | "sistema";

export type Notification = {
  id: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  title: string;
  description: string;
  /** Quando (texto pronto): "Agora", "2h atrás", "Hoje, 06:00", "28 Jun". */
  time: string;
  /** Ação à direita (ex.: "Ver no mapa"). */
  actionLabel?: string;
  /** Não lida → fundo destacado. */
  unread?: boolean;
};

/** Abas do painel. */
export type NotificationTab = "all" | NotificationCategory;
