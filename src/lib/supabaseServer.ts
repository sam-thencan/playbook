import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// For Server Components - read-only cookies, no writes
export function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const store = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // No-op for Server Components - cookies are read-only here
        // Real cookie writes happen in middleware and route handlers
      },
      remove(name: string, options: CookieOptions) {
        // No-op for Server Components
      },
    },
  });
}

// For Route Handlers - full cookie access
export function getRouteHandlerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const store = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        store.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        store.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}


