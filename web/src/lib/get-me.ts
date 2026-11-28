import { cookies } from "next/headers";
import { cache } from "react";

import { SESSION_COOKIE } from "@/lib/session";
import type { User } from "@/types/user";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3333";

export const getMe = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  if (!cookieStore.has(SESSION_COOKIE)) return null;

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Falha ao buscar usuário (${res.status})`);

  return (await res.json()) as User;
});
