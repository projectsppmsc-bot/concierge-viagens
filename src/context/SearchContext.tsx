"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { SearchQuery, SearchFilters, SearchSortOption } from "@/types/search";
import type { Flight } from "@/types/flight";
import { getFlightProvider, getActiveProviderName } from "@/services/flights/provider";
import { mockProvider } from "@/services/flights/mock-provider";

type SearchState = {
  query: SearchQuery | null;
  results: Flight[];
  filters: SearchFilters;
  sortBy: SearchSortOption;
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;
  // Indica que os resultados vieram do mock por falha da API real
  usedFallback: boolean;
  fallbackReason: string | null;
};

type SearchContextValue = SearchState & {
  search: (query: SearchQuery) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  setSortBy: (sort: SearchSortOption) => void;
  clearResults: () => void;
};

const defaultState: SearchState = {
  query: null,
  results: [],
  filters: {},
  sortBy: "best_value",
  isLoading: false,
  hasSearched: false,
  error: null,
  usedFallback: false,
  fallbackReason: null,
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchState>(defaultState);

  const search = useCallback(async (query: SearchQuery) => {
    setState((prev) => ({
      ...prev,
      query,
      isLoading: true,
      error: null,
      usedFallback: false,
      fallbackReason: null,
    }));

    const provider = getFlightProvider();
    const providerName = getActiveProviderName();
    let results: Flight[] = [];
    let usedFallback = false;
    let fallbackReason: string | null = null;

    try {
      results = await provider.search(query);

      // Se o provider real não retornou nada, usa mock como fallback informativo
      const isRealProvider = providerName === "amadeus" || providerName === "travelpayouts";
      if (isRealProvider && results.length === 0) {
        const mockResults = await mockProvider.search(query);
        if (mockResults.length > 0) {
          results = mockResults;
          usedFallback = true;
          fallbackReason = "A busca real não retornou voos para essa rota. Exibindo dados simulados.";
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      const isRealProvider = providerName === "amadeus" || providerName === "travelpayouts";
      // Fallback para mock em caso de falha da API real
      if (isRealProvider) {
        try {
          results = await mockProvider.search(query);
          usedFallback = true;
          fallbackReason = "A busca real de voos não respondeu. Exibindo dados simulados.";
        } catch {
          // mock também falhou — improvável, mas protege
          setState((prev) => ({
            ...prev,
            isLoading: false,
            hasSearched: true,
            error: msg,
          }));
          return;
        }
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          hasSearched: true,
          error: msg,
        }));
        return;
      }
    }

    // Provedores reais às vezes completam a lista com preços de outras datas do
    // mês quando a data exata não tem cache — avisa o usuário quando isso ocorre.
    if (!usedFallback && query.departureDate && results.length > 0) {
      const requestedDate = query.departureDate.slice(0, 10);
      const hasExactDate = results.some((f) => f.segments[0]?.departureTime.slice(0, 10) === requestedDate);
      if (!hasExactDate) {
        usedFallback = true;
        fallbackReason = `Não encontramos voos na data exata pesquisada (${requestedDate}). Exibindo os preços mais próximos encontrados para essa rota.`;
      }
    }

    setState((prev) => ({
      ...prev,
      results,
      isLoading: false,
      hasSearched: true,
      usedFallback,
      fallbackReason,
    }));
  }, []);

  const setFilters = useCallback((filters: SearchFilters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const setSortBy = useCallback((sortBy: SearchSortOption) => {
    setState((prev) => ({ ...prev, sortBy }));
  }, []);

  const clearResults = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <SearchContext.Provider value={{ ...state, search, setFilters, setSortBy, clearResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext deve ser usado dentro de SearchProvider");
  return ctx;
}
