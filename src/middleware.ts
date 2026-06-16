import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies.has('sb-auth-token');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = request.nextUrl.pathname === '/' || 
                           request.nextUrl.pathname.startsWith('/admin') ||
                           request.nextUrl.pathname.startsWith('/streams') ||
                           request.nextUrl.pathname.startsWith('/history') ||
                           request.nextUrl.pathname.startsWith('/alerts');

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Redirect to dashboard if accessing auth route with token
  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', 
    '/admin/:path*', 
    '/auth',
    '/streams/:path*',
    '/history/:path*',
    '/alerts/:path*'
  ],
}
