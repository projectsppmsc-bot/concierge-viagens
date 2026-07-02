"use client";

import { useState, useCallback } from "react";
import type { FavoriteRoute, FavoriteFlight } from "@/types/favorite";
import { mockFavoriteRoutes, mockFavoriteFlights } from "@/mock/favorites";

export function useFavorites() {
  const [routes, setRoutes] = useState<FavoriteRoute[]>(mockFavoriteRoutes);
  const [flights, setFlights] = useState<FavoriteFlight[]>(mockFavoriteFlights);

  const addRoute = useCallback((route: FavoriteRoute) => {
    setRoutes((prev) => [route, ...prev]);
  }, []);

  const removeRoute = useCallback((id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addFlight = useCallback((flight: FavoriteFlight) => {
    setFlights((prev) => [flight, ...prev]);
  }, []);

  const removeFlight = useCallback((id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }, []);

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
