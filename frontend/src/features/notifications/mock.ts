import type { Notification } from "./types";

/** Notificações mockadas (TODO: vir do backend). */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    severity: "critical",
    category: "critical",
    title: "Cobertura 4G crítica — Região Leste",
    description: "22% de cobertura. Abaixo do limite mínimo regulatório (30%).",
    time: "Agora",
    actionLabel: "Ver no mapa",
  },
  {
    id: "2",
    severity: "warning",
    category: "editais",
    title: "Edital MCTI #42/2026 vence em 18 dias",
    description: "Justificativa gerada. Revisão pendente antes do envio.",
    time: "2h atrás",
    actionLabel: "Revisar",
    unread: true,
  },
  {
    id: "3",
    severity: "info",
    category: "sistema",
    title: "Relatório de Indicadores disponível",
    description: "Mensal Jun 2026 gerado. Todas as regiões incluídas.",
    time: "Hoje, 06:00",
    actionLabel: "Baixar",
  },
  {
    id: "4",
    severity: "success",
    category: "editais",
    title: "MEC #18/2026 — Justificativa enviada",
    description: "Documento protocolado com sucesso. Aguardando análise.",
    time: "28 Jun",
    actionLabel: "Ver protocolo",
  },
];
