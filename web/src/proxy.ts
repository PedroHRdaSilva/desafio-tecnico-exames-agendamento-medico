import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Nome do cookie httpOnly que a API define no login
const SESSION_COOKIE = "token";

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

  if (matches(pathname, authRoutes) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
