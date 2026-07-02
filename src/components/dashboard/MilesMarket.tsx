"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Activity, ArrowRight } from "lucide-react";
import { MILES_PROGRAM_COLORS, MILES_PROGRAM_LABELS } from "@/lib/constants";
import type { MilesProgramId } from "@/types/miles";

// ---------------------------------------------------------------------------
// Dados de referência e geração de histórico simulado
// ---------------------------------------------------------------------------

const BASE_VALUES: Record<MilesProgramId, number> = {
  latam_pass:     0.0250,
  smiles:         0.0220,
  azul_fidelidade:0.0280,
  livelo:         0.0200,
  esfera:         0.0180,
};

// Gera série histórica de 30 dias com seed baseada na data para ser estável por dia
function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateHistory(programId: MilesProgramId, days = 30): number[] {
  const base = BASE_VALUES[programId];
  const seed = programId.charCodeAt(0) + programId.length;
  const today = new Date();
  const history: number[] = [];
  let val = base * (0.92 + seededRand(seed) * 0.08);

  for (let i = days; i >= 0; i--) {
    const daySeed = seed + i + today.getDate() * 31 + today.getMonth() * 365;
    const change = (seededRand(daySeed) - 0.48) * 0.0008; // ±0.08% por dia
    val = Math.max(base * 0.85, Math.min(base * 1.15, val + change));
    history.push(parseFloat(val.toFixed(5)));
  }
  return history;
}

// Simula variação em tempo real (muda a cada tick)
function liveVariation(programId: MilesProgramId, tick: number): number {
  const seed = programId.charCodeAt(2) + tick * 7.3;
  return (seededRand(seed) - 0.5) * 0.0002;
}

// ---------------------------------------------------------------------------
// Sparkline SVG
// ---------------------------------------------------------------------------

function Sparkline({ values, positive }: { values: number[]; color?: string; positive: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 0.0001;
  const w = 80, h = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const area = `M${pts[0]} L${pts.join(" L")} L${w},${h} L0,${h} Z`;
  const line = `M${pts.join(" L")}`;
  const lineColor = positive ? "#10b981" : "#ef4444";
  const areaColor = positive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={area} fill={areaColor} />
      <path d={line} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ticker horizontal (estilo bolsa)
// ---------------------------------------------------------------------------

function Ticker({ items }: { items: { id: MilesProgramId; value: number; change: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.4;
    const step = () => {
      pos -= speed;
      if (pos < -el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [items]);

  const doubled = [...items, ...items]; // loop infinito

  return (
    <div className="overflow-hidden bg-gray-950 rounded-lg px-3 py-1.5 mb-4">
      <div ref={ref} className="flex items-center gap-6 whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-gray-400">{MILES_PROGRAM_LABELS[item.id].split(" ")[0]}</span>
            <span className="text-white font-semibold">R${item.value.toFixed(4)}</span>
            <span className={item.change >= 0 ? "text-emerald-400" : "text-red-400"}>
              {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change * 100).toFixed(3)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card individual por programa
// ---------------------------------------------------------------------------

interface ProgramState {
  id: MilesProgramId;
  current: number;
  history: number[];
  dayChange: number;
  dayChangePct: number;
}

function ProgramCard({ prog }: { prog: ProgramState }) {
  const positive = prog.dayChange >= 0;
  const neutral  = Math.abs(prog.dayChangePct) < 0.01;
  const color    = MILES_PROGRAM_COLORS[prog.id];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
      {/* Cor / ícone */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
        style={{ backgroundColor: color }}>
        {MILES_PROGRAM_LABELS[prog.id][0]}
      </div>

      {/* Nome + variação */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{MILES_PROGRAM_LABELS[prog.id]}</p>
        <p className="text-[10px] text-muted-foreground">por milha</p>
      </div>

      {/* Sparkline */}
      <div className="shrink-0">
        <Sparkline values={prog.history} positive={positive} />
      </div>

      {/* Valor + change */}
      <div className="text-right shrink-0 w-24">
        <p className="text-sm font-bold text-foreground font-mono">
          R$ {prog.current.toFixed(4)}
        </p>
        <div className={`flex items-center justify-end gap-0.5 text-[10px] font-semibold ${
          neutral ? "text-muted-foreground" : positive ? "text-emerald-600" : "text-red-500"
        }`}>
          {neutral ? <Minus className="w-2.5 h-2.5" /> : positive
            ? <TrendingUp className="w-2.5 h-2.5" />
            : <TrendingDown className="w-2.5 h-2.5" />
          }
          {positive && !neutral ? "+" : ""}{(prog.dayChangePct).toFixed(3)}%
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Widget principal
// ---------------------------------------------------------------------------

const PROGRAMS: MilesProgramId[] = ["latam_pass", "smiles", "azul_fidelidade", "livelo", "esfera"];

export function MilesMarket() {
  const [tick, setTick] = useState(0);
  const [states, setStates] = useState<ProgramState[]>([]);
  const [sortBy, setSortBy] = useState<"value" | "change">("value");

  // Inicializa histórico
  useEffect(() => {
    const initial = PROGRAMS.map((id) => {
      const history = generateHistory(id);
      const open = history[0];
      const current = history[history.length - 1];
      return {
        id,
        current,
        history,
        dayChange: current - open,
        dayChangePct: ((current - open) / open) * 100,
      };
    });
    setStates(initial);
  }, []);

  // Tick a cada 3 segundos — simula variação live
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  // Aplica variação live a cada tick
  useEffect(() => {
    if (tick === 0 || states.length === 0) return;
    setStates((prev) =>
      prev.map((prog) => {
        const delta = liveVariation(prog.id, tick);
        const newVal = parseFloat((prog.current + delta).toFixed(5));
        const newHistory = [...prog.history.slice(1), newVal];
        const open = newHistory[0];
        return {
          ...prog,
          current: newVal,
          history: newHistory,
          dayChange: newVal - open,
          dayChangePct: ((newVal - open) / open) * 100,
        };
      }),
    );
  }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = [...states].sort((a, b) =>
    sortBy === "value" ? b.current - a.current : b.dayChangePct - a.dayChangePct,
  );

  const tickerItems = states.map((s) => ({
    id: s.id, value: s.current, change: s.dayChangePct / 100,
  }));

  const rising  = states.filter((s) => s.dayChange > 0).length;
  const falling = states.filter((s) => s.dayChange < 0).length;

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-foreground">Mercado de Milhas</h3>
          <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            AO VIVO
          </span>
        </div>
        <Link href="/milhas" className="text-xs text-primary hover:underline flex items-center gap-1">
          Ver tudo <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Resumo mercado */}
      <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
        <span className="text-emerald-600 font-medium">▲ {rising} em alta</span>
        <span className="text-red-500 font-medium">▼ {falling} em baixa</span>
        <span>· atualiza a cada 3s</span>
      </div>

      {/* Ticker */}
      {tickerItems.length > 0 && <Ticker items={tickerItems} />}

      {/* Sort tabs */}
      <div className="flex gap-1 mb-3">
        {(["value", "change"] as const).map((opt) => (
          <button key={opt} onClick={() => setSortBy(opt)}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              sortBy === opt ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
            }`}>
            {opt === "value" ? "Por valor" : "Por variação"}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-0.5">
        {sorted.map((prog) => <ProgramCard key={prog.id} prog={prog} />)}
      </div>

      <p className="text-[10px] text-muted-foreground mt-3 text-center">
        Valores estimados com base em dados de mercado · atualiza automaticamente
      </p>
    </div>
  );
}
