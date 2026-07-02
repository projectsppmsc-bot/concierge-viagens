export const APP_NAME = "Concierge de Viagens";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Seu concierge inteligente para pesquisa e comparação de passagens aéreas.";

export const CURRENCY = "BRL";
export const LOCALE = "pt-BR";

export const CABIN_LABELS: Record<string, string> = {
  economy: "Econômica",
  premium_economy: "Premium Economy",
  business: "Executiva",
  first: "Primeira Classe",
};

export const MILES_PROGRAM_LABELS: Record<string, string> = {
  latam_pass: "LATAM Pass",
  smiles: "Smiles",
  azul_fidelidade: "Azul Fidelidade",
  livelo: "Livelo",
  esfera: "Esfera",
};

export const MILES_PROGRAM_COLORS: Record<string, string> = {
  latam_pass: "#E31837",
  smiles: "#FF6900",
  azul_fidelidade: "#003087",
  livelo: "#8B1A9A",
  esfera: "#0066CC",
};

export const RATING_LABELS: Record<string, string> = {
  excellent: "Excelente uso",
  good: "Bom uso",
  poor: "Não vale a pena",
};

export const BADGE_LABELS: Record<string, string> = {
  best_price: "Melhor preço",
  best_time: "Melhor tempo",
  best_value: "Melhor custo-benefício",
  direct: "Direto",
  promo: "Promoção",
};

export const MOCK_DELAY_MS = 800;

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/busca", label: "Buscar Voos", icon: "Search" },
  { href: "/milhas", label: "Comparar Milhas", icon: "Award" },
  { href: "/concierge", label: "Concierge", icon: "MessageSquare" },
  { href: "/promocoes", label: "Promoções", icon: "Tag" },
  { href: "/favoritos", label: "Favoritos", icon: "Heart" },
  { href: "/historico", label: "Histórico", icon: "Clock" },
  { href: "/alertas", label: "Alertas", icon: "Bell" },
] as const;
