"use client";

import { useState, useEffect } from "react";

/**
 * Estado com persistência em localStorage. Inicializa com `initialValue` (para
 * bater com a renderização no servidor) e, após montar no cliente, sobrescreve
 * com o valor salvo, se houver. Toda mudança subsequente é persistida.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {
      // dados corrompidos — mantém o valor inicial
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage indisponível ou cheio — ignora
    }
  }, [key, state, hydrated]);

  return [state, setState] as const;
}
