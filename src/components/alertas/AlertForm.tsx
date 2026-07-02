"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MILES_PROGRAM_LABELS } from "@/lib/constants";
import type { MilesProgramId } from "@/types/miles";
import type { PriceAlert } from "@/types/alert";

interface AlertFormProps {
  onAdd: (alert: PriceAlert) => void;
}

const programs = Object.entries(MILES_PROGRAM_LABELS) as [MilesProgramId, string][];

export function AlertForm({ onAdd }: AlertFormProps) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [targetMiles, setTargetMiles] = useState("");
  const [program, setProgram] = useState<MilesProgramId | "">("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      origin: origin.toUpperCase().slice(0, 3),
      originCity: originCity || origin,
      destination: destination.toUpperCase().slice(0, 3),
      destinationCity: destinationCity || destination,
      targetPriceBRL: targetPrice ? Number(targetPrice) : undefined,
      targetMiles: targetMiles ? Number(targetMiles) : undefined,
      targetMilesProgram: program || undefined,
      status: "active",
      createdAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
    };

    onAdd(newAlert);
    setOpen(false);
    setOrigin(""); setOriginCity(""); setDestination(""); setDestinationCity("");
    setTargetPrice(""); setTargetMiles(""); setProgram("");
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2 w-full sm:w-auto">
        <Plus className="w-4 h-4" />
        Criar novo alerta
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-5 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Novo alerta de preço</h3>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Origem (IATA)</label>
          <Input placeholder="GRU" value={origin} onChange={(e) => setOrigin(e.target.value)} required maxLength={3} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Cidade de origem</label>
          <Input placeholder="São Paulo" value={originCity} onChange={(e) => setOriginCity(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Destino (IATA)</label>
          <Input placeholder="LIS" value={destination} onChange={(e) => setDestination(e.target.value)} required maxLength={3} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Cidade de destino</label>
          <Input placeholder="Lisboa" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço desejado (R$)</label>
          <Input type="number" placeholder="3000" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} min={100} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Meta em milhas</label>
          <Input type="number" placeholder="45000" value={targetMiles} onChange={(e) => setTargetMiles(e.target.value)} min={1000} />
        </div>
      </div>

      {targetMiles && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Programa de milhas</label>
          <Select value={program} onValueChange={(v) => setProgram(v as MilesProgramId)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o programa" />
            </SelectTrigger>
            <SelectContent>
              {programs.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" className="flex-1 gap-1">
          <Plus className="w-3.5 h-3.5" /> Criar alerta
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
      </div>
    </form>
  );
}
