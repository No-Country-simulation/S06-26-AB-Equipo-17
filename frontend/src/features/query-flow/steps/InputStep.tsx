import { Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Perguntas-exemplo (mock por enquanto). */
const SUGGESTIONS = [
  "Qual região tem menor cobertura 4G?",
  "Onde falta infraestrutura tech?",
  "Compare emprego e mobilidade no Leste",
];

/** Fontes que a consulta vai cruzar (mock por enquanto). */
const SOURCES = ["Vísent CDRView", "IBGE 2023", "Anatel ERB"];

export type InputStepProps = {
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
};

/** Passo 1 — entrada da pergunta em linguagem natural. */
export function InputStep({ question, onQuestionChange, onSubmit }: InputStepProps) {
  const canSubmit = question.trim().length > 0;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">
          Consulta em linguagem natural
        </DialogTitle>
        <DialogDescription className="text-body text-ink-muted">
          Pergunte como perguntaria a um assessor técnico
        </DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <p className="flex items-center gap-2 text-body text-ink">
        <Sparkles size={16} className="text-primary" />
        Powered by Vísent CDRView + IA
      </p>

      <textarea
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder="Ex: Onde faltam programas de formação tech na região metropolitana?"
        rows={4}
        className="w-full resize-none rounded-card border border-primary/30 bg-surface-sec p-4 text-body text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
      />

      <div className="space-y-2">
        <p className="text-caption uppercase tracking-wide text-ink-muted">Sugestões</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
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
        <span className="text-body text-ink-muted">Fontes a consultar:</span>
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
        Enviar consulta
      </Button>
    </>
  );
}
