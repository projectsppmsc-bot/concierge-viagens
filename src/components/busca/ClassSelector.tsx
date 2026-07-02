"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CABIN_LABELS } from "@/lib/constants";
import type { CabinClass } from "@/types/flight";

interface ClassSelectorProps {
  value: CabinClass;
  onChange: (v: CabinClass) => void;
}

const classes: CabinClass[] = ["economy", "premium_economy", "business", "first"];

export function ClassSelector({ value, onChange }: ClassSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CabinClass)}>
      <SelectTrigger>
        <SelectValue placeholder="Classe" />
      </SelectTrigger>
      <SelectContent>
        {classes.map((c) => (
          <SelectItem key={c} value={c}>
            {CABIN_LABELS[c]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
