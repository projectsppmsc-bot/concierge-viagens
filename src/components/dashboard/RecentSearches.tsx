import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockHistory } from "@/mock/history";
import { formatCurrency } from "@/utils/price-formatter";
import { formatRelativeDate } from "@/utils/date-helpers";
import { MILES_PROGRAM_LABELS } from "@/lib/constants";

export function RecentSearches() {
  const recent = mockHistory.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Últimas Pesquisas</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/historico" className="text-xs text-muted-foreground flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recent.map((h) => (
          <Link
            key={h.id}
            href="/busca"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 shrink-0">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {h.originCity} → {h.destinationCity}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{formatRelativeDate(h.searchedAt)}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{h.passengersCount}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              {h.bestPriceBRL && (
                <p className="text-sm font-semibold text-foreground">{formatCurrency(h.bestPriceBRL)}</p>
              )}
              {h.bestMilesProgram && (
                <Badge variant="info" className="text-[10px] mt-0.5">
                  {MILES_PROGRAM_LABELS[h.bestMilesProgram]}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
