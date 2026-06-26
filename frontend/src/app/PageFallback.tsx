import { Loader2 } from "lucide-react";

/** Fallback de carregamento das rotas lazy (Suspense). */
export function PageFallback() {
  return (
    <div className="flex min-h-40 flex-1 items-center justify-center text-ink-muted">
      <Loader2 className="size-6 animate-spin" aria-label="Carregando" />
    </div>
  );
}
