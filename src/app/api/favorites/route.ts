import { NextRequest, NextResponse } from 'next/server';
import { getRouteHandlerSupabase } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = getRouteHandlerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('favorites')
    .select('lesson_id, lessons!inner(id, slug, title, day)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const items = (data || [])
    .map((row: any) => ({ id: row.lessons.id, slug: row.lessons.slug, title: row.lessons.title, day: row.lessons.day as number | null }))
    .sort((a, b) => (a.day ?? 999) - (b.day ?? 999) || a.title.localeCompare(b.title));
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const supabase = getRouteHandlerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error('favorites: no user in request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 });

  // toggle favorite
  const { data: existing, error: selErr } = await supabase
    .from('favorites')
    .select('user_id, lesson_id')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle();
  if (selErr) {
    console.error('favorites: select error', selErr);
    return NextResponse.json({ error: selErr.message }, { status: 400 });
  }

  if (existing) {
    const { error: delErr } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('lesson_id', lessonId);
    if (delErr) {
      console.error('favorites: delete error', delErr);
      return NextResponse.json({ error: delErr.message }, { status: 400 });
    }
    return NextResponse.json({ favorited: false });
  }

  const { error } = await supabase.from('favorites').insert({ user_id: user.id, lesson_id: lessonId });
  if (error) {
    console.error('favorites: insert error', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ favorited: true });
}


