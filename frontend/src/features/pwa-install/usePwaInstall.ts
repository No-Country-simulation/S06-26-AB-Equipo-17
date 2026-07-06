import { useCallback, useSyncExternalStore } from "react";

/** Evento do Chromium (não existe no lib do TS): prompt de instalação da PWA. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

// ── Store em nível de módulo ──────────────────────────────────────────────
// O beforeinstallprompt pode disparar ANTES de qualquer componente montar →
// capturar no import (o AppLayout puxa este módulo no bundle inicial).
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // segura o mini-infobar do Chrome; o prompt sai do nosso botão
    deferredPrompt = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installed = true;
    notify();
  });
}

/** App já rodando instalado (standalone)? iOS usa o `navigator.standalone`. */
function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iPhone/iPad — o iPadOS se identifica como Mac, mas com tela de toque. */
function isIos(): boolean {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export type PwaInstallStatus =
  | "hidden" // já instalado/standalone, ou plataforma sem instalação (ex.: Firefox desktop)
  | "installable" // Chromium: prompt nativo disponível
  | "ios"; // iOS/Safari: nunca dispara o evento → só instrução manual

/**
 * Estado de instalação da PWA + ação de instalar.
 * `status` decide o comportamento do botão; `promptInstall` só age no Chromium.
 */
export function usePwaInstall(): { status: PwaInstallStatus; promptInstall: () => void } {
  const canPrompt = useSyncExternalStore(subscribe, () => deferredPrompt !== null);
  const isInstalled = useSyncExternalStore(subscribe, () => installed);

  const promptInstall = useCallback(() => {
    const evt = deferredPrompt;
    if (!evt) return;
    // O Chrome só permite 1 prompt() por evento → consome; se o usuário
    // recusar, o navegador pode redisparar o beforeinstallprompt depois.
    deferredPrompt = null;
    notify();
    void evt.prompt();
  }, []);

  let status: PwaInstallStatus = "hidden";
  if (!isInstalled && !isStandalone()) {
    if (canPrompt) status = "installable";
    else if (isIos()) status = "ios";
  }
  return { status, promptInstall };
}
