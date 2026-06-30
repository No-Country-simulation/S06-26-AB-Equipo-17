import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUp, Sparkles } from "lucide-react";
import { cx, styles } from "./AIPrompt.styles";

export type AIPromptProps = {
  /** Texto do campo (controlado). */
  value: string;
  onChange: (value: string) => void;
  /** Disparado ao enviar (Enter ou botão). */
  onSubmit?: (value: string) => void;
  placeholder?: string;
};

/**
 * Prompt "hero" da IA — pílula elevada com sparkle, input e botão de enviar.
 * Usado como ponto de entrada da consulta (ex.: sobre o mapa).
 * Placeholder/a11y vêm do i18n (ns `common`); `placeholder` pode sobrescrever.
 */
export function AIPrompt({ value, onChange, onSubmit, placeholder }: AIPromptProps) {
  const { t } = useTranslation("common");
  const id = useId();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={styles.root}
    >
      <span className={styles.badge} aria-hidden="true">
        <Sparkles size={24} strokeWidth={2} />
      </span>

      <label htmlFor={id} className="sr-only">
        {t("askAI")}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder ?? t("promptPlaceholder")}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />

      <button type="submit" aria-label={t("send")} className={cx(styles.submit)}>
        <ArrowUp size={20} strokeWidth={2.2} />
      </button>
    </form>
  );
}
