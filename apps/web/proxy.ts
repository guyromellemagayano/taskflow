import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Next.js proxy middleware for route protection and authentication */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxy(_request: NextRequest) {
  // Public routes that don't require authentication
  // Note: Currently all routes are allowed through
  // Client-side AuthProvider handles authentication checks
  // Future: Implement server-side route protection using httpOnly cookies
  // const { pathname } = request.nextUrl;
  // const publicRoutes = ["/login", "/signup"];
  // const isPublicRoute = publicRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

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
