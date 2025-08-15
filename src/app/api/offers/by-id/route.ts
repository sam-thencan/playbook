import { NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = getRouteHandlerSupabase();
  const { data, error } = await supabase
    .from('offers')
    .select('id, title, description, type, unlock_day, unlock_percent, sort_order, cta, active')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}


