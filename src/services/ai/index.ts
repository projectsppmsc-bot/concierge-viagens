// ESTRUTURA FUTURA — IA Concierge (OpenAI / Anthropic)
// Para ativar OpenAI: npm install openai
// Para ativar Anthropic: npm install @anthropic-ai/sdk
// Configurar chaves no .env.local — NUNCA comitar chaves reais
// Nao implementado nesta versao.

import type { AIProviderConfig, ChatMessage } from "@/types/concierge";

export async function sendMessageToAI(
  _messages: ChatMessage[],
  _config: AIProviderConfig
): Promise<string> {
  throw new Error("IA nao configurada nesta versao. Use respostas mock do ConciergeContext.");
}

// Interface para futuros providers de IA
export interface AIProvider {
  chat(messages: ChatMessage[], systemPrompt?: string): Promise<string>;
  isAvailable(): boolean;
}
