import type { CabinClass } from "@/types/flight";

interface BookingLinkParams {
  airlineCode: string;
  origin: string;
  destination: string;
  departureDate: string;   // YYYY-MM-DD
  returnDate?: string;     // YYYY-MM-DD
  adults: number;
  cabin: CabinClass;
}

// ---------------------------------------------------------------------------
// Aviasales — link principal com afiliado (marker do Travelpayouts)
// Formato da rota: /search/{ORIGIN}{DDMM}{DESTINATION}{ADULTS}
// Exemplo: /search/GRU1009LIS1  → GRU→LIS em 10/09, 1 adulto
// ---------------------------------------------------------------------------

const AVIASALES_MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER ?? "";

function formatDateForAviasales(dateStr: string): string {
  // YYYY-MM-DD → DDMM
  if (!dateStr || dateStr.length < 10) return "";
  const day = dateStr.slice(8, 10);
  const month = dateStr.slice(5, 7);
  return `${day}${month}`;
}

function aviasalesLink({
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
}: BookingLinkParams): string {
  const dep = formatDateForAviasales(departureDate);
  const ret = returnDate ? formatDateForAviasales(returnDate) : "";
  const pax = Math.max(1, adults);

  // Rota de ida: /search/GRU1009LIS1
  // Ida e volta: /search/GRU1009LIS2010GRU1  (destino+dataVolta+origem+pax)
  let path: string;
  if (returnDate && ret) {
    path = `/search/${origin}${dep}${destination}${ret}${origin}${pax}`;
  } else {
    path = `/search/${origin}${dep}${destination}${pax}`;
  }

  const marker = AVIASALES_MARKER;
  const base = "https://www.aviasales.com";

  return marker
    ? `${base}${path}?marker=${marker}`
    : `${base}${path}`;
}

// ---------------------------------------------------------------------------
// Deep links por companhia — usados como fallback quando Aviasales não cobre
// ---------------------------------------------------------------------------

const latinCabinMap: Record<CabinClass, string> = {
  economy: "Y",
  premium_economy: "W",
  business: "C",
  first: "F",
};

const aaCabinMap: Record<CabinClass, string> = {
  economy: "coach",
  premium_economy: "premium_coach",
  business: "business",
  first: "first",
};

function latamLink({ origin, destination, departureDate, returnDate, adults, cabin }: BookingLinkParams): string {
  const p = new URLSearchParams({
    origin,
    destination,
    outbound: departureDate,
    adults: String(adults),
    children: "0",
    infants: "0",
    cabin: latinCabinMap[cabin] ?? "Y",
    trip: returnDate ? "RT" : "OW",
  });
  if (returnDate) p.set("inbound", returnDate);
  return `https://www.latamairlines.com/br/pt/oferta-voos?${p.toString()}`;
}

function golLink({ origin, destination, departureDate, returnDate, adults }: BookingLinkParams): string {
  const p = new URLSearchParams({
    departure: origin,
    arrival: destination,
    departureDate,
    adults: String(adults),
    type: returnDate ? "RT" : "OW",
  });
  if (returnDate) p.set("returnDate", returnDate);
  return `https://www.voegol.com.br/compre/voos-disponiveis?${p.toString()}`;
}

function azulLink({ origin, destination, departureDate, returnDate, adults }: BookingLinkParams): string {
  const p = new URLSearchParams({
    departure: origin,
    arrival: destination,
    departureDate,
    adults: String(adults),
  });
  if (returnDate) p.set("returnDate", returnDate);
  return `https://www.voeazul.com.br/br/pt/home/flight-search#/flight-results?${p.toString()}`;
}

function tapLink({ origin, destination, departureDate, returnDate, adults }: BookingLinkParams): string {
  const p = new URLSearchParams({
    origin,
    destination,
    date: departureDate,
    adults: String(adults),
    triptype: returnDate ? "R" : "S",
  });
  if (returnDate) p.set("returndate", returnDate);
  return `https://www.flytap.com/pt-br/flight-search#/flight-results?${p.toString()}`;
}

function americanLink({ origin, destination, departureDate, returnDate, adults, cabin }: BookingLinkParams): string {
  const p = new URLSearchParams({
    locale: "pt_BR",
    pax: String(adults),
    adult: String(adults),
    type: returnDate ? "RoundTrip" : "OneWay",
    searchType: "O",
    cabin: aaCabinMap[cabin] ?? "coach",
    carriers: "AA",
    "slice_0_origin": origin,
    "slice_0_destination": destination,
    "slice_0_date": departureDate,
  });
  if (returnDate) {
    p.set("slice_1_origin", destination);
    p.set("slice_1_destination", origin);
    p.set("slice_1_date", returnDate);
  }
  return `https://www.aa.com/booking/search?${p.toString()}`;
}

// ---------------------------------------------------------------------------
// Dispatcher principal
// Prioridade: Aviasales (afiliado) → companhia específica → Google Flights
// ---------------------------------------------------------------------------

/**
 * Retorna o link externo de compra para uma oferta de voo.
 *
 * Para rotas domésticas brasileiras (ambos os IATAs brasileiros):
 *   → deep link da companhia aérea (GOL, LATAM, Azul)
 *
 * Para rotas internacionais:
 *   → Aviasales com afiliado (marker Travelpayouts)
 */
export function buildBookingLink(params: BookingLinkParams): string {
  const { airlineCode, origin, destination } = params;

  // Aeroportos domésticos brasileiros
  const BR_IATAS = new Set([
    "GRU","CGH","GIG","SDU","BSB","SSA","FOR","REC","POA","CWB",
    "BEL","MAO","FLN","VCP","MCZ","NAT","GYN","CNF","PLU","THE",
    "CGB","CGB","PMW","THE","IGU","JPA","SLZ","VIX","MGF","LDB",
  ]);

  const isDomestic = BR_IATAS.has(origin) && BR_IATAS.has(destination);

  // Rotas domésticas → companhia direta
  if (isDomestic) {
    if (airlineCode === "LA" || airlineCode === "JJ") return latamLink(params);
    if (airlineCode === "G3") return golLink(params);
    if (airlineCode === "AD") return azulLink(params);
    // Fallback doméstico: Aviasales com afiliado
    return aviasalesLink(params);
  }

  // Companhias com link direto confiável
  if (airlineCode === "TP") return tapLink(params);
  if (airlineCode === "AA") return americanLink(params);

  // Demais rotas internacionais → Aviasales (afiliado)
  return aviasalesLink(params);
}

/** Nome comercial exibível da fonte da oferta */
export function offerSourceLabel(
  airlineCode: string,
  source: "mock" | "amadeus" | "travelpayouts",
): string {
  if (source === "mock") return "Dados simulados";
  const names: Record<string, string> = {
    LA: "LATAM Airlines",
    JJ: "LATAM Brasil",
    G3: "GOL Linhas Aéreas",
    AD: "Azul Linhas Aéreas",
    TP: "TAP Air Portugal",
    AA: "American Airlines",
    UA: "United Airlines",
    DL: "Delta Air Lines",
    AF: "Air France",
    KL: "KLM",
    IB: "Iberia",
    EK: "Emirates",
    QR: "Qatar Airways",
    TK: "Turkish Airlines",
    LH: "Lufthansa",
    BA: "British Airways",
  };
  return names[airlineCode] ?? airlineCode;
}
