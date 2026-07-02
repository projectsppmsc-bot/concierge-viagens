import type { Metadata } from "next";
import { MessageSquare, Zap, Award, Bell, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWindow } from "@/components/concierge/ChatWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPromotions } from "@/mock/promotions";
import { mockAlerts } from "@/mock/alerts";
import { formatCurrency } from "@/utils/price-formatter";

export const metadata: Metadata = { title: "Concierge IA" };

const capabilities = [
  { icon: MessageSquare, label: "Busca conversacional", desc: "Descreva sua viagem em linguagem natural" },
  { icon: Award, label: "Análise de milhas", desc: "Descubra se vale pagar ou usar pontos" },
  { icon: Zap, label: "Alertas inteligentes", desc: "Configure monitoramento de preços" },
  { icon: Clock, label: "Histórico de buscas", desc: "Retome pesquisas anteriores" },
];

export default function ConciergePage() {
  const featuredPromos = mockPromotions.filter((p) => p.featured).slice(0, 2);
  const activeAlerts = mockAlerts.filter((a) => a.status === "active" || a.status === "triggered");

  return (
    <AppShell title="Concierge IA">
      <div className="flex flex-col lg:flex-row gap-5 h-full">

        {/* Chat — main column */}
        <div className="flex-1 min-w-0" style={{ minHeight: "calc(100vh - 10rem)" }}>
          <ChatWindow />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-72 space-y-4 shrink-0">

          {/* Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                O que posso fazer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {capabilities.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active promos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-500" />
                Promoções ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {featuredPromos.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-foreground truncate">{p.title}</p>
                    {p.discountPercent && (
                      <Badge variant="success" className="text-[10px] shrink-0">-{p.discountPercent}%</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{p.originCity} → {p.destinationCity}</p>
                  {p.promoPriceBRL && (
                    <p className="text-sm font-bold text-primary mt-1">{formatCurrency(p.promoPriceBRL)}</p>
                  )}
                  {p.promoMiles && (
                    <p className="text-sm font-bold text-purple-600 mt-1">
                      {p.promoMiles.toLocaleString("pt-BR")} milhas
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alerts summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Seus alertas
                <Badge className="ml-auto text-[10px]">{activeAlerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeAlerts.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${a.status === "triggered" ? "bg-emerald-500" : "bg-blue-400"}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground truncate">{a.originCity} → {a.destinationCity}</p>
                    {a.targetPriceBRL && (
                      <p className="text-[10px] text-muted-foreground">Meta: {formatCurrency(a.targetPriceBRL)}</p>
                    )}
                  </div>
                  <Badge
                    variant={a.status === "triggered" ? "success" : "info"}
                    className="text-[9px] shrink-0"
                  >
                    {a.status === "triggered" ? "Atingido" : "Ativo"}
                  </Badge>
                </div>
              ))}
              <a href="/alertas" className="block text-xs text-primary hover:underline pt-1">
                Ver todos os alertas →
              </a>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppShell>
  );
}
