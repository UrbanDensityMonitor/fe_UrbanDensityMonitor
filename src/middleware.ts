import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for a non-empty sb-auth-token cookie value
  // We store the actual JWT (not just "true") so this is a reliable check
  const authCookie = request.cookies.get('sb-auth-token');
  const isAuthenticated = !!(authCookie?.value && authCookie.value.length > 4);

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/streams') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/alerts') ||
    pathname.startsWith('/analytics');

  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if already authenticated and visiting auth page
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/auth',
    '/streams/:path*',
    '/history/:path*',
    '/alerts/:path*',
    '/analytics/:path*',
  ],
};
