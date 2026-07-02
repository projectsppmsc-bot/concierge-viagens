import type { Metadata } from "next";
import { Plane, MapPin, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SearchForm } from "@/components/busca/SearchForm";
import { popularDestinations } from "@/data/destinations";
import { formatCurrency } from "@/utils/price-formatter";

export const metadata: Metadata = { title: "Buscar Voos" };

export default function BuscaPage() {
  const top = popularDestinations.slice(0, 6);

  return (
    <AppShell title="Buscar Voos">
      {/* Hero */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 mb-4">
            <Plane className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Para onde você vai?</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Compare preços em dinheiro e milhas de 5 companhias aéreas
          </p>
        </div>

        <SearchForm />
      </div>

      {/* Destinos populares */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-semibold text-foreground">Destinos populares</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {top.map((dest) => (
            <a
              key={dest.iata}
              href="/resultados"
              className="group bg-white rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-card-hover transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-xs font-bold mx-auto mb-2">
                {dest.iata}
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{dest.city}</p>
              <p className="text-xs text-muted-foreground">{dest.country}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3 text-emerald-500" />
                <p className="text-xs font-semibold text-emerald-600">{formatCurrency(dest.avgPriceBRL)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
