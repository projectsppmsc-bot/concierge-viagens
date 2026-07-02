// ESTRUTURA FUTURA — Esfera (Santander) API
// Nao implementado nesta versao.

import type { MilesQuote } from "@/types/miles";
import type { SearchQuery } from "@/types/search";

export type EsferaConfig = {
  apiKey: string;
  endpoint: string;
};

export async function getEsferaQuote(
  _query: SearchQuery,
  _config: EsferaConfig
): Promise<MilesQuote> {
  throw new Error("Esfera API nao implementada nesta versao. Use dados mock.");
}

export async function getEsferaBalance(_memberId: string): Promise<number> {
  throw new Error("Esfera API nao implementada nesta versao.");
}
