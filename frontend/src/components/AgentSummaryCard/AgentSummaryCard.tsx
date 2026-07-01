import { cx, styles } from "./AgentSummaryCard.styles";
import { itemIcon, itemIconColor, type AgentItemStatus } from "./AgentSummaryCard.states";

export type AgentSummaryItem = {
  /** Status do item — define o ícone e a cor. */
  status: AgentItemStatus;
  /** Texto do item (já traduzido pelo call-site). */
  text: string;
};

export type AgentSummaryCardProps = {
  /** Título do card (ex.: "Agente AppBiT"). */
  title: string;
  /** Valor em destaque (ex.: "1.247.893"). */
  value: string;
  /** Descrição do valor (ex.: "Residentes monitorados"). */
  label: string;
  /** Itens do checklist (justificativas, alertas, relatórios...). */
  items: AgentSummaryItem[];
  /** Texto da pílula de status (ex.: "Online"); some se ausente. */
  statusLabel?: string;
  /** Mostra o ponto verde de "online" na pílula (default: true). */
  online?: boolean;
  /** Fontes citadas no rodapé (ex.: "Vísent CDRView + IBGE + Anatel"). */
  sources?: string;
  className?: string;
};

/**
 * Card-resumo do agente para o dashboard de Dados: gradiente azul com
 * status (Online), um KPI grande e um checklist de pendências/entregas.
 * Presentacional — todos os dados e textos vêm por props.
 */
export function AgentSummaryCard({
  title,
  value,
  label,
  items,
  statusLabel,
  online = true,
  sources,
  className,
}: AgentSummaryCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {statusLabel && (
          <span className={styles.badge}>
            {online && <span className={styles.badgeDot} />}
            {statusLabel}
          </span>
        )}
      </div>

      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>

      <hr className={styles.divider} />

      <div className={styles.footer}>
        <ul className={styles.list}>
          {items.map((item, i) => {
            const Icon = itemIcon[item.status];
            return (
              <li key={`${item.text}-${i}`} className={styles.item}>
                <Icon size={16} className={cx(styles.itemIcon, itemIconColor[item.status])} />
                {item.text}
              </li>
            );
          })}
        </ul>
        {sources && <p className={styles.sources}>{sources}</p>}
      </div>
    </div>
  );
}
