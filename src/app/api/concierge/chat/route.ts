import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ConciergeSearchContext } from "@/types/concierge";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é o Concierge de Viagens — um assistente especializado em viagens aéreas para o mercado brasileiro.

Suas especialidades:
- Busca e comparação de voos (companhias: LATAM, GOL, Azul, TAP, American Airlines, etc.)
- Programas de milhas brasileiros: LATAM Pass, Smiles (GOL), Azul Fidelidade, Livelo, Esfera
- Cálculo de custo-benefício: pagar em dinheiro vs usar milhas
- Melhores rotas, escalas, aeroportos (GRU, CGH, GIG, SDU, BSB, SSA, etc.)
- Dicas de quando comprar, datas flexíveis, temporadas
- Bagagem, classes (econômica, executiva, primeira classe)
- Destinos populares do Brasil para o exterior e domésticos

Regras de resposta:
- Responda SEMPRE em português brasileiro, de forma amigável e direta
- Seja conciso — máximo 3-4 parágrafos
- Use valores em R$ (reais) e milhas quando relevante
- Quando sugerir buscar voos, mencione que o usuário pode usar a busca na plataforma
- Não invente preços específicos — sugira faixas realistas baseadas no mercado atual
- Se perguntarem sobre algo fora de viagens, redirecione gentilmente para o tema de viagens
- Finalize sempre com 2-3 sugestões de próximas perguntas relevantes (formato: lista curta)`;

interface Message { role: "user" | "assistant"; content: string; }

function buildContextBlock(context?: ConciergeSearchContext): string {
  if (!context || !context.origin) return "";

  const lines = [
    "",
    "---",
    "Contexto da busca atual do usuário na plataforma (use isso para responder de forma específica, não genérica):",
    `- Rota: ${context.originCity} (${context.origin}) → ${context.destinationCity} (${context.destination})`,
    context.departureDate ? `- Data de ida: ${context.departureDate}` : null,
    context.returnDate ? `- Data de volta: ${context.returnDate}` : null,
    `- Passageiros: ${context.adults} adulto(s), classe ${context.cabin}`,
  ];

  if (context.cheapest.length) {
    lines.push(`- Resultados encontrados (${context.totalResults} no total, os mais baratos):`);
    for (const f of context.cheapest) {
      lines.push(`  • ${f.airline} ${f.flightNumber}: R$ ${f.priceBRL} — ${f.stops === 0 ? "direto" : `${f.stops} escala(s)`}`);
    }
  } else {
    lines.push("- Ainda não há resultados de busca para essa rota.");
  }

  return lines.filter((l): l is string => l !== null).join("\n");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurado." }, { status: 500 });
  }

  try {
    const body = await req.json() as { messages: Message[]; context?: ConciergeSearchContext };
    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: "Nenhuma mensagem enviada." }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT + buildContextBlock(body.context),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
