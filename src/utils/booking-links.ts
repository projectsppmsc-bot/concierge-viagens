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
// Dispatcher principal
//
// Os deep links por companhia (LATAM, GOL, Azul, TAP, American) que existiam
// aqui eram URLs "adivinhadas" (nunca validadas contra os sites reais) e
// devolviam 404 em produção. O Aviasales tem um formato de busca documentado
// e confirmado funcional, então é usado como único fallback quando não há um
// link real vindo do provedor de dados (Travelpayouts).
// ---------------------------------------------------------------------------

export function buildBookingLink(params: BookingLinkParams): string {
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
