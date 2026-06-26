/* ============================================================
   useDebounce — hook genérico (NÃO fala com API → mora em libs/).
   Atrasa a propagação de um valor (ex.: texto da busca antes de
   chamar a IA), evitando uma requisição por tecla.
   ============================================================ */

import { useEffect, useState } from "react";

/** @param value valor a "atrasar" · @param delay ms (default 300). */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
