import type { FlightProvider } from "./types";
import type { SearchQuery } from "@/types/search";
import type { Flight } from "@/types/flight";

/**
 * Provider combinado: Travelpayouts + Sky Scrapper em paralelo.
 * Os resultados são mesclados e deduplicados por (companhia + número + data).
 */
export const travelpayoutsProvider: FlightProvider = {
  async search(query: SearchQuery): Promise<Flight[]> {
    const body = {
      origin: query.origin,
      destination: query.destination,
      departureDate: query.departureDate,
      returnDate: query.returnDate,
      adults: query.passengers.adults,
      cabin: query.cabin,
    };

    // Dispara os dois providers em paralelo — falha de um não afeta o outro
    const [tpResult, skyResult] = await Promise.allSettled([
      fetch("/api/flights/search-tp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.ok ? r.json() as Promise<{ flights: Flight[] }> : Promise.resolve({ flights: [] })),

      fetch("/api/flights/search-sky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.ok ? r.json() as Promise<{ flights: Flight[] }> : Promise.resolve({ flights: [] })),
    ]);

    const tpFlights  = tpResult.status  === "fulfilled" ? (tpResult.value.flights  ?? []) : [];
    const skyFlights = skyResult.status === "fulfilled" ? (skyResult.value.flights ?? []) : [];

    const all = [...tpFlights, ...skyFlights];

    // Deduplica por companhia + número de voo + data de partida
    const seen = new Map<string, Flight>();
    for (const f of all) {
      const seg = f.segments[0];
      if (!seg) continue;
      const key = `${seg.airlineCode}-${seg.flightNumber}-${seg.departureTime.slice(0, 10)}`;
      const existing = seen.get(key);
      if (!existing || f.priceTotal < existing.priceTotal) seen.set(key, f);
    }

    return Array.from(seen.values()).sort((a, b) => a.priceTotal - b.priceTotal);
  },

  async getById(id: string): Promise<Flight | null> {
    void id;
    return null;
  },
};
