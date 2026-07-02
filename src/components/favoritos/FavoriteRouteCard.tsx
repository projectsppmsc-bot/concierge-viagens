"use client";

import Link from "next/link";
import { Heart, ArrowRight, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/price-formatter";
import { formatRelativeDate } from "@/utils/date-helpers";
import type { FavoriteRoute } from "@/types/favorite";

interface FavoriteRouteCardProps {
  route: FavoriteRoute;
  onRemove: (id: string) => void;
}

export function FavoriteRouteCard({ route, onRemove }: FavoriteRouteCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 hover:shadow-card-hover transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">{route.originCity}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground">{route.destinationCity}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Salvo {formatRelativeDate(route.savedAt)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(route.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {route.notes && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mb-3 italic">
          &ldquo;{route.notes}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between">
        {route.lastPrice ? (
          <div>
            <p className="text-[10px] text-muted-foreground">Último preço visto</p>
            <p className="text-base font-bold text-primary">{formatCurrency(route.lastPrice)}</p>
          </div>
        ) : <div />}
        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" asChild>
          <Link href="/busca">
            <Search className="w-3.5 h-3.5" />
            Buscar agora
          </Link>
        </Button>
      </div>
    </div>
  );
}
