import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isAdminPath = url.pathname.startsWith('/admin');
  const needsAuth = isAdminPath || url.pathname === '/dashboard' || url.pathname.startsWith('/lesson/');
  const isPayPath = url.pathname === '/pay' || url.pathname.startsWith('/api/checkout') || url.pathname.startsWith('/api/auth/callback');
  if (!needsAuth) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });

  // Important: allow the OAuth callback to exchange the code for a session.
  // When returning from Supabase (e.g., /dashboard?code=...), getUser() will
  // set cookies on `res`. We must NOT redirect away on this first pass.
  const { data: { user } } = await supabase.auth.getUser();
  if (url.searchParams.has('code')) {
    return res;
  }
  if (!user) {
    const redirect = new URL('/login', req.url);
    redirect.searchParams.set('redirect', url.pathname);
    return NextResponse.redirect(redirect);
  }

  // Paywall: if user lacks access, send to /pay
  if (!isAdminPath && !isPayPath) {
    const { data: profile } = await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle();
    if (profile && profile.has_access === false) {
      const redirect = new URL('/pay', req.url);
      return NextResponse.redirect(redirect);
    }
  }

  if (isAdminPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profile?.role !== 'admin') {
      const redirect = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirect);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard', '/lesson/:path*'],
};


