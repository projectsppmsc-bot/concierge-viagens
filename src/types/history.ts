import type { MilesProgramId } from "./miles";
import type { CabinClass } from "./flight";

export type HistoryStatus = "completed" | "pending" | "no_results";

export type SearchHistory = {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  cabin: CabinClass;
  passengersCount: number;
  searchedAt: string;
  bestPriceBRL?: number;
  bestMilesProgram?: MilesProgramId;
  bestMilesAmount?: number;
  resultsCount: number;
  status: HistoryStatus;
};
