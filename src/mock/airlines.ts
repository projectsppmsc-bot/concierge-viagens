import type { Airline } from "@/types/flight";

export const mockAirlines: Airline[] = [
  {
    code: "LA",
    name: "LATAM Airlines",
    color: "#E31837",
  },
  {
    code: "G3",
    name: "GOL Linhas Aéreas",
    color: "#FF6900",
  },
  {
    code: "AD",
    name: "Azul Linhas Aéreas",
    color: "#003087",
  },
  {
    code: "TP",
    name: "TAP Air Portugal",
    color: "#00B04F",
  },
  {
    code: "AA",
    name: "American Airlines",
    color: "#0078D2",
  },
];

export function getAirline(code: string): Airline | undefined {
  return mockAirlines.find((a) => a.code === code);
}
