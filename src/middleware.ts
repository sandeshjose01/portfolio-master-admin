import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Check if the URL starts with admin (e.g., admin.localhost:3000 or admin.portfolio.com)
  const isAdminSubdomain = hostname.startsWith('admin.');

  if (isAdminSubdomain) {
    // If the user just goes to admin.domain.com, show the admin folder
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
    
    // This allows admin.domain.com/projects to point to /admin/projects
    if (!url.pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};
