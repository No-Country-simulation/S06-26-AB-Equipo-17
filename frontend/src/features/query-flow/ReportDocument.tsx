/* ============================================================
   ReportDocument — o "paper" em PDF (via @react-pdf/renderer).
   Presentacional e SEM hooks: recebe rótulos (já traduzidos) e o
   result por props → pode ser gerado com `pdf(<Doc/>).toBlob()`.
   Fonte padrão Helvetica (built-in do react-pdf; sem registrar Inter).
   ============================================================ */

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { QueryResult } from "@/types";

/** Rótulos do relatório — resolvidos via i18n no ExportStep e passados aqui. */
export type ReportLabels = {
  title: string;
  meta: string;
  question: string;
  answer: string;
  evidence: string;
  colData: string;
  colValue: string;
  colRegion: string;
  colPeriod: string;
  sources: string;
};

export type ReportDocumentProps = {
  labels: ReportLabels;
  question: string;
  result: QueryResult;
};

const INK = "#16171b";
const MUTED = "#6e7178";
const LINE = "#e6e7ec";
const LINE_SOFT = "#f0f1f4";
const PRIMARY = "#2f6bff";

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  meta: { marginTop: 4, fontSize: 9, color: MUTED },
  sectionLabel: {
    marginTop: 18,
    fontSize: 8,
    color: MUTED,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  question: { marginTop: 4, fontSize: 11 },
  claim: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 1.5,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  table: { marginTop: 8, borderTopWidth: 1, borderTopColor: LINE },
  headRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 5 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE_SOFT, paddingVertical: 5 },
  th: { fontSize: 8, color: MUTED, textTransform: "uppercase", fontFamily: "Helvetica-Bold" },
  cData: { width: "34%", paddingRight: 6 },
  cValue: { width: "26%", paddingRight: 6 },
  cRegion: { width: "22%", paddingRight: 6 },
  cPeriod: { width: "18%" },
  tdStrong: { fontFamily: "Helvetica-Bold" },
  tdMuted: { color: MUTED },
  source: { marginTop: 3, fontSize: 9, color: MUTED },
});

/** Documento PDF do relatório: pergunta → resposta → tabela de evidências → fontes. */
export function ReportDocument({ labels, question, result }: ReportDocumentProps) {
  return (
    <Document title={labels.title}>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>{labels.title}</Text>
        <Text style={s.meta}>{labels.meta}</Text>

        <Text style={s.sectionLabel}>{labels.question}</Text>
        <Text style={s.question}>{question}</Text>

        <Text style={s.sectionLabel}>{labels.answer}</Text>
        <Text style={s.claim}>{result.claim}</Text>

        <Text style={s.sectionLabel}>{labels.evidence}</Text>
        <View style={s.table}>
          <View style={s.headRow}>
            <Text style={[s.th, s.cData]}>{labels.colData}</Text>
            <Text style={[s.th, s.cValue]}>{labels.colValue}</Text>
            <Text style={[s.th, s.cRegion]}>{labels.colRegion}</Text>
            <Text style={[s.th, s.cPeriod]}>{labels.colPeriod}</Text>
          </View>
          {result.evidence.map((r, i) => (
            <View key={`${r.label}-${i}`} style={s.row}>
              <Text style={[s.cData, s.tdStrong]}>{r.label}</Text>
              <Text style={s.cValue}>{r.value}</Text>
              <Text style={s.cRegion}>{r.region}</Text>
              <Text style={[s.cPeriod, s.tdMuted]}>{r.period}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionLabel}>{labels.sources}</Text>
        {result.sources.map((src) => (
          <Text key={src.name} style={s.source}>
            {src.name}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
