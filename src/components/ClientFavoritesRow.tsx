"use client";
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import FavoriteToggle from '@/components/FavoriteToggle';

type Item = { id: string; slug: string; title: string; day?: number | null };

export default function ClientFavoritesRow({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>([...initial].sort((a, b) => ((a.day ?? 999) - (b.day ?? 999)) || a.title.localeCompare(b.title)));

  const refresh = useCallback(async () => {
    const res = await fetch('/api/favorites', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const sorted = (json.items || []) as Item[];
      setItems(sorted);
    }
  }, []);

  useEffect(() => {
    const onFav = () => refresh();
    window.addEventListener('favorite:changed', onFav);
    return () => window.removeEventListener('favorite:changed', onFav);
  }, [refresh]);

  return (
    <ul className="flex flex-wrap gap-3 p-4">
      {items.slice(0, 5).map((it) => (
        <li key={it.id} className="flex items-center gap-2 rounded-[10px] border border-neutral-200 px-3 py-2">
          <FavoriteToggle lessonId={it.id} initial={true} />
          <Link href={`/lesson/${it.slug}`} className="hover:underline">
            {it.title}
          </Link>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-sm text-neutral-600">No favorites yet. Star lessons to add them here.</li>
      )}
    </ul>
  );
}


