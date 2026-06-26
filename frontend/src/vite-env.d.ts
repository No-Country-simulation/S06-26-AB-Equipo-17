/// <reference types="vite/client" />

/** Imports de CSS (side-effect) do @fontsource — não têm tipos próprios. */
declare module "@fontsource-variable/inter";

/** Variáveis de ambiente do app (Vite expõe só as que começam com VITE_). */
interface ImportMetaEnv {
  /** Host puro da API (ex.: https://appbit-api.onrender.com). O client prefixa /api/v1. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
