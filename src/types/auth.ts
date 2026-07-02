// Estrutura de autenticacao preparada para futura integracao com Supabase Auth

export type AuthProvider = "email" | "google" | "apple";

export type UserRole = "guest" | "user" | "premium" | "admin";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  preferences: UserPreferences;
};

export type UserPreferences = {
  preferredCabin: string;
  preferredPrograms: string[];
  homeAirport?: string;
  currency: "BRL";
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
  };
};

export type AuthSession = {
  user: UserProfile | null;
  accessToken?: string;
  expiresAt?: string;
  isAuthenticated: boolean;
};

export type AuthState = {
  session: AuthSession;
  isLoading: boolean;
  error?: string;
};
