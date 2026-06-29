import { Suspense, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IconButton } from "../components/IconButton";
import { Logo } from "../components/Logo";
import { SideAppBar, type SideNavItem } from "../components/SideAppBar";
import { TopAppBar } from "../components/TopAppBar";
import { BarsIcon, BellIcon, DocIcon, GearIcon, PinIcon } from "../components/icons";
import { NotificationsPanel } from "../features/notifications";
import { SettingsPanel } from "../features/settings";
import { PageFallback } from "./PageFallback";

/** Navegação lateral (mock). `value` = caminho da rota. */
const NAV: SideNavItem[] = [
  { value: "/app/map", label: "Mapa", icon: <PinIcon /> },
  { value: "/app/analytics", label: "Analytics", icon: <BarsIcon /> },
  { value: "/app/reports", label: "Relatórios", icon: <DocIcon /> },
  { value: "/app/alerts", label: "Alertas", icon: <BellIcon /> },
];

/** Usuário exibido na casca (mock — app sem autenticação). */
const MOCK_USER = { name: "Carla Mendes" };

/**
 * Casca do app — barra superior (full-width) e, abaixo, coluna branca da
 * sidebar + conteúdo da rota (<Outlet/>).
 */
export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const current = NAV.find((item) => pathname.startsWith(item.value));

  return (
    <div className="flex min-h-screen flex-col bg-app">
      <TopAppBar
        brand={<Logo variant="dark" className="h-7 w-auto" />}
        title={current?.label}
        actions={
          <>
            <IconButton variant="ghost" label="Configurações" onClick={() => setSettingsOpen(true)}>
              <GearIcon />
            </IconButton>
            <IconButton
              variant="ghost"
              label="Notificações"
              onClick={() => setNotificationsOpen(true)}
            >
              <BellIcon />
            </IconButton>
          </>
        }
        user={MOCK_USER}
      />

      <div className="flex flex-1">
        {/* Coluna branca da sidebar — card de menu centralizado verticalmente */}
        <aside className="flex w-40 items-center justify-center bg-surface px-4">
          <SideAppBar
            items={NAV}
            activeValue={current?.value ?? ""}
            onNavigate={(value) => navigate(value)}
          />
        </aside>

        <main className="flex min-h-0 flex-1 flex-col">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
