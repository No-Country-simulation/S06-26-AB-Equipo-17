import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { Logo } from "../../components/Logo";

function CheckGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function SignInPage() {
  const { t } = useTranslation("signIn");
  const navigate = useNavigate();
  // Credenciais mockadas (demo/hackathon) — pré-preenchem o formulário.
  const [email, setEmail] = useState("carla.demo@appbit.gov.br");
  const [password, setPassword] = useState("appbit2026");

  // Fluxo de 2 telas SÓ no mobile: splash (hero) → botão → desliza pro form.
  // No desktop as duas colunas convivem, então já começa "no form" (evita
  // esconder/inertizar o painel do formulário na coluna direita).
  const [showForm, setShowForm] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  // Ao cruzar p/ desktop (resize/rotação), garante o form visível.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => mq.matches && setShowForm(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/app");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ---- Painel esquerdo (hero) ----
          Mobile: 1ª dobra (splash) — centralizado p/ ficar longe do notch.
          Desktop: coluna esquerda com logo (topo) · título (meio) · citação (base). */}
      <aside className="flex min-h-screen flex-col justify-center gap-10 bg-hero-navy p-8 text-ink-inverse lg:min-h-0 lg:justify-between lg:gap-0 lg:p-12">
        <div>
          <Logo className="h-9 w-auto" />
        </div>

        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl">{t("heroTitle")}</h1>
          <div className="space-y-2">
            <p className="text-title-3">{t("heroTagline")}</p>
            <p className="text-body-lg text-ink-inverse/60">{t("heroSubtitle")}</p>
          </div>

          {/* CTA branco — só mobile: leva à "tela" do formulário (desliza). */}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full rounded-input bg-surface px-6 py-4 text-body-lg font-semibold text-ink shadow-elev-3 outline-none transition-colors hover:bg-surface-sec focus-visible:ring-2 focus-visible:ring-ink-inverse/60 lg:hidden"
          >
            {t("accessAccount")}
          </button>
        </div>

        {/* Citação — só no desktop (no mobile a 1ª dobra fica enxuta). */}
        <figure className="hidden max-w-md rounded-panel bg-ink-inverse/5 p-6 lg:block">
          <blockquote className="text-body text-ink-inverse/80">{`“${t("quote")}”`}</blockquote>
          <figcaption className="mt-3 text-caption text-ink-inverse/50">
            {t("quoteAuthor")}
          </figcaption>
        </figure>
      </aside>

      {/* ---- Painel direito (formulário) ----
          Mobile: "tela" que desliza sobre o hero (fixed + translate-x) ao tocar
          no CTA; navy como o hero → o card branco "flutua". `inert` quando
          escondido (fora de foco/leitor de tela).
          Desktop: coluna direita estática e sempre visível (lg:static). */}
      <main
        inert={!showForm}
        className={`fixed inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-hero-navy p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out lg:static lg:z-auto lg:min-h-0 lg:translate-x-0 lg:bg-surface lg:transition-none ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Voltar ao splash — só mobile. */}
        <button
          type="button"
          onClick={() => setShowForm(false)}
          aria-label={t("back")}
          className="absolute left-4 top-[calc(1rem+env(safe-area-inset-top))] inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-inverse outline-none transition-colors hover:bg-ink-inverse/10 focus-visible:ring-2 focus-visible:ring-ink-inverse/60 lg:hidden"
        >
          <ChevronLeft />
        </button>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5 rounded-panel bg-surface p-8 shadow-elev-3 ring-1 ring-line"
        >
          <div className="space-y-1">
            <h2 className="text-title-2 text-ink">{t("welcome", { name: "Carla" })}</h2>
            <p className="text-body text-ink-muted">{t("welcomeSubtitle")}</p>
          </div>

          <hr className="border-line" />

          <TextField
            label={t("emailLabel")}
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-1.5">
            <TextField
              label={t("passwordLabel")}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-right">
              <a href="#" className="text-label text-primary hover:underline">
                {t("forgotPassword")}
              </a>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            {t("signIn")}
          </Button>

          <div className="flex items-center gap-3 text-caption text-ink-muted">
            <span className="h-px flex-1 bg-line" />
            {t("or")}
            <span className="h-px flex-1 bg-line" />
          </div>

          <Button type="button" variant="secondary" fullWidth>
            {t("signInGov")}
          </Button>

          <p className="text-center text-caption text-ink-muted">{t("restricted")}</p>
        </form>

        <p className="text-caption text-ink-inverse/60 lg:text-ink-muted">{t("hackathon")}</p>

        <span className="inline-flex items-center gap-1.5 rounded-pill bg-success-soft px-3 py-1 text-label font-medium text-success">
          <CheckGlyph />
          {t("secureConnection")}
        </span>
      </main>
    </div>
  );
}
