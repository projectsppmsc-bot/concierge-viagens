import type { Flight } from "@/types/flight";
import type { MilesQuote } from "@/types/miles";

export type RecommendationResult = {
  verdict: "pay_cash" | "use_miles" | "wait_promo" | "best_value";
  title: string;
  explanation: string;
  savings?: number;
  confidence: "high" | "medium" | "low";
};

export function generateRecommendation(
  flight: Flight,
  milesQuotes: MilesQuote[]
): RecommendationResult {
  const cashPrice = flight.priceTotal;
  const bestMiles = milesQuotes
    .filter((q) => q.available)
    .sort((a, b) => b.estimatedMileValue - a.estimatedMileValue)[0];

  // Nenhuma opcao de milhas disponivel
  if (!bestMiles) {
    return {
      verdict: "pay_cash",
      title: "Vale mais pagar em dinheiro",
      explanation: "Nenhum programa de milhas disponível para este trecho. O pagamento em dinheiro é a única opção neste momento.",
      confidence: "high",
    };
  }

  const milesEfficiency = bestMiles.estimatedMileValue;
  const cashEquivalent = bestMiles.equivalentCashPrice;
  const savings = cashPrice - cashEquivalent - bestMiles.taxes;

  // Milha com valor acima de R$0,025 = excelente uso
  if (milesEfficiency >= 0.025 && savings > 300) {
    return {
      verdict: "use_miles",
      title: "Vale mais utilizar milhas",
      explanation: `Usar ${bestMiles.programName} neste voo equivale a R$ ${milesEfficiency.toFixed(3)} por milha — acima da média de mercado. Você economiza aproximadamente ${savings > 0 ? `R$ ${Math.round(savings)}` : "valor significativo"} em relação ao preço em dinheiro.`,
      savings: Math.max(0, savings),
      confidence: "high",
    };
  }

  // Preco alto e milhas medianas — aguardar promocao
  if (cashPrice > 4000 && milesEfficiency < 0.018) {
    return {
      verdict: "wait_promo",
      title: "A melhor opção é aguardar uma promoção",
      explanation: "O preço em dinheiro está elevado e o custo por milha não compensa o resgate agora. Configure um alerta de preço e aguarde uma queda.",
      confidence: "medium",
    };
  }

  // Melhor custo-beneficio geral
  if (flight.badges.includes("best_value")) {
    return {
      verdict: "best_value",
      title: "Este voo tem melhor custo-benefício",
      explanation: "Mesmo não sendo o mais barato, esta opção oferece a melhor relação entre preço, tempo de voo e conforto. Considere pagar em dinheiro e acumular milhas.",
      confidence: "medium",
    };
  }

  // Default: pagar em dinheiro
  return {
    verdict: "pay_cash",
    title: "Vale mais pagar em dinheiro",
    explanation: `O valor da milha para este trecho (R$ ${milesEfficiency.toFixed(3)}) está abaixo da média de mercado. Pagar em dinheiro e acumular milhas é mais vantajoso agora.`,
    confidence: "medium",
  };
}
