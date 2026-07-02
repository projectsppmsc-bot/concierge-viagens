import type { CabinClass } from "./flight";

export type TripType = "roundtrip" | "oneway" | "multicity";

export type SearchQuery = {
  tripType: TripType;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;   // pode ser string vazia se o usuário não escolheu data
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabin: CabinClass;
  flexibleDates: boolean;
  includeMiles: boolean;
};

export type SearchFilters = {
  maxPrice?: number;
  maxStops?: number;
  airlines?: string[];
  departureTimeRange?: { from: string; to: string };
  arrivalTimeRange?: { from: string; to: string };
  baggageIncluded?: boolean;
};

export type SearchSortOption = "price_asc" | "price_desc" | "duration_asc" | "departure_asc" | "best_value";

export type SearchResult = {
  id: string;
  query: SearchQuery;
  executedAt: string;
  totalResults: number;
};
