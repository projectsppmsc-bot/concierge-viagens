"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MilesProgramCard } from "./MilesProgramCard";
import { MilesRecommendation } from "./MilesRecommendation";
import { getMockMilesQuotes } from "@/mock/miles-programs";
import { generateRecommendation } from "@/utils/recommendation-engine";
import { bestMilesOption } from "@/utils/miles-calculator";
import { mockFlights } from "@/mock/flights";
import { formatCurrency } from "@/utils/price-formatter";
import type { MilesQuote } from "@/types/miles";

export function MilesComparator() {
  const [cashPrice, setCashPrice] = useState(3490);
  const [routeKey, setRouteKey] = useState("international");
  const [quotes, setQuotes] = useState<MilesQuote[]>([]);
  const [hasCompared, setHasCompared] = useState(false);

  const routeMultipliers: Record<string, number> = {
    domestic_short: 0.25,
    domestic_long: 0.45,
    south_america: 0.55,
    usa: 1.0,
    europe: 1.3,
    international: 1.0,
    asia: 1.8,
  };

  function handleCompare() {
    const multiplier = routeMultipliers[routeKey] ?? 1;
    const result = getMockMilesQuotes(cashPrice, multiplier);
    setQuotes(result);
    setHasCompared(true);
  }

  const recommendation = hasCompared && quotes.length > 0
    ? generateRecommendation(mockFlights[0], quotes)
    : null;

  const best = hasCompared ? bestMilesOption(quotes) : null;

  const popularPrices = [
    { label: "GRU → BSB (R$ 410)", value: 410 },
    { label: "GRU → SSA (R$ 620)", value: 620 },
    { label: "GRU → EZE (R$ 1.150)", value: 1150 },
    { label: "GRU → MIA (R$ 2.950)", value: 2950 },
    { label: "GRU → LIS (R$ 3.490)", value: 3490 },
    { label: "GRU → CDG (R$ 4.200)", value: 4200 },
  ];

  return (
    <div className="space-y-6">
      {/* Search panel */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Compare programas de milhas para qualquer rota
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Cash price */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Preço em dinheiro (R$)
            </label>
            <Input
              type="number"
              value={cashPrice}
              onChange={(e) => setCashPrice(Number(e.target.value))}
              min={100}
              max={50000}
              step={10}
            />
          </div>

          {/* Route type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Tipo de rota
            </label>
            <Select value={routeKey} onValueChange={setRouteKey}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domestic_short">Doméstico curto (&lt;2h)</SelectItem>
                <SelectItem value="domestic_long">Doméstico longo (2h+)</SelectItem>
                <SelectItem value="south_america">América do Sul</SelectItem>
                <SelectItem value="usa">América do Norte</SelectItem>
                <SelectItem value="europe">Europa</SelectItem>
                <SelectItem value="asia">Ásia / Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCompare} className="gap-2 h-10">
            <Search className="w-4 h-4" />
            Comparar milhas
          </Button>
        </div>

        {/* Quick picks */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Rápido:</span>
          {popularPrices.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => { setCashPrice(p.value); }}
              className="text-xs px-2.5 py-1 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasCompared && (
        <>
          {/* Recommendation */}
          {recommendation && (
            <MilesRecommendation result={recommendation} cashPrice={cashPrice} />
          )}

          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Preço em dinheiro:
              <span className="font-bold text-foreground ml-1">{formatCurrency(cashPrice)}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            {best && (
              <span className="text-sm text-muted-foreground">
                Melhor resgate:
                <span className="font-bold text-emerald-600 ml-1">{best.programName}</span>
                <span className="ml-1 text-muted-foreground">
                  ({best.milesRequired.toLocaleString("pt-BR")} mi + {formatCurrency(best.taxes)})
                </span>
              </span>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((q) => (
              <MilesProgramCard
                key={q.programId}
                quote={q}
                cashPrice={cashPrice}
                isBest={best?.programId === q.programId}
              />
            ))}
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground">Tabela comparativa</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Programa</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Milhas</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Taxas</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">R$/milha</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Equivalente</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Avaliação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {quotes.map((q) => (
                    <tr key={q.programId} className={best?.programId === q.programId ? "bg-emerald-50/60" : "hover:bg-muted/30"}>
                      <td className="px-4 py-3 font-medium text-foreground">{q.programName}</td>
                      <td className="px-4 py-3 text-right">{q.milesRequired.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(q.taxes)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs">R$ {q.estimatedMileValue.toFixed(3)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(q.equivalentCashPrice + q.taxes)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          q.rating === "excellent" ? "bg-emerald-100 text-emerald-700" :
                          q.rating === "good" ? "bg-amber-100 text-amber-700" :
                          "bg-rose-100 text-rose-700"
                        }`}>
                          {q.ratingLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!hasCompared && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Search className="w-7 h-7 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Informe o preço em dinheiro e clique em &quot;Comparar milhas&quot;
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            O comparador calcula o custo em cada programa e indica qual oferece o melhor uso das suas milhas.
          </p>
        </div>
      )}
    </div>
  );
}
