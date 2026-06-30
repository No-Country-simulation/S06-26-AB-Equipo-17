/** Severidade — define a cor (barra lateral + ponto). */
export type NotificationSeverity = "critical" | "warning" | "info" | "success";

/** Categoria — usada nas abas (Críticos / Editais / Sistema). */
export type NotificationCategory = "critical" | "editais" | "sistema";

/** Id do item — também é a chave do texto no i18n (ns `notifications`, `items.<id>`). */
export type NotificationId = "1" | "2" | "3" | "4";

/**
 * Metadados da notificação (mock). O texto (title/description/time/action) NÃO
 * mora aqui — vem do i18n por `items.<id>` (ver ADR-017). Quando o backend
 * existir, ele devolve dados já localizados ou um código que vira chave.
 */
export type Notification = {
  id: NotificationId;
  severity: NotificationSeverity;
  category: NotificationCategory;
  /** Exibe o botão de ação à direita (rótulo vem de `items.<id>.action`). */
  hasAction?: boolean;
  /** Não lida → fundo destacado. */
  unread?: boolean;
};

/** Abas do painel. */
export type NotificationTab = "all" | NotificationCategory;
