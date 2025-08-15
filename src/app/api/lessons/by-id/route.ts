import { NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = getRouteHandlerSupabase();
  const base = 'id, title, slug, day, is_intro, is_bonus, estimated_minutes, resources, body, sort_order, published';
  const extended = base + ', category, tags';
  let row: any = null;
  let { data, error } = await supabase
    .from('lessons')
    .select(extended)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    const fallback = await supabase
      .from('lessons')
      .select(base)
      .eq('id', id)
      .maybeSingle();
    row = fallback.data ? { ...fallback.data, category: null, tags: [] } : null;
  } else {
    row = data;
  }
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}


