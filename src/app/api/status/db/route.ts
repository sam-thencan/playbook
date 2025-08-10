import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 });

  // Try selecting new columns; if they don't exist, PostgREST returns an error
  const check = await supabase
    .from('lessons')
    .select('id, category, tags, tags_text, body_text')
    .limit(1);

  const present = !check.error;
  return NextResponse.json({
    ok: true,
    auth: true,
    columns: {
      category_tags_present: present,
    },
    error: check.error ? check.error.message : null,
  });
}


