"use client";

import { useState } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: Passengers;
  onChange: (v: Passengers) => void;
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const [open, setOpen] = useState(false);
  const total = value.adults + value.children + value.infants;

  function adjust(key: keyof Passengers, delta: number) {
    const next = { ...value, [key]: Math.max(key === "adults" ? 1 : 0, value[key] + delta) };
    if (next.adults + next.children + next.infants > 9) return;
    onChange(next);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted/50 transition-colors"
      >
        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-foreground">
          {total} passageiro{total !== 1 ? "s" : ""}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-12 left-0 z-20 w-64 bg-white border border-border rounded-xl shadow-card-hover p-4 space-y-4">
            {(["adults", "children", "infants"] as const).map((key) => {
              const labels = { adults: "Adultos", children: "Crianças (2-11)", infants: "Bebês (0-1)" };
              return (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{labels[key]}</p>
                    {key === "adults" && <p className="text-xs text-muted-foreground">12+ anos</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => adjust(key, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-semibold w-4 text-center">{value[key]}</span>
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => adjust(key, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button type="button" size="sm" className="w-full" onClick={() => setOpen(false)}>
              Confirmar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
