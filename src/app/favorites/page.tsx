import Link from 'next/link';
import { Card } from '@/components/Card';
import { getServerSupabase } from '@/lib/supabaseServer';
import FavoriteToggle from '@/components/FavoriteToggle';

export default async function FavoritesPage() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return (null);

  // Gate unpaid users: if user has no access, show a CTA to pay.
  const { data: profile } = await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle();
  if (profile?.has_access === false) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-semibold">Favorites</h1>
        <Card>
          <div className="p-6">
            <p className="text-neutral-700">Unlock access to view and manage your favorites.</p>
            <a href="/pay" className="mt-3 inline-block rounded-md bg-[#FF6A00] px-4 py-2 text-white">Go to Paywall</a>
          </div>
        </Card>
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
            <li key={row.lesson_id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <FavoriteToggle lessonId={row.lessons.id} initial={true} />
                <Link href={`/lesson/${row.lessons.slug}`} className="hover:underline">
                  {row.lessons.title}
                </Link>
              </div>
              <a href={`/lesson/${row.lessons.slug}`} className="text-sm text-[#FF6A00] hover:underline">Open</a>
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


