"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockAirlines } from "@/mock/airlines";
import { formatCurrency } from "@/utils/price-formatter";
import { cn } from "@/lib/utils";

interface Filters {
  maxPrice: number;
  maxStops: number;
  airlines: string[];
  baggageOnly: boolean;
}

interface FlightFiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  totalResults: number;
  maxAvailablePrice?: number;
}

export function FlightFilters({ filters, onChange, totalResults, maxAvailablePrice = 10000 }: FlightFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Arredonda para cima em múltiplos de 500
  const priceMax = Math.ceil(maxAvailablePrice / 500) * 500 || 10000;

  function toggleAirline(code: string) {
    const next = filters.airlines.includes(code)
      ? filters.airlines.filter((a) => a !== code)
      : [...filters.airlines, code];
    onChange({ ...filters, airlines: next });
  }

  function reset() {
    onChange({ maxPrice: priceMax, maxStops: 2, airlines: [], baggageOnly: false });
  }

  const hasActive =
    filters.maxPrice < priceMax ||
    filters.maxStops < 2 ||
    filters.airlines.length > 0 ||
    filters.baggageOnly;

  const inner = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Filtros</p>
        {hasActive && (
          <button type="button" onClick={reset} className="text-xs text-primary hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground -mt-3">{totalResults} voos encontrados</p>

      {/* Preço */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Preço máximo</p>
        <input
          type="range"
          min={200}
          max={priceMax}
          step={100}
          value={Math.min(filters.maxPrice, priceMax)}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">R$ 200</span>
          <span className="text-xs font-semibold text-primary">{formatCurrency(filters.maxPrice)}</span>
        </div>
      </div>

      {/* Escalas */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Escalas</p>
        <div className="space-y-1.5">
          {[
            { label: "Direto", value: 0 },
            { label: "Até 1 escala", value: 1 },
            { label: "Até 2 escalas", value: 2 },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="stops"
                checked={filters.maxStops === opt.value}
                onChange={() => onChange({ ...filters, maxStops: opt.value })}
                className="accent-primary"
              />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Companhias */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Companhias</p>
        <div className="space-y-1.5">
          {mockAirlines.map((a) => (
            <label key={a.code} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(a.code)}
                onChange={() => toggleAirline(a.code)}
                className="rounded accent-primary"
              />
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
              <span className="text-sm text-foreground truncate">{a.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bagagem */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Bagagem</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.baggageOnly}
            onChange={(e) => onChange({ ...filters, baggageOnly: e.target.checked })}
            className="rounded accent-primary"
          />
          <span className="text-sm text-foreground">Apenas com bagagem despachada</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)} className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros {hasActive && <span className="bg-primary text-white text-[10px] rounded-full px-1.5">ON</span>}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-5 overflow-y-auto lg:hidden shadow-xl">
            {inner}
            <Button className="w-full mt-6" onClick={() => setMobileOpen(false)}>Ver resultados</Button>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div className={cn("hidden lg:block w-56 shrink-0 bg-white rounded-xl border border-border p-5 h-fit sticky top-24")}>
        {inner}
      </div>
    </>
  );
}
