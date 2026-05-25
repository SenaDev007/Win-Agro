import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // Check if host starts with admin. (e.g., admin.winagrotech.com or admin.localhost:3000)
  const isAdminSubdomain = host.startsWith("admin.");

  if (isAdminSubdomain) {
    const pathname = url.pathname;

    // Do not rewrite internal assets, api routes, or files containing dots (like favicon, robots.txt, etc.)
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Map admin.winagrotech.com/ to /admin/dashboard
    if (pathname === "/") {
      url.pathname = "/admin/dashboard";
    } else if (!pathname.startsWith("/admin")) {
      // Map admin.winagrotech.com/login to /admin/login, etc.
      url.pathname = `/admin${pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
