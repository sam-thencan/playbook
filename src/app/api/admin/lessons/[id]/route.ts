import { NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

async function ensureAdmin() {
  const supabase = await getRouteHandlerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false } as const;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return { supabase, ok: profile?.role === 'admin' } as const;
}

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, ok } = await ensureAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await _req.json();
  const payload = {
    title: body.title as string | undefined,
    slug: body.slug as string | undefined,
    day: (body.day as number | null | undefined),
    is_intro: body.is_intro as boolean | undefined,
    is_bonus: body.is_bonus as boolean | undefined,
    estimated_minutes: (body.estimated_minutes as number | null | undefined),
    resources: (Array.isArray(body.resources) ? body.resources : undefined),
    body: (Array.isArray(body.body) ? body.body : undefined),
    category: (typeof body.category === 'string' ? (body.category as string | null) : undefined),
    tags: (Array.isArray(body.tags) ? (body.tags as any[]).map(String) : undefined),
    sort_order: (typeof body.sort_order === 'number' ? body.sort_order : undefined),
    published: body.published as boolean | undefined,
  };
  const { error } = await supabase.from('lessons').update(payload).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, ok } = await ensureAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { error } = await supabase.from('lessons').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}


