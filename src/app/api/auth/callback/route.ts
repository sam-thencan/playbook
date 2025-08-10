import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

// Handles Supabase OAuth redirect on the same origin and then forwards to the desired page.
export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  // Calling getUser() will exchange the `code` for a session and set cookies via our server client.
  await supabase.auth.getUser();

  const url = new URL(req.url);
  const redirect = url.searchParams.get('redirect') || '/dashboard';
  return NextResponse.redirect(new URL(redirect, url.origin), 303);
}


