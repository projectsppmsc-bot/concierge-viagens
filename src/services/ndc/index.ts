// ESTRUTURA FUTURA — NDC (New Distribution Capability) IATA
// Padrao XML para distribuicao direta das companhias aereas
// Nao implementado nesta versao.

import type { SearchQuery } from "@/types/search";
import type { Flight } from "@/types/flight";

export type NDCProvider = "latam" | "gol" | "azul" | "tap" | "american" | "delta";

export type NDCConfig = {
  provider: NDCProvider;
  endpoint: string;
  apiKey: string;
  agencyId: string;
};

export async function searchFlightsNDC(
  _query: SearchQuery,
  _config: NDCConfig
): Promise<Flight[]> {
  throw new Error("NDC nao implementado nesta versao. Use dados mock.");
}
