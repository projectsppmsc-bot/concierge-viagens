"use client";

import { useCallback } from "react";
import type { SearchHistory } from "@/types/history";
import { mockHistory } from "@/mock/history";
import { useLocalStorageState } from "./useLocalStorageState";

export function useHistory() {
  const [history, setHistory] = useLocalStorageState<SearchHistory[]>("cv:history", mockHistory);

  const addEntry = useCallback((entry: SearchHistory) => {
    setHistory((prev) => [entry, ...prev]);
  }, [setHistory]);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addEntry, removeEntry, clearHistory };
}
