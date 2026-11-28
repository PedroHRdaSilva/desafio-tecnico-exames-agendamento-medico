import { SESSION_EXPIRED_URL } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function extractErrorMessage(res: Response): Promise<string> {
  const body = await res.text().catch(() => "");

  try {
    const { message } = JSON.parse(body);
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  } catch {
    // corpo não é JSON: usa o texto cru abaixo
  }

  return body || res.statusText;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  // Token expirou com o usuário já na página: manda para o login.
  // No /auth/login o 401 é senha errada, então o signin trata sozinho.
  if (
    res.status === 401 &&
    path !== "/auth/login" &&
    typeof window !== "undefined"
  ) {
    window.location.href = SESSION_EXPIRED_URL;
  }

  if (!res.ok) {
    throw new ApiError(res.status, await extractErrorMessage(res));
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
