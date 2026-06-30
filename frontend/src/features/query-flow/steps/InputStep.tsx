import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Fontes que a consulta vai cruzar (nomes próprios — não traduzidos). */
const SOURCES = ["Vísent CDRView", "IBGE 2023", "Anatel ERB"];

export type InputStepProps = {
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
};

/** Passo 1 — entrada da pergunta em linguagem natural. */
export function InputStep({ question, onQuestionChange, onSubmit }: InputStepProps) {
  const { t } = useTranslation("query");
  const canSubmit = question.trim().length > 0;
  // Perguntas-exemplo (mock por enquanto) — vêm do i18n.
  const suggestions = t("input.suggestions", { returnObjects: true });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">{t("input.title")}</DialogTitle>
        <DialogDescription className="text-body text-ink-muted">
          {t("input.description")}
        </DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <p className="flex items-center gap-2 text-body text-ink">
        <Sparkles size={16} className="text-primary" />
        {t("input.poweredBy")}
      </p>

      <textarea
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder={t("input.placeholder")}
        rows={4}
        className="w-full resize-none rounded-card border border-primary/30 bg-surface-sec p-4 text-body text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
      />

      <div className="space-y-2">
        <p className="text-caption uppercase tracking-wide text-ink-muted">
          {t("input.suggestionsLabel")}
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onQuestionChange(suggestion)}
              className="rounded-pill border border-ink/10 bg-line px-3 py-1.5 text-label text-ink/80 transition hover:brightness-95"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-line" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body text-ink-muted">{t("input.sourcesLabel")}</span>
        {SOURCES.map((source) => (
          <span
            key={source}
            className="rounded-pill bg-primary-soft px-2.5 py-1 text-label font-medium text-primary"
          >
            {source}
          </span>
        ))}
      </div>

      <Button variant="primary" fullWidth disabled={!canSubmit} onClick={onSubmit}>
        {t("input.submit")}
      </Button>
    </>
  );
}
