/* eslint-disable react-refresh/only-export-components --
   arquivo de rotas: define componentes lazy + exporta `router` (não-componente);
   fast-refresh não se aplica aqui. */
import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { PageFallback } from "./PageFallback";
import { PlaceholderPage } from "../pages/PlaceholderPage";

// Páginas pesadas/raras viram chunks separados (lazy) — tiram Leaflet e o
// playground do carregamento inicial.
const SignInPage = lazy(() =>
  import("../pages/SignInPage").then((m) => ({ default: m.SignInPage })),
);
const MapPage = lazy(() =>
  import("../pages/MapPage").then((m) => ({ default: m.MapPage })),
);
const DevPlayground = lazy(() => import("../App"));

/** Envolve um elemento lazy no Suspense (fallback de carregamento). */
const suspense = (node: ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

/**
 * Rotas do app.
 *  /        → SignInPage (primeira página)
 *  /dev     → playground do design system (componentes + tokens)
 *  /app/*   → casca (AppLayout) + páginas internas; o Suspense vive no AppLayout (<Outlet/>)
 */
export const router = createBrowserRouter([
  { path: "/", element: suspense(<SignInPage />) },
  { path: "/dev", element: suspense(<DevPlayground />) },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="map" replace /> },
      { path: "map", element: <MapPage /> },
      { path: "analytics", element: <PlaceholderPage title="Analytics" /> },
      { path: "reports", element: <PlaceholderPage title="Relatórios" /> },
      { path: "alerts", element: <PlaceholderPage title="Alertas" /> },
    ],
  },
]);
