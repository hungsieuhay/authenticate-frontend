import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;

  const publicPaths = ['/authenticate'];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (!token && !isPublic) {
    const loginUrl = new URL('/authenticate', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
    // Or be more specific
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
