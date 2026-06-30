import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { Download, Link2, Scale } from "lucide-react";
import { Button } from "@/components/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { QueryResult } from "@/types";

type ExportOption = "pdf" | "link";

export type ExportStepProps = {
  /** Pergunta do usuário — vai no cabeçalho do relatório impresso. */
  question: string;
  /** Resultado da consulta — conteúdo do PDF. */
  result: QueryResult;
};

/** Passo 4 — exportar o relatório (PDF via react-to-print) ou copiar link. */
export function ExportStep({ question, result }: ExportStepProps) {
  const { t } = useTranslation("query");
  const [selected, setSelected] = useState<ExportOption>("pdf");
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: t("export.printDocTitle"),
  });

  function handleExport() {
    if (selected === "link") {
      void navigator.clipboard?.writeText(window.location.href);
      return;
    }
    handlePrint();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-2 text-ink">{t("export.title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("export.srDescription")}</DialogDescription>
      </DialogHeader>

      <hr className="border-line" />

      {/* Resumo do relatório */}
      <div className="flex items-center gap-3 rounded-card bg-surface-sec p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-critical text-caption font-bold text-ink-inverse">
          PDF
        </span>
        <div className="space-y-0.5">
          <p className="text-body-lg font-semibold text-ink">{t("export.reportTitle")}</p>
          <p className="text-caption text-ink-muted">{t("export.reportMeta")}</p>
          <p className="text-caption text-ink-muted">{t("export.reportFormat")}</p>
        </div>
      </div>

      {/* Opções de exportação */}
      <ExportOptionCard
        icon={<Download size={18} />}
        title={t("export.downloadPdf")}
        description={t("export.downloadPdfDesc")}
        active={selected === "pdf"}
        onClick={() => setSelected("pdf")}
      />
      <ExportOptionCard
        icon={<Link2 size={18} />}
        title={t("export.copyLink")}
        description={t("export.copyLinkDesc")}
        active={selected === "link"}
        onClick={() => setSelected("link")}
      />

      {/* Aviso LGPD */}
      <div className="flex items-center gap-2 rounded-card bg-warning/15 px-3 py-2 text-label text-ink/70">
        <Scale size={14} className="shrink-0 text-warning" />
        {t("export.lgpd")}
      </div>

      <Button variant="primary" fullWidth onClick={handleExport}>
        {t("export.download")}
      </Button>

      {/* Documento imprimível (fora da tela) — react-to-print clona isto. */}
      <div className="pointer-events-none fixed -left-[10000px] top-0" aria-hidden>
        <div ref={contentRef} className="w-[640px] bg-white p-10 text-black">
          <h1 className="text-2xl font-bold">{t("export.reportTitle")}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t("export.printMeta")}</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {t("export.printQuestion")}
          </p>
          <p className="mt-1">{question}</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {t("export.printAnswer")}
          </p>
          <p className="mt-1 leading-relaxed">{result.claim}</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {t("export.printSources")}
          </p>
          {result.sources.map((source) => (
            <p key={source.name} className="mt-1 text-sm text-neutral-600">
              {source.name}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

type ExportOptionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
};

/** Item selecionável de exportação (PDF / link). */
function ExportOptionCard({ icon, title, description, active, onClick }: ExportOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-card border p-3 text-left transition-colors ${
        active ? "border-primary bg-primary-soft/40" : "border-line bg-surface hover:bg-surface-sec"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-btn-sm ${
          active ? "bg-primary-soft text-primary" : "bg-surface-sec text-ink-muted"
        }`}
      >
        {icon}
      </span>
      <span className="space-y-0.5">
        <span className="block text-body font-medium text-ink">{title}</span>
        <span className="block text-caption text-ink-muted">{description}</span>
      </span>
    </button>
  );
}
