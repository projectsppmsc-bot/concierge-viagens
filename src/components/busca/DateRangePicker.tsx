"use client";

import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DateRangePickerProps {
  departureDate: string;
  returnDate?: string;
  onDepartureChange: (v: string) => void;
  onReturnChange: (v: string) => void;
  isRoundtrip: boolean;
}

export function DateRangePicker({
  departureDate,
  returnDate,
  onDepartureChange,
  onReturnChange,
  isRoundtrip,
}: DateRangePickerProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={`grid gap-3 ${isRoundtrip ? "grid-cols-2" : "grid-cols-1"}`}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="date"
          value={departureDate}
          min={today}
          onChange={(e) => onDepartureChange(e.target.value)}
          className="pl-9"
          placeholder="Ida"
        />
      </div>
      {isRoundtrip && (
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            value={returnDate ?? ""}
            min={departureDate || today}
            onChange={(e) => onReturnChange(e.target.value)}
            className="pl-9"
            placeholder="Volta"
          />
        </div>
      )}
    </div>
  );
}
