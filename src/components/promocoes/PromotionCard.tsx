import Link from "next/link";
import { Plane, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDiscount } from "@/utils/price-formatter";
import { MILES_PROGRAM_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/types/promotion";

interface PromotionCardProps {
  promo: Promotion;
}

export function PromotionCard({ promo }: PromotionCardProps) {
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(promo.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className={cn(
      "bg-white rounded-2xl border overflow-hidden hover:shadow-card-hover transition-all",
      promo.featured ? "border-amber-200 ring-1 ring-amber-100" : "border-border"
    )}>
      {promo.featured && (
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest">
          ★ Destaque
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-foreground leading-snug">{promo.title}</p>
              {promo.discountPercent && (
                <Badge variant="success" className="text-[10px] shrink-0">
                  {promo.type === "cash" && promo.originalPriceBRL && promo.promoPriceBRL
                    ? formatDiscount(promo.originalPriceBRL, promo.promoPriceBRL)
                    : `-${promo.discountPercent}%`}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {promo.originCity} → {promo.destinationCity} · {promo.airline}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {promo.type === "cash" && promo.promoPriceBRL && (
            <div className="flex items-baseline gap-2 flex-wrap">
              {promo.originalPriceBRL && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(promo.originalPriceBRL)}
                </span>
              )}
              <span className="text-2xl font-bold text-primary">{formatCurrency(promo.promoPriceBRL)}</span>
              <span className="text-xs text-muted-foreground">por pessoa</span>
            </div>
          )}
          {promo.type === "miles" && promo.promoMiles && (
            <div className="flex items-baseline gap-2 flex-wrap">
              {promo.originalMiles && (
                <span className="text-sm text-muted-foreground line-through">
                  {promo.originalMiles.toLocaleString("pt-BR")} mi
                </span>
              )}
              <span className="text-2xl font-bold text-purple-600">
                {promo.promoMiles.toLocaleString("pt-BR")} mi
              </span>
              {promo.milesProgram && (
                <span className="text-xs text-muted-foreground">{MILES_PROGRAM_LABELS[promo.milesProgram]}</span>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {promo.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
          ))}
          <Badge variant="outline" className="text-[10px]">
            {promo.type === "cash" ? "Dinheiro" : promo.type === "miles" ? "Milhas" : "Híbrido"}
          </Badge>
        </div>

        {/* Expiry + action */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {daysLeft === 0 ? "Expira hoje!" : `${daysLeft} dia${daysLeft !== 1 ? "s" : ""} restante${daysLeft !== 1 ? "s" : ""}`}
          </div>
          <Button size="sm" className="gap-1.5 text-xs h-8" asChild>
            <Link href="/busca">
              <Tag className="w-3.5 h-3.5" />
              Aproveitar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
