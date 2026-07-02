import Link from "next/link";
import { MapPin, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { popularDestinations } from "@/data/destinations";
import { formatCurrency } from "@/utils/price-formatter";

export function TopDestinations() {
  const top = popularDestinations.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            Destinos em Alta
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/busca" className="text-xs text-muted-foreground flex items-center gap-1">
              Buscar <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {top.map((dest, i) => (
          <Link
            key={dest.iata}
            href="/busca"
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
          >
            <span className="text-sm font-bold text-muted-foreground w-5 shrink-0 text-center">{i + 1}</span>

            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 text-white text-xs font-bold shrink-0">
              {dest.iata}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {dest.city}
                <span className="text-muted-foreground font-normal ml-1 text-xs">{dest.country}</span>
              </p>
              <p className="text-xs text-muted-foreground truncate">{dest.highlight}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-foreground">{formatCurrency(dest.avgPriceBRL)}</p>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 font-medium">Em alta</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Tags de categorias */}
        <div className="pt-3 flex flex-wrap gap-1.5">
          {["Europa", "EUA", "América do Sul", "Praia", "Luxo"].map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
