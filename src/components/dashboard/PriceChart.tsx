"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/price-formatter";

// Dados simulados de evolucao de preco para GRU->LIS nos ultimos 12 meses
const priceHistory = [
  { month: "Jun", price: 4200 },
  { month: "Jul", price: 3900 },
  { month: "Ago", price: 4100 },
  { month: "Set", price: 3600 },
  { month: "Out", price: 3800 },
  { month: "Nov", price: 3200 },
  { month: "Dez", price: 4500 },
  { month: "Jan", price: 3800 },
  { month: "Fev", price: 3500 },
  { month: "Mar", price: 3700 },
  { month: "Abr", price: 3400 },
  { month: "Mai", price: 3490 },
];

export function PriceChart() {
  const min = Math.min(...priceHistory.map((d) => d.price));
  const max = Math.max(...priceHistory.map((d) => d.price));
  const range = max - min;
  const current = priceHistory[priceHistory.length - 1].price;
  const previous = priceHistory[priceHistory.length - 2].price;
  const diff = current - previous;
  const positive = diff < 0;

  const getY = (price: number) => {
    return 100 - ((price - min) / (range || 1)) * 80 - 10;
  };

  const points = priceHistory.map((d, i) => {
    const x = (i / (priceHistory.length - 1)) * 100;
    const y = getY(d.price);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const area = `0,${getY(priceHistory[0].price)} ${polyline} 100,${getY(priceHistory[priceHistory.length - 1].price)} 100,100 0,100`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">Evolução de Preços</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">GRU → Lisboa · 12 meses</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">{formatCurrency(current)}</p>
            <div className={`flex items-center gap-1 justify-end text-xs font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>
              {positive ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {positive ? "▼" : "▲"} {formatCurrency(Math.abs(diff))} vs mês anterior
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {/* SVG chart */}
        <div className="relative h-28 w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={area} fill="url(#chart-gradient)" />
            <polyline
              points={polyline}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Min marker */}
            <circle cx={(priceHistory.findIndex(d => d.price === min) / (priceHistory.length - 1)) * 100} cy={getY(min)} r="1.5" fill="#10b981" vectorEffect="non-scaling-stroke" />
            {/* Current marker */}
            <circle cx="100" cy={getY(current)} r="2" fill="#3b82f6" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Month labels */}
        <div className="flex justify-between mt-1">
          {priceHistory.filter((_, i) => i % 2 === 0).map((d) => (
            <span key={d.month} className="text-[10px] text-muted-foreground">{d.month}</span>
          ))}
        </div>

        {/* Min / Max */}
        <div className="flex justify-between mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-[10px] text-muted-foreground">Mínimo 12m</p>
            <p className="text-sm font-semibold text-emerald-600">{formatCurrency(min)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Máximo 12m</p>
            <p className="text-sm font-semibold text-rose-600">{formatCurrency(max)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
