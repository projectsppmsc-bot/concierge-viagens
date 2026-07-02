// ESTRUTURA FUTURA — Supabase
// Para ativar: npm install @supabase/supabase-js
// Configurar NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local
// Nao implementado nesta versao.

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

// Placeholder do cliente — substituir pela instancia real do @supabase/supabase-js
export function createSupabaseClient(_config: SupabaseConfig) {
  throw new Error("Supabase nao configurado nesta versao.");
}

// Tabelas previstas no schema futuro
export type DatabaseSchema = {
  users: "users";
  search_history: "search_history";
  price_alerts: "price_alerts";
  favorites: "favorites";
  promotions: "promotions";
};
