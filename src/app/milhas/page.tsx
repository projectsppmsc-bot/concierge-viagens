import type { Metadata } from "next";
import { Award, Info } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MilesComparator } from "@/components/milhas/MilesComparator";
import { Card, CardContent } from "@/components/ui/card";
import { MILES_PROGRAM_LABELS, MILES_PROGRAM_COLORS } from "@/lib/constants";
import { getMileValue } from "@/utils/miles-calculator";
import type { MilesProgramId } from "@/types/miles";

export const metadata: Metadata = { title: "Comparar Milhas" };

const programs: MilesProgramId[] = ["latam_pass", "smiles", "azul_fidelidade", "livelo", "esfera"];

export default function MilhasPage() {
  return (
    <AppShell title="Comparador de Milhas">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-foreground">Comparador de Milhas</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Compare os 5 principais programas e descubra se vale mais a pena pagar em dinheiro ou usar milhas.
          </p>
        </div>
      </div>

      {/* Programs reference strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {programs.map((id) => {
          const value = getMileValue(id);
          const color = MILES_PROGRAM_COLORS[id];
          return (
            <div
              key={id}
              className="bg-white rounded-xl border border-border p-3 flex items-center gap-2.5 hover:shadow-card-hover transition-shadow"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
                <Award className="w-4 h-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{MILES_PROGRAM_LABELS[id]}</p>
                <p className="text-[10px] text-muted-foreground">R$ {value.toFixed(3)}/mi</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main comparator */}
      <MilesComparator />

      {/* Info card */}
      <Card className="mt-6 border-blue-100 bg-blue-50/40">
        <CardContent className="p-4 flex gap-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 space-y-1 leading-relaxed">
            <p><strong>Como interpretar:</strong> O valor da milha (R$/milha) indica quanto vale cada ponto no resgate. Acima de R$ 0,025 é considerado excelente.</p>
            <p>Os valores são estimativas baseadas em médias de mercado. Taxas e disponibilidade variam por data, rota e programa.</p>
            <p>Dados simulados para fins de demonstração. Integrações reais com APIs dos programas serão adicionadas em versões futuras.</p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
