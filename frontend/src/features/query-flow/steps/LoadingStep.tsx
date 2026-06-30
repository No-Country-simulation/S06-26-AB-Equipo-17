import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { t } = useTranslation("query");
  const [phaseIndex, setPhaseIndex] = useState(0);
  // Etapas do processamento (com pontos verdes ao concluir) — vêm do i18n.
  const phases = t("loading.phases", { returnObjects: true });
  const phaseCount = phases.length;

  // A request real demora ~20-30s. Avançamos as etapas devagar e PARAMOS na
  // última (deixa "em andamento", não 100%) — quem encerra o loading é o
  // useQueryFlow quando a resposta chega. Assim não parece "pronto" esperando.
  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((i) => Math.min(i + 1, phaseCount - 1));
    }, 4000);
    return () => clearInterval(id);
  }, [phaseCount]);

  const progress = (phaseIndex / phaseCount) * 100;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">
          {t("loading.title")}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("loading.srDescription")}
        </DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <div className="rounded-card bg-surface-sec p-4">
        <p className="text-caption uppercase tracking-wide text-ink-muted">
          {t("loading.yourQuestion")}
        </p>
        <p className="text-body text-ink">{question}</p>
      </div>

      <div className="flex flex-col items-center gap-3 py-2">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
          role="status"
          aria-label={t("loading.spinnerLabel")}
        />
        <div className="space-y-1 text-center">
          <p className="text-title-3 text-ink">{t("loading.title")}</p>
          <p className="text-body text-ink-muted">{t("loading.crossing")}</p>
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
        {phases.map((label, index) => {
          const done = index < phaseIndex;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${done ? "bg-success" : "bg-disabled-foreground"}`}
              />
              <span
                className={`text-body ${done ? "text-ink" : "text-ink-muted"}`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
