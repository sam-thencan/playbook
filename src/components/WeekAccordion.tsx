"use client";
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import FavoriteToggle from '@/components/FavoriteToggle';

export type OutlineItem = { slug: string; title: string; completed: boolean; id?: string; favorited?: boolean };
export type WeekGroup = { label: string; items: OutlineItem[]; completedCount: number; nextSlug?: string | null };

type Props = {
  groups: WeekGroup[];
  nextFallback: string;
};

export default function WeekAccordion({ groups, nextFallback }: Props) {
  const defaultIndex = useMemo(() => {
    const firstWithIncomplete = groups.findIndex(g => g.items.some(it => !it.completed));
    return Math.max(0, firstWithIncomplete);
  }, [groups]);
  const [openIndex, setOpenIndex] = useState<number>(defaultIndex);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {groups.map((g, idx) => (
        <Card key={g.label}>
          <details open={idx === openIndex}>
            <summary
              className="flex cursor-pointer items-center justify-between p-4 font-medium select-none"
              onClick={(e) => {
                e.preventDefault();
                setOpenIndex(idx === openIndex ? -1 : idx);
              }}
            >
              <span className="flex items-center gap-2">
                <Chevron isOpen={idx === openIndex} />
                {g.label}
              </span>
              <span className="text-sm text-neutral-600">{g.completedCount}/{g.items.length} complete</span>
            </summary>
            <div className="accordion-content">
              <ul className="divide-y divide-neutral-200">
                {g.items.map((it) => (
                  <li key={it.slug} className="flex items-center justify-between p-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {it.id && <FavoriteToggle lessonId={it.id} initial={!!it.favorited} />}
                      <Link href={`/lesson/${it.slug}`} className="truncate underline-offset-2 hover:underline">
                        {it.title}
                      </Link>
                    </div>
                    {it.completed && <span className="ml-2 text-[#FF6A00]">✓</span>}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-end gap-2 p-3">
                <Link href={`/lesson/${g.nextSlug ?? nextFallback}`}>
                  <Button variant="secondary">Resume Week</Button>
                </Link>
              </div>
            </div>
          </details>
        </Card>
      ))}
    </div>
  );
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}


