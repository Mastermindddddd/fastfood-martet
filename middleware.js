import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host'); // e.g., shop.kota-market.com

  if (host.startsWith('shop.')) {
    // Rewrite to shop pages
    url.pathname = `/shop${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Apply middleware to all paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
