"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeftRight, Luggage, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PassengerSelector } from "./PassengerSelector";
import { ClassSelector } from "./ClassSelector";
import { DateRangePicker } from "./DateRangePicker";
import { useSearchContext } from "@/context/SearchContext";
import { searchAirports, airports } from "@/data/airports";
import type { SearchQuery, TripType } from "@/types/search";
import type { CabinClass } from "@/types/flight";
import { cn } from "@/lib/utils";

const tripTypes: { value: TripType; label: string }[] = [
  { value: "roundtrip", label: "Ida e volta" },
  { value: "oneway", label: "Somente ida" },
];

interface SearchFormProps {
  compact?: boolean;
}

export function SearchForm({ compact = false }: SearchFormProps) {
  const router = useRouter();
  const { search } = useSearchContext();
  const [isPending, startTransition] = useTransition();

  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [origin, setOrigin] = useState("");
  const [originIata, setOriginIata] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationIata, setDestinationIata] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [baggageChecked, setBaggageChecked] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<ReturnType<typeof searchAirports>>([]);
  const [destSuggestions, setDestSuggestions] = useState<ReturnType<typeof searchAirports>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleOriginInput(v: string) {
    setOrigin(v);
    setOriginIata("");
    setOriginSuggestions(v.length >= 2 ? searchAirports(v).slice(0, 6) : []);
  }

  function handleDestInput(v: string) {
    setDestination(v);
    setDestinationIata("");
    setDestSuggestions(v.length >= 2 ? searchAirports(v).slice(0, 6) : []);
  }

  function swapAirports() {
    setOrigin(destination);
    setOriginIata(destinationIata);
    setDestination(origin);
    setDestinationIata(originIata);
  }

  /**
   * Resolve o IATA a partir do que o usuário digitou.
   * Prioridade:
   *  1. iata já selecionado pelo dropdown
   *  2. texto é exatamente um IATA válido (ex: "GRU")
   *  3. primeira correspondência na busca por texto
   */
  function resolveIata(typed: string, iata: string): string {
    if (iata) return iata;
    const trimmed = typed.trim();
    const upper = trimmed.toUpperCase();
    // Caso o usuário tenha digitado "GRU" direto
    if (/^[A-Z]{3}$/.test(upper) && airports.some((a) => a.iata === upper)) return upper;
    // Sugestão do texto (ex: "Lisboa" → "LIS")
    const match = searchAirports(trimmed)[0];
    return match?.iata ?? trimmed.toUpperCase().slice(0, 3);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const resolvedOriginIata = resolveIata(origin, originIata);
    const resolvedDestIata   = resolveIata(destination, destinationIata);

    const newErrors: Record<string, string> = {};

    // Origem obrigatória
    if (!origin.trim()) {
      newErrors.origin = "Informe a origem.";
    }

    // Destino obrigatório
    if (!destination.trim()) {
      newErrors.destination = "Informe o destino.";
    }

    // Origem e destino não podem ser iguais
    if (
      resolvedOriginIata &&
      resolvedDestIata &&
      resolvedOriginIata === resolvedDestIata
    ) {
      newErrors.destination = "Origem e destino não podem ser iguais.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const query: SearchQuery = {
      tripType,
      origin: resolvedOriginIata,
      originCity: origin,
      destination: resolvedDestIata,
      destinationCity: destination,
      departureDate,                                          // pode ser vazio — o provider lida
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      passengers,
      cabin,
      flexibleDates,
      includeMiles: true,
    };

    startTransition(async () => {
      await search(query);
      router.push("/resultados");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-white rounded-2xl shadow-card-hover border border-border",
        compact ? "p-4" : "p-6",
      )}
    >
      {/* Abas tipo de viagem */}
      <div className="flex gap-1 mb-5">
        {tripTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTripType(t.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              tripType === t.value
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Campos principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">

        {/* Origem */}
        <div className="relative sm:col-span-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Origem <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Input
              placeholder="Ex: São Paulo, GRU..."
              value={origin}
              onChange={(e) => handleOriginInput(e.target.value)}
              autoComplete="off"
              className={cn("pr-8", errors.origin && "border-rose-400 focus-visible:ring-rose-400")}
            />
            {origin && !compact && (
              <button
                type="button"
                onClick={swapAirports}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                title="Trocar origem e destino"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {errors.origin && (
            <p className="text-[11px] text-rose-500 mt-0.5">{errors.origin}</p>
          )}
          {originSuggestions.length > 0 && (
            <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-border rounded-xl shadow-card-hover overflow-hidden">
              {originSuggestions.map((a) => (
                <button
                  key={a.iata}
                  type="button"
                  className="w-full text-left px-3 py-2.5 hover:bg-muted flex items-center gap-3 text-sm"
                  onClick={() => {
                    setOrigin(`${a.city} (${a.iata})`);
                    setOriginIata(a.iata);
                    setOriginSuggestions([]);
                  }}
                >
                  <span className="font-bold text-primary w-8 shrink-0">{a.iata}</span>
                  <span className="truncate text-foreground">{a.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-auto">{a.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destino */}
        <div className="relative sm:col-span-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Destino <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="Ex: Lisboa, LIS..."
            value={destination}
            onChange={(e) => handleDestInput(e.target.value)}
            autoComplete="off"
            className={errors.destination ? "border-rose-400 focus-visible:ring-rose-400" : ""}
          />
          {errors.destination && (
            <p className="text-[11px] text-rose-500 mt-0.5">{errors.destination}</p>
          )}
          {destSuggestions.length > 0 && (
            <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-border rounded-xl shadow-card-hover overflow-hidden">
              {destSuggestions.map((a) => (
                <button
                  key={a.iata}
                  type="button"
                  className="w-full text-left px-3 py-2.5 hover:bg-muted flex items-center gap-3 text-sm"
                  onClick={() => {
                    setDestination(`${a.city} (${a.iata})`);
                    setDestinationIata(a.iata);
                    setDestSuggestions([]);
                  }}
                >
                  <span className="font-bold text-primary w-8 shrink-0">{a.iata}</span>
                  <span className="truncate text-foreground">{a.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-auto">{a.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Datas */}
        <div className="sm:col-span-1 lg:col-span-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {tripType === "roundtrip" ? "Datas" : "Data de ida"}
            <span className="text-muted-foreground/60 font-normal"> (opcional)</span>
          </label>
          <DateRangePicker
            departureDate={departureDate}
            returnDate={returnDate}
            onDepartureChange={setDepartureDate}
            onReturnChange={setReturnDate}
            isRoundtrip={tripType === "roundtrip"}
          />
        </div>

        {/* Passageiros + Classe */}
        <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Passageiros</label>
            <PassengerSelector value={passengers} onChange={setPassengers} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Classe</label>
            <ClassSelector value={cabin} onChange={setCabin} />
          </div>
        </div>
      </div>

      {/* Opções extras */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={flexibleDates}
              onChange={(e) => setFlexibleDates(e.target.checked)}
              className="rounded"
            />
            <CalendarDays className="w-3.5 h-3.5" />
            Datas flexíveis (±3 dias)
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={baggageChecked}
              onChange={(e) => setBaggageChecked(e.target.checked)}
              className="rounded"
            />
            <Luggage className="w-3.5 h-3.5" />
            Bagagem despachada inclusa
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <input type="checkbox" defaultChecked className="rounded" />
            Incluir opções com milhas
          </label>
        </div>
      )}

      {/* Botão */}
      <div className="mt-5 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full sm:w-auto min-w-40 gap-2"
        >
          {isPending ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Pesquisar Voos
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
