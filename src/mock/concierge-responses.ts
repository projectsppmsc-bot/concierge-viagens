export type ConciergeResponseEntry = {
  keywords: string[];
  response: string;
  suggestions?: string[];
};

export const mockConciergeResponses: ConciergeResponseEntry[] = [
  {
    keywords: ["lisboa", "portugal", "setembro", "outubro"],
    response: "Ótima escolha! Lisboa é um destino incrível. Para setembro, encontrei voos a partir de R$ 2.890 com escala e R$ 3.490 direto com LATAM. Se você tem milhas LATAM Pass, consegue resgatar a partir de 45.000 milhas + taxas de ~R$ 480. A melhor janela de preços para Lisboa costuma ser de 3 a 4 meses antes da viagem.",
    suggestions: ["Ver voos para Lisboa", "Comparar milhas para Lisboa", "Criar alerta de preço"],
  },
  {
    keywords: ["smiles", "80 mil", "80000", "vale a pena", "milhas smiles"],
    response: "Com 80.000 milhas Smiles você tem um bom poder de resgate! Em rotas como GRU→MIA (Miami), o resgate médio é de 48.000 milhas + R$ 520 em taxas — sobrando ainda 32.000 para outro trecho. Para Europa (Lisboa/Madrid), gira em torno de 55.000 milhas. O valor médio da milha Smiles está em R$ 0,022, então suas milhas valem cerca de R$ 1.760 em poder de compra.",
    suggestions: ["Ver voos com Smiles", "Comparar todos os programas", "Calcular melhor destino"],
  },
  {
    keywords: ["3000", "r$ 3.000", "3.000", "barato", "econômico", "até 3"],
    response: "Com até R$ 3.000 você tem ótimas opções internacionais! Encontrei: Buenos Aires a partir de R$ 1.150, Santiago ~R$ 1.480, Miami ~R$ 2.650, Cancún ~R$ 2.780 e até Lisboa em promoção por R$ 2.990. Para a Europa, vale monitorar promoções da TAP e LATAM — queda de preços acontece frequentemente!",
    suggestions: ["Ver voos até R$ 3.000", "Criar alerta de preço", "Ver promoções ativas"],
  },
  {
    keywords: ["menos escalas", "direto", "sem escala", "voo direto"],
    response: "Para voos diretos, as melhores opções são: GRU→LIS (LATAM e TAP, ~12h30), GRU→MIA (LATAM e American, ~10h30), GRU→MAD (LATAM, ~12h30), GRU→CDG (LATAM, ~13h). Voos diretos costumam custar 15-30% a mais, mas economizam muito em tempo e conforto — especialmente em viagens longas.",
    suggestions: ["Buscar voos diretos", "Comparar com escalas", "Ver preços executiva"],
  },
  {
    keywords: ["executiva", "business", "primeira classe", "conforto"],
    response: "Boa escolha para maior conforto! Em executiva para Europa, os preços partem de R$ 9.800 (LATAM GRU→LIS) e R$ 8.500 (American GRU→MIA). Em milhas, você precisa de aproximadamente 80.000-100.000 pontos LATAM Pass — aqui o resgate faz muito mais sentido, pois o valor por milha sobe para R$ 0,098!",
    suggestions: ["Ver voos executiva", "Calcular milhas executiva", "Ver disponibilidade"],
  },
  {
    keywords: ["latam pass", "latam", "pontos latam"],
    response: "O LATAM Pass é um dos melhores programas para rotas brasileiras! Parceiros de transferência incluem Itaucard, Bradesco, Santander e Livelo. Para aproveitar melhor: resgates em executiva têm valor de ~R$ 0,025-0,035 por ponto, enquanto em econômica o valor cai para ~R$ 0,018-0,022. Pontos vencem após 24 meses de inatividade.",
    suggestions: ["Ver resgates LATAM Pass", "Comparar com outros programas", "Calcular milhas"],
  },
  {
    keywords: ["azul", "azul fidelidade"],
    response: "A Azul Fidelidade é excelente para rotas domésticas e tem parceria com a TAP para Europa! O valor médio da milha Azul é R$ 0,028 — um dos mais altos do mercado. Parceiros de transferência: Itaucard, Bradesco, C6 Bank. Para GRU→LIS via TAP, você precisa de ~42.000 milhas, tornando este um dos resgates mais eficientes disponíveis.",
    suggestions: ["Ver resgates Azul Fidelidade", "Rotas Azul + TAP", "Comparar programas"],
  },
  {
    keywords: ["livelo"],
    response: "O Livelo é um hub de pontos que permite transferir para vários programas aéreos. O ponto Livelo vale ~R$ 0,020 e você pode transferir para LATAM Pass, Smiles, Azul e outros. A estratégia mais comum é acumular no Livelo via cartão Bradesco ou Banco do Brasil e transferir quando houver bônus de transferência (comum em promoções).",
    suggestions: ["Ver programas parceiros Livelo", "Calcular transferência", "Ver promoções"],
  },
  {
    keywords: ["alerta", "aviso", "notificação", "monitorar"],
    response: "Você pode criar alertas de preço aqui no Concierge! Defina a rota, o preço desejado em dinheiro ou quantidade de milhas, e você será notificado quando o preço cair. Tenho 5 alertas ativos agora — o melhor deles monitorando GRU→MIA abaixo de R$ 2.500.",
    suggestions: ["Criar alerta de preço", "Ver alertas ativos", "Monitorar rota específica"],
  },
  {
    keywords: ["promoção", "oferta", "desconto", "barato agora"],
    response: "Encontrei promoções ativas hoje! Destaque para: Lisboa (TAP) por R$ 2.990 — queda de 20% no preço normal. Miami (LATAM) por R$ 2.680 com bagagem incluída. E Cancún a R$ 3.100 em voo direto. Promoções costumam durar 24-72 horas, então não demora muito para agir!",
    suggestions: ["Ver todas as promoções", "Comprar agora", "Criar alerta para mais rotas"],
  },
  {
    keywords: ["favorito", "salvar", "guardar"],
    response: "Você pode salvar voos e rotas favoritas para acompanhar os preços ao longo do tempo! Basta clicar no ícone de coração em qualquer voo ou usar a seção Favoritos do menu. Assim você não perde de vista as rotas que mais te interessam.",
    suggestions: ["Ver meus favoritos", "Salvar rota", "Ver histórico"],
  },
  {
    keywords: ["historico", "histórico", "pesquisas anteriores"],
    response: "No seu histórico estão registradas as últimas pesquisas. Você buscou Lisboa com preço mínimo de R$ 3.490, Miami por R$ 2.950 e Paris em executiva por R$ 9.800. Posso re-executar qualquer uma dessas buscas com os preços atualizados!",
    suggestions: ["Ver histórico completo", "Repetir última busca", "Comparar preços"],
  },
];
