import { cx, styles } from "./JustificationsCard.styles";

export type Justification = {
  /** Código do edital (ex.: "MCTI #42/2026"). */
  code: string;
  /** Prazo já formatado (ex.: "Prazo: 18 dias"). */
  deadline: string;
  /** Título (ex.: "Conectividade Digital — Região Leste"). */
  title: string;
  /** Status como texto (ex.: "Justificativa gerada", "Em revisão"). */
  status: string;
};

export type JustificationsCardProps = {
  /** Título do card (ex.: "Justificativas de Editais"). */
  title: string;
  /** Contagem à direita (ex.: "3 editais abertos"). */
  countLabel?: string;
  /** Rótulo do botão de exportar (ex.: "Exportar"). */
  exportLabel: string;
  items: Justification[];
  onExport?: (item: Justification, index: number) => void;
  className?: string;
};

/**
 * Card "Justificativas de Editais": lista de editais com código, prazo,
 * título, status e ação de exportar. Presentacional — dados por props.
 */
export function JustificationsCard({
  title,
  countLabel,
  exportLabel,
  items,
  onExport,
  className,
}: JustificationsCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {countLabel && <span className={styles.count}>{countLabel}</span>}
      </div>

      <hr className={styles.divider} />

      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={`${item.code}-${i}`} className={cx(styles.item, i % 2 === 1 && styles.itemAlt)}>
            <p className={styles.code}>{item.code}</p>
            <p className={styles.deadline}>{item.deadline}</p>
            <p className={styles.itemTitle}>{item.title}</p>
            <div className={styles.bottomRow}>
              <span className={styles.status}>{item.status}</span>
              <button
                type="button"
                className={styles.exportButton}
                onClick={() => onExport?.(item, i)}
              >
                {exportLabel}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
