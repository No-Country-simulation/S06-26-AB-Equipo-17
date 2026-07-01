import { cx, styles } from "./OpportunityListCard.styles";
import { pillStyles, type OpportunityStatus } from "./OpportunityListCard.states";

export type Opportunity = {
  /** Código do edital (ex.: "MCTI #42/2026"). */
  code: string;
  /** Título (ex.: "Conectividade Digital Rural"). */
  title: string;
  /** Descrição curta (ex.: "Leste qualifica automaticamente"). */
  subtitle?: string;
  /** Prazo (ex.: "18 dias"). */
  deadline?: string;
  /** Valor (ex.: "R$ 2,4M"). */
  value: string;
  /** Pílula de status. */
  status: { label: string; tone: OpportunityStatus };
};

export type OpportunityListCardProps = {
  /** Título do card (ex.: "Editais Federais"). */
  title: string;
  /** Contagem à direita (ex.: "3 oportunidades"). */
  countLabel?: string;
  items: Opportunity[];
  className?: string;
};

/**
 * Card de lista de editais/oportunidades do dashboard: cada item traz
 * código, título, status (pílula) e valor. Presentacional — dados por props.
 */
export function OpportunityListCard({
  title,
  countLabel,
  items,
  className,
}: OpportunityListCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {countLabel && <span className={styles.count}>{countLabel}</span>}
      </div>

      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={`${item.code}-${i}`} className={cx(styles.item, i > 0 && styles.itemDivider)}>
            <div className={styles.itemTop}>
              <div className="min-w-0">
                <p className={styles.code}>{item.code}</p>
                <p className={styles.itemTitle}>{item.title}</p>
                {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
              </div>
              {item.deadline && <span className={styles.deadline}>{item.deadline}</span>}
            </div>

            <div className={styles.itemBottom}>
              <span className={cx(styles.pill, pillStyles[item.status.tone])}>
                {item.status.label}
              </span>
              <span className={styles.value}>{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
