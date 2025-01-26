import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect dashboard routes based on role
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      // Role-specific dashboard access
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
    "/dashboard/:path*",
    "/checkout",
    "/profile/:path*"
  ]
}; 