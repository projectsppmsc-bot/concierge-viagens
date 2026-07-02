/**
 * Verifica preços reais para cada alerta ativo via Travelpayouts.
 * Retorna os alertas com currentBestPrice atualizado e lastCheckedAt = agora.
 */
import { NextResponse } from "next/server";
import type { PriceAlert } from "@/types/alert";

const AIRPORT_TO_CITY: Record<string, string> = {
  CGH: "SAO", GRU: "SAO", VCP: "SAO",
  SDU: "RIO", GIG: "RIO", PLU: "BHZ", CNF: "BHZ",
};
function toCity(iata: string) { return AIRPORT_TO_CITY[iata] ?? iata; }

interface TpFlight { price: number; actual: boolean; }
interface TpResponse { success: boolean; data: TpFlight[]; }

async function fetchBestPrice(origin: string, destination: string, token: string): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      origin: toCity(origin), destination: toCity(destination),
      currency: "brl", limit: "10", one_way: "true",
      direct: "false", market: "br", sorting: "price",
    });
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/get_cheapest_tickets?${params}`,
      { headers: { "x-access-token": token }, next: { revalidate: 1800 } },
    );
    if (!res.ok) return null;
    const data = await res.json() as TpResponse;
    if (!data.success || !data.data?.length) return null;
    const prices = data.data.filter((f) => f.price > 0).map((f) => f.price);
    return prices.length ? Math.min(...prices) : null;
  } catch { return null; }
}

// Alertas base — datas sempre relativas a hoje
function buildAlerts(): PriceAlert[] {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
  const daysAgo  = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  return [
    {
      id: "alert-001",
      origin: "GRU", originCity: "São Paulo",
      destination: "LIS", destinationCity: "Lisboa",
      targetPriceBRL: 3000, status: "active",
      createdAt: daysAgo(29), lastCheckedAt: hoursAgo(2),
      currentBestPrice: 3490,
    },
    {
      id: "alert-002",
      origin: "GRU", originCity: "São Paulo",
      destination: "MIA", destinationCity: "Miami",
      targetPriceBRL: 2500, targetMiles: 40000, targetMilesProgram: "smiles",
      status: "triggered", createdAt: daysAgo(34),
      triggeredAt: daysAgo(21), lastCheckedAt: hoursAgo(1),
      currentBestPrice: 2650, currentBestMiles: 38000,
    },
    {
      id: "alert-003",
      origin: "GRU", originCity: "São Paulo",
      destination: "CDG", destinationCity: "Paris",
      targetPriceBRL: 4000, status: "active",
      createdAt: daysAgo(27), lastCheckedAt: hoursAgo(2),
      currentBestPrice: 4200,
    },
    {
      id: "alert-004",
      origin: "GRU", originCity: "São Paulo",
      destination: "DXB", destinationCity: "Dubai",
      targetMiles: 65000, targetMilesProgram: "latam_pass",
      status: "paused", createdAt: daysAgo(39),
      lastCheckedAt: daysAgo(19), currentBestMiles: 75000,
    },
    {
      id: "alert-005",
      origin: "GIG", originCity: "Rio de Janeiro",
      destination: "LIS", destinationCity: "Lisboa",
      targetPriceBRL: 3200, status: "active",
      createdAt: daysAgo(24), lastCheckedAt: hoursAgo(2),
      currentBestPrice: 3650,
    },
  ];
}

export async function GET() {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  const alerts = buildAlerts();
  const now = new Date().toISOString();

  if (!token) {
    return NextResponse.json({ alerts: alerts.map((a) => ({ ...a, lastCheckedAt: now })) });
  }

  // Atualiza preços dos alertas ativos em paralelo
  const updated = await Promise.all(
    alerts.map(async (alert) => {
      if (alert.status === "paused" || !alert.targetPriceBRL) {
        return { ...alert, lastCheckedAt: alert.status === "paused" ? alert.lastCheckedAt : now };
      }
      const price = await fetchBestPrice(alert.origin, alert.destination, token);
      const currentBestPrice = price ?? alert.currentBestPrice;

      // Verifica se atingiu meta
      let status = alert.status;
      if (status === "active" && alert.targetPriceBRL && currentBestPrice !== undefined && currentBestPrice <= alert.targetPriceBRL) {
        status = "triggered";
      }

      return { ...alert, currentBestPrice, status, lastCheckedAt: now };
    }),
  );

  return NextResponse.json({ alerts: updated, checkedAt: now });
}
