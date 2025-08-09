'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

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

  const grouped = useMemo(() => groupLessons(filtered), [filtered]);

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-80px)] w-72 shrink-0 overflow-auto rounded-md bg-white p-3 ring-1 ring-neutral-300 lg:block">
      <div className="mb-2 text-sm font-semibold text-neutral-900">Lessons</div>
      <input
        placeholder="Search lessons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
      />
      <nav className="space-y-2">
        {grouped.map(({ label, items }) => (
          <details key={label} open>
            <summary className="mb-1 cursor-pointer text-xs font-semibold uppercase text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]">
              {label}
            </summary>
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
          </details>
        ))}
      </nav>
    </aside>
  );
}

function groupLessons(lessons: SidebarLesson[]): Array<{ label: string; items: SidebarLesson[] }> {
  const intro = lessons.filter((l) => l.is_intro);
  const bonus = lessons.filter((l) => l.is_bonus);
  const days = lessons.filter((l) => !l.is_intro && !l.is_bonus);
  const groups: Array<{ label: string; items: SidebarLesson[] }> = [];
  if (intro.length) groups.push({ label: 'Intro', items: intro });
  for (let start = 1; start <= 30; start += 5) {
    const end = Math.min(30, start + 4);
    const items = days.filter((d) => (d.day ?? 0) >= start && (d.day ?? 0) <= end);
    if (items.length) groups.push({ label: `Days ${start}–${end}`, items });
  }
  if (bonus.length) groups.push({ label: 'Bonus', items: bonus });
  return groups;
}


