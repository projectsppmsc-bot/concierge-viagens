import type { Flight } from "./flight";

export type FavoriteType = "flight" | "route" | "destination";

export type FavoriteRoute = {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  savedAt: string;
  lastPrice?: number;
  notes?: string;
};

export type FavoriteFlight = {
  id: string;
  flight: Flight;
  savedAt: string;
  notes?: string;
};

export type Favorite = FavoriteRoute | FavoriteFlight;
