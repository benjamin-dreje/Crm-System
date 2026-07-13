import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if trying to access /crm
  if (pathname.startsWith("/crm")) {
    // Get auth token from cookies - backend sets 'accessToken' as httpOnly cookie
    const token = request.cookies.get("accessToken")?.value;

    // If no token, redirect to login
    if (!token) {
      console.log("🔒 [Middleware] No auth token found! Redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: ["/crm/:path*"],
};

