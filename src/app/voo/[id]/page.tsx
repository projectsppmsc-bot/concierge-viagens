"use client";

import Link from "next/link";
import {
  ArrowLeft, Plane, Clock, CheckCircle2,
  XCircle, Award, ChevronRight, ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MilesRecommendation } from "@/components/milhas/MilesRecommendation";
import { MilesProgramCard } from "@/components/milhas/MilesProgramCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlightBadge } from "@/components/resultados/FlightBadge";
import { useSearchContext } from "@/context/SearchContext";
import { mockFlights } from "@/mock/flights";
import { getMockMilesQuotes } from "@/mock/miles-programs";
import { generateRecommendation } from "@/utils/recommendation-engine";
import { bestMilesOption } from "@/utils/miles-calculator";
import { formatCurrency, formatMiles } from "@/utils/price-formatter";
import { formatTime, formatDate, formatDuration } from "@/utils/date-helpers";
import { getAirline } from "@/mock/airlines";
import { CABIN_LABELS } from "@/lib/constants";
import { buildBookingLink } from "@/utils/booking-links";

interface PageProps {
  params: { id: string };
}

export default function VooPage({ params }: PageProps) {
  const { id } = params;
  const { results } = useSearchContext();

  // Procura primeiro nos resultados da busca atual, depois no mock
  const flight =
    results.find((f) => f.id === id) ??
    mockFlights.find((f) => f.id === id);

  if (!flight) {
    return (
      <AppShell title="Voo não encontrado">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Plane className="w-12 h-12 text-muted-foreground/30" />
          <p className="text-lg font-semibold text-foreground">Voo não encontrado</p>
          <p className="text-sm text-muted-foreground">Faça uma nova busca para ver os voos disponíveis.</p>
          <Button asChild><Link href="/busca">Nova busca</Link></Button>
        </div>
      </AppShell>
    );
  }

  const first    = flight.segments[0];
  const last     = flight.segments[flight.segments.length - 1];
  const airline  = getAirline(first.airlineCode);
  const bookingLink = buildBookingLink({
    airlineCode: first.airlineCode,
    origin: first.origin,
    destination: last.destination,
    departureDate: first.departureTime.slice(0, 10),
    adults: 1,
    cabin: flight.cabin,
  });
  const routeMult = flight.priceTotal > 4000 ? 1.3 : flight.priceTotal > 2000 ? 1.0 : 0.45;
  const quotes   = getMockMilesQuotes(flight.priceTotal, routeMult);
  const rec      = generateRecommendation(flight, quotes);
  const best     = bestMilesOption(quotes);

  return (
    <AppShell title="Detalhes do Voo">
      {/* Back */}
      <div className="mb-5 flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/resultados" className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>
        </Button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm text-foreground font-medium">
          {first.originCity} → {last.destinationCity}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — flight detail */}
        <div className="lg:col-span-2 space-y-5">

          {/* Summary card */}
          <Card>
            <CardContent className="p-6">
              {/* Airline + badges */}
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: airline?.color ?? "#6b7280" }}
                  >
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{first.airlineName}</p>
                    <p className="text-xs text-muted-foreground">{first.flightNumber} · {CABIN_LABELS[flight.cabin]}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {flight.badges.map((b) => <FlightBadge key={b} badge={b} />)}
                </div>
              </div>

              {/* Route display */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center shrink-0">
                  <p className="text-3xl font-bold text-foreground">{formatTime(first.departureTime)}</p>
                  <p className="text-sm font-bold text-primary mt-1">{first.origin}</p>
                  <p className="text-xs text-muted-foreground">{first.originCity}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(first.departureTime)}</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs text-muted-foreground">{formatDuration(flight.totalDurationMinutes)}</p>
                  <div className="w-full flex items-center gap-1">
                    <div className="flex-1 h-px bg-border" />
                    <Plane className="w-4 h-4 text-primary" />
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <p className="text-xs font-medium">
                    {flight.stops === 0
                      ? <span className="text-emerald-600">Voo direto</span>
                      : <span className="text-amber-600">{flight.stops} escala{flight.stops > 1 ? "s" : ""}</span>
                    }
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <p className="text-3xl font-bold text-foreground">{formatTime(last.arrivalTime)}</p>
                  <p className="text-sm font-bold text-primary mt-1">{last.destination}</p>
                  <p className="text-xs text-muted-foreground">{last.destinationCity}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(last.arrivalTime)}</p>
                </div>
              </div>

              {/* Segment timeline */}
              <div className="border-t border-border pt-5 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Detalhes do itinerário</p>
                {flight.segments.map((seg, i) => (
                  <div key={seg.id}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 pt-1 w-4 shrink-0">
                        <div className="w-3 h-3 rounded-full border-2 border-primary bg-white" />
                        {i < flight.segments.length - 1 && <div className="flex-1 w-px bg-border min-h-12" />}
                        {i === flight.segments.length - 1 && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <div>
                            <p className="text-base font-bold text-foreground">{formatTime(seg.departureTime)}</p>
                            <p className="text-sm text-foreground">{seg.origin} · {seg.originCity}</p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <p>{seg.flightNumber}</p>
                            {"aircraft" in seg && seg.aircraft ? <p>{String(seg.aircraft)}</p> : null}
                          </div>
                        </div>
                        <div className="my-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(seg.durationMinutes)} de voo
                        </div>
                        <div>
                          <p className="text-base font-bold text-foreground">{formatTime(seg.arrivalTime)}</p>
                          <p className="text-sm text-foreground">{seg.destination} · {seg.destinationCity}</p>
                        </div>
                        {"stopoverMinutes" in seg && seg.stopoverMinutes && i < flight.segments.length - 1 && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                            Conexão em {seg.destination}: {formatDuration(Number(seg.stopoverMinutes))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fare conditions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Condições da tarifa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Bagagem de mão", ok: flight.baggage.carryOn },
                  { label: `${flight.baggage.checked} bagagem${flight.baggage.checked !== 1 ? "s" : ""} despachada${flight.baggage.checked !== 1 ? "s" : ""}${flight.baggage.weightKg ? ` (${flight.baggage.weightKg}kg)` : ""}`, ok: flight.baggage.checked > 0 },
                  { label: "Reembolsável", ok: flight.isRefundable },
                  { label: "Assento incluso", ok: flight.cabin !== "economy" },
                  { label: "Refeição inclusa", ok: flight.cabin === "business" || flight.cabin === "first" },
                  { label: "Lounge incluso", ok: flight.cabin === "business" || flight.cabin === "first" },
                ].map(({ label, ok }) => (
                  <div key={label} className="flex items-center gap-2">
                    {ok
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <XCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    }
                    <span className={`text-xs ${ok ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Concierge recommendation */}
          <MilesRecommendation result={rec} cashPrice={flight.priceTotal} />
        </div>

        {/* Right — price & miles */}
        <div className="space-y-4">

          {/* Price box */}
          <Card className="border-primary/20 ring-1 ring-primary/10">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{CABIN_LABELS[flight.cabin]} · por pessoa</p>
              <p className="text-3xl font-bold text-primary mb-1">{formatCurrency(flight.priceTotal)}</p>
              {"seatsLeft" in flight && flight.seatsLeft && (flight.seatsLeft as number) <= 5 && (
                <p className="text-xs text-rose-600 font-medium mb-3">
                  Apenas {flight.seatsLeft as number} vagas restantes!
                </p>
              )}
              <Button className="w-full mb-2 gap-2" asChild>
                <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Comprar passagem
                </a>
              </Button>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link href="/alertas">
                  <Award className="w-4 h-4" />
                  Criar alerta de preço
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Best miles option */}
          {best && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  Melhor opção com milhas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Programa</span>
                  <span className="font-semibold">{best.programName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Milhas</span>
                  <span className="font-semibold">{formatMiles(best.milesRequired)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxas</span>
                  <span className="font-semibold">{formatCurrency(best.taxes)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Valor/milha</span>
                  <span className="font-bold text-emerald-600">R$ {best.estimatedMileValue.toFixed(3)}</span>
                </div>
                <Badge variant={best.rating === "excellent" ? "success" : best.rating === "good" ? "warning" : "secondary"} className="w-full justify-center">
                  {best.ratingLabel}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* All programs compact */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Todos os programas</p>
            {quotes.slice(0, 3).map((q) => (
              <MilesProgramCard key={q.programId} quote={q} cashPrice={flight.priceTotal} isBest={best?.programId === q.programId} />
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs" asChild>
              <Link href="/milhas">Ver comparação completa</Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
