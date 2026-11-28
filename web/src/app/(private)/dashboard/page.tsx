"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Bem-vindo, {user.name}!</p>
      <Button variant="outline" onClick={logout}>
        Sair
      </Button>
    </div>
  );
}
