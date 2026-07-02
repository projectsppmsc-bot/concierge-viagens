import type { MilesProgram, MilesQuote, MilesProgramId } from "@/types/miles";

export const mockMilesPrograms: MilesProgram[] = [
  {
    id: "latam_pass",
    name: "LATAM Pass",
    color: "#E31837",
    transferPartners: ["Itaucard", "Bradesco", "Santander", "Livelo"],
    expirationMonths: 24,
  },
  {
    id: "smiles",
    name: "Smiles",
    color: "#FF6900",
    transferPartners: ["Bradesco", "Banco do Brasil", "Caixa"],
    expirationMonths: 36,
  },
  {
    id: "azul_fidelidade",
    name: "Azul Fidelidade",
    color: "#003087",
    transferPartners: ["Itaucard", "Bradesco", "C6 Bank"],
    expirationMonths: 24,
  },
  {
    id: "livelo",
    name: "Livelo",
    color: "#8B1A9A",
    transferPartners: ["Bradesco", "Banco do Brasil", "Porto Seguro"],
    expirationMonths: 36,
  },
  {
    id: "esfera",
    name: "Esfera",
    color: "#0066CC",
    transferPartners: ["Santander"],
    expirationMonths: 24,
  },
];

export function getMockMilesQuotes(
  cashPrice: number,
  routeMultiplier: number = 1
): MilesQuote[] {
  const bases: Array<{
    id: MilesProgramId;
    name: string;
    milesBase: number;
    taxBase: number;
    mileValue: number;
  }> = [
    { id: "latam_pass", name: "LATAM Pass", milesBase: 45000, taxBase: 480, mileValue: 0.026 },
    { id: "smiles", name: "Smiles", milesBase: 48000, taxBase: 520, mileValue: 0.022 },
    { id: "azul_fidelidade", name: "Azul Fidelidade", milesBase: 42000, taxBase: 390, mileValue: 0.028 },
    { id: "livelo", name: "Livelo", milesBase: 52000, taxBase: 450, mileValue: 0.020 },
    { id: "esfera", name: "Esfera", milesBase: 55000, taxBase: 400, mileValue: 0.018 },
  ];

  return bases.map((b) => {
    const miles = Math.round(b.milesBase * routeMultiplier);
    const taxes = Math.round(b.taxBase * routeMultiplier);
    const equiv = Math.round(miles * b.mileValue + taxes);
    const rating =
      b.mileValue >= 0.025 ? "excellent" : b.mileValue >= 0.018 ? "good" : "poor";
    const ratingLabel =
      rating === "excellent" ? "Excelente uso" : rating === "good" ? "Bom uso" : "Não vale a pena";

    return {
      programId: b.id,
      programName: b.name,
      milesRequired: miles,
      taxes,
      estimatedMileValue: b.mileValue,
      equivalentCashPrice: equiv,
      rating,
      ratingLabel,
      recommendation:
        equiv < cashPrice
          ? `Você economiza ~R$ ${cashPrice - equiv} usando ${b.name}`
          : `Pagar em dinheiro é ${equiv - cashPrice > 0 ? "R$ " + (equiv - cashPrice) : ""} mais barato`,
      available: true,
    };
  });
}
