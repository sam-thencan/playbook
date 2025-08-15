import { NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

async function ensureAdmin() {
  const supabase = await getRouteHandlerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase, ok: false } as const;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return { supabase, ok: profile?.role === 'admin' } as const;
}

export async function POST(request: Request) {
  const { supabase, ok } = await ensureAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const payload = {
    title: body.title as string,
    slug: body.slug as string,
    day: body.day as number | null,
    is_intro: !!body.is_intro,
    is_bonus: !!body.is_bonus,
    estimated_minutes: body.estimated_minutes as number | null,
    resources: Array.isArray(body.resources) ? body.resources : [],
    body: Array.isArray(body.body) ? body.body : [],
    category: (typeof body.category === 'string' && body.category.trim() !== '') ? (body.category as string) : null,
    tags: Array.isArray(body.tags) ? (body.tags as any[]).map(String) : [],
    sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
    published: !!body.published,
  };
  const { data, error } = await supabase.from('lessons').insert(payload).select('id').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data?.id });
}


