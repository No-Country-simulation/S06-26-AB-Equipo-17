import type { AlertStatus } from "@/components/AlertBadge";
import { cx, styles } from "./AlertsListCard.styles";
import { severityColor } from "./AlertsListCard.states";

export type AlertListItem = {
  /** Identificador do alerta (usado na seleção). */
  id: string;
  /** Severidade — define a cor da barra lateral. */
  severity: AlertStatus;
  /** Título do alerta (ex.: "Cobertura 4G crítica"). */
  title: string;
  /** Descrição curta (ex.: "Região Leste · Anatel"). */
  subtitle: string;
  /** Rótulo temporal (ex.: "Agora", "2h atrás", "28 Jun"). */
  time: string;
};

export type AlertsListCardProps = {
  /** Título do card (ex.: "Alertas ativos"). */
  title: string;
  /** Número exibido no contador (default: nº de itens). */
  count?: number;
  items: AlertListItem[];
  /** Id do alerta selecionado (destaca o item). */
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

/**
 * Card "Alertas ativos" — header com contador e lista rolável de alertas.
 * Cada item tem uma barra de cor por severidade e pode ser selecionado
 * (o detalhe correspondente aparece no AlertDetailCard). Presentacional.
 */
export function AlertsListCard({
  title,
  count,
  items,
  selectedId,
  onSelect,
  className,
}: AlertsListCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{count ?? items.length}</span>
      </div>

      <div className={styles.list} role="listbox" aria-label={title}>
        {items.map((item) => {
          const selected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect?.(item.id)}
              className={cx(styles.item, selected && styles.itemSelected)}
            >
              <span className={cx(styles.accent, severityColor[item.severity])} aria-hidden="true" />
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemSubtitle}>{item.subtitle}</p>
              <span className={styles.itemTime}>{item.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
