import type { FavoriteRoute, FavoriteFlight } from "@/types/favorite";

export const mockFavoriteRoutes: FavoriteRoute[] = [
  {
    id: "fav-route-001",
    origin: "GRU",
    originCity: "São Paulo",
    destination: "LIS",
    destinationCity: "Lisboa",
    savedAt: "2026-05-20T10:00:00",
    lastPrice: 3490,
    notes: "Viagem de aniversário em setembro",
  },
  {
    id: "fav-route-002",
    origin: "GRU",
    originCity: "São Paulo",
    destination: "MIA",
    destinationCity: "Miami",
    savedAt: "2026-05-22T14:00:00",
    lastPrice: 2950,
    notes: "Possível viagem de negócios",
  },
  {
    id: "fav-route-003",
    origin: "GRU",
    originCity: "São Paulo",
    destination: "CDG",
    destinationCity: "Paris",
    savedAt: "2026-05-25T09:00:00",
    lastPrice: 4200,
  },
];

export const mockFavoriteFlights: FavoriteFlight[] = [];
