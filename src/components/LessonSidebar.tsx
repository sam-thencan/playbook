'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export type SidebarLesson = {
  slug: string;
  title: string;
  day: number | null;
  is_intro: boolean;
  is_bonus: boolean;
};

type Props = {
  lessons: SidebarLesson[];
  currentSlug: string;
  completed: string[]; // slugs
};

export default function LessonSidebar({ lessons, currentSlug, completed }: Props) {
  const [query, setQuery] = useState('');
  const completedSet = useMemo(() => new Set(completed), [completed]);
  const filtered = useMemo(() => {
    if (!query) return lessons;
    const q = query.toLowerCase();
    return lessons.filter((l) => l.title.toLowerCase().includes(q) || l.slug.includes(q));
  }, [lessons, query]);

  const grouped = useMemo(() => groupLessonsByCategory(filtered), [filtered]);

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-80px)] w-72 shrink-0 overflow-auto rounded-md bg-white p-3 ring-1 ring-neutral-300 lg:block">
      <div className="mb-2 text-sm font-semibold text-neutral-900">Lessons</div>
      <input
        placeholder="Search lessons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
      />
      <nav className="space-y-4 pb-24">
        {grouped.map(({ label, items }) => (
          <div key={label}>
            <div className="sticky top-0 z-10 mb-1 bg-white/90 px-1 py-1 text-xs font-semibold uppercase text-neutral-700 backdrop-blur">
              {label}
            </div>
            <ul className="space-y-1 pb-2">
              {items.map((l) => {
                const isActive = l.slug === currentSlug;
                const isDone = completedSet.has(l.slug);
                return (
                  <li key={l.slug}>
                    <Link
                      href={`/lesson/${l.slug}`}
                      className={
                        'flex items-center justify-between rounded-md px-2 py-1 text-sm text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] ' +
                        (isActive ? 'bg-neutral-100 font-semibold' : '')
                      }
                    >
                      <span className="truncate">{l.title}</span>
                      {isDone && <span className="ml-2 text-[#FF6A00]">✓</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function groupLessonsByCategory(lessons: SidebarLesson[]): Array<{ label: string; items: SidebarLesson[] }> {
  const order = ['Intro', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Bonus'];
  function inferCategory(l: SidebarLesson): string {
    if (l.is_intro) return 'Intro';
    if (l.is_bonus) return 'Bonus';
    const d = l.day ?? 0;
    if (d <= 7) return 'Week 1';
    if (d <= 14) return 'Week 2';
    if (d <= 21) return 'Week 3';
    if (d <= 28) return 'Week 4';
    return 'Week 5';
  }
  const map = new Map<string, SidebarLesson[]>();
  for (const l of lessons) {
    const c = inferCategory(l);
    const arr = map.get(c) ?? [];
    arr.push(l);
    map.set(c, arr);
  }
  const groups: Array<{ label: string; items: SidebarLesson[] }> = [];
  for (const label of order) {
    const items = map.get(label);
    if (items && items.length) groups.push({ label, items });
  }
  return groups;
}


