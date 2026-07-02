"use client";

import { useState, useEffect } from "react";
import { Clock, Search, TrendingDown, Trash2, Plane, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/utils/price-formatter";
import { useSearchContext } from "@/context/SearchContext";
import { useRouter } from "next/navigation";

interface SearchRecord {
  origin: string;
  destination: string;
  originCode?: string;
  destinationCode?: string;
  date: string;
  returnDate?: string;
  price?: number;
  passengers?: number;
  cabin?: string;
  ts: number;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "Agora mesmo";
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7) return `Há ${Math.floor(diff / 86400)} dias`;
  return new Date(ts).toLocaleDateString("pt-BR");
}

function cabinLabel(cabin?: string): string {
  const map: Record<string, string> = {
    economy: "Econômica", premium_economy: "Premium Eco",
    business: "Executiva", first: "Primeira Classe",
  };
  return map[cabin ?? ""] ?? "Econômica";
}

export default function HistoricoPage() {
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const { search } = useSearchContext();
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cv_searches") ?? "[]") as SearchRecord[];
    setSearches(stored);
  }, []);

  function clearAll() {
    localStorage.removeItem("cv_searches");
    setSearches([]);
  }

  function removeOne(ts: number) {
    const next = searches.filter((s) => s.ts !== ts);
    localStorage.setItem("cv_searches", JSON.stringify(next));
    setSearches(next);
  }

  async function repeatSearch(s: SearchRecord) {
    await search({
      tripType: "oneway",
      origin: s.originCode ?? s.origin.slice(0, 3).toUpperCase(),
      originCity: s.origin,
      destination: s.destinationCode ?? s.destination.slice(0, 3).toUpperCase(),
      destinationCity: s.destination,
      departureDate: s.date,
      returnDate: s.returnDate,
      passengers: { adults: s.passengers ?? 1, children: 0, infants: 0 },
      cabin: (s.cabin as "economy") ?? "economy",
      flexibleDates: false,
      includeMiles: true,
    });
    router.push("/resultados");
  }

  const bestPrice = searches.filter((s) => s.price).reduce(
    (min, s) => Math.min(min, s.price!), Infinity,
  );
  const bestSearch = searches.find((s) => s.price === bestPrice);

  return (
    <AppShell title="Histórico de Pesquisas">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl font-bold text-foreground">Histórico de Pesquisas</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {searches.length > 0
              ? `${searches.length} busca${searches.length !== 1 ? "s" : ""} realizadas neste navegador`
              : "Suas buscas aparecerão aqui automaticamente"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {searches.length > 0 && (
            <Button size="sm" variant="ghost" onClick={clearAll} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
              <Trash2 className="w-4 h-4 mr-1.5" /> Limpar tudo
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href="/busca" className="gap-2 flex items-center">
              <Search className="w-4 h-4" /> Nova pesquisa
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {searches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total de pesquisas</p>
            <p className="text-2xl font-bold text-foreground">{searches.length}</p>
            <p className="text-xs text-muted-foreground">neste navegador</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Com resultados</p>
            <p className="text-2xl font-bold text-foreground">{searches.filter((s) => s.price).length}</p>
            <p className="text-xs text-muted-foreground">encontraram voos</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Menor preço visto</p>
            <p className="text-2xl font-bold text-emerald-600">
              {isFinite(bestPrice) ? formatCurrency(bestPrice) : "—"}
            </p>
            {bestSearch && (
              <p className="text-xs text-muted-foreground truncate">
                {bestSearch.origin} → {bestSearch.destination}
              </p>
            )}
          </div>
        </div>
      )}

      {/* List */}
      {searches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border gap-4">
          <Clock className="w-12 h-12 text-muted-foreground/20" />
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">Nenhuma pesquisa ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Faça sua primeira busca e ela aparecerá aqui automaticamente
            </p>
          </div>
          <Button asChild><Link href="/busca">Buscar voos agora</Link></Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-0 divide-y divide-border">
            {/* Header */}
            <div className="col-span-3 grid grid-cols-[1fr_auto_auto] px-5 py-3 bg-muted/40">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rota</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right pr-8">Preço</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28 text-center">Ação</p>
            </div>

            {searches.map((s) => (
              <div key={s.ts} className="col-span-3 grid grid-cols-[1fr_auto_auto] items-center px-5 py-4 hover:bg-muted/20 transition-colors">
                {/* Route info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Plane className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-foreground truncate">{s.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-semibold text-foreground truncate">{s.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{timeAgo(s.ts)}</span>
                      {s.date && <span className="text-xs text-muted-foreground">· {s.date}</span>}
                      {s.passengers && s.passengers > 1 && (
                        <span className="text-xs text-muted-foreground">· {s.passengers} pax</span>
                      )}
                      {s.cabin && s.cabin !== "economy" && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                          {cabinLabel(s.cabin)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right pr-6">
                  {s.price ? (
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm font-bold text-foreground">{formatCurrency(s.price)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">sem resultado</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 w-28 justify-center">
                  <Button size="sm" variant="outline" onClick={() => repeatSearch(s)} className="text-xs h-8 px-3">
                    Repetir
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeOne(s.ts)} className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
