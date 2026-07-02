import { CheckCircle2, DollarSign, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/price-formatter";
import { cn } from "@/lib/utils";
import type { RecommendationResult } from "@/utils/recommendation-engine";

interface MilesRecommendationProps {
  result: RecommendationResult;
  cashPrice: number;
}

const verdictConfig = {
  pay_cash: {
    icon: DollarSign,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Pagar em dinheiro",
  },
  use_miles: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Usar milhas",
  },
  wait_promo: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Aguardar promoção",
  },
  best_value: {
    icon: Zap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "Melhor custo-benefício",
  },
};

export function MilesRecommendation({ result, cashPrice }: MilesRecommendationProps) {
  const cfg = verdictConfig[result.verdict];
  const Icon = cfg.icon;

  return (
    <Card className={cn("border-2", cfg.border)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", cfg.bg)}>
            <Icon className={cn("w-6 h-6", cfg.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Recomendação do Concierge
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                cfg.bg, cfg.color
              )}>
                {cfg.label}
              </span>
            </div>
            <p className="text-base font-bold text-foreground">{result.title}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.explanation}</p>

            {result.savings && result.savings > 0 && (
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <div className="bg-white border border-border rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Preço em dinheiro</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(cashPrice)}</p>
                </div>
                <div className="text-muted-foreground text-sm">vs</div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-emerald-600">Com milhas (economiza)</p>
                  <p className="text-sm font-bold text-emerald-700">{formatCurrency(result.savings)}</p>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Confiança:</span>
              <div className="flex gap-1">
                {["high", "medium", "low"].map((lvl, i) => (
                  <div
                    key={lvl}
                    className={cn(
                      "w-6 h-1.5 rounded-full",
                      i <= (result.confidence === "high" ? 2 : result.confidence === "medium" ? 1 : 0)
                        ? cfg.color.replace("text-", "bg-")
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] capitalize text-muted-foreground">
                {result.confidence === "high" ? "Alta" : result.confidence === "medium" ? "Média" : "Baixa"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
