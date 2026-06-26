/* ============================================================
   useApi — hook genérico p/ chamadas que rodam AO MONTAR (GET).
   Expõe { data, loading, error, refetch }. Cancela se desmontar.
   Para ações disparadas pelo usuário (POST), ver useAIQuery.
   ============================================================ */

import { useEffect, useState } from "react";

type State<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type AsyncState<T> = State<T> & {
  refetch: () => void;
};

/**
 * @param fn   função que faz a chamada (ex.: () => getMapData()).
 * @param deps dependências que, ao mudar, refazem a chamada.
 *
 * Os setState ficam só nos callbacks async e no refetch (nunca no corpo
 * do effect) — exigência do lint react-hooks/set-state-in-effect.
 */
export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // fn é recriada a cada render; controlamos via deps explícitas + reloadKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  /** Refaz a chamada (marca loading antes — fora do effect, permitido). */
  const refetch = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setReloadKey((k) => k + 1);
  };

  return { ...state, refetch };
}
