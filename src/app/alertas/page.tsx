"use client";

import { Bell, CheckCircle2, PauseCircle, Activity, RefreshCw, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AlertCard } from "@/components/alertas/AlertCard";
import { AlertForm } from "@/components/alertas/AlertForm";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/useAlerts";

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  return `há ${Math.floor(diff / 3600)}h`;
}

export default function AlertasPage() {
  const { alerts, checking, lastChecked, addAlert, updateStatus, removeAlert, refresh } = useAlerts();

  const active    = alerts.filter((a) => a.status === "active").length;
  const triggered = alerts.filter((a) => a.status === "triggered").length;
  const paused    = alerts.filter((a) => a.status === "paused").length;

  return (
    <AppShell title="Alertas de Preço">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-foreground">Alertas de Preço</h2>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            {checking ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verificando preços reais...</>
            ) : lastChecked ? (
              <><Clock className="w-3.5 h-3.5" /> Preços verificados {timeAgo(lastChecked)}</>
            ) : (
              "Monitore rotas e seja notificado quando o preço atingir sua meta."
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => void refresh()} disabled={checking}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${checking ? "animate-spin" : ""}`} />
            Verificar agora
          </Button>
          <AlertForm onAdd={addAlert} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatsCard title="Ativos"    value={String(active)}    icon={Activity}      color="blue"  subtitle="monitorando" />
        <StatsCard title="Atingidos" value={String(triggered)} icon={CheckCircle2}  color="green" subtitle="meta alcançada" />
        <StatsCard title="Pausados"  value={String(paused)}    icon={PauseCircle}   color="amber" subtitle="em pausa" />
      </div>

      {/* Alert cards */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-border gap-3">
          <Bell className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-foreground">Nenhum alerta configurado</p>
          <p className="text-xs text-muted-foreground">Crie um alerta para monitorar preços automaticamente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onPause={(id) => updateStatus(id, "paused")}
              onResume={(id) => updateStatus(id, "active")}
              onDelete={removeAlert}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
