/**
 * API Route — Sky Scrapper (RapidAPI)
 * Usa o endpoint searchFlights (Version 2) do sky-scrapper.p.rapidapi.com
 * para complementar os resultados do Travelpayouts com dados do Skyscanner.
 */
import { NextRequest, NextResponse } from "next/server";
import type { Flight, FlightSegment, CabinClass, FlightBadge } from "@/types/flight";
import { buildBookingLink } from "@/utils/booking-links";

// ---------------------------------------------------------------------------
// Tipos Sky Scrapper
// ---------------------------------------------------------------------------

interface SkyAirportResult {
  skyId: string;
  entityId: string;
  presentation: { title: string; suggestionTitle: string; subtitle: string };
  navigation: { entityId: string; entityType: string; localizedName: string };
}

interface SkyLeg {
  id: string;
  origin: { id: string; entityId: string; name: string; displayCode: string; city: string };
  destination: { id: string; entityId: string; name: string; displayCode: string; city: string };
  durationInMinutes: number;
  stopCount: number;
  departure: string;
  arrival: string;
  carriers: { marketing: Array<{ id: number; alternateId: string; logoUrl: string; name: string }> };
  segments: Array<{
    id: string;
    origin: { flightPlaceId: string; displayCode: string; name: string; city: string };
    destination: { flightPlaceId: string; displayCode: string; name: string; city: string };
    departure: string;
    arrival: string;
    durationInMinutes: number;
    flightNumber: string;
    marketingCarrier: { id: number; name: string; alternateId: string };
  }>;
}

interface SkyItinerary {
  id: string;
  price: { raw: number; formatted: string };
  legs: SkyLeg[];
  score: number;
  deeplink?: string;
}

interface SkyResponse {
  status: boolean;
  data: {
    itineraries?: SkyItinerary[];
    context?: { status: string; totalResults: number };
  };
}

// ---------------------------------------------------------------------------
// Cache de airport IDs (evita chamadas repetidas por aeroporto)
// ---------------------------------------------------------------------------

const airportCache = new Map<string, { skyId: string; entityId: string }>();

async function lookupAirport(
  iata: string,
  apiKey: string,
): Promise<{ skyId: string; entityId: string } | null> {
  if (airportCache.has(iata)) return airportCache.get(iata)!;

  try {
    const res = await fetch(
      `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${iata}&locale=pt-BR`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
        next: { revalidate: 86400 }, // cache 24h — aeroportos não mudam
      },
    );
    if (!res.ok) return null;
    const data = await res.json() as { status: boolean; data: SkyAirportResult[] };
    if (!data.status || !data.data?.length) return null;

    // Prefere resultado com displayCode igual ao IATA buscado
    const exact = data.data.find(
      (a) =>
        a.skyId?.toUpperCase() === iata ||
        a.navigation?.entityType === "AIRPORT",
    );
    const result = exact ?? data.data[0];
    const entry = { skyId: result.skyId, entityId: result.entityId || result.navigation?.entityId };
    airportCache.set(iata, entry);
    return entry;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

const AIRLINE_NAMES: Record<string, string> = {
  LA: "LATAM Airlines", JJ: "LATAM Brasil",
  G3: "GOL Linhas Aéreas", AD: "Azul Linhas Aéreas",
  TP: "TAP Air Portugal", AA: "American Airlines",
  UA: "United Airlines", DL: "Delta Air Lines",
  AF: "Air France", KL: "KLM", IB: "Iberia",
  EK: "Emirates", QR: "Qatar Airways", TK: "Turkish Airlines",
  LH: "Lufthansa", BA: "British Airways",
};

function mapSkyItinerary(
  it: SkyItinerary,
  index: number,
  allPrices: number[],
  sp: { departureDate: string; returnDate?: string; adults: number; cabin: CabinClass },
): Flight | null {
  const leg = it.legs?.[0];
  if (!leg) return null;

  const airlineCode = leg.carriers?.marketing?.[0]?.alternateId ?? "??";
  const airlineName = leg.carriers?.marketing?.[0]?.name ?? AIRLINE_NAMES[airlineCode] ?? airlineCode;
  const flightNumber = leg.segments?.[0]?.flightNumber ?? `${airlineCode}0`;

  const segments: FlightSegment[] = leg.segments?.length
    ? leg.segments.map((s, si) => ({
        id: `sky-${it.id}-${si}`,
        origin: s.origin.flightPlaceId || s.origin.displayCode,
        originCity: s.origin.city || s.origin.name,
        destination: s.destination.flightPlaceId || s.destination.displayCode,
        destinationCity: s.destination.city || s.destination.name,
        departureTime: s.departure,
        arrivalTime: s.arrival,
        durationMinutes: s.durationInMinutes,
        flightNumber: s.flightNumber,
        airlineCode: s.marketingCarrier?.alternateId ?? airlineCode,
        airlineName: s.marketingCarrier?.name ?? airlineName,
      }))
    : [{
        id: `sky-${it.id}-0`,
        origin: leg.origin.displayCode,
        originCity: leg.origin.city,
        destination: leg.destination.displayCode,
        destinationCity: leg.destination.city,
        departureTime: leg.departure,
        arrivalTime: leg.arrival,
        durationMinutes: leg.durationInMinutes,
        flightNumber,
        airlineCode,
        airlineName,
      }];

  const price = it.price?.raw ?? 0;
  if (price <= 0) return null;

  const minPrice = Math.min(...allPrices);
  const badges: FlightBadge[] = [];
  if (leg.stopCount === 0) badges.push("direct");
  if (price === minPrice) badges.push("best_price");
  if (index === 0) badges.push("best_value");

  const bookingLink = it.deeplink ?? buildBookingLink({
    airlineCode,
    origin: leg.origin.displayCode,
    destination: leg.destination.displayCode,
    departureDate: sp.departureDate,
    returnDate: sp.returnDate,
    adults: sp.adults,
    cabin: sp.cabin,
  });

  return {
    id: `sky-${it.id}`,
    segments,
    totalDurationMinutes: leg.durationInMinutes,
    stops: leg.stopCount,
    cabin: sp.cabin,
    baggage: { carryOn: true, checked: 0 },
    priceTotal: price,
    pricePerLeg: price,
    currency: "BRL",
    badges,
    isRefundable: false,
    source: "travelpayouts", // reutiliza badge "voo real"
    bookingLink,
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RAPIDAPI_KEY não configurado." }, { status: 500 });
  }

  try {
    const body = await req.json() as {
      origin: string; destination: string;
      departureDate: string; returnDate?: string;
      adults: number; cabin: string;
    };

    const originIata = body.origin.toUpperCase();
    const destIata = body.destination.toUpperCase();

    // Busca entityIds em paralelo
    const [originInfo, destInfo] = await Promise.all([
      lookupAirport(originIata, apiKey),
      lookupAirport(destIata, apiKey),
    ]);

    if (!originInfo || !destInfo) {
      return NextResponse.json({ flights: [] });
    }

    const cabin = (body.cabin ?? "economy") as CabinClass;
    const params = new URLSearchParams({
      originSkyId: originInfo.skyId,
      destinationSkyId: destInfo.skyId,
      originEntityId: originInfo.entityId,
      destinationEntityId: destInfo.entityId,
      cabinClass: cabin,
      adults: String(body.adults ?? 1),
      sortBy: "best",
      currency: "BRL",
      market: "pt-BR",
      countryCode: "BR",
      ...(body.departureDate ? { date: body.departureDate } : {}),
      ...(body.returnDate ? { returnDate: body.returnDate } : {}),
    });

    const res = await fetch(
      `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?${params}`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
        next: { revalidate: 1800 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ flights: [] });
    }

    const data = await res.json() as SkyResponse;
    const itineraries = data.data?.itineraries ?? [];

    const allPrices = itineraries.map((it) => it.price?.raw ?? 0).filter((p) => p > 0);
    const sp = { departureDate: body.departureDate, returnDate: body.returnDate, adults: body.adults, cabin };

    const flights = itineraries
      .map((it, i) => mapSkyItinerary(it, i, allPrices, sp))
      .filter((f): f is Flight => f !== null);

    return NextResponse.json({ flights });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message, flights: [] }, { status: 500 });
  }
}
