// ESTRUTURA FUTURA — Azul Fidelidade API
// Nao implementado nesta versao.

import type { MilesQuote } from "@/types/miles";
import type { SearchQuery } from "@/types/search";

export type AzulFidelidadeConfig = {
  apiKey: string;
  endpoint: string;
};

export async function getAzulQuote(
  _query: SearchQuery,
  _config: AzulFidelidadeConfig
): Promise<MilesQuote> {
  throw new Error("Azul Fidelidade API nao implementada nesta versao. Use dados mock.");
}

export async function getAzulBalance(_memberId: string): Promise<number> {
  throw new Error("Azul Fidelidade API nao implementada nesta versao.");
}
