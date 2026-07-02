"use client";

import { Bell, Pause, Play, Trash2, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertStatusBadge } from "./AlertStatusBadge";
import { formatCurrency } from "@/utils/price-formatter";
import { formatRelativeDate } from "@/utils/date-helpers";
import { MILES_PROGRAM_LABELS } from "@/lib/constants";
import type { PriceAlert } from "@/types/alert";

interface AlertCardProps {
  alert: PriceAlert;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AlertCard({ alert, onPause, onResume, onDelete }: AlertCardProps) {
  const isPaused = alert.status === "paused";
  const isTriggered = alert.status === "triggered";

  const gapPct = alert.targetPriceBRL && alert.currentBestPrice
    ? Math.round(((alert.currentBestPrice - alert.targetPriceBRL) / alert.targetPriceBRL) * 100)
    : null;

  return (
    <div className={`bg-white rounded-xl border p-4 transition-all hover:shadow-card-hover ${
      isTriggered ? "border-emerald-300 ring-1 ring-emerald-100" : "border-border"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isTriggered ? "bg-emerald-50" : "bg-blue-50"
          }`}>
            <Bell className={`w-4 h-4 ${isTriggered ? "text-emerald-500" : "text-blue-500"}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">{alert.originCity}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground">{alert.destinationCity}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Atualizado {formatRelativeDate(alert.lastCheckedAt)}
            </p>
          </div>
        </div>
        <AlertStatusBadge status={alert.status} />
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {alert.targetPriceBRL && (
          <div className="bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Meta em dinheiro</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(alert.targetPriceBRL)}</p>
          </div>
        )}
        {alert.currentBestPrice && (
          <div className={`rounded-lg p-2.5 ${
            isTriggered ? "bg-emerald-50" : "bg-muted/40"
          }`}>
            <p className="text-[10px] text-muted-foreground">Preço atual</p>
            <p className={`text-sm font-bold ${isTriggered ? "text-emerald-600" : "text-foreground"}`}>
              {formatCurrency(alert.currentBestPrice)}
            </p>
          </div>
        )}
        {alert.targetMiles && (
          <div className="bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Meta em milhas</p>
            <p className="text-sm font-bold text-purple-600">
              {alert.targetMiles.toLocaleString("pt-BR")} mi
            </p>
            {alert.targetMilesProgram && (
              <p className="text-[10px] text-muted-foreground">{MILES_PROGRAM_LABELS[alert.targetMilesProgram]}</p>
            )}
          </div>
        )}
        {alert.currentBestMiles && (
          <div className="bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground">Milhas atuais</p>
            <p className="text-sm font-bold text-foreground">
              {alert.currentBestMiles.toLocaleString("pt-BR")} mi
            </p>
          </div>
        )}
      </div>

      {/* Gap indicator */}
      {gapPct !== null && !isTriggered && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
          <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
          <span>Falta {gapPct > 0 ? `${gapPct}% acima` : "abaixo"} da meta</span>
        </div>
      )}

      {isTriggered && (
        <div className="bg-emerald-50 rounded-lg px-3 py-2 mb-3 text-xs text-emerald-700 font-medium flex items-center gap-2">
          <TrendingDown className="w-3.5 h-3.5" />
          Meta atingida! {alert.triggeredAt && `em ${formatRelativeDate(alert.triggeredAt)}`}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        {(alert.status === "active" || alert.status === "triggered") && (
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => onPause(alert.id)}>
            <Pause className="w-3 h-3" /> Pausar
          </Button>
        )}
        {isPaused && (
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => onResume(alert.id)}>
            <Play className="w-3 h-3" /> Retomar
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-7 gap-1 ml-auto text-muted-foreground hover:text-rose-600"
          onClick={() => onDelete(alert.id)}
        >
          <Trash2 className="w-3 h-3" /> Excluir
        </Button>
      </div>
    </div>
  );
}
