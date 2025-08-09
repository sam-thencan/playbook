import Link from 'next/link';
import { Card } from '@/components/Card';
import { getServerSupabase } from '@/lib/supabaseServer';

export default async function FavoritesPage() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-semibold">Favorites</h1>
        <p className="text-neutral-600">Sign in to see your favorites.</p>
      </main>
    );
  }

  const { data } = await supabase
    .from('favorites')
    .select('lesson_id, lessons!inner(id, slug, title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">Favorites</h1>
      <Card>
        <ul className="divide-y divide-neutral-200">
          {(data || []).map((row: any) => (
            <li key={row.lesson_id} className="p-4">
              <Link href={`/lesson/${row.lessons.slug}`} className="hover:underline">
                {row.lessons.title}
              </Link>
            </li>
          ))}
          {(data || []).length === 0 && (
            <li className="p-4 text-sm text-neutral-600">No favorites yet.</li>
          )}
        </ul>
      </Card>
    </main>
  );
}


