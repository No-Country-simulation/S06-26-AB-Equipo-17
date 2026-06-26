import { createBrowserRouter } from "react-router-dom";
import { SignInPage } from "../pages/SignInPage";
import App from "../App";

/**
 * Rotas do app.
 *  /     → SignInPage (primeira página)
 *  /dev  → playground do design system (componentes + tokens)
 * (a criar: /home, /consulta, /mapa, /sobre — ver roadmap)
 */
export const router = createBrowserRouter([
  { path: "/", element: <SignInPage /> },
  { path: "/dev", element: <App /> },
]);
