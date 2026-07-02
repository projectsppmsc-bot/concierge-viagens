"use client";

import Link from "next/link";
import {
  Plane, Luggage, Clock, ArrowRight, ChevronDown, ChevronUp,
  ExternalLink, Calendar, Users, Info,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlightBadge } from "./FlightBadge";
import { formatCurrency } from "@/utils/price-formatter";
import { formatTime, formatDuration } from "@/utils/date-helpers";
import { getAirline } from "@/mock/airlines";
import { CABIN_LABELS } from "@/lib/constants";
import { buildBookingLink } from "@/utils/booking-links";
import { cn } from "@/lib/utils";
import type { Flight } from "@/types/flight";

interface FlightCardProps {
  flight: Flight;
  searchOrigin?: string;
  searchDestination?: string;
  searchDepartureDate?: string;
  searchReturnDate?: string;
  searchAdults?: number;
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

// Detecta se chegada é no dia seguinte ou mais
function arrivalDayOffset(departure: string, arrival: string): number {
  const d = new Date(departure);
  const a = new Date(arrival);
  if (isNaN(d.getTime()) || isNaN(a.getTime())) return 0;
  const depDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const arrDay = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.round((arrDay.getTime() - depDay.getTime()) / 86400000);
}

export function FlightCard({
  flight,
  searchOrigin,
  searchDestination,
  searchDepartureDate,
  searchReturnDate,
  searchAdults = 1,
}: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);

  const first = flight.segments[0];
  const last  = flight.segments[flight.segments.length - 1];
  const airline = getAirline(first.airlineCode);

  // Prefere o link real devolvido pelo provedor (Travelpayouts já inclui o
  // deep link específico da oferta). Só reconstrói como último recurso.
  const externalLink = flight.bookingLink ?? buildBookingLink({
    airlineCode: first.airlineCode,
    origin: searchOrigin ?? first.origin,
    destination: searchDestination ?? last.destination,
    departureDate: searchDepartureDate ?? first.departureTime.slice(0, 10),
    returnDate: searchReturnDate,
    adults: searchAdults,
    cabin: flight.cabin,
  });

  const isReal = flight.source === "amadeus" || flight.source === "travelpayouts";
  const dayOffset = arrivalDayOffset(first.departureTime, last.arrivalTime);

  // Data de partida — prefere do segmento, fallback do parâmetro de busca
  const departureDate = first.departureTime
    ? formatShortDate(first.departureTime)
    : searchDepartureDate ? formatShortDate(searchDepartureDate + "T12:00:00") : "";

  return (
    <Card className={cn(
      "hover:shadow-card-hover transition-all border",
      flight.badges.includes("best_price") && "border-emerald-200 ring-1 ring-emerald-100",
      flight.badges.includes("promo")       && "border-amber-200 ring-1 ring-amber-100",
    )}>
      <CardContent className="p-0">

        {/* ── Linha principal ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">

          {/* Companhia */}
          <div className="flex items-center gap-3 sm:w-44 shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: airline?.color ?? "#6b7280" }}
            >
              <Plane className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{first.airlineName}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{first.flightNumber}</p>
              <p className="text-[10px] text-muted-foreground">{CABIN_LABELS[flight.cabin]}</p>
              {isReal && (
                <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  Voo real
                </span>
              )}
            </div>
          </div>

          {/* Rota + datas */}
          <div className="flex-1 min-w-0">
            {/* Data de partida em destaque */}
            {departureDate && (
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-primary">{departureDate}</span>
                {searchReturnDate && (
                  <>
                    <span className="text-muted-foreground text-xs">→ volta</span>
                    <span className="text-xs font-semibold text-primary">
                      {formatShortDate(searchReturnDate + "T12:00:00")}
                    </span>
                  </>
                )}
                {searchAdults > 1 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground ml-1">
                    <Users className="w-3 h-3" />{searchAdults} pax
                  </span>
                )}
              </div>
            )}

            {/* Horários e rota */}
            <div className="flex items-center gap-3">
              {/* Partida */}
              <div className="text-center shrink-0">
                <p className="text-2xl font-bold text-foreground leading-none">{formatTime(first.departureTime)}</p>
                <p className="text-xs font-bold text-primary mt-0.5">{first.origin}</p>
                <p className="text-[10px] text-muted-foreground">{first.originCity}</p>
              </div>

              {/* Duração + escalas */}
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <p className="text-[10px] text-muted-foreground">{formatDuration(flight.totalDurationMinutes)}</p>
                <div className="w-full flex items-center gap-1">
                  <div className="flex-1 h-px bg-border" />
                  <Plane className="w-3 h-3 text-muted-foreground/50" />
                  <div className="flex-1 h-px bg-border" />
                </div>
                {flight.stops === 0 ? (
                  <span className="text-[10px] text-emerald-600 font-semibold">Direto</span>
                ) : (
                  <span className="text-[10px] text-amber-600 font-semibold">
                    {flight.stops} escala{flight.stops > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Chegada */}
              <div className="text-center shrink-0">
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-foreground leading-none">{formatTime(last.arrivalTime)}</p>
                  {dayOffset > 0 && (
                    <sup className="text-[10px] text-rose-500 font-bold">+{dayOffset}</sup>
                  )}
                </div>
                <p className="text-xs font-bold text-primary mt-0.5">{last.destination}</p>
                <p className="text-[10px] text-muted-foreground">{last.destinationCity}</p>
                {dayOffset > 0 && (
                  <p className="text-[10px] text-rose-500">
                    {formatShortDate(last.arrivalTime)}
                  </p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-1 flex-wrap mt-2">
              {flight.badges.map((b) => <FlightBadge key={b} badge={b} />)}
            </div>
          </div>

          {/* Preço + ações */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0 sm:w-36 sm:text-right">
            <div className="flex-1 sm:flex-none">
              <p className="text-2xl font-bold text-primary leading-none">{formatCurrency(flight.priceTotal)}</p>
              <p className="text-[10px] text-muted-foreground">por pessoa</p>
              {flight.seatsLeft && flight.seatsLeft <= 5 && (
                <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                  Últimas {flight.seatsLeft} vagas!
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 bg-primary text-white hover:bg-primary/90 transition-colors w-full"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                Ver oferta
              </a>
              <Button size="sm" variant="outline" className="text-xs w-full" asChild>
                <Link href={`/voo/${flight.id}`}>Ver detalhes</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Barra inferior ──────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-4 pb-3 flex-wrap border-t border-border/50 pt-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Luggage className="w-3.5 h-3.5" />
            {flight.baggage.carryOn ? "Mão inclusa" : "Sem bagagem de mão"}
            {flight.baggage.checked > 0 &&
              ` · ${flight.baggage.checked} despachada${flight.baggage.checked > 1 ? "s" : ""}${flight.baggage.weightKg ? ` (${flight.baggage.weightKg}kg)` : ""}`}
          </div>
          {flight.isRefundable && (
            <span className="text-xs text-emerald-600 font-medium">Reembolsável</span>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Ocultar" : "Detalhes do itinerário"}
          </button>
        </div>

        {/* ── Itinerário expandido ─────────────────────────────────── */}
        {expanded && (
          <div className="border-t border-border px-4 py-4 bg-muted/20 space-y-4">

            {/* Resumo da viagem */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-white rounded-xl border border-border text-xs">
              <div>
                <p className="text-muted-foreground mb-0.5">Saída</p>
                <p className="font-semibold text-foreground">{formatFullDate(first.departureTime)}</p>
                <p className="text-primary font-bold">{formatTime(first.departureTime)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Chegada</p>
                <p className="font-semibold text-foreground">{formatFullDate(last.arrivalTime)}</p>
                <p className="text-primary font-bold">{formatTime(last.arrivalTime)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Duração total</p>
                <p className="font-semibold text-foreground">{formatDuration(flight.totalDurationMinutes)}</p>
                <p className="text-muted-foreground">{flight.stops === 0 ? "Voo direto" : `${flight.stops} escala${flight.stops > 1 ? "s" : ""}`}</p>
              </div>
              {searchReturnDate && (
                <div>
                  <p className="text-muted-foreground mb-0.5">Volta</p>
                  <p className="font-semibold text-foreground">{formatShortDate(searchReturnDate + "T12:00:00")}</p>
                </div>
              )}
            </div>

            {/* Segmentos */}
            {flight.segments.map((seg, i) => (
              <div key={seg.id}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white" />
                    <div className="w-px flex-1 bg-border min-h-10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="text-sm font-bold text-foreground">{formatTime(seg.departureTime)}</p>
                        <p className="text-xs text-muted-foreground">{formatFullDate(seg.departureTime)}</p>
                        <p className="text-xs font-semibold text-primary">{seg.origin} · {seg.originCity}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p className="font-mono font-semibold">{seg.flightNumber}</p>
                        {"aircraft" in seg && seg.aircraft && <p>{String(seg.aircraft)}</p>}
                        <p>{seg.airlineName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white rounded-lg px-2 py-1.5 border border-border w-fit">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(seg.durationMinutes)} de voo
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{formatTime(seg.arrivalTime)}</p>
                      <p className="text-xs text-muted-foreground">{formatFullDate(seg.arrivalTime)}</p>
                      <p className="text-xs font-semibold text-primary">{seg.destination} · {seg.destinationCity}</p>
                    </div>
                  </div>
                </div>

                {i < flight.segments.length - 1 && (
                  <div className="ml-6 mt-2 mb-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div className="text-xs text-amber-700">
                      <span className="font-semibold">Escala em {seg.destination}</span>
                      {"stopoverMinutes" in seg && seg.stopoverMinutes
                        ? ` · ${formatDuration(Number(seg.stopoverMinutes))} de conexão`
                        : ""}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Botão de compra com contexto */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-2 mb-3 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Voo <strong className="text-foreground">{first.flightNumber}</strong> ·{" "}
                  <strong className="text-foreground">{first.origin} → {last.destination}</strong> ·{" "}
                  Saída <strong className="text-foreground">{formatFullDate(first.departureTime)}</strong> às{" "}
                  <strong className="text-foreground">{formatTime(first.departureTime)}</strong>.
                  Use estes dados para localizar o voo ao comprar.
                </span>
              </div>
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ir para compra · {formatCurrency(flight.priceTotal)}
              </a>
              <p className="text-[10px] text-muted-foreground mt-2">
                Abre no site parceiro. Confirme o preço final antes de pagar.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
