import type { MilesQuote, MilesProgramId } from "@/types/miles";

// Valor de referencia por milha em BRL por programa (estimativas de mercado)
const MILE_REFERENCE_VALUES: Record<MilesProgramId, number> = {
  latam_pass: 0.025,
  smiles: 0.022,
  azul_fidelidade: 0.028,
  livelo: 0.020,
  esfera: 0.018,
};

export function getMileValue(programId: MilesProgramId): number {
  return MILE_REFERENCE_VALUES[programId] ?? 0.020;
}

export function calculateMileWorth(
  miles: number,
  programId: MilesProgramId
): number {
  return miles * getMileValue(programId);
}

export function rateQuote(quote: MilesQuote): "excellent" | "good" | "poor" {
  const cpm = quote.estimatedMileValue;
  if (cpm >= 0.025) return "excellent";
  if (cpm >= 0.015) return "good";
  return "poor";
}

export function bestMilesOption(quotes: MilesQuote[]): MilesQuote | null {
  const available = quotes.filter((q) => q.available);
  if (available.length === 0) return null;
  return available.reduce((best, curr) =>
    curr.estimatedMileValue > best.estimatedMileValue ? curr : best
  );
}
