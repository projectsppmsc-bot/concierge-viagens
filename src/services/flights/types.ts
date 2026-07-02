import type { Flight } from "@/types/flight";
import type { SearchQuery } from "@/types/search";

export interface FlightProvider {
  search(query: SearchQuery): Promise<Flight[]>;
  getById(id: string): Promise<Flight | null>;
}

export type ProviderName = "mock" | "amadeus" | "travelpayouts";
