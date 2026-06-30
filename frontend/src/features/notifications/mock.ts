import type { Notification } from "./types";

/** Metadados das notificações mockadas (TODO: vir do backend). O texto está no
 *  i18n (ns `notifications`, `items.<id>`), resolvido no painel pelo `id`. */
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", severity: "critical", category: "critical", hasAction: true },
  { id: "2", severity: "warning", category: "editais", hasAction: true, unread: true },
  { id: "3", severity: "info", category: "sistema", hasAction: true },
  { id: "4", severity: "success", category: "editais", hasAction: true },
];
