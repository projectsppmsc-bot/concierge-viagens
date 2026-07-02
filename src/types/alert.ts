import type { MilesProgramId } from "./miles";

export type AlertStatus = "active" | "triggered" | "paused" | "expired";

export type PriceAlert = {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  targetPriceBRL?: number;
  targetMiles?: number;
  targetMilesProgram?: MilesProgramId;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
  lastCheckedAt: string;
  currentBestPrice?: number;
  currentBestMiles?: number;
};
