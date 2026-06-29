import { useState, type ReactNode } from "react";
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

const REGIONS = ["Todas as regiões", "Leste", "Sudoeste", "Centro"];
const INDICATORS = ["Cobertura 4G", "Formação tech", "Emprego", "Mobilidade"];

const CHANNELS = [
  { key: "painel", label: "Painel AppBiT" },
  { key: "email", label: "E-mail" },
  { key: "pdf", label: "Relatório PDF" },
] as const;
type ChannelKey = (typeof CHANNELS)[number]["key"];

const FREQUENCIES = [
  { value: "realtime", label: "Tempo real" },
  { value: "hourly", label: "A cada hora" },
  { value: "daily", label: "Diário" },
];

export type SettingsPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Painel lateral de configuração de alertas (Sheet). Estado local mockado. */
export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const [region, setRegion] = useState(REGIONS[0]);
  const [indicator, setIndicator] = useState(INDICATORS[0]);
  const [threshold, setThreshold] = useState("30%");
  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>({
    painel: true,
    email: true,
    pdf: false,
  });
  const [frequency, setFrequency] = useState("realtime");

  function handleSave() {
    // TODO: persistir via api/ quando o endpoint existir.
    console.log("salvar config:", { region, indicator, threshold, channels, frequency });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        <div className="border-b border-line px-6 pt-6 pb-4">
          <SheetTitle className="text-title-2 text-ink">Configurar Alertas</SheetTitle>
          <SheetDescription className="sr-only">
            Configure região, indicador, limite e notificações dos alertas
          </SheetDescription>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <Field label="Região monitorada">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Indicador">
            <Select value={indicator} onValueChange={setIndicator}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDICATORS.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Limite crítico">
            <div className="relative">
              <input
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="h-9 w-full rounded-md border border-line bg-surface px-3 pr-24 text-body text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-caption text-ink-muted">
                abaixo de
              </span>
            </div>
          </Field>

          <hr className="border-line" />

          <div className="space-y-3">
            <p className="text-label text-ink-muted">Notificar via</p>
            {CHANNELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-body text-ink">{label}</span>
                <Switch
                  checked={channels[key]}
                  onCheckedChange={(v) => setChannels((c) => ({ ...c, [key]: v }))}
                  aria-label={label}
                />
              </div>
            ))}
          </div>

          <hr className="border-line" />

          <div className="space-y-2">
            <p className="text-label text-ink-muted">Frequência</p>
            <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-2">
              {FREQUENCIES.map((f) => (
                <label key={f.value} htmlFor={f.value} className="flex items-center gap-2">
                  <RadioGroupItem id={f.value} value={f.value} />
                  <span
                    className={
                      frequency === f.value ? "text-body font-medium text-ink" : "text-body text-ink-muted"
                    }
                  >
                    {f.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="border-t border-line p-4">
          <Button variant="primary" fullWidth onClick={handleSave}>
            Salvar configuração
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
