"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { ChatMessage, ConciergeSession, AIProviderConfig, ConciergeSearchContext } from "@/types/concierge";
import { mockConciergeResponses } from "@/mock/concierge-responses";
import { useSearchContext } from "@/context/SearchContext";

type ConciergeState = {
  session: ConciergeSession;
  isThinking: boolean;
  aiConfig: AIProviderConfig;
};

type ConciergeContextValue = ConciergeState & {
  sendMessage: (content: string) => Promise<void>;
  clearSession: () => void;
  // Preparado para futura troca de provider de IA
  setAIConfig: (config: AIProviderConfig) => void;
};

const defaultAIConfig: AIProviderConfig = {
  provider: "mock",
  temperature: 0.7,
};

function createSession(): ConciergeSession {
  return {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    messages: [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Olá! Sou seu Concierge de Viagens. Posso te ajudar a encontrar voos, comparar milhas e descobrir as melhores ofertas. Como posso ajudar hoje?",
        status: "delivered",
        timestamp: new Date().toISOString(),
        suggestedActions: [
          "Quero ir para Lisboa em setembro",
          "Tenho 80 mil milhas Smiles. Vale a pena usar?",
          "Destinos internacionais por até R$ 3.000",
          "Qual opção tem menos escalas?",
        ],
      },
    ],
  };
}

const ConciergeContext = createContext<ConciergeContextValue | null>(null);

export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ConciergeSession>(createSession);
  const [isThinking, setIsThinking] = useState(false);
  const [aiConfig, setAIConfig] = useState<AIProviderConfig>(defaultAIConfig);
  const messageIdRef = useRef(0);
  const { query, results } = useSearchContext();

  const buildSearchContext = useCallback((): ConciergeSearchContext | undefined => {
    if (!query) return undefined;
    return {
      origin: query.origin,
      originCity: query.originCity,
      destination: query.destination,
      destinationCity: query.destinationCity,
      departureDate: query.departureDate,
      returnDate: query.returnDate,
      adults: query.passengers.adults,
      cabin: query.cabin,
      totalResults: results.length,
      cheapest: results.slice(0, 5).map((f) => ({
        airline: f.segments[0]?.airlineName ?? "",
        flightNumber: f.segments[0]?.flightNumber ?? "",
        priceBRL: f.priceTotal,
        stops: f.stops,
      })),
    };
  }, [query, results]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `msg-${++messageIdRef.current}`,
        role: "user",
        content,
        status: "delivered",
        timestamp: new Date().toISOString(),
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      setIsThinking(true);

      try {
        // Monta histórico para contexto (exclui a mensagem de boas-vindas inicial)
        const history = session.messages
          .filter((m) => m.role !== "assistant" || m.id !== session.messages[0]?.id)
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        history.push({ role: "user", content });

        const res = await fetch("/api/concierge/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, context: buildSearchContext() }),
        });

        let replyText: string;
        if (res.ok) {
          const data = await res.json() as { text: string };
          replyText = data.text;
        } else {
          // Fallback para mock em caso de erro
          replyText = getMockResponse(content).text;
        }

        // Extrai sugestões se o Claude as incluiu em forma de lista
        const suggestions = extractSuggestions(replyText);

        const assistantMessage: ChatMessage = {
          id: `msg-${++messageIdRef.current}`,
          role: "assistant",
          content: replyText,
          status: "delivered",
          timestamp: new Date().toISOString(),
          suggestedActions: suggestions,
        };

        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
      } catch {
        const fallback = getMockResponse(content);
        const assistantMessage: ChatMessage = {
          id: `msg-${++messageIdRef.current}`,
          role: "assistant",
          content: fallback.text,
          status: "delivered",
          timestamp: new Date().toISOString(),
          suggestedActions: fallback.suggestions,
        };
        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
      } finally {
        setIsThinking(false);
      }
    },
    [session.messages, buildSearchContext]
  );

  const clearSession = useCallback(() => {
    setSession(createSession());
  }, []);

  return (
    <ConciergeContext.Provider
      value={{ session, isThinking, aiConfig, sendMessage, clearSession, setAIConfig }}
    >
      {children}
    </ConciergeContext.Provider>
  );
}

export function useConciergeContext() {
  const ctx = useContext(ConciergeContext);
  if (!ctx) throw new Error("useConciergeContext deve ser usado dentro de ConciergeProvider");
  return ctx;
}

// Tenta extrair sugestões de perguntas do final da resposta do Claude
function extractSuggestions(text: string): string[] | undefined {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const suggestions: string[] = [];
  for (const line of lines.slice(-6)) {
    const clean = line.replace(/^[-*•\d.]\s*/, "").trim();
    if (clean.length > 10 && clean.length < 80 && !clean.endsWith(":")) {
      suggestions.push(clean);
    }
  }
  return suggestions.length >= 2 ? suggestions.slice(0, 3) : undefined;
}

function getMockResponse(input: string): { text: string; suggestions?: string[] } {
  const lower = input.toLowerCase();

  for (const entry of mockConciergeResponses) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { text: entry.response, suggestions: entry.suggestions };
    }
  }

  return {
    text: "Entendido! Estou analisando as melhores opções para você. Por enquanto, posso te ajudar a buscar voos, comparar milhas e encontrar promoções. O que gostaria de fazer?",
    suggestions: ["Buscar voos", "Comparar milhas", "Ver promoções"],
  };
}
