"use client";

// ESTRUTURA FUTURA — AuthContext
// Integrar com Supabase Auth quando disponivel.
// Por enquanto opera em modo guest.

import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthState, AuthSession } from "@/types/auth";

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isGuest: boolean;
};

const guestSession: AuthSession = {
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state] = useState<AuthState>({
    session: guestSession,
    isLoading: false,
  });

  async function signIn(_email: string, _password: string) {
    // TODO: integrar com Supabase Auth
    console.warn("AuthProvider: autenticacao nao implementada nesta versao.");
  }

  async function signOut() {
    // TODO: integrar com Supabase Auth
    console.warn("AuthProvider: signOut nao implementado nesta versao.");
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        isGuest: !state.session.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  return ctx;
}
