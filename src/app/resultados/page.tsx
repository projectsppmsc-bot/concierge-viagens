"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Plane, AlertTriangle, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FlightCard } from "@/components/resultados/FlightCard";
import { FlightFilters } from "@/components/resultados/FlightFilters";
import { FlightSortBar } from "@/components/resultados/FlightSortBar";
import { Button } from "@/components/ui/button";
import { useSearchContext } from "@/context/SearchContext";
import { sortFlights } from "@/utils/flight-sorter";
import type { SearchSortOption } from "@/types/search";

interface Filters {
  maxPrice: number;
  maxStops: number;
  airlines: string[];
  baggageOnly: boolean;
}

function buildDefaultFilters(maxPrice = 10000): Filters {
  return { maxPrice, maxStops: 2, airlines: [], baggageOnly: false };
}

export default function ResultadosPage() {
  const { results, isLoading, hasSearched, query, usedFallback, fallbackReason } = useSearchContext();
  const [sortBy, setSortBy] = useState<SearchSortOption>("best_value");

  // Calcula preço máximo dinâmico baseado nos resultados reais
  const maxAvailablePrice = useMemo(
    () => (results.length > 0 ? Math.max(...results.map((r) => r.priceTotal)) : 10000),
    [results],
  );
  const [filters, setFilters] = useState<Filters>(() => buildDefaultFilters(maxAvailablePrice));

  const filtered = useMemo(() => {
    return results.filter((f) => {
      if (f.priceTotal > filters.maxPrice) return false;
      if (f.stops > filters.maxStops) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.segments[0].airlineCode)) return false;
      if (filters.baggageOnly && f.baggage.checked === 0) return false;
      return true;
    });
  }, [results, filters]);

  const sorted = useMemo(() => sortFlights(filtered, sortBy), [filtered, sortBy]);

  return (
    <AppShell title="Resultados de Voos">
      {/* Back + search bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/busca" className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Nova busca
          </Link>
        </Button>
        {query && (
          <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2 flex-wrap">
            <Plane className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              {query.originCity || query.origin}
            </span>
            <span className="text-muted-foreground text-sm">→</span>
            <span className="text-sm font-semibold text-foreground">
              {query.destinationCity || query.destination}
            </span>
            {query.departureDate && (
              <span className="text-xs text-muted-foreground">· {query.departureDate}</span>
            )}
          </div>
        )}
        <Button variant="outline" size="sm" asChild className="ml-auto">
          <Link href="/busca" className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Editar busca
          </Link>
        </Button>
      </div>

      {/* Banner de dados reais */}
      {!usedFallback && results.length > 0 && (results[0]?.source === "amadeus" || results[0]?.source === "travelpayouts") && (
        <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-sm text-blue-800">
          <Zap className="w-4 h-4 shrink-0 text-blue-500" />
          <span>
            Exibindo <strong>voos reais</strong> via{" "}
            {results[0]?.source === "travelpayouts" ? "Travelpayouts · Aviasales" : "Amadeus"}.
          </span>
        </div>
      )}

      {/* Banner de fallback discreto */}
      {usedFallback && fallbackReason && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span>{fallbackReason}</span>
        </div>
      )}

      {isLoading ? (
        /* Loading state */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center animate-pulse">
            <Plane className="w-7 h-7 text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">Buscando os melhores voos...</p>
            <p className="text-sm text-muted-foreground mt-1">Comparando preços e disponibilidade</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* Filters */}
          <FlightFilters
            filters={filters}
            onChange={setFilters}
            totalResults={sorted.length}
            maxAvailablePrice={maxAvailablePrice}
          />

          {/* Results */}
          <div className="flex-1 min-w-0 space-y-3">
            <FlightSortBar value={sortBy} onChange={setSortBy} count={sorted.length} />

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-xl border border-border">
                <Plane className="w-10 h-10 text-muted-foreground/40" />
                <p className="text-base font-semibold text-foreground">
                  {hasSearched && results.length === 0
                    ? "Nenhum voo encontrado para essa combinação."
                    : "Nenhum voo encontrado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasSearched && results.length === 0
                    ? "Tente outras datas ou destinos."
                    : "Tente ajustar os filtros"}
                </p>
                {!(hasSearched && results.length === 0) && (
                  <Button variant="outline" size="sm" onClick={() => setFilters(buildDefaultFilters(maxAvailablePrice))}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              sorted.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  searchOrigin={query?.origin}
                  searchDestination={query?.destination}
                  searchDepartureDate={query?.departureDate}
                  searchReturnDate={query?.returnDate}
                  searchAdults={query?.passengers.adults}
                />
              ))
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
