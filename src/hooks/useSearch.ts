"use client";

import { useSearchContext } from "@/context/SearchContext";

export function useSearch() {
  return useSearchContext();
}
