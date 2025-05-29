
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const publicRoutes = ['/signin', '/signup', '/forgot-password', '/api/token', '/otp', '/reset-password', '/api/images'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === '/'
  );

  const token = request.cookies.get('access')?.value;
  
  if (!isPublicRoute && !token) {
    const url = new URL('/signin', request.url);
    return NextResponse.redirect(url);
  }
  
  if (pathname === '/signin' && token) {
    const url = new URL('/editor', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};