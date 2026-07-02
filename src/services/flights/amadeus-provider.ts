import type { FlightProvider } from "./types";
import type { SearchQuery } from "@/types/search";
import type { Flight } from "@/types/flight";

// Chama a API Route server-side (/api/flights/search).
// O CLIENT_SECRET fica exclusivamente no servidor — nunca exposto ao browser.
export const amadeusProvider: FlightProvider = {
  async search(query: SearchQuery): Promise<Flight[]> {
    const res = await fetch("/api/flights/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: query.origin,
        destination: query.destination,
        departureDate: query.departureDate,
        returnDate: query.returnDate,
        adults: query.passengers.adults,
        children: query.passengers.children,
        infants: query.passengers.infants,
        cabin: query.cabin,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(body.error ?? `Erro ${res.status} na busca real de voos.`);
    }

    const data = await res.json() as { flights: Flight[] };
    return data.flights;
  },

  async getById(id: string): Promise<Flight | null> {
    // Amadeus não tem endpoint de detalhe por ID — retornamos null
    // (o FlightCard usa os dados já em memória)
    void id;
    return null;
  },
};
