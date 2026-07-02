import type { MilesProgramId } from "./miles";
import type { CabinClass } from "./flight";

export type PromotionType = "cash" | "miles" | "hybrid";

export type Promotion = {
  id: string;
  title: string;
  description: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  type: PromotionType;
  cabin: CabinClass;
  originalPriceBRL?: number;
  promoPriceBRL?: number;
  originalMiles?: number;
  promoMiles?: number;
  milesProgram?: MilesProgramId;
  discountPercent?: number;
  validFrom: string;
  validUntil: string;
  airline: string;
  imageUrl?: string;
  featured: boolean;
  tags: string[];
};
