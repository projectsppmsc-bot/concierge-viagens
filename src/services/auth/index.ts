// ESTRUTURA FUTURA — Autenticacao (Supabase Auth)
// Para ativar: integrar com @supabase/supabase-js e Auth helpers do Next.js
// Nao implementado nesta versao.

import type { AuthSession, AuthProvider, UserProfile } from "@/types/auth";

export async function signIn(
  _provider: AuthProvider,
  _credentials?: { email: string; password: string }
): Promise<AuthSession> {
  throw new Error("Autenticacao nao implementada nesta versao.");
}

export async function signOut(): Promise<void> {
  throw new Error("Autenticacao nao implementada nesta versao.");
}

export async function getSession(): Promise<AuthSession> {
  // Sessao mock para desenvolvimento
  return {
    user: null,
    isAuthenticated: false,
  };
}

export async function getUserProfile(_userId: string): Promise<UserProfile | null> {
  throw new Error("Autenticacao nao implementada nesta versao.");
}

export async function updateUserProfile(
  _userId: string,
  _data: Partial<UserProfile>
): Promise<void> {
  throw new Error("Autenticacao nao implementada nesta versao.");
}
