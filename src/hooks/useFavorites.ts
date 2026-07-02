"use client";

import { useCallback } from "react";
import type { FavoriteRoute, FavoriteFlight } from "@/types/favorite";
import { mockFavoriteRoutes, mockFavoriteFlights } from "@/mock/favorites";
import { useLocalStorageState } from "./useLocalStorageState";

export function useFavorites() {
  const [routes, setRoutes] = useLocalStorageState<FavoriteRoute[]>("cv:favorites:routes", mockFavoriteRoutes);
  const [flights, setFlights] = useLocalStorageState<FavoriteFlight[]>("cv:favorites:flights", mockFavoriteFlights);

  const addRoute = useCallback((route: FavoriteRoute) => {
    setRoutes((prev) => [route, ...prev]);
  }, [setRoutes]);

  const removeRoute = useCallback((id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  }, [setRoutes]);

  const addFlight = useCallback((flight: FavoriteFlight) => {
    setFlights((prev) => [flight, ...prev]);
  }, [setFlights]);

  const removeFlight = useCallback((id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }, [setFlights]);

  const isFavoriteRoute = useCallback(
    (origin: string, destination: string) =>
      routes.some((r) => r.origin === origin && r.destination === destination),
    [routes]
  );

  return {
    routes,
    flights,
    addRoute,
    removeRoute,
    addFlight,
    removeFlight,
    isFavoriteRoute,
    totalFavorites: routes.length + flights.length,
  };
}
