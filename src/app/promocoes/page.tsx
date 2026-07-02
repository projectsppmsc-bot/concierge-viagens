"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, Zap, DollarSign, Globe, RefreshCw, Clock, Plane, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/price-formatter";
import { useSearchContext } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LivePromo {
  id: string;
  origin: string; destination: string;
  originCity: string; destinationCity: string;
  flag: string; type: string; tags: string[];
  price: number; airline: string; airlineCode: string;
  direct: boolean; departure_at: string;
}

type Filter = "all" | "domestic" | "international";

const filters: { value: Filter; label: string; icon: React.ElementType }[] = [
  { value: "all",           label: "Todas",          icon: Tag },
  { value: "domestic",      label: "Domésticos",      icon: DollarSign },
  { value: "international", label: "Internacionais",  icon: Globe },
];

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  return `há ${Math.floor(diff / 3600)}h`;
}

function departureSoon(departure_at: string): boolean {
  const d = new Date(departure_at);
  const diff = d.getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 3600000; // próximos 30 dias
}

export default function PromocoesPage() {
  const [promos, setPromos] = useState<LivePromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { search } = useSearchContext();
  const router = useRouter();

  const fetchPromos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const res = await fetch("/api/promotions");
      if (res.ok) {
        const data = await res.json() as { promotions: LivePromo[]; updatedAt: string };
        setPromos(data.promotions);
        setUpdatedAt(data.updatedAt);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void fetchPromos(); }, [fetchPromos]);

  const displayed = filter === "all" ? promos : promos.filter((p) => p.type === filter);
  const cheapest = displayed.length ? Math.min(...displayed.map((p) => p.price)) : 0;

  async function handleSearch(p: LivePromo) {
    await search({
      tripType: "oneway",
      origin: p.origin, originCity: p.originCity,
      destination: p.destination, destinationCity: p.destinationCity,
      departureDate: "", returnDate: undefined,
      passengers: { adults: 1, children: 0, infants: 0 },
      cabin: "economy", flexibleDates: true, includeMiles: true,
    });
    router.push("/resultados");
  }

  return (
    <AppShell title="Promoções">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-foreground">Promoções ao vivo</h2>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            {loading ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Buscando melhores preços...</>
            ) : updatedAt ? (
              <><Clock className="w-3.5 h-3.5" /> Atualizado {timeAgo(updatedAt)} · {promos.length} rotas</>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => fetchPromos(true)} disabled={refreshing || loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {filters.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setFilter(value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filter === value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-muted rounded w-1/3 mb-3" />
              <div className="h-9 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Promo grid */}
      {!loading && displayed.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((p) => {
            const isCheapest = p.price === cheapest;
            const soon = departureSoon(p.departure_at);

            return (
              <div key={p.id}
                className={cn(
                  "bg-white rounded-xl border p-5 flex flex-col gap-4 hover:shadow-card-hover transition-all",
                  isCheapest ? "border-emerald-300 ring-1 ring-emerald-200" : "border-border",
                )}>
                {/* Top */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg shrink-0">
                      {p.flag}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {p.originCity} → {p.destinationCity}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.airline}</p>
                    </div>
                  </div>
                  {isCheapest && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                      Mais barato
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {p.direct && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Direto</span>
                  )}
                  {soon && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Saída em breve</span>
                  )}
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Price */}
                <div>
                  <p className="text-xs text-muted-foreground">a partir de</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(p.price)}</p>
                  <p className="text-xs text-muted-foreground">por pessoa · ida</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleSearch(p)}>
                    <Plane className="w-3.5 h-3.5" /> Ver voos
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://www.aviasales.com/search/${p.origin}${new Date().toLocaleDateString("en-CA", { month: "2-digit", day: "2-digit" }).replace("-", "")}${p.destination}1`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-border gap-3">
          <Tag className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhuma promoção encontrada no momento</p>
          <Button variant="outline" size="sm" onClick={() => fetchPromos()}>Tentar novamente</Button>
        </div>
      )}
    </AppShell>
  );
}
