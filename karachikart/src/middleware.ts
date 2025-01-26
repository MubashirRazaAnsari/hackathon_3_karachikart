import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Add public paths that don't need authentication
    const publicPaths = ['/', '/auth/signin', '/auth/signup', '/api/auth'];
    if (publicPaths.some(p => path.startsWith(p))) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Protect dashboard routes based on role
    if (path.startsWith('/dashboard')) {
      if (path.startsWith('/dashboard/seller') && token.role !== 'seller') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      if (path.startsWith('/dashboard/service-provider') && token.role !== 'service-provider') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout',
    '/profile/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 