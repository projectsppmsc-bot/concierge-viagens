import { Award, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MILES_PROGRAM_COLORS, RATING_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/utils/price-formatter";
import { cn } from "@/lib/utils";
import type { MilesQuote } from "@/types/miles";

interface MilesProgramCardProps {
  quote: MilesQuote;
  cashPrice: number;
  isBest?: boolean;
}

const ratingIcon = {
  excellent: TrendingUp,
  good: Minus,
  poor: TrendingDown,
};

const ratingColor = {
  excellent: "text-emerald-600",
  good: "text-amber-600",
  poor: "text-rose-600",
};

const ratingBadge = {
  excellent: "success" as const,
  good: "warning" as const,
  poor: "destructive" as const,
};

export function MilesProgramCard({ quote, cashPrice, isBest }: MilesProgramCardProps) {
  const color = MILES_PROGRAM_COLORS[quote.programId];
  const RatingIcon = ratingIcon[quote.rating];
  const savings = cashPrice - quote.equivalentCashPrice - quote.taxes;

  return (
    <Card className={cn(
      "transition-all hover:shadow-card-hover",
      isBest && "ring-2 ring-emerald-400 border-emerald-200"
    )}>
      {isBest && (
        <div className="bg-emerald-500 text-white text-[10px] font-bold text-center py-1 rounded-t-lg uppercase tracking-wider">
          ★ Melhor opção
        </div>
      )}
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: color + "20" }}
          >
            <Award className="w-5 h-5" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{quote.programName}</p>
            <Badge variant={ratingBadge[quote.rating]} className="text-[10px] mt-0.5">
              {RATING_LABELS[quote.rating]}
            </Badge>
          </div>
          <div className={cn("flex items-center gap-1", ratingColor[quote.rating])}>
            <RatingIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Milhas necessárias</span>
            <span className="text-sm font-bold text-foreground">
              {quote.milesRequired.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Taxas e tarifas</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(quote.taxes)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Valor da milha</span>
            <span className="text-sm font-semibold text-foreground">
              R$ {quote.estimatedMileValue.toFixed(3)}
            </span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Preço equivalente</span>
            <span className="text-base font-bold" style={{ color }}>
              {formatCurrency(quote.equivalentCashPrice + quote.taxes)}
            </span>
          </div>
        </div>

        {/* Value bar */}
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Eficiência do resgate</span>
            <span className="text-[10px] font-medium" style={{ color }}>
              {Math.round((quote.estimatedMileValue / 0.035) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((quote.estimatedMileValue / 0.035) * 100))}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>

        {/* Savings / recommendation */}
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{quote.recommendation}</p>

        {savings > 0 && (
          <div className="mt-2 bg-emerald-50 rounded-lg px-3 py-2 text-xs text-emerald-700 font-medium">
            Economia de {formatCurrency(savings)} vs preço em dinheiro
          </div>
        )}
      </CardContent>
    </Card>
  );
}
