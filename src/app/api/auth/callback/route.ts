import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

// Handles Supabase OAuth redirect on the same origin and then forwards to the desired page.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirect = url.searchParams.get('redirect') || '/dashboard';
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = getServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(redirect, url.origin), 303);
}


