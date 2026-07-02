export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type BaggagePolicy = {
  carryOn: boolean;
  checked: number;
  weightKg?: number;
};

export type FlightSegment = {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  aircraft?: string;
  stopoverMinutes?: number;
};

export type FlightBadge = "best_price" | "best_time" | "best_value" | "direct" | "promo";

export type Flight = {
  id: string;
  segments: FlightSegment[];
  totalDurationMinutes: number;
  stops: number;
  cabin: CabinClass;
  baggage: BaggagePolicy;
  priceTotal: number;
  pricePerLeg: number;
  currency: "BRL";
  seatsLeft?: number;
  badges: FlightBadge[];
  isRefundable: boolean;
  source: "mock" | "amadeus" | "travelpayouts";
  /** Link externo para compra no site do parceiro / companhia aérea */
  bookingLink?: string;
  /** Origem da oferta para exibição ao usuário */
  offerSource?: string;
  /** ID original da oferta na Amadeus (útil para futura integração de orders) */
  amadeusOfferId?: string;
};

export type Airline = {
  code: string;
  name: string;
  logo?: string;
  color: string;
};
