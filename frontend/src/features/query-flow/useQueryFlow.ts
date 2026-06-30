/* ============================================================
   useQueryFlow — orquestra o fluxo de consulta (passos + request).
   Concentra o estado do fluxo num lugar; os steps são "burros" e
   recebem tudo por props. A request real vive na api/ (useAIQuery).
   ============================================================ */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAIQuery } from "@/api/hooks";
import { toApiLanguage } from "@/i18n";
import type { Step } from "./types";

/** @param initialQuestion texto vindo do AIPrompt do mapa (lido na montagem). */
export function useQueryFlow(initialQuestion = "") {
  const { i18n } = useTranslation();
  const [step, setStep] = useState<Step>("input");
  const [question, setQuestion] = useState(initialQuestion);
  const { data: result, error, submit } = useAIQuery();

  /** Envia a consulta: vai pra loading, dispara a request e avança no fim. */
  async function runQuery() {
    setStep("loading");
    try {
      const language = toApiLanguage(i18n.resolvedLanguage ?? i18n.language);
      await submit({ question, language });
      setStep("result");
    } catch {
      // O erro fica em `error`; por ora volta pro input. (UI de erro: TODO)
      setStep("input");
    }
  }

  return {
    step,
    question,
    result,
    error,
    setQuestion,
    /** Dispara a consulta (input → loading → result). */
    submit: runQuery,
    /** Volta pro input pra ajustar a pergunta. */
    refine: () => setStep("input"),
    /** Avança pro passo de exportação. */
    toExport: () => setStep("export"),
  };
}
