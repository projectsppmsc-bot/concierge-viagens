"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchSortOption } from "@/types/search";

interface FlightSortBarProps {
  value: SearchSortOption;
  onChange: (v: SearchSortOption) => void;
  count: number;
}

const options: { value: SearchSortOption; label: string }[] = [
  { value: "best_value", label: "Melhor custo-benefício" },
  { value: "price_asc", label: "Menor preço" },
  { value: "duration_asc", label: "Menor duração" },
  { value: "departure_asc", label: "Saída mais cedo" },
];

export function FlightSortBar({ value, onChange, count }: FlightSortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span> voos encontrados
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
              value === opt.value
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
