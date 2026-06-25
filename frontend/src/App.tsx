import { useState } from "react";
import { IconButton } from "./components/IconButton";
import { NavItem } from "./components/NavItem";
import { TabNav } from "./components/TabNav";
import { KpiCardLarge, KpiCardSmall } from "./components/KpiCard";

/** Ícone de exemplo (quadrado arredondado). `currentColor` herda a cor do estado. */
function SquareGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <rect width="18" height="18" rx="5" />
    </svg>
  );
}

/** Cabeçalho de seção no padrão do design system. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-label uppercase tracking-wide text-ink-muted">{title}</p>
        <hr className="mt-2 border-line" />
      </div>
      {children}
    </section>
  );
}

/** Coluna rotulada (Padrão / Hover / Ativo / ...). */
function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-caption text-ink-muted">{label}</span>
      {children}
    </div>
  );
}

function App() {
  const [ativo, setAtivo] = useState(false);
  const [tab, setTab] = useState("visao");
  const [rota, setRota] = useState("mapa");

  return (
    <div className="min-h-screen bg-app p-10">
      <div className="mx-auto max-w-2xl space-y-12">
        <header className="space-y-1">
          <h1 className="text-display text-ink">App BiT — Design System</h1>
          <p className="text-body text-ink-muted">
            Página de teste dos tokens (cores, fontes, raios, sombras) e componentes.
          </p>
        </header>

        {/* ---- Tipografia ---- */}
        <Section title="Tipografia · Inter">
          <div className="space-y-1">
            <p className="text-display text-ink">Display Grande</p>
            <p className="text-title-2 text-ink">Título 2</p>
            <p className="text-title-3 text-ink">Título 3</p>
            <p className="text-body-lg text-ink">Corpo Grande</p>
            <p className="text-body text-ink">Corpo Regular</p>
            <p className="text-label text-ink">Rótulo Pequeno</p>
            <p className="text-caption text-ink-muted">Legenda</p>
          </div>

          {/* Textos corridos para conferir a renderização do Inter em vários pesos */}
          <div className="max-w-prose space-y-3">
            <h2 className="text-title-2 text-ink">Painel de Indicadores Regionais</h2>
            <p className="text-body text-ink">
              O App BiT consolida dados públicos de atendimento e emprego em uma única
              visão. Acompanhe a evolução dos números, compare regiões e exporte o
              relatório em PDF — tudo direto do navegador, sem instalação.
            </p>
            <p className="text-body text-ink-muted">
              Tipografia variável Inter: pesos{" "}
              <span className="font-normal">Regular (400)</span>,{" "}
              <span className="font-medium">Medium (500)</span>,{" "}
              <span className="font-semibold">SemiBold (600)</span> e{" "}
              <span className="font-bold">Bold (700)</span>. Acentuação: ação, coração,
              após, três, à própria região. Números: 0123456789 · 1.247.893 · 48,2%.
            </p>
          </div>
        </Section>

        {/* ---- Cartão KPI ---- */}
        <Section title="Cartão KPI">
          <div className="flex flex-wrap items-start gap-6">
            <KpiCardLarge
              value="1.247.893"
              label="Total de Residentes Atendidos"
              trend={{ value: "+12,4%", direction: "up" }}
            />
            <KpiCardSmall value="48,2%" label="Taxa de Emprego" />
          </div>
          {/* Variação com chip vermelho (tendência negativa) */}
          <div className="flex flex-wrap items-start gap-6">
            <KpiCardLarge
              value="312"
              label="Ocorrências em Aberto"
              trend={{ value: "-3,1%", direction: "down" }}
            />
            <KpiCardSmall
              value="R$ 2,4M"
              label="Investimento"
              trend={{ value: "+8%", direction: "up" }}
            />
          </div>
        </Section>

        {/* ---- IconButton ---- */}
        <Section title="Botão ícone — 40×40">
          <div className="flex items-start gap-10">
            <Demo label="Padrão">
              <IconButton label="Exemplo padrão">
                <SquareGlyph />
              </IconButton>
            </Demo>
            <Demo label="Ativo">
              <IconButton label="Exemplo ativo" active>
                <SquareGlyph />
              </IconButton>
            </Demo>
            <Demo label="Interativo (clique)">
              <IconButton label="Alternar" active={ativo} onClick={() => setAtivo((v) => !v)}>
                <SquareGlyph />
              </IconButton>
            </Demo>
          </div>
        </Section>

        {/* ---- TabNav ---- */}
        <Section title="TabNav — abas superiores">
          <TabNav
            aria-label="Seções"
            value={tab}
            onChange={setTab}
            items={[
              { value: "visao", label: "Visão Geral" },
              { value: "dados", label: "Dados" },
              { value: "mapa", label: "Mapa" },
              { value: "sobre", label: "Sobre", disabled: true },
            ]}
          />
          <p className="text-caption text-ink-muted">Aba ativa: {tab}</p>
        </Section>

        {/* ---- NavItem ---- */}
        <Section title="NavItem — barra lateral 88×72">
          <div className="inline-flex gap-2 rounded-panel bg-surface p-2 shadow-elev-1 ring-1 ring-line">
            <NavItem
              label="Mapa"
              icon={<SquareGlyph size={22} />}
              active={rota === "mapa"}
              onClick={() => setRota("mapa")}
            />
            <NavItem
              label="Dados"
              icon={<SquareGlyph size={22} />}
              active={rota === "dados"}
              onClick={() => setRota("dados")}
            />
            <NavItem label="Sobre" icon={<SquareGlyph size={22} />} disabled />
          </div>
          <p className="text-caption text-ink-muted">Rota ativa: {rota}</p>
        </Section>
      </div>
    </div>
  );
}

export default App;
