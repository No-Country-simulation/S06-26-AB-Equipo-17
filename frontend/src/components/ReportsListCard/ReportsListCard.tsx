import { Plus } from "lucide-react";
import { cx, styles } from "./ReportsListCard.styles";

export type ReportStatus = "ready" | "generating";

export type ReportItem = {
  /** Título do relatório (ex.: "Indicadores Jun 2026"). */
  title: string;
  /** Descrição (ex.: "Mensal · todas as regiões"). */
  subtitle: string;
  /** Data/rótulo temporal (ex.: "Hoje", "30 Jun", "—"). */
  date: string;
  /** Estado: pronto (link Baixar) ou gerando (texto). Default "ready". */
  status?: ReportStatus;
  /** Destaca o item (traço azul à esquerda — ex.: o mais recente). */
  highlighted?: boolean;
};

export type ReportsListCardProps = {
  /** Título do card (ex.: "Meus Relatórios"). */
  title: string;
  /** Rótulo do botão de novo relatório (ex.: "Novo relatório"). */
  newLabel: string;
  /** Rótulo acima da lista (ex.: "Gerados recentemente"). */
  recentLabel?: string;
  /** Rótulo da ação de download (ex.: "Baixar"). */
  downloadLabel: string;
  /** Rótulo do estado "gerando" (ex.: "Gerando..."). */
  generatingLabel: string;
  items: ReportItem[];
  onNew?: () => void;
  onDownload?: (item: ReportItem, index: number) => void;
  className?: string;
};

/**
 * Card "Meus Relatórios": header com ação de novo relatório e uma lista
 * com zebra, destaque do mais recente e ação Baixar / estado Gerando.
 * Presentacional — dados e textos por props.
 */
export function ReportsListCard({
  title,
  newLabel,
  recentLabel,
  downloadLabel,
  generatingLabel,
  items,
  onNew,
  onDownload,
  className,
}: ReportsListCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button type="button" className={styles.newButton} onClick={onNew}>
          <Plus size={16} />
          {newLabel}
        </button>
      </div>

      <hr className={styles.divider} />
      {recentLabel && <p className={styles.recentLabel}>{recentLabel}</p>}

      <ul className={styles.list}>
        {items.map((item, i) => {
          const generating = item.status === "generating";
          return (
            <li key={`${item.title}-${i}`} className={cx(styles.item, i % 2 === 1 && styles.itemAlt)}>
              {item.highlighted && <span className={styles.accent} />}
              <div className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.itemSubtitle}>{item.subtitle}</p>
                </div>
                {generating ? (
                  <span className={styles.generating}>{generatingLabel}</span>
                ) : (
                  <button
                    type="button"
                    className={styles.download}
                    onClick={() => onDownload?.(item, i)}
                  >
                    {downloadLabel}
                  </button>
                )}
              </div>
              <p className={styles.itemDate}>{item.date}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
