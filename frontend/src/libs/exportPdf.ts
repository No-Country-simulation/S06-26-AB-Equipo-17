/* ============================================================
   exportPdf — entrega um PDF (Blob) ao usuário de forma PWA-safe.
   - Mobile/PWA (iOS standalone incluso): Web Share API nível 2
     (share sheet nativo → "Salvar em Arquivos", imprimir, enviar...).
   - Desktop / Android: download via <a download>.
   NÃO usa window.print() (quebra no PWA standalone do iOS).
   ============================================================ */

/**
 * Detecta DESKTOP em browser (não instalado como PWA, com mouse):
 *  - `true`  → desktop → abrir o PDF numa **nova aba** (visor do browser:
 *    preview + imprimir + salvar). Melhor UX no web que o download silencioso.
 *  - `false` → PWA standalone (iOS incluso) ou touch (celular/tablet) → usar
 *    Web Share/download via `exportPdf`.
 * Sinais: standalone nunca abre aba; senão exige ponteiro fino + hover (mouse),
 * o que exclui touch.
 * (Obs.: NÃO usamos `window.print()`/react-to-print — o print via iframe perde
 * a user-activation ao carregar o CSS/fontes e é bloqueado silenciosamente.)
 */
export function isDesktopBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Compartilha (mobile/PWA) ou baixa (desktop) o PDF `blob` como `filename`. */
export async function exportPdf(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: "application/pdf" });

  // Web Share API com arquivos — funciona no iOS/Android (incl. PWA standalone).
  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (err) {
      // Usuário fechou o share sheet → não é erro, não cai no fallback.
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Qualquer outra falha do share → segue pro download.
    }
  }

  // Fallback: download (desktop / Android / navegadores sem share de arquivos).
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
