// ESTRUTURA FUTURA — Livelo API
// Nao implementado nesta versao.

import type { MilesQuote } from "@/types/miles";
import type { SearchQuery } from "@/types/search";

export type LiveloConfig = {
  apiKey: string;
  endpoint: string;
};

export async function getLiveloQuote(
  _query: SearchQuery,
  _config: LiveloConfig
): Promise<MilesQuote> {
  throw new Error("Livelo API nao implementada nesta versao. Use dados mock.");
}

export async function getLiveloBalance(_memberId: string): Promise<number> {
  throw new Error("Livelo API nao implementada nesta versao.");
}
