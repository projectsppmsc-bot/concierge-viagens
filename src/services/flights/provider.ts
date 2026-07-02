import type { FlightProvider, ProviderName } from "./types";
import { mockProvider } from "./mock-provider";
import { amadeusProvider } from "./amadeus-provider";
import { travelpayoutsProvider } from "./travelpayouts-provider";

/**
 * Provider ativo — lido no browser via NEXT_PUBLIC_.
 * Padrão: "mock".  Alternativas: "travelpayouts" | "amadeus".
 *
 * Nota: "amadeus" (Self-Service) está descontinuado em 17/07/2026.
 * Use "travelpayouts" para dados reais.
 */
const ACTIVE_PROVIDER: ProviderName =
  (process.env.NEXT_PUBLIC_FLIGHT_PROVIDER as ProviderName | undefined) ?? "mock";

const providers: Record<ProviderName, FlightProvider> = {
  mock: mockProvider,
  travelpayouts: travelpayoutsProvider,
  amadeus: amadeusProvider, // mantido para compatibilidade — prefer travelpayouts
};

export function getFlightProvider(): FlightProvider {
  return providers[ACTIVE_PROVIDER] ?? mockProvider;
}

export function getActiveProviderName(): ProviderName {
  return ACTIVE_PROVIDER;
}
