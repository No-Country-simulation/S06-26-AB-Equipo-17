import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { QueryResult } from "@/types";

export type ResultStepProps = {
  /** Pergunta do usuário (subtítulo). */
  question: string;
  /** Resultado da consulta (vem do useQueryFlow → api). */
  result: QueryResult;
  /** Voltar ao passo de entrada pra ajustar a pergunta. */
  onRefine: () => void;
  /** Avançar pro passo de exportação. */
  onExport: () => void;
};

/** Passo 3 — resultado da análise (o "paper"): afirmação → evidências → fontes. */
export function ResultStep({ question, result, onRefine, onExport }: ResultStepProps) {
  const { t } = useTranslation("query");
  return (
    <>
      <DialogHeader className="pr-8">
        <DialogTitle className="text-title-2 text-ink">{t("result.title")}</DialogTitle>
        <DialogDescription className="text-body text-ink-muted">{question}</DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-success-soft px-3 py-1 text-label font-medium text-success">
        <Zap size={14} />
        {t("result.meta", { time: result.responseTime, count: result.sources.length })}
      </span>

      {/* Afirmação principal */}
      <p className="border-l-4 border-primary pl-4 text-body-lg text-ink">{result.claim}</p>

      {/* Evidência (tabela) — rola na horizontal no mobile (4 colunas não cabem
          a ~360px); `whitespace-nowrap` força o scroll em vez de espremer. */}
      <div className="space-y-2">
        <p className="text-caption uppercase tracking-wide text-ink-muted">{t("result.evidence")}</p>
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full text-left" aria-label={t("result.evidence")}>
            <thead className="bg-surface-sec">
              <tr className="text-caption uppercase tracking-wide text-ink-muted">
                <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
                  {t("result.colData")}
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
                  {t("result.colValue")}
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
                  {t("result.colRegion")}
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
                  {t("result.colPeriod")}
                </th>
              </tr>
            </thead>
            <tbody>
              {result.evidence.map((row, i) => (
                <tr key={`${row.label}-${i}`} className="border-t border-line text-body">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-semibold text-ink">
                    {row.label}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-ink tabular-nums">{row.value}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink">{row.region}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fontes — lista semântica (leitor de tela anuncia "lista, N itens"). */}
      <div className="space-y-1">
        <p className="text-caption uppercase tracking-wide text-ink-muted">{t("result.sources")}</p>
        <ul className="space-y-1">
          {result.sources.map((source) => (
            <li key={source.name} className="text-caption text-ink-muted">
              {source.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Ações — empilham no mobile (rótulos maiores em es/en não estouram). */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" onClick={onExport}>
          {t("result.exportPdf")}
        </Button>
        <Button variant="secondary" onClick={onRefine}>
          {t("result.refine")}
        </Button>
      </div>
    </>
  );
}
