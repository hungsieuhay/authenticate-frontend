import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // Define protected routes (routes that require authentication)
  const protectedPaths = [
    '/',
    '/dashboard',
    '/profile',
    '/settings',
    // Add other protected routes here
  ];

  // Define public routes (routes that don't require authentication)
  const publicPaths = [
    '/authenticate',
    // Add other public routes here
  ];

  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow access to static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files (images, css, js, etc.)
  ) {
    return NextResponse.next();
  }

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  // If it's a protected path and no access token, redirect to authenticate
  if (isProtectedPath && !accessToken) {
    const authenticateUrl = new URL('/authenticate', request.url);
    // Add the original URL as a redirect parameter
    authenticateUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(authenticateUrl);
  }

  // If user has access token but is on authenticate page, redirect to home
  if (accessToken && pathname === '/authenticate') {
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
