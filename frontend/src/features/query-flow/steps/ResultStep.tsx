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
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">Resultado da análise</DialogTitle>
        <DialogDescription className="text-body text-ink-muted">{question}</DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-success-soft px-3 py-1 text-label font-medium text-success">
        <Zap size={14} />
        Resposta em {result.responseTime} · {result.sourceCount} fontes consultadas
      </span>

      {/* Afirmação principal */}
      <p className="border-l-4 border-primary pl-4 text-body-lg text-ink">{result.claim}</p>

      {/* Evidência (tabela) */}
      <div className="space-y-2">
        <p className="text-caption uppercase tracking-wide text-ink-muted">Evidência</p>
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left">
            <thead className="bg-surface-sec">
              <tr className="text-caption uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2 font-medium">Região</th>
                <th className="px-4 py-2 font-medium">Cobertura 4G</th>
                <th className="px-4 py-2 font-medium">Formação tech</th>
                <th className="px-4 py-2 font-medium">Status</th>
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
        <p className="text-caption uppercase tracking-wide text-ink-muted">Fontes</p>
        {result.sources.map((source) => (
          <p key={source} className="text-caption text-ink-muted">
            {source}
          </p>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="primary" onClick={onExport}>
          Exportar como PDF
        </Button>
        <Button variant="secondary" onClick={onRefine}>
          Refinar consulta
        </Button>
      </div>
    </>
  );
}
