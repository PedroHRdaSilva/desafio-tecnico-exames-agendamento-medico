"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";

import { api } from "@/lib/api";
import type { User } from "@/types/user";

type AuthContextValue = {
  user: User;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  user: User;
  children: React.ReactNode;
};

export function AuthProvider({ user, children }: AuthProviderProps) {
  const router = useRouter();

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      router.replace("/signin");
      router.refresh();
    }
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }
  return context;
}
