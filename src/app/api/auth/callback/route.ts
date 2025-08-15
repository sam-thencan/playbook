import { NextRequest, NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirect = url.searchParams.get('redirect') || '/dashboard';
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = await getRouteHandlerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(redirect, url.origin), 303);
}


