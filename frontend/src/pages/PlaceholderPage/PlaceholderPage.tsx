/** Stub de página — usado nas rotas internas até a tela real existir. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="space-y-2 p-6">
      <h1 className="text-title-2 text-ink">{title}</h1>
      <p className="text-body text-ink-muted">Página em construção.</p>
    </section>
  );
}
