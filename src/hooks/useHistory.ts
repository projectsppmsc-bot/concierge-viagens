"use client";

import { useState, useCallback } from "react";
import type { SearchHistory } from "@/types/history";
import { mockHistory } from "@/mock/history";

export function useHistory() {
  const [history, setHistory] = useState<SearchHistory[]>(mockHistory);

  const addEntry = useCallback((entry: SearchHistory) => {
    setHistory((prev) => [entry, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
