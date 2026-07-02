/**
 * Busca preços reais para rotas populares — usada pelo Dashboard.
 * Chama Travelpayouts get_cheapest_tickets para cada rota em paralelo.
 */
import { NextResponse } from "next/server";

interface TpFlight {
  price: number;
  airline: string;
  flight_number: number;
  transfers: number;
  departure_at: string;
  duration_to: number;
}
interface TpResponse { success: boolean; data: TpFlight[]; }

const POPULAR_ROUTES = [
  { origin: "SAO", destination: "SSA", label: "São Paulo → Salvador",     flag: "🏖️" },
  { origin: "SAO", destination: "FLN", label: "São Paulo → Florianópolis", flag: "🏄" },
  { origin: "SAO", destination: "REC", label: "São Paulo → Recife",        flag: "🦀" },
  { origin: "SAO", destination: "FOR", label: "São Paulo → Fortaleza",     flag: "☀️" },
  { origin: "SAO", destination: "POA", label: "São Paulo → Porto Alegre",  flag: "🍷" },
  { origin: "SAO", destination: "BSB", label: "São Paulo → Brasília",      flag: "🏛️" },
  { origin: "SAO", destination: "LIS", label: "São Paulo → Lisboa",        flag: "🇵🇹" },
  { origin: "SAO", destination: "MIA", label: "São Paulo → Miami",         flag: "🌴" },
  { origin: "SAO", destination: "MAD", label: "São Paulo → Madrid",        flag: "🇪🇸" },
  { origin: "RIO", destination: "SSA", label: "Rio → Salvador",            flag: "🎭" },
];

async function fetchCheapest(
  origin: string, destination: string, token: string,
): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      origin, destination, currency: "brl",
      limit: "5", one_way: "true", direct: "false",
      market: "br", sorting: "price",
    });
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/get_cheapest_tickets?${params}`,
      { headers: { "x-access-token": token }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json() as TpResponse;
    if (!data.success || !data.data?.length) return null;
    const prices = data.data.filter((f) => f.price > 0).map((f) => f.price);
    return prices.length ? Math.min(...prices) : null;
  } catch { return null; }
}

export async function GET() {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) return NextResponse.json({ error: "Token não configurado" }, { status: 500 });

  const results = await Promise.all(
    POPULAR_ROUTES.map(async (route) => {
      const price = await fetchCheapest(route.origin, route.destination, token);
      return { ...route, price };
    }),
  );

  const withPrices = results.filter((r) => r.price !== null);
  return NextResponse.json({ routes: withPrices, updatedAt: new Date().toISOString() });
}
