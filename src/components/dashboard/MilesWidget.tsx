import Link from "next/link";
import { Award, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MILES_PROGRAM_COLORS, MILES_PROGRAM_LABELS } from "@/lib/constants";
import { getMileValue } from "@/utils/miles-calculator";
import type { MilesProgramId } from "@/types/miles";

const programs: MilesProgramId[] = ["latam_pass", "smiles", "azul_fidelidade", "livelo", "esfera"];

export function MilesWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            Valor das Milhas
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/milhas" className="text-xs text-muted-foreground flex items-center gap-1">
              Comparar <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {programs.map((id) => {
          const value = getMileValue(id);
          const pct = Math.round((value / 0.035) * 100);

          return (
            <div key={id} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: MILES_PROGRAM_COLORS[id] }}
              />
              <span className="text-xs text-foreground font-medium w-28 shrink-0 truncate">
                {MILES_PROGRAM_LABELS[id]}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: MILES_PROGRAM_COLORS[id] }}
                />
              </div>
              <span className="text-xs font-semibold text-foreground w-14 text-right shrink-0">
                R$ {value.toFixed(3)}
              </span>
            </div>
          );
        })}

        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Valor estimado por milha no mercado atual</span>
        </div>
      </CardContent>
    </Card>
  );
}
