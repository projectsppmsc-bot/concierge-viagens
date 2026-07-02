import { NextRequest, NextResponse } from "next/server";
import type { Flight, FlightSegment, CabinClass, FlightBadge } from "@/types/flight";
import { buildBookingLink, offerSourceLabel } from "@/utils/booking-links";

// ---------------------------------------------------------------------------
// Token cache — módulo-level, dura enquanto o processo estiver ativo
// ---------------------------------------------------------------------------
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAmadeusToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET não configurados.");
  }

  const base = process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";

  const res = await fetch(`${base}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Falha ao autenticar na Amadeus: ${res.status} — ${body}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  // Renova 60s antes de expirar
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

// ---------------------------------------------------------------------------
// Tipos da resposta Amadeus
// ---------------------------------------------------------------------------

interface AmadeusSegment {
  id: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  carrierCode: string;
  number: string;
  aircraft: { code: string };
  duration: string;
  numberOfStops: number;
}

interface AmadeusOffer {
  id: string;
  itineraries: {
    duration: string;
    segments: AmadeusSegment[];
  }[];
  price: { total: string; currency: string };
  travelerPricings: {
    fareDetailsBySegment: {
      segmentId: string;
      cabin: string;
      includedCheckedBags?: { quantity: number; weight?: number; weightUnit?: string };
    }[];
  }[];
  numberOfBookableSeats?: number;
  lastTicketingDate?: string;
}

interface AmadeusDictionaries {
  carriers?: Record<string, string>;
  aircraft?: Record<string, string>;
  locations?: Record<string, { cityCode: string; countryCode: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isoDurationToMinutes(iso: string): number {
  const m = iso.match(/PT?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? "0") * 60) + parseInt(m[2] ?? "0");
}

function mapCabin(amadeus: string): CabinClass {
  const map: Record<string, CabinClass> = {
    ECONOMY: "economy",
    PREMIUM_ECONOMY: "premium_economy",
    BUSINESS: "business",
    FIRST: "first",
  };
  return map[amadeus] ?? "economy";
}

interface MappingContext {
  dicts: AmadeusDictionaries;
  allPrices: number[];
  index: number;
  searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    cabin: CabinClass;
  };
}

function mapOffer(offer: AmadeusOffer, ctx: MappingContext): Flight {
  const { dicts, allPrices, index, searchParams } = ctx;
  const firstItin = offer.itineraries[0];
  const firstDetail = offer.travelerPricings[0]?.fareDetailsBySegment ?? [];
  const priceTotal = Math.round(parseFloat(offer.price.total));

  // Classe de cabine (primeira perna)
  const cabinCode = firstDetail[0]?.cabin ?? "ECONOMY";
  const cabin = mapCabin(cabinCode);

  // Bagagem (primeira perna)
  const bags = firstDetail[0]?.includedCheckedBags;
  const baggage = {
    carryOn: true,
    checked: bags?.quantity ?? 0,
    weightKg: bags?.weight ?? undefined,
  };

  // Segmentos
  const stops = firstItin.segments.length - 1;
  const segments: FlightSegment[] = firstItin.segments.map((seg, i) => {
    const nextSeg = firstItin.segments[i + 1];

    let stopoverMinutes: number | undefined;
    if (nextSeg) {
      const arrMs = new Date(seg.arrival.at).getTime();
      const depMs = new Date(nextSeg.departure.at).getTime();
      stopoverMinutes = Math.round((depMs - arrMs) / 60000);
    }

    const airlineCode = seg.carrierCode;
    const airlineName = dicts.carriers?.[airlineCode] ?? airlineCode;
    const aircraftCode = seg.aircraft?.code ?? "";
    const aircraftName = dicts.aircraft?.[aircraftCode] ?? aircraftCode;

    // cityCode da Amadeus é um código de 3 letras de cidade (ex: "SAO"), não nome.
    // Usamos iataCode como fallback legível se não há nome mapeado.
    const originCity =
      dicts.locations?.[seg.departure.iataCode]?.cityCode ?? seg.departure.iataCode;
    const destCity =
      dicts.locations?.[seg.arrival.iataCode]?.cityCode ?? seg.arrival.iataCode;

    return {
      id: `${offer.id}-seg-${i}`,
      origin: seg.departure.iataCode,
      originCity,
      destination: seg.arrival.iataCode,
      destinationCity: destCity,
      departureTime: seg.departure.at,
      arrivalTime: seg.arrival.at,
      durationMinutes: isoDurationToMinutes(seg.duration),
      flightNumber: `${seg.carrierCode}${seg.number}`,
      airlineCode,
      airlineName,
      aircraft: aircraftName || undefined,
      stopoverMinutes,
    };
  });

  // Badges
  const badges: FlightBadge[] = [];
  if (stops === 0) badges.push("direct");
  const minPrice = Math.min(...allPrices);
  if (priceTotal === minPrice) badges.push("best_price");
  if (index === 0) badges.push("best_value");

  // Link de compra: deep link por companhia da primeira perna
  const firstAirline = segments[0]?.airlineCode ?? "";
  const bookingLink = buildBookingLink({
    airlineCode: firstAirline,
    origin: searchParams.origin,
    destination: searchParams.destination,
    departureDate: searchParams.departureDate,
    returnDate: searchParams.returnDate,
    adults: searchParams.adults,
    cabin,
  });

  const offerSource = offerSourceLabel(firstAirline, "amadeus" as "mock" | "amadeus" | "travelpayouts");

  return {
    id: `amadeus-${offer.id}`,
    segments,
    totalDurationMinutes: isoDurationToMinutes(firstItin.duration),
    stops,
    cabin,
    baggage,
    priceTotal,
    pricePerLeg: priceTotal,
    currency: "BRL",
    seatsLeft: offer.numberOfBookableSeats,
    badges,
    isRefundable: false,
    source: "amadeus",
    bookingLink,
    offerSource,
    amadeusOfferId: offer.id,
  };
}

// ---------------------------------------------------------------------------
// Handler POST /api/flights/search
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      origin: string;
      destination: string;
      departureDate: string;
      returnDate?: string;
      adults: number;
      children?: number;
      infants?: number;
      cabin: string;
      nonStop?: boolean;
    };

    const token = await getAmadeusToken();
    const base = process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";

    const cabinMap: Record<string, string> = {
      economy: "ECONOMY",
      premium_economy: "PREMIUM_ECONOMY",
      business: "BUSINESS",
      first: "FIRST",
    };

    const params = new URLSearchParams({
      originLocationCode: body.origin,
      destinationLocationCode: body.destination,
      departureDate: body.departureDate,
      adults: String(body.adults),
      currencyCode: "BRL",
      max: "20",
    });

    if (body.returnDate) params.set("returnDate", body.returnDate);
    if (body.children && body.children > 0) params.set("children", String(body.children));
    if (body.infants && body.infants > 0) params.set("infants", String(body.infants));
    if (body.cabin && cabinMap[body.cabin]) params.set("travelClass", cabinMap[body.cabin]);
    if (body.nonStop) params.set("nonStop", "true");

    const apiRes = await fetch(
      `${base}/v2/shopping/flight-offers?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return NextResponse.json(
        { error: `Amadeus retornou ${apiRes.status}`, detail: err },
        { status: apiRes.status },
      );
    }

    const data = await apiRes.json() as {
      data: AmadeusOffer[];
      dictionaries?: AmadeusDictionaries;
    };

    const offers = data.data ?? [];
    const dicts = data.dictionaries ?? {};
    const allPrices = offers.map((o) => Math.round(parseFloat(o.price.total)));

    const cabin = (body.cabin ?? "economy") as CabinClass;

    const flights = offers.map((o, i) =>
      mapOffer(o, {
        dicts,
        allPrices,
        index: i,
        searchParams: {
          origin: body.origin,
          destination: body.destination,
          departureDate: body.departureDate,
          returnDate: body.returnDate,
          adults: body.adults,
          cabin,
        },
      }),
    );

    return NextResponse.json({ flights });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
