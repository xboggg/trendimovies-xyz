import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("user_session");

    if (!sessionCookie) {
      // Redirect to login if no session
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = JSON.parse(sessionCookie.value);

      // Check if user has admin or editor role
      if (session.role !== "admin" && session.role !== "editor") {
        // Redirect to home if not authorized
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Invalid session, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get("user_session");

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    try {
      const session = JSON.parse(sessionCookie.value);

      if (session.role !== "admin" && session.role !== "editor") {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
