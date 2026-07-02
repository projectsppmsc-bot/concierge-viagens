// ESTRUTURA FUTURA — Amadeus Flight Offers API
// Documentacao: https://developers.amadeus.com/self-service/category/flights
// Nao implementado nesta versao. Substituir mock quando integrar.

import type { SearchQuery } from "@/types/search";
import type { Flight } from "@/types/flight";

export type AmadeusConfig = {
  clientId: string;
  clientSecret: string;
  environment: "test" | "production";
};

// Placeholder: retorna array vazio ate integracao real
export async function searchFlightsAmadeus(
  _query: SearchQuery,
  _config: AmadeusConfig
): Promise<Flight[]> {
  throw new Error("Amadeus API nao implementada nesta versao. Use dados mock.");
}

export async function getFlightPriceAmadeus(
  _offerId: string,
  _config: AmadeusConfig
): Promise<number> {
  throw new Error("Amadeus API nao implementada nesta versao.");
}
