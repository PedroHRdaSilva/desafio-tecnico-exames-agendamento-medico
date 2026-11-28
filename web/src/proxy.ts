import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/signin", "/signup"];

function matches(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (matches(pathname, protectedRoutes) && !hasSession) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // ?session=expired: o cookie existe mas a API recusou o token.
  // Sem essa exceção, /signin → /dashboard → /signin viraria um loop.
  const sessionExpired = request.nextUrl.searchParams.has("session");

  if (matches(pathname, authRoutes) && hasSession && !sessionExpired) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
