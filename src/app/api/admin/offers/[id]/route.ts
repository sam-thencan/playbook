import { NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

async function ensureAdmin() {
  const supabase = await getRouteHandlerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false } as const;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return { supabase, ok: profile?.role === 'admin' } as const;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { supabase, ok } = await ensureAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const payload = {
    title: body.title as string | undefined,
    description: (body.description as string | null | undefined),
    type: body.type as 'call' | 'download' | 'discount' | undefined,
    unlock_day: (body.unlock_day as number | null | undefined),
    unlock_percent: (body.unlock_percent as number | null | undefined),
    sort_order: (typeof body.sort_order === 'number' ? body.sort_order : undefined),
    cta: (body.cta as any) ?? undefined,
    active: body.active as boolean | undefined,
  };
  const { error } = await supabase.from('offers').update(payload).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, ok } = await ensureAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { error } = await supabase.from('offers').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}


