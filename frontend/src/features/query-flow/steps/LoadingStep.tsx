import { useEffect, useState } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Etapas do processamento (com pontos verdes ao concluir). */
const PHASES = [
  "Interpretando consulta",
  "Buscando dados por região",
  "Gerando resposta com fontes",
];

export type LoadingStepProps = {
  /** Pergunta do usuário (vinda do passo anterior). */
  question: string;
};

/**
 * Passo 2 — processando a consulta. Spinner + barra de progresso + checklist.
 * A animação das etapas é decorativa; quem encerra o loading é o `useQueryFlow`
 * (avança pro resultado quando a request resolve).
 */
export function LoadingStep({ question }: LoadingStepProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((i) => Math.min(i + 1, PHASES.length));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const progress = (phaseIndex / PHASES.length) * 100;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">Analisando dados...</DialogTitle>
        <DialogDescription className="sr-only">Processando sua consulta</DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <div className="rounded-card bg-surface-sec p-4">
        <p className="text-caption uppercase tracking-wide text-ink-muted">Sua pergunta</p>
        <p className="text-body text-ink">{question}</p>
      </div>

      <div className="flex flex-col items-center gap-3 py-2">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
          role="status"
          aria-label="Carregando"
        />
        <div className="space-y-1 text-center">
          <p className="text-title-3 text-ink">Analisando dados...</p>
          <p className="text-body text-ink-muted">
            Cruzando Vísent CDRView, IBGE 2023 e Anatel ERB
          </p>
        </div>
      </div>

      {/* Barra de progresso (anima a largura a cada etapa concluída). */}
      <div className="h-1.5 w-full overflow-hidden rounded-pill bg-line">
        <div
          className="h-full rounded-pill bg-primary transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-2">
        {PHASES.map((label, index) => {
          const done = index < phaseIndex;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${done ? "bg-success" : "bg-disabled-foreground"}`}
              />
              <span className={`text-body ${done ? "text-ink" : "text-ink-muted"}`}>{label}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
