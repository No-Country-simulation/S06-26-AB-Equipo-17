import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { EvidenceStatus, QueryResult } from "@/types";

const STATUS_COLOR: Record<EvidenceStatus, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  success: "bg-success",
};

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
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">{t("result.title")}</DialogTitle>
        <DialogDescription className="text-body text-ink-muted">{question}</DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-success-soft px-3 py-1 text-label font-medium text-success">
        <Zap size={14} />
        {t("result.meta", { time: result.responseTime, count: result.sourceCount })}
      </span>

      {/* Afirmação principal */}
      <p className="border-l-4 border-primary pl-4 text-body-lg text-ink">{result.claim}</p>

      {/* Evidência (tabela) */}
      <div className="space-y-2">
        <p className="text-caption uppercase tracking-wide text-ink-muted">{t("result.evidence")}</p>
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left">
            <thead className="bg-surface-sec">
              <tr className="text-caption uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2 font-medium">{t("result.colRegion")}</th>
                <th className="px-4 py-2 font-medium">{t("result.colCoverage")}</th>
                <th className="px-4 py-2 font-medium">{t("result.colTech")}</th>
                <th className="px-4 py-2 font-medium">{t("result.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {result.evidence.map((row) => (
                <tr key={row.region} className="border-t border-line text-body">
                  <td className="px-4 py-3 font-semibold text-ink">{row.region}</td>
                  <td className="px-4 py-3 text-ink">{row.coverage4g}</td>
                  <td className="px-4 py-3 text-ink">{row.techTraining}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_COLOR[row.status]}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fontes */}
      <div className="space-y-1">
        <p className="text-caption uppercase tracking-wide text-ink-muted">{t("result.sources")}</p>
        {result.sources.map((source) => (
          <p key={source} className="text-caption text-ink-muted">
            {source}
          </p>
        ))}
      </div>

      <div className="flex gap-3">
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
