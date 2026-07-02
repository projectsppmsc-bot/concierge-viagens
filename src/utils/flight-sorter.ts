import type { Flight } from "@/types/flight";
import type { SearchSortOption } from "@/types/search";

export function sortFlights(flights: Flight[], sortBy: SearchSortOption): Flight[] {
  const sorted = [...flights];

  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.priceTotal - b.priceTotal);
    case "price_desc":
      return sorted.sort((a, b) => b.priceTotal - a.priceTotal);
    case "duration_asc":
      return sorted.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    case "departure_asc":
      return sorted.sort((a, b) =>
        a.segments[0].departureTime.localeCompare(b.segments[0].departureTime)
      );
    case "best_value":
    default:
      return sorted.sort((a, b) => {
        const scoreA = valueScore(a);
        const scoreB = valueScore(b);
        return scoreB - scoreA;
      });
  }
}

function valueScore(flight: Flight): number {
  let score = 0;
  if (flight.badges.includes("best_value")) score += 30;
  if (flight.badges.includes("best_price")) score += 20;
  if (flight.badges.includes("best_time")) score += 15;
  if (flight.stops === 0) score += 25;
  if (flight.stops === 1) score += 10;
  if (flight.baggage.checked > 0) score += 10;
  // Penaliza preco alto
  score -= Math.floor(flight.priceTotal / 1000);
  return score;
}
