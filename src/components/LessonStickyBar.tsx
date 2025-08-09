'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';

type Props = {
  prevSlug: string | null;
  nextSlug: string | null;
  currentSlug: string;
};

export default function LessonStickyBar({ prevSlug, nextSlug, currentSlug }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/75 lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-2">
        {prevSlug ? (
          <Link href={`/lesson/${prevSlug}`} className="flex-1">
            <Button variant="secondary" className="w-full">Previous</Button>
          </Link>
        ) : <div className="flex-1" />}
        <form action="/api/progress/complete" method="post" className="flex-1">
          <input type="hidden" name="lessonSlug" value={currentSlug} />
          <Button className="w-full">Mark Complete</Button>
        </form>
        {nextSlug ? (
          <Link href={`/lesson/${nextSlug}`} className="flex-1">
            <Button variant="secondary" className="w-full">Next</Button>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  );
}


