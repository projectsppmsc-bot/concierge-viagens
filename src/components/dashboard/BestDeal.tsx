import Link from "next/link";
import { Zap, ArrowRight, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPromotions } from "@/mock/promotions";
import { formatCurrency, formatDiscount } from "@/utils/price-formatter";

export function BestDeal() {
  const featured = mockPromotions.filter((p) => p.featured).slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Melhores Promoções
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/promocoes" className="text-xs text-muted-foreground flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {featured.map((promo) => (
          <div
            key={promo.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-blue-50/30 transition-all group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shrink-0">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground truncate">{promo.title}</p>
                {promo.discountPercent && (
                  <Badge variant="success" className="text-[10px] shrink-0">
                    {formatDiscount(promo.originalPriceBRL ?? 0, promo.promoPriceBRL ?? 0)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {promo.originCity} → {promo.destinationCity} · {promo.airline}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {promo.tags.map((t) => (
                  <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              {promo.type === "cash" && promo.promoPriceBRL && (
                <>
                  {promo.originalPriceBRL && (
                    <p className="text-xs text-muted-foreground line-through">{formatCurrency(promo.originalPriceBRL)}</p>
                  )}
                  <p className="text-base font-bold text-primary">{formatCurrency(promo.promoPriceBRL)}</p>
                </>
              )}
              {promo.type === "miles" && promo.promoMiles && (
                <>
                  {promo.originalMiles && (
                    <p className="text-xs text-muted-foreground line-through">{promo.originalMiles.toLocaleString("pt-BR")} mi</p>
                  )}
                  <p className="text-base font-bold text-purple-600">{promo.promoMiles.toLocaleString("pt-BR")} mi</p>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
