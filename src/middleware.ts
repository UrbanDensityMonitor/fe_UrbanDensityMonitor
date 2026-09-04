import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Validasi format JWT (header.payload.signature) — 3 segmen dipisah titik.
  // Backend tetap memvalidasi signature; ini hanya untuk mencegah redirect
  // yang tidak perlu bagi user yang belum login sama sekali.
  const authCookie = request.cookies.get("sb-auth-token");
  const token = authCookie?.value ?? "";
  const isAuthenticated = token.split(".").length === 3 && token.length > 20;

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/auth');
  const isLandingRoute = pathname === '/landing';
  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/streams') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/alerts') ||
    pathname.startsWith('/analytics');

  // Redirect to landing page if accessing protected route without valid token
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/landing', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if already authenticated and visiting auth or landing page
  if ((isAuthRoute || isLandingRoute) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/auth',
    '/landing',
    '/streams/:path*',
    '/history/:path*',
    '/alerts/:path*',
    '/analytics/:path*',
  ],
};
