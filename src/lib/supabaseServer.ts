import { cookies as nextCookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const store = (nextCookies as any)();
        return store?.get?.(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        const store = (nextCookies as any)();
        store?.set?.(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        const store = (nextCookies as any)();
        store?.set?.(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}


