import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/app");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ---- Painel esquerdo (hero) ---- */}
      <aside className="bg-hero-navy hidden flex-col justify-between p-12 text-ink-inverse lg:flex">
        <div>
          <Logo className="h-9 w-auto" />
        </div>

        <div className="max-w-md space-y-6">
          <h1 className="text-5xl font-bold leading-[1.05]">{t("heroTitle")}</h1>
          <div className="space-y-2">
            <p className="text-title-3">{t("heroTagline")}</p>
            <p className="text-body-lg text-ink-inverse/60">{t("heroSubtitle")}</p>
          </div>
        </div>

        <figure className="max-w-md rounded-panel bg-ink-inverse/5 p-6">
          <blockquote className="text-body text-ink-inverse/80">{`“${t("quote")}”`}</blockquote>
          <figcaption className="mt-3 text-caption text-ink-inverse/50">
            {t("quoteAuthor")}
          </figcaption>
        </figure>
      </aside>

      {/* ---- Painel direito (formulário) ---- */}
      <main className="flex flex-col items-center justify-center gap-6 bg-surface p-6">
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

        <p className="text-caption text-ink-muted">{t("hackathon")}</p>

        <span className="inline-flex items-center gap-1.5 rounded-pill bg-success-soft px-3 py-1 text-label font-medium text-success">
          <CheckGlyph />
          {t("secureConnection")}
        </span>
      </main>
    </div>
  );
}
