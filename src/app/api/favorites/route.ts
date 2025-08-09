import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 });

  // toggle favorite
  const { data: existing, error: selErr } = await supabase
    .from('favorites')
    .select('user_id, lesson_id')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle();
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 400 });

  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('lesson_id', lessonId);
    return NextResponse.json({ favorited: false });
  }

  const { error } = await supabase.from('favorites').insert({ user_id: user.id, lesson_id: lessonId });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ favorited: true });
}


