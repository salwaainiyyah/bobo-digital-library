import { NextResponse } from 'next/server';

export default function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('bobo_session');

  // Proteksi rute dashboard (optimistic check)
  if (pathname.startsWith('/dashboard')) {
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah memiliki cookie dan membuka login/register, arahkan ke dashboard
  if ((pathname === '/login' || pathname === '/register') && sessionCookie?.value) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
