import Link from "next/link";
import { Bell, ArrowRight, CheckCircle2, PauseCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAlerts } from "@/mock/alerts";
import { formatCurrency } from "@/utils/price-formatter";

const statusConfig = {
  active:    { label: "Ativo",     icon: Bell,          color: "text-blue-500",   badge: "info" as const },
  triggered: { label: "Atingido",  icon: CheckCircle2,  color: "text-emerald-500", badge: "success" as const },
  paused:    { label: "Pausado",   icon: PauseCircle,   color: "text-amber-500",  badge: "warning" as const },
  expired:   { label: "Expirado",  icon: AlertCircle,   color: "text-muted-foreground", badge: "secondary" as const },
};

export function AlertsWidget() {
  const alerts = mockAlerts.slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" />
            Alertas de Preço
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alertas" className="text-xs text-muted-foreground flex items-center gap-1">
              Gerenciar <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => {
          const cfg = statusConfig[alert.status];
          const Icon = cfg.icon;

          return (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
            >
              <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {alert.originCity} → {alert.destinationCity}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {alert.targetPriceBRL
                    ? `Meta: ${formatCurrency(alert.targetPriceBRL)}`
                    : `Meta: ${alert.targetMiles?.toLocaleString("pt-BR")} milhas`}
                  {alert.currentBestPrice && (
                    <span className="ml-2 text-foreground font-medium">
                      · Atual: {formatCurrency(alert.currentBestPrice)}
                    </span>
                  )}
                </p>
              </div>
              <Badge variant={cfg.badge} className="text-[10px] shrink-0">
                {cfg.label}
              </Badge>
            </div>
          );
        })}

        <Button variant="outline" size="sm" className="w-full mt-1 text-xs" asChild>
          <Link href="/alertas">
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            Criar novo alerta
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
