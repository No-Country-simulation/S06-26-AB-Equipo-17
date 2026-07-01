import { useTranslation } from "react-i18next";
import { JustificationsCard } from "@/components/JustificationsCard";
import { ReportGeneratorCard } from "@/components/ReportGeneratorCard";
import { ReportsListCard } from "@/components/ReportsListCard";
import { buildGenerator, buildJustifications, buildMyReports } from "./mocks";

/**
 * Página de Relatórios (rota /app/reports) — lista de relatórios +
 * justificativas de editais na coluna principal, gerador na lateral.
 * Tudo MOCKADO (ver ./mocks.ts), textos via i18n (namespace `reports`).
 */
export function ReportsPage() {
  const { t } = useTranslation("reports");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Coluna principal — lista + justificativas empilhadas */}
        <div className="flex flex-col gap-5">
          <ReportsListCard {...buildMyReports(t)} />
          <JustificationsCard {...buildJustifications(t)} />
        </div>

        {/* Lateral — gerador de relatório */}
        <ReportGeneratorCard {...buildGenerator(t)} />
      </div>
    </div>
  );
}
