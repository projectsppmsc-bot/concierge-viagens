import type { FlightProvider } from "./types";
import type { SearchQuery } from "@/types/search";
import type { Flight } from "@/types/flight";
import { mockFlights } from "@/mock/flights";
import { MOCK_DELAY_MS } from "@/lib/constants";

const VALID_IATA = /^[A-Z]{3}$/;

export const mockProvider: FlightProvider = {
  async search(query: SearchQuery): Promise<Flight[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const originIata  = query.origin.trim().toUpperCase();
    const destIata    = query.destination.trim().toUpperCase();
    const hasOrigin   = VALID_IATA.test(originIata);
    const hasDest     = VALID_IATA.test(destIata);

    // ── Caso 1: rota completa (ambos IATAs válidos) ──────────────────────────
    if (hasOrigin && hasDest) {
      const exact = mockFlights.filter((f) => {
        const o = f.segments[0]?.origin;
        const d = f.segments[f.segments.length - 1]?.destination;
        return o === originIata && d === destIata;
      });
      // Se encontrou voos para a rota exata, retorna
      if (exact.length > 0) return exact;

      // Rota não tem mock → devolve amostra de voos do mesmo tipo
      // (doméstico vs. internacional) para não deixar vazio
      const isDomestic = isBrazilian(originIata) && isBrazilian(destIata);
      const sample = mockFlights
        .filter((f) => {
          const o = f.segments[0]?.origin ?? "";
          const d = f.segments[f.segments.length - 1]?.destination ?? "";
          if (isDomestic) return isBrazilian(o) && isBrazilian(d);
          return !isBrazilian(o) || !isBrazilian(d);
        })
        .slice(0, 6);
      return sample;
    }

    // ── Caso 2: só origem ────────────────────────────────────────────────────
    if (hasOrigin) {
      return mockFlights.filter((f) => f.segments[0]?.origin === originIata).slice(0, 8);
    }

    // ── Caso 3: só destino ───────────────────────────────────────────────────
    if (hasDest) {
      return mockFlights
        .filter((f) => f.segments[f.segments.length - 1]?.destination === destIata)
        .slice(0, 8);
    }

    // ── Caso 4: nenhum IATA → amostra dos melhores preços ───────────────────
    return [...mockFlights].sort((a, b) => a.priceTotal - b.priceTotal).slice(0, 10);
  },

  async getById(id: string): Promise<Flight | null> {
    return mockFlights.find((f) => f.id === id) ?? null;
  },
};

// Aeroportos brasileiros conhecidos
const BR_SET = new Set([
  "GRU","CGH","GIG","SDU","BSB","SSA","FOR","REC","POA","CWB",
  "BEL","MAO","FLN","VCP","MCZ","NAT","GYN","CNF","PLU","THE",
  "CGB","IGU","JPA","SLZ","VIX","MGF","LDB","PMW","CXJ","NVT",
]);

function isBrazilian(iata: string): boolean {
  return BR_SET.has(iata);
}
