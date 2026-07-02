"use client";

import Link from "next/link";
import { Trash2, ArrowRight, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/price-formatter";
import { formatRelativeDate, formatDate } from "@/utils/date-helpers";
import { CABIN_LABELS, MILES_PROGRAM_LABELS } from "@/lib/constants";
import type { SearchHistory } from "@/types/history";

interface HistoryRowProps {
  entry: SearchHistory;
  onRemove: (id: string) => void;
}

const statusConfig = {
  completed: { label: "Concluída", variant: "success" as const },
  pending:   { label: "Pendente",  variant: "warning" as const },
  no_results:{ label: "Sem resultados", variant: "secondary" as const },
};

export function HistoryRow({ entry, onRemove }: HistoryRowProps) {
  const cfg = statusConfig[entry.status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-xl border border-border p-4 hover:shadow-card-hover transition-all group">
      {/* Route */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-foreground">{entry.originCity}</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm font-bold text-foreground">{entry.destinationCity}</span>
            <Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(entry.departureDate)}
              {entry.returnDate && ` → ${formatDate(entry.returnDate)}`}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {entry.passengersCount} passageiro{entry.passengersCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-muted-foreground">{CABIN_LABELS[entry.cabin]}</span>
          </div>
        </div>
      </div>

      {/* Best results */}
      <div className="flex items-center gap-4 shrink-0">
        {entry.bestPriceBRL && (
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Melhor preço</p>
            <p className="text-base font-bold text-primary">{formatCurrency(entry.bestPriceBRL)}</p>
          </div>
        )}
        {entry.bestMilesProgram && entry.bestMilesAmount && (
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Melhor milhas</p>
            <p className="text-xs font-semibold text-purple-600">
              {entry.bestMilesAmount.toLocaleString("pt-BR")} mi
            </p>
            <p className="text-[10px] text-muted-foreground">{MILES_PROGRAM_LABELS[entry.bestMilesProgram]}</p>
          </div>
        )}

        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">{formatRelativeDate(entry.searchedAt)}</p>
          <p className="text-xs text-muted-foreground">{entry.resultsCount} voos</p>
        </div>

        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="text-xs h-8" asChild>
            <Link href="/busca">Repetir</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(entry.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
