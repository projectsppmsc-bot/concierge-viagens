/**
 * Busca promoções reais do Travelpayouts — rotas populares com os menores preços encontrados.
 */
import { NextResponse } from "next/server";

interface TpFlight {
  price: number; airline: string; flight_number: number;
  transfers: number; departure_at: string; actual: boolean;
}
interface TpResponse { success: boolean; data: TpFlight[]; }

const PROMO_ROUTES = [
  { origin: "SAO", destination: "LIS", originCity: "São Paulo", destinationCity: "Lisboa",        flag: "🇵🇹", type: "international", tags: ["Europa", "Bagagem inclusa"] },
  { origin: "SAO", destination: "MIA", originCity: "São Paulo", destinationCity: "Miami",         flag: "🌴", type: "international", tags: ["EUA", "Direto"] },
  { origin: "SAO", destination: "MAD", originCity: "São Paulo", destinationCity: "Madrid",        flag: "🇪🇸", type: "international", tags: ["Europa"] },
  { origin: "SAO", destination: "SSA", originCity: "São Paulo", destinationCity: "Salvador",      flag: "🏖️", type: "domestic",      tags: ["Nordeste", "Direto"] },
  { origin: "SAO", destination: "REC", originCity: "São Paulo", destinationCity: "Recife",        flag: "🦀", type: "domestic",      tags: ["Nordeste"] },
  { origin: "SAO", destination: "FOR", originCity: "São Paulo", destinationCity: "Fortaleza",     flag: "☀️", type: "domestic",      tags: ["Nordeste", "Praia"] },
  { origin: "SAO", destination: "FLN", originCity: "São Paulo", destinationCity: "Florianópolis", flag: "🏄", type: "domestic",      tags: ["Sul", "Praia"] },
  { origin: "SAO", destination: "CWB", originCity: "São Paulo", destinationCity: "Curitiba",      flag: "🌲", type: "domestic",      tags: ["Sul", "Direto"] },
  { origin: "RIO", destination: "LIS", originCity: "Rio de Janeiro", destinationCity: "Lisboa",   flag: "🇵🇹", type: "international", tags: ["Europa"] },
  { origin: "SAO", destination: "EZE", originCity: "São Paulo", destinationCity: "Buenos Aires",  flag: "🇦🇷", type: "international", tags: ["América do Sul"] },
  { origin: "SAO", destination: "SCL", originCity: "São Paulo", destinationCity: "Santiago",      flag: "🇨🇱", type: "international", tags: ["América do Sul"] },
  { origin: "SAO", destination: "CDG", originCity: "São Paulo", destinationCity: "Paris",         flag: "🇫🇷", type: "international", tags: ["Europa"] },
];

const AIRLINE_NAMES: Record<string, string> = {
  LA: "LATAM Airlines", JJ: "LATAM Brasil", G3: "GOL", AD: "Azul",
  TP: "TAP Air Portugal", AA: "American Airlines", UA: "United",
  DL: "Delta", AF: "Air France", IB: "Iberia", KL: "KLM",
};

async function fetchLowest(origin: string, destination: string, token: string) {
  try {
    const params = new URLSearchParams({
      origin, destination, currency: "brl", limit: "5",
      one_way: "true", direct: "false", market: "br", sorting: "price",
    });
    // Tenta get_cheapest_tickets primeiro
    const r1 = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/get_cheapest_tickets?${params}`,
      { headers: { "x-access-token": token }, next: { revalidate: 3600 } },
    );
    if (r1.ok) {
      const d = await r1.json() as TpResponse;
      const valid = (d.data ?? []).filter((f) => f.price > 0);
      if (valid.length) {
        valid.sort((a, b) => a.price - b.price);
        return { price: valid[0].price, airline: valid[0].airline, transfers: valid[0].transfers, departure_at: valid[0].departure_at };
      }
    }
    // Fallback: prices_for_dates sem data
    const r2 = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params}`,
      { headers: { "x-access-token": token }, next: { revalidate: 3600 } },
    );
    if (!r2.ok) return null;
    const d2 = await r2.json() as TpResponse;
    const valid2 = (d2.data ?? []).filter((f) => f.price > 0);
    if (!valid2.length) return null;
    valid2.sort((a, b) => a.price - b.price);
    return { price: valid2[0].price, airline: valid2[0].airline, transfers: valid2[0].transfers, departure_at: valid2[0].departure_at };
  } catch { return null; }
}

export async function GET() {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) return NextResponse.json({ promotions: [] }, { status: 500 });

  const results = await Promise.all(
    PROMO_ROUTES.map(async (route, i) => {
      const deal = await fetchLowest(route.origin, route.destination, token);
      if (!deal) return null;
      return {
        id: `promo-live-${i}`,
        ...route,
        price: deal.price,
        airline: AIRLINE_NAMES[deal.airline] ?? deal.airline,
        airlineCode: deal.airline,
        direct: deal.transfers === 0,
        departure_at: deal.departure_at,
      };
    }),
  );

  const promotions = results
    .filter(Boolean)
    .sort((a, b) => (a!.type === b!.type ? a!.price - b!.price : a!.type === "domestic" ? 1 : -1));

  return NextResponse.json({ promotions, updatedAt: new Date().toISOString() });
}
