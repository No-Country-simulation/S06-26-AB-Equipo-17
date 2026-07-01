import { cx, styles } from "./Legend.styles";
import { dotColor, type LegendTone } from "./Legend.states";

export type LegendItem = {
  /** Rótulo do item (já traduzido pelo call-site). */
  label: string;
  /** Tom do ponto (define a cor). */
  tone: LegendTone;
};

export type LegendProps = {
  /** Título (ex.: "Camadas ativas"); some se ausente. */
  title?: string;
  items: LegendItem[];
  className?: string;
};

/**
 * Legenda compacta — título + lista de itens (ponto colorido + rótulo).
 * Presentacional; usada flutuando sobre o mapa. Dados por props.
 */
export function Legend({ title, items, className }: LegendProps) {
  return (
    <div className={cx(styles.card, className)}>
      {title && <p className={styles.title}>{title}</p>}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.label} className={styles.item}>
            <span className={cx(styles.dot, dotColor[item.tone])} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
