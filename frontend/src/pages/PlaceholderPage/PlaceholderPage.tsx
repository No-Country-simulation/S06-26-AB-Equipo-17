import { useTranslation } from "react-i18next";
import type nav from "@/i18n/locales/pt-BR/nav.json";

/** Stub de página — usado nas rotas internas até a tela real existir.
 *  `titleKey` = chave no namespace `nav` (mesmo rótulo da sidebar/topbar). */
export function PlaceholderPage({ titleKey }: { titleKey: keyof typeof nav }) {
  const { t } = useTranslation(["nav", "common"]);
  return (
    <section className="space-y-2 p-4 md:p-6">
      <h1 className="text-title-2 text-ink">{t(titleKey)}</h1>
      <p className="text-body text-ink-muted">{t("common:underConstruction")}</p>
    </section>
  );
}
