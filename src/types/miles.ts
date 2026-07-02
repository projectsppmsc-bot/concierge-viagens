export type MilesProgramId = "latam_pass" | "smiles" | "azul_fidelidade" | "livelo" | "esfera";

export type MilesRating = "excellent" | "good" | "poor";

export type MilesProgram = {
  id: MilesProgramId;
  name: string;
  color: string;
  logo?: string;
  transferPartners: string[];
  expirationMonths: number;
};

export type MilesQuote = {
  programId: MilesProgramId;
  programName: string;
  milesRequired: number;
  taxes: number;
  estimatedMileValue: number;
  equivalentCashPrice: number;
  rating: MilesRating;
  ratingLabel: string;
  recommendation: string;
  available: boolean;
};

export type MilesBalance = {
  programId: MilesProgramId;
  balance: number;
  expirationDate?: string;
};
