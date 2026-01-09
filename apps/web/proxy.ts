import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js proxy middleware for route protection and authentication
 *
 * Note: Since we're using localStorage for tokens (client-side),
 * this proxy only handles basic route protection.
 * Full authentication checks happen client-side via AuthProvider.
 *
 * In production, consider using httpOnly cookies for better security.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For now, we allow all routes through
  // Client-side AuthProvider will handle redirects based on auth state
  // In production, you might want to use httpOnly cookies and check them here

  // Optional: Check for token in cookies if using cookie-based auth
  // const token = request.cookies.get("taskflow_access_token")?.value;
  // if (isProtectedRoute && !token) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

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
