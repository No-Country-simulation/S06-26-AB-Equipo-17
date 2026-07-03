import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/Button";
import { Switch } from "@/components/ui/switch";
import { cx, styles } from "./AlertConfigCard.styles";

export type ConfigSelect = {
  /** Rótulo do campo (ex.: "Região monitorada"). */
  label: string;
  /** Opções (a 1ª é a default). */
  options: string[];
};

export type ConfigChannel = {
  /** Id do canal (ex.: "panel"). */
  id: string;
  /** Rótulo (ex.: "Painel AppBiT"). */
  label: string;
  /** Ligado por padrão. */
  enabled?: boolean;
};

export type ConfigFrequency = {
  /** Id da opção (ex.: "realtime"). */
  id: string;
  /** Rótulo (ex.: "Tempo real"). */
  label: string;
};

export type AlertConfigCardProps = {
  /** Título do card (ex.: "Configurar Alertas"). */
  title: string;
  region: ConfigSelect;
  indicator: ConfigSelect;
  /** Limite crítico: rótulo, valor inicial e sufixo (ex.: "abaixo de"). */
  threshold: { label: string; value: string; suffix: string };
  /** Rótulo da seção de canais (ex.: "Notificar via"). */
  notifyLabel: string;
  channels: ConfigChannel[];
  /** Rótulo da seção de frequência (ex.: "Frequência"). */
  frequencyLabel: string;
  frequencyOptions: ConfigFrequency[];
  /** Id da frequência selecionada por padrão (default: a 1ª). */
  defaultFrequency?: string;
  /** Rótulo do botão (ex.: "Salvar configuração"). */
  saveLabel: string;
  onSave?: (config: AlertConfigState) => void;
  className?: string;
};

/** Estado atual do formulário, entregue no onSave. */
export type AlertConfigState = {
  threshold: string;
  channels: Record<string, boolean>;
  frequency: string;
};

/**
 * Card "Configurar Alertas" — selects de região/indicador, limite crítico,
 * canais de notificação (switches) e frequência (radios). Mantém o estado
 * dos controles internamente e o devolve no onSave. Mockado por ora.
 */
export function AlertConfigCard({
  title,
  region,
  indicator,
  threshold,
  notifyLabel,
  channels,
  frequencyLabel,
  frequencyOptions,
  defaultFrequency,
  saveLabel,
  onSave,
  className,
}: AlertConfigCardProps) {
  const baseId = useId();
  const [thresholdValue, setThresholdValue] = useState(threshold.value);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(channels.map((c) => [c.id, c.enabled ?? false])),
  );
  const [frequency, setFrequency] = useState(defaultFrequency ?? frequencyOptions[0]?.id);

  const selects: Array<{ key: string; field: ConfigSelect }> = [
    { key: "region", field: region },
    { key: "indicator", field: indicator },
  ];

  return (
    <div className={cx(styles.card, className)}>
      <h3 className={styles.title}>{title}</h3>
      <hr className={styles.divider} />

      {/* Selects + limite crítico */}
      <div className={styles.fields}>
        {selects.map(({ key, field }) => {
          const id = `${baseId}-${key}`;
          return (
            <div key={key}>
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

        <div>
          <label htmlFor={`${baseId}-threshold`} className={styles.fieldLabel}>
            {threshold.label}
          </label>
          <div className={styles.thresholdWrap}>
            <input
              id={`${baseId}-threshold`}
              type="text"
              inputMode="numeric"
              value={thresholdValue}
              onChange={(e) => setThresholdValue(e.target.value)}
              className={styles.thresholdInput}
            />
            <span className={styles.thresholdSuffix}>{threshold.suffix}</span>
          </div>
        </div>
      </div>

      {/* Canais (switches) */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>{notifyLabel}</span>
        <div className={styles.channels}>
          {channels.map((channel) => {
            const id = `${baseId}-ch-${channel.id}`;
            return (
              <div key={channel.id} className={styles.channelRow}>
                <label htmlFor={id} className={styles.channelLabel}>
                  {channel.label}
                </label>
                <Switch
                  id={id}
                  checked={enabled[channel.id]}
                  onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [channel.id]: v }))}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequência (radios) */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>{frequencyLabel}</span>
        <div className={styles.radios} role="radiogroup" aria-label={frequencyLabel}>
          {frequencyOptions.map((opt) => {
            const id = `${baseId}-freq-${opt.id}`;
            return (
              <div key={opt.id} className={styles.radioRow}>
                <input
                  id={id}
                  type="radio"
                  name={`${baseId}-frequency`}
                  value={opt.id}
                  checked={frequency === opt.id}
                  onChange={() => setFrequency(opt.id)}
                  className={styles.radioInput}
                />
                <label htmlFor={id} className={styles.radioLabel}>
                  {opt.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        className={styles.save}
        onClick={() => onSave?.({ threshold: thresholdValue, channels: enabled, frequency })}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
