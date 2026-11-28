import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthProvider } from "@/contexts/auth-context";
import { getMe } from "@/lib/get-me";
import { SESSION_EXPIRED_URL } from "@/lib/session";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Carregando...
        </div>
      }
    >
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  if (!user) redirect(SESSION_EXPIRED_URL);

  return <AuthProvider user={user}>{children}</AuthProvider>;
}
