// ESTRUTURA FUTURA — LATAM Pass API
// Nao implementado nesta versao.

import type { MilesQuote } from "@/types/miles";
import type { SearchQuery } from "@/types/search";

export type LatamPassConfig = {
  apiKey: string;
  endpoint: string;
};

export async function getLatamPassQuote(
  _query: SearchQuery,
  _config: LatamPassConfig
): Promise<MilesQuote> {
  throw new Error("LATAM Pass API nao implementada nesta versao. Use dados mock.");
}

export async function getLatamPassBalance(_memberId: string): Promise<number> {
  throw new Error("LATAM Pass API nao implementada nesta versao.");
}
