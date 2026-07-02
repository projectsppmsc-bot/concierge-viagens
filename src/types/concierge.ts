export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "sent" | "thinking" | "delivered" | "error";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  timestamp: string;
  suggestedActions?: string[];
};

export type ConciergeSession = {
  id: string;
  startedAt: string;
  messages: ChatMessage[];
  context?: Record<string, unknown>;
};

export type ConciergeIntent =
  | "search_flight"
  | "compare_miles"
  | "find_deals"
  | "check_worth"
  | "general_query";

// Interface preparada para futura integracao com IA (OpenAI / Claude)
export type AIProviderConfig = {
  provider: "openai" | "anthropic" | "mock";
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
};

/** Resumo da busca atual do usuário, enviado ao Concierge para respostas com contexto. */
export type ConciergeSearchContext = {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabin: string;
  totalResults: number;
  cheapest: Array<{
    airline: string;
    flightNumber: string;
    priceBRL: number;
    stops: number;
  }>;
};
