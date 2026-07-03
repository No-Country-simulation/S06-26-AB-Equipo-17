import { AlertBadge, type AlertStatus } from "@/components/AlertBadge";
import { Button } from "@/components/Button";
import { cx, styles } from "./AlertDetailCard.styles";
import { statTone } from "./AlertDetailCard.states";

export type AlertContextItem = {
  /** Rótulo do dado (ex.: "Região"). */
  label: string;
  /** Valor (ex.: "Leste — Florianópolis"). */
  value: string;
};

export type AlertDetailCardProps = {
  /** Severidade — define a cor do badge e do bloco de destaque. */
  severity: AlertStatus;
  /** Rótulo do badge (ex.: "Crítico"). */
  badgeLabel: string;
  /** Rótulo temporal (ex.: "Agora"). */
  time: string;
  /** Título do alerta (ex.: "Cobertura 4G — Região Leste"). */
  title: string;
  /** Origem/detecção (ex.: "Detectado via CDRView + Anatel"). */
  source: string;
  /** Bloco de destaque: valor, rótulo e mínimo de referência. */
  stat: { value: string; label: string; min: string };
  /** Título da seção de contexto (ex.: "Contexto"). */
  contextTitle: string;
  context: AlertContextItem[];
  /** Recomendação: título + texto. */
  recommendationTitle: string;
  recommendationText: string;
  /** Título da seção de ações (ex.: "Ações"). */
  actionsTitle: string;
  /** Rótulo do botão principal (ex.: "Ver no mapa"). */
  mapLabel: string;
  /** Rótulo do botão secundário (ex.: "Ver justificativa"). */
  justificationLabel: string;
  onMap?: () => void;
  onJustification?: () => void;
  className?: string;
};

/**
 * Detalhe do alerta selecionado — cabeçalho (badge + hora), título, bloco
 * de destaque colorido pela severidade, contexto em pares rótulo/valor,
 * recomendação e ações. Presentacional (dados e textos por props).
 */
export function AlertDetailCard({
  severity,
  badgeLabel,
  time,
  title,
  source,
  stat,
  contextTitle,
  context,
  recommendationTitle,
  recommendationText,
  actionsTitle,
  mapLabel,
  justificationLabel,
  onMap,
  onJustification,
  className,
}: AlertDetailCardProps) {
  const tone = statTone[severity];

  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.header}>
        <AlertBadge status={severity}>{badgeLabel}</AlertBadge>
        <span className={styles.time}>{time}</span>
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.source}>{source}</p>

      <hr className={styles.divider} />

      {/* Bloco de destaque — cor conforme a severidade */}
      <div>
        <div className={cx(styles.stat, tone.box)}>
          <span className={cx(styles.statValue, tone.value)}>{stat.value}</span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
        <p className={styles.statMin}>{stat.min}</p>
      </div>

      <hr className={styles.divider} />

      {/* Contexto */}
      <p className={styles.contextTitle}>{contextTitle}</p>
      <dl className={styles.contextList}>
        {context.map((item) => (
          <div key={item.label} className={styles.contextItem}>
            <dt className={styles.contextLabel}>{item.label}</dt>
            <dd className={styles.contextValue}>{item.value}</dd>
          </div>
        ))}
      </dl>

      {/* Recomendação */}
      <div className={styles.recommendation}>
        <p className={styles.recommendationTitle}>{recommendationTitle}</p>
        <p className={styles.recommendationText}>{recommendationText}</p>
      </div>

      {/* Ações */}
      <p className={styles.actionsTitle}>{actionsTitle}</p>
      <div className={styles.actions}>
        <Button variant="primary" fullWidth onClick={onMap}>
          {mapLabel}
        </Button>
        <Button variant="secondary" fullWidth onClick={onJustification}>
          {justificationLabel}
        </Button>
      </div>
    </div>
  );
}
