import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const tags = searchParams.getAll('tag').filter(Boolean);
  const limit = Math.min(Number(searchParams.get('limit') || '50'), 100);

  const supabase = getServerSupabase();
  let query = supabase
    .from('lessons')
    .select('id, slug, title, day, is_intro, is_bonus, category, tags, published, sort_order')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (q) {
    const like = `%${q}%`;
    // OR over title/body_text/tags_text for basic search
    query = query.or(
      `title.ilike.${like},body_text.ilike.${like},tags_text.ilike.${like}`
    );
  }
  if (tags.length) {
    query = query.contains('tags', tags);
  }

  const { data, error } = await query.limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json((data || []).map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    day: l.day,
    is_intro: l.is_intro,
    is_bonus: l.is_bonus,
    category: (l as any).category ?? null,
    tags: (l as any).tags ?? [],
  })));
}


