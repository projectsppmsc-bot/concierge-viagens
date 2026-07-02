/**
 * API Route — Travelpayouts multi-endpoint search
 * Combina 3 endpoints em paralelo para maximizar resultados:
 *   1. prices_for_dates  (v3) — preços por data específica
 *   2. get_cheapest_tickets (v3) — melhores preços do mês
 *   3. v1/prices/cheap — cache legado com voos adicionais
 */
import { NextRequest, NextResponse } from "next/server";
import type { Flight, FlightSegment, CabinClass, FlightBadge } from "@/types/flight";
import { buildBookingLink, offerSourceLabel } from "@/utils/booking-links";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface TpFlight {
  origin: string;
  destination: string;
  origin_airport: string;
  destination_airport: string;
  price: number;
  airline: string;
  flight_number: number;
  transfers: number;
  duration: number;
  duration_to: number;
  duration_back: number;
  departure_at: string;
  return_at: string | null;
  link: string;
  actual: boolean;
  distance: number;
}

interface TpResponse {
  success: boolean;
  data: TpFlight[];
  currency: string;
  error: string | null;
}

// v1/prices/cheap retorna objeto keyed por airline
interface TpV1Ticket {
  price: number;
  airline: string;
  flight_number: number;
  departure_at: string;
  return_at: string;
  expires_at: string;
  transfers: number;
  origin: string;
  destination: string;
  origin_airport: string;
  destination_airport: string;
  duration: number;
  duration_to: number;
  duration_back: number;
  link: string;
}

interface TpV1Response {
  success: boolean;
  data: Record<string, Record<string, TpV1Ticket>>;
  currency: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const AIRLINE_NAMES: Record<string, string> = {
  LA: "LATAM Airlines", JJ: "LATAM Brasil",
  G3: "GOL Linhas Aéreas", AD: "Azul Linhas Aéreas",
  TP: "TAP Air Portugal", AA: "American Airlines",
  UA: "United Airlines", DL: "Delta Air Lines",
  AF: "Air France", KL: "KLM", IB: "Iberia",
  EK: "Emirates", QR: "Qatar Airways", TK: "Turkish Airlines",
  LH: "Lufthansa", BA: "British Airways", AZ: "ITA Airways",
  NH: "ANA", JL: "Japan Airlines", CM: "Copa Airlines",
  AV: "Avianca", AM: "Aeroméxico",
};

const CITY_NAMES: Record<string, string> = {
  SAO: "São Paulo", RIO: "Rio de Janeiro", BHZ: "Belo Horizonte",
  BSB: "Brasília", SSA: "Salvador", FOR: "Fortaleza",
  REC: "Recife", POA: "Porto Alegre", CWB: "Curitiba",
  FLN: "Florianópolis", BEL: "Belém", MAO: "Manaus",
  MCZ: "Maceió", NAT: "Natal", GYN: "Goiânia",
  THE: "Teresina", CGB: "Cuiabá", IGU: "Foz do Iguaçu",
  JPA: "João Pessoa", SLZ: "São Luís", VIX: "Vitória",
  NVT: "Navegantes", PMW: "Palmas", CXJ: "Caxias do Sul",
};

const AIRPORT_TO_CITY: Record<string, string> = {
  CGH: "SAO", GRU: "SAO", VCP: "SAO",
  SDU: "RIO", GIG: "RIO",
  PLU: "BHZ", CNF: "BHZ",
  BSB: "BSB", SSA: "SSA", FOR: "FOR",
  REC: "REC", POA: "POA", CWB: "CWB",
  FLN: "FLN", BEL: "BEL", MAO: "MAO",
  MCZ: "MCZ", NAT: "NAT", GYN: "GYN",
  THE: "THE", CGB: "CGB", IGU: "IGU",
  JPA: "JPA", SLZ: "SLZ", VIX: "VIX",
  NVT: "NVT", PMW: "PMW", CXJ: "CXJ",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toCityCode(iata: string): string {
  return AIRPORT_TO_CITY[iata] ?? iata;
}

function airlineName(code: string): string {
  return AIRLINE_NAMES[code] ?? code;
}

function cityName(code: string): string {
  return CITY_NAMES[code] ?? code;
}

function addMinutes(isoDate: string, minutes: number): string {
  const d = new Date(isoDate);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function buildTpBookingLink(tpLink: string, marker?: string): string {
  if (marker) {
    return `https://tp.media/r?marker=${marker}&locale=pt&trs=288026&p=4114&host=aviasales.com${tpLink}`;
  }
  return `https://www.jetradar.com${tpLink}`;
}

function mapTpFlight(
  f: TpFlight,
  index: number,
  allPrices: number[],
  sp: { departureDate: string; returnDate?: string; adults: number; cabin: CabinClass; originIata: string; destIata: string },
  marker?: string,
): Flight {
  const cabin: CabinClass = sp.cabin ?? "economy";
  const departureAt = f.departure_at.endsWith("Z")
    ? f.departure_at.slice(0, -1)
    : f.departure_at;
  const arrivalAt = addMinutes(departureAt, f.duration_to || f.duration || 60);

  const originDisplay = (f.origin_airport && f.origin_airport !== f.origin)
    ? f.origin_airport : sp.originIata;
  const destDisplay = (f.destination_airport && f.destination_airport !== f.destination)
    ? f.destination_airport : sp.destIata;

  const segment: FlightSegment = {
    id: `tp-${f.airline}${f.flight_number}-0`,
    origin: originDisplay,
    originCity: cityName(f.origin),
    destination: destDisplay,
    destinationCity: cityName(f.destination),
    departureTime: departureAt,
    arrivalTime: arrivalAt,
    durationMinutes: f.duration_to || f.duration || 60,
    flightNumber: `${f.airline}${f.flight_number}`,
    airlineCode: f.airline,
    airlineName: airlineName(f.airline),
  };

  const minPrice = Math.min(...allPrices);
  const badges: FlightBadge[] = [];
  if (f.transfers === 0) badges.push("direct");
  if (f.price === minPrice) badges.push("best_price");
  if (index === 0) badges.push("best_value");

  const tpLink = f.link
    ? buildTpBookingLink(f.link, marker)
    : buildBookingLink({
        airlineCode: f.airline,
        origin: originDisplay,
        destination: destDisplay,
        departureDate: sp.departureDate,
        returnDate: sp.returnDate,
        adults: sp.adults,
        cabin,
      });

  return {
    id: `tp-${f.airline}${f.flight_number}-${index}`,
    segments: [segment],
    totalDurationMinutes: f.duration_to || f.duration || 60,
    stops: f.transfers,
    cabin,
    baggage: { carryOn: true, checked: 1, weightKg: 23 },
    priceTotal: f.price,
    pricePerLeg: f.price,
    currency: "BRL",
    badges,
    isRefundable: false,
    source: "travelpayouts",
    bookingLink: tpLink,
    offerSource: offerSourceLabel(f.airline, "amadeus"),
  };
}

// ---------------------------------------------------------------------------
// Fetchers por endpoint
// ---------------------------------------------------------------------------

async function fetchPricesForDates(
  origin: string, destination: string, isOneWay: boolean,
  departureDate: string, returnDate: string | undefined,
  token: string,
): Promise<TpFlight[]> {
  const allResults: TpFlight[] = [];
  const attempts: Array<Record<string, string>> = [];

  if (departureDate) {
    attempts.push({ departure_at: departureDate, ...(returnDate ? { return_at: returnDate } : {}) });
    const month = departureDate.slice(0, 7);
    attempts.push({ departure_at: month, ...(returnDate ? { return_at: returnDate.slice(0, 7) } : {}) });
  }
  attempts.push({});

  for (const dateExtra of attempts) {
    const params = new URLSearchParams({
      origin, destination, currency: "brl", limit: "30", page: "1",
      one_way: isOneWay ? "true" : "false", direct: "false",
      market: "br", locale: "pt", ...dateExtra,
    });
    try {
      const res = await fetch(
        `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params}`,
        { headers: { "x-access-token": token }, next: { revalidate: 3600 } },
      );
      if (!res.ok) continue;
      const data = await res.json() as TpResponse;
      if (!data.success) continue;
      const items = (data.data ?? []).filter((f) => f.price > 0);
      allResults.push(...items);
      if (items.length >= 5) break; // suficiente — para de tentar datas menos específicas
    } catch { continue; }
  }
  return allResults;
}

async function fetchCheapestTickets(
  origin: string, destination: string, isOneWay: boolean,
  departureDate: string, returnDate: string | undefined,
  token: string,
): Promise<TpFlight[]> {
  const params = new URLSearchParams({
    origin, destination, currency: "brl", limit: "30", page: "1",
    one_way: isOneWay ? "true" : "false", direct: "false",
    market: "br", locale: "pt", sorting: "price",
    ...(departureDate ? { departure_at: departureDate.slice(0, 7) } : {}),
    ...(returnDate ? { return_at: returnDate.slice(0, 7) } : {}),
  });
  try {
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/get_cheapest_tickets?${params}`,
      { headers: { "x-access-token": token }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json() as TpResponse;
    if (!data.success) return [];
    return (data.data ?? []).filter((f) => f.price > 0);
  } catch { return []; }
}

async function fetchV1Cheap(
  origin: string, destination: string,
  departureDate: string, returnDate: string | undefined,
  token: string,
): Promise<TpFlight[]> {
  const params = new URLSearchParams({
    origin, destination, currency: "brl",
    ...(departureDate ? { depart_date: departureDate.slice(0, 7) } : {}),
    ...(returnDate ? { return_date: returnDate.slice(0, 7) } : {}),
    token,
  });
  try {
    const res = await fetch(
      `https://api.travelpayouts.com/v1/prices/cheap?${params}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json() as TpV1Response;
    if (!data.success) return [];

    const results: TpFlight[] = [];
    const destData = data.data?.[destination] ?? {};
    for (const ticket of Object.values(destData)) {
      if (!ticket.price || ticket.price <= 0) continue;
      results.push({
        origin: ticket.origin ?? origin,
        destination: ticket.destination ?? destination,
        origin_airport: ticket.origin_airport ?? ticket.origin ?? origin,
        destination_airport: ticket.destination_airport ?? ticket.destination ?? destination,
        price: ticket.price,
        airline: ticket.airline,
        flight_number: ticket.flight_number,
        transfers: ticket.transfers ?? 0,
        duration: ticket.duration ?? 0,
        duration_to: ticket.duration_to ?? ticket.duration ?? 0,
        duration_back: ticket.duration_back ?? 0,
        departure_at: ticket.departure_at,
        return_at: ticket.return_at ?? null,
        link: ticket.link ?? "",
        actual: true,
        distance: 0,
      });
    }
    return results;
  } catch { return []; }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  const marker = process.env.TRAVELPAYOUTS_MARKER;

  if (!token) {
    return NextResponse.json({ error: "TRAVELPAYOUTS_TOKEN não configurado." }, { status: 500 });
  }

  try {
    const body = await req.json() as {
      origin: string; destination: string;
      departureDate: string; returnDate?: string;
      adults: number; cabin: string;
    };

    const origin = toCityCode(body.origin.toUpperCase());
    const destination = toCityCode(body.destination.toUpperCase());
    const isOneWay = !body.returnDate;

    // Dispara os 3 endpoints em paralelo
    const [r1, r2, r3] = await Promise.all([
      fetchPricesForDates(origin, destination, isOneWay, body.departureDate, body.returnDate, token),
      fetchCheapestTickets(origin, destination, isOneWay, body.departureDate, body.returnDate, token),
      fetchV1Cheap(origin, destination, body.departureDate, body.returnDate, token),
    ]);

    const all = [...r1, ...r2, ...r3];

    // Deduplica: mantém o menor preço por (companhia + número + data)
    const seen = new Map<string, TpFlight>();
    for (const f of all) {
      const key = `${f.airline}${f.flight_number}-${(f.departure_at ?? "").slice(0, 10)}`;
      const existing = seen.get(key);
      if (!existing || f.price < existing.price) seen.set(key, f);
    }

    const deduped = Array.from(seen.values());

    // As buscas por "mais barato do mês" (get_cheapest_tickets, v1/prices/cheap) não
    // respeitam a data exata pesquisada. Prioriza voos que batem com a data pedida;
    // só usa datas próximas se não houver nenhum voo na data exata.
    const requestedDate = body.departureDate ? body.departureDate.slice(0, 10) : "";
    const exactDateFlights = requestedDate
      ? deduped.filter((f) => (f.departure_at ?? "").slice(0, 10) === requestedDate)
      : deduped;
    const finalFlights = (exactDateFlights.length > 0 ? exactDateFlights : deduped)
      .sort((a, b) => a.price - b.price);
    const dateExact = !requestedDate || exactDateFlights.length > 0;

    const allPrices = finalFlights.map((f) => f.price);
    const cabin = (body.cabin ?? "economy") as CabinClass;
    const sp = {
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      adults: body.adults,
      cabin,
      originIata: body.origin.toUpperCase(),
      destIata: body.destination.toUpperCase(),
    };

    const flights = finalFlights.map((f, i) => mapTpFlight(f, i, allPrices, sp, marker));

    return NextResponse.json({ flights, dateExact });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
