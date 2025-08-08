import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

async function ensureAdmin() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false } as const;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return { supabase, ok: profile?.role === 'admin' } as const;
}

export async function POST(request: Request) {
  const { supabase, ok } = await ensureAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const payload = {
    title: body.title as string,
    description: (body.description as string) ?? null,
    type: body.type as 'call' | 'download' | 'discount',
    unlock_day: (body.unlock_day as number | null) ?? null,
    unlock_percent: (body.unlock_percent as number | null) ?? null,
    sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
    cta: body.cta ?? null,
    active: !!body.active,
  };
  const { data, error } = await supabase.from('offers').insert(payload).select('id').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data?.id });
}


