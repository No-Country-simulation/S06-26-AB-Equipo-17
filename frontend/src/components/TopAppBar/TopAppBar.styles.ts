/* ============================================================
   TopAppBar — ESTILO
   Barra superior (chrome): brand (esq) · título (centro) · ações+avatar (dir).
   Grid de 3 colunas mantém o título centralizado independente das laterais.
   Sem variações de estado → não tem .states.ts.
   ============================================================ */

export const styles = {
  root: "relative z-10 grid h-16 grid-cols-3 items-center bg-surface px-6 shadow-elev-3",
  brand: "flex items-center",
  title: "text-center text-title-3 text-ink",
  right: "flex items-center justify-end gap-2",
} as const;
