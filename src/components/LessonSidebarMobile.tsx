'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { SidebarLesson } from './LessonSidebar';
import { groupLessons } from './LessonSidebar';

type Props = {
  lessons: SidebarLesson[];
  currentSlug: string;
  completed: string[];
};

export default function LessonSidebarMobile({ lessons, currentSlug, completed }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const completedSet = useMemo(() => new Set(completed), [completed]);
  const filtered = useMemo(() => {
    if (!query) return lessons;
    const q = query.toLowerCase();
    return lessons.filter((l) => l.title.toLowerCase().includes(q) || l.slug.includes(q));
  }, [lessons, query]);
  const grouped = useMemo(() => groupLessons(filtered), [filtered]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] lg:hidden"
        aria-label="Open lessons"
      >
        ☰ Lessons
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-80 overflow-auto bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-900">Lessons</div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <input
              placeholder="Search lessons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-3 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
            />
            <nav className="space-y-4">
              {grouped.map(({ label, items }) => (
                <div key={label}>
                  <div className="mb-1 text-xs font-semibold uppercase text-neutral-700">{label}</div>
                  <ul className="space-y-1">
                    {items.map((l) => {
                      const isActive = l.slug === currentSlug;
                      const isDone = completedSet.has(l.slug);
                      return (
                        <li key={l.slug}>
                          <Link
                            href={`/lesson/${l.slug}`}
                            onClick={() => setOpen(false)}
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
          </div>
        </div>
      )}
    </>
  );
}


