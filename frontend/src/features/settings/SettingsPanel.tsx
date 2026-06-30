import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/i18n";

// Valores ESTÁVEIS (não mudam com o idioma); o rótulo vem da tradução.
const REGIONS = ["all", "east", "southwest", "center"] as const;
const INDICATORS = ["coverage4g", "techEducation", "employment", "mobility"] as const;
const CHANNELS = ["panel", "email", "pdf"] as const;
type ChannelKey = (typeof CHANNELS)[number];
const FREQUENCIES = ["realtime", "hourly", "daily"] as const;

// Nomes de idioma em endônimo (não se traduzem).
const LANGUAGE_LABELS: Record<(typeof LANGUAGES)[number], string> = {
  "pt-BR": "🇧🇷 Português",
  en: "🇺🇸 English",
  es: "🇪🇸 Español",
};

export type SettingsPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Painel lateral de configuração de alertas (Sheet). Estado local mockado. */
export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { t, i18n } = useTranslation(["settings", "common"]);
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [indicator, setIndicator] = useState<string>(INDICATORS[0]);
  const [threshold, setThreshold] = useState("30%");
  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>({
    panel: true,
    email: true,
    pdf: false,
  });
  const [frequency, setFrequency] = useState("realtime");

  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  function handleSave() {
    // TODO: persistir via api/ quando o endpoint existir.
    console.log("salvar config:", { region, indicator, threshold, channels, frequency });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        <div className="border-b border-line px-6 pt-6 pb-4">
          <SheetTitle className="text-title-2 text-ink">{t("title")}</SheetTitle>
          <SheetDescription className="sr-only">{t("description")}</SheetDescription>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <Field label={t("common:language")}>
            <Select value={currentLanguage} onValueChange={(lng) => i18n.changeLanguage(lng)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lng) => (
                  <SelectItem key={lng} value={lng}>
                    {LANGUAGE_LABELS[lng]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <hr className="border-line" />

          <Field label={t("monitoredRegion")}>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`regions.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("indicator")}>
            <Select value={indicator} onValueChange={setIndicator}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDICATORS.map((i) => (
                  <SelectItem key={i} value={i}>
                    {t(`indicators.${i}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("criticalThreshold")}>
            <div className="relative">
              <input
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="h-9 w-full rounded-md border border-line bg-surface px-3 pr-24 text-body text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-caption text-ink-muted">
                {t("below")}
              </span>
            </div>
          </Field>

          <hr className="border-line" />

          <div className="space-y-3">
            <p className="text-label text-ink-muted">{t("notifyVia")}</p>
            {CHANNELS.map((key) => {
              const label = t(`channels.${key}`);
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-body text-ink">{label}</span>
                  <Switch
                    checked={channels[key]}
                    onCheckedChange={(v) => setChannels((c) => ({ ...c, [key]: v }))}
                    aria-label={label}
                  />
                </div>
              );
            })}
          </div>

          <hr className="border-line" />

          <div className="space-y-2">
            <p className="text-label text-ink-muted">{t("frequency")}</p>
            <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-2">
              {FREQUENCIES.map((f) => (
                <label key={f} htmlFor={f} className="flex items-center gap-2">
                  <RadioGroupItem id={f} value={f} />
                  <span
                    className={
                      frequency === f ? "text-body font-medium text-ink" : "text-body text-ink-muted"
                    }
                  >
                    {t(`frequencies.${f}`)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="border-t border-line p-4">
          <Button variant="primary" fullWidth onClick={handleSave}>
            {t("save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Label (cinza, pequeno) + controle. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-label text-ink-muted">{label}</p>
      {children}
    </div>
  );
}
