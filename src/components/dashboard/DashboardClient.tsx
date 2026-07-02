"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, TrendingDown, Bell, Plane, MessageSquare,
  RefreshCw, Clock, ArrowRight, Zap, Award,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { MilesMarket } from "@/components/dashboard/MilesMarket";
import { AlertsWidget } from "@/components/dashboard/AlertsWidget";
import { formatCurrency } from "@/utils/price-formatter";
import { useSearchContext } from "@/context/SearchContext";

interface RoutePrice {
  origin: string;
  destination: string;
  label: string;
  flag: string;
  price: number | null;
}

interface SearchRecord {
  origin: string;
  destination: string;
  date: string;
  price?: number;
  ts: number;
}

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 min

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)} dias`;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia! 👋";
  if (h < 18) return "Boa tarde! 👋";
  return "Boa noite! 👋";
}

export function DashboardClient() {
  const { results, query } = useSearchContext();

  const [routes, setRoutes] = useState<RoutePrice[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searches, setSearches] = useState<SearchRecord[]>([]);

  // Salva histórico de buscas no localStorage
  useEffect(() => {
    if (!query) return;
    const record: SearchRecord = {
      origin: query.originCity || query.origin,
      destination: query.destinationCity || query.destination,
      date: query.departureDate || "",
      price: results[0]?.priceTotal,
      ts: Date.now(),
    };
    const stored = JSON.parse(localStorage.getItem("cv_searches") ?? "[]") as SearchRecord[];
    const deduped = stored.filter(
      (s) => !(s.origin === record.origin && s.destination === record.destination),
    );
    const next = [record, ...deduped].slice(0, 10);
    localStorage.setItem("cv_searches", JSON.stringify(next));
    setSearches(next);
  }, [query, results]);

  // Carrega histórico do localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cv_searches") ?? "[]") as SearchRecord[];
    setSearches(stored);
  }, []);

  const fetchPrices = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard/prices");
      if (res.ok) {
        const data = await res.json() as { routes: RoutePrice[]; updatedAt: string };
        setRoutes(data.routes);
        setUpdatedAt(data.updatedAt);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchPrices();
    const interval = setInterval(() => void fetchPrices(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const bestRoute = routes.reduce<RoutePrice | null>(
    (best, r) => (!best || (r.price && (!best.price || r.price < best.price)) ? r : best),
    null,
  );

  const avgPrice = routes.filter((r) => r.price).reduce((s, r) => s + (r.price ?? 0), 0)
    / (routes.filter((r) => r.price).length || 1);

  return (
    <AppShell title="Dashboard">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{greeting()}</h2>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            {updatedAt ? (
              <>
                <Clock className="w-3.5 h-3.5" />
                Preços atualizados {timeAgo(updatedAt)}
              </>
            ) : "Buscando preços reais..."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="ghost" onClick={() => fetchPrices(true)} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button size="sm" asChild>
            <Link href="/busca" className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Nova busca
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/concierge" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Concierge IA
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Buscas realizadas</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{searches.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">salvas neste navegador</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Melhor oferta</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : bestRoute?.price ? (
            <>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(bestRoute.price)}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{bestRoute.label}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rotas monitoradas</p>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Plane className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{routes.filter((r) => r.price).length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">destinos populares</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preço médio</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : avgPrice > 0 ? (
            <>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(Math.round(avgPrice))}</p>
              <p className="text-xs text-muted-foreground mt-0.5">média das rotas populares</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Melhores ofertas em tempo real */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-foreground">Melhores preços agora</h3>
                {!loading && updatedAt && (
                  <span className="text-xs text-muted-foreground">· {timeAgo(updatedAt)}</span>
                )}
              </div>
              <Link href="/busca" className="text-xs text-primary hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 animate-pulse">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {routes.filter((r) => r.price).map((route, i) => (
                  <Link
                    key={route.destination}
                    href={`/busca`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{route.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {route.label}
                        </p>
                        <p className="text-xs text-muted-foreground">a partir de</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-emerald-600">{formatCurrency(route.price!)}</p>
                      {i === 0 && (
                        <span className="text-xs text-amber-600 font-medium">Mais barato</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Histórico de buscas */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-foreground">Suas buscas recentes</h3>
              </div>
              {searches.length > 0 && (
                <button
                  onClick={() => { localStorage.removeItem("cv_searches"); setSearches([]); }}
                  className="text-xs text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>

            {searches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Search className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Nenhuma busca ainda</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/busca">Fazer minha primeira busca</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {searches.slice(0, 6).map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Plane className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {s.origin} → {s.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(new Date(s.ts).toISOString())}
                          {s.date ? ` · ${s.date}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.price && (
                        <span className="text-sm font-semibold text-foreground">{formatCurrency(s.price)}</span>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <Link href="/busca">
                          <Search className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Destinos em alta */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-foreground">Destinos em alta</h3>
              </div>
              <Link href="/busca" className="text-xs text-primary hover:underline">Buscar →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-muted" />
                    <div className="flex-1 h-4 bg-muted rounded" />
                    <div className="w-16 h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {routes.filter((r) => r.price).slice(0, 5).map((r, i) => (
                  <div key={r.destination} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {r.flag} {r.label.split("→")[1].trim()}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium">{formatCurrency(r.price!)}</p>
                    </div>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <MilesMarket />
          <AlertsWidget />
        </div>
      </div>
    </AppShell>
  );
}
