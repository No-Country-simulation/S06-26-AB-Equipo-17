import { useId, useState } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/Button";
import { cx, styles } from "./ReportGeneratorCard.styles";

export type SelectField = {
  /** Rótulo do campo (ex.: "Região"). */
  label: string;
  /** Opções do select (a 1ª é a default). */
  options: string[];
};

export type ReportGeneratorCardProps = {
  /** Título do card (ex.: "Gerar Relatório"). */
  title: string;
  /** Campos de seleção (Região, Período, Indicadores). */
  fields: SelectField[];
  /** Rótulo da seção de formato (ex.: "Formato"). */
  formatLabel: string;
  /** Formatos disponíveis (ex.: ["PDF", "XLSX", "CSV"]). */
  formats: string[];
  /** Título da prévia (ex.: "Prévia"). */
  previewTitle: string;
  /** Texto da prévia (ex.: "5 regiões · 30 indicadores · ~4 pág."). */
  previewText: string;
  /** Rótulo do botão principal (ex.: "Gerar Relatório"). */
  generateLabel: string;
  /** Rótulo da seção de recentes (ex.: "Recentes"). */
  recentLabel?: string;
  /** Itens recentes (texto já formatado). */
  recents?: string[];
  onGenerate?: (format: string) => void;
  onRecent?: (item: string, index: number) => void;
  className?: string;
};

/**
 * Card "Gerar Relatório": selects (Região/Período/Indicadores), formato
 * segmentado, prévia, botão e recentes. O formato tem estado interno; o
 * resto é presentacional (dados por props). Mockado por ora.
 */
export function ReportGeneratorCard({
  title,
  fields,
  formatLabel,
  formats,
  previewTitle,
  previewText,
  generateLabel,
  recentLabel,
  recents,
  onGenerate,
  onRecent,
  className,
}: ReportGeneratorCardProps) {
  const [format, setFormat] = useState(formats[0]);
  const baseId = useId();

  return (
    <div className={cx(styles.card, className)}>
      <h3 className={styles.title}>{title}</h3>
      <hr className={styles.divider} />

      {/* Campos de seleção */}
      <div className={styles.fields}>
        {fields.map((field, i) => {
          const id = `${baseId}-field-${i}`;
          return (
            <div key={field.label}>
              <label htmlFor={id} className={styles.fieldLabel}>
                {field.label}
              </label>
              <div className={styles.selectWrap}>
                <select id={id} className={styles.select} defaultValue={field.options[0]}>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectChevron} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Formato (segmentado) */}
      <div className={styles.formatSection}>
        <span className={styles.formatLabel}>{formatLabel}</span>
        <div className={styles.formatRow}>
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === format}
              onClick={() => setFormat(f)}
              className={cx(styles.formatBtn, f === format ? styles.formatBtnActive : styles.formatBtnIdle)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Prévia */}
      <div className={styles.preview}>
        <p className={styles.previewTitle}>{previewTitle}</p>
        <p className={styles.previewText}>{previewText}</p>
      </div>

      {/* Botão principal */}
      <Button variant="primary" fullWidth className={styles.generate} onClick={() => onGenerate?.(format)}>
        {generateLabel}
      </Button>

      {/* Recentes */}
      {recents && recents.length > 0 && (
        <>
          <hr className={styles.divider} />
          {recentLabel && <span className={styles.recentLabel}>{recentLabel}</span>}
          <ul className={styles.recentList}>
            {recents.map((item, i) => (
              <li key={`${item}-${i}`} className={styles.recentItem}>
                <span className={styles.recentText}>{item}</span>
                <button
                  type="button"
                  aria-label={item}
                  onClick={() => onRecent?.(item, i)}
                  className={styles.recentAction}
                >
                  <ArrowDown size={16} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
