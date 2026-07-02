// ESTRUTURA FUTURA — Smiles (GOL) API
// Nao implementado nesta versao.

import type { MilesQuote } from "@/types/miles";
import type { SearchQuery } from "@/types/search";

export type SmilesConfig = {
  apiKey: string;
  endpoint: string;
};

export async function getSmilesQuote(
  _query: SearchQuery,
  _config: SmilesConfig
): Promise<MilesQuote> {
  throw new Error("Smiles API nao implementada nesta versao. Use dados mock.");
}

export async function getSmilesBalance(_memberId: string): Promise<number> {
  throw new Error("Smiles API nao implementada nesta versao.");
}
