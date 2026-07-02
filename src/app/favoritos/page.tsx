"use client";

import { Heart, Search, MapPin } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { FavoriteRouteCard } from "@/components/favoritos/FavoriteRouteCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritosPage() {
  const { routes, removeRoute, totalFavorites } = useFavorites();

  return (
    <AppShell title="Favoritos">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold text-foreground">Favoritos</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalFavorites} rota{totalFavorites !== 1 ? "s" : ""} salva{totalFavorites !== 1 ? "s" : ""} para acompanhamento.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/busca" className="gap-2 flex items-center">
            <Search className="w-4 h-4" />
            Buscar nova rota
          </Link>
        </Button>
      </div>

      {routes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-border gap-3">
          <Heart className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-foreground">Nenhuma rota favorita</p>
          <p className="text-xs text-muted-foreground">Salve rotas para acompanhar os preços ao longo do tempo</p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/busca">Começar a buscar</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-foreground">Rotas salvas</h3>
            <span className="text-xs text-muted-foreground">({routes.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <FavoriteRouteCard key={route.id} route={route} onRemove={removeRoute} />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
