import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const protectedRoutes = ['/polls', '/polls/create'];

export async function middleware(request: NextRequest) {
  if (!supabase) {
    console.warn('Supabase not configured in middleware');
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Accept several token locations: sb-auth-token (our client), sb-access-token (common), or Authorization header
  const sessionToken =
    request.cookies.get('sb-auth-token')?.value ||
    request.cookies.get('sb-access-token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    null;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Validate token with Supabase to ensure it's an active session
  try {
    const { data, error } = await supabase.auth.getUser(sessionToken as string);
    if (error || !data?.user) {
      console.debug('Middleware: token invalid or no user', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch (err) {
    console.warn('Middleware: error validating token', err);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
