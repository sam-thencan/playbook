"use client";
import { useState, useTransition } from 'react';

type Props = { lessonId: string; initial?: boolean; size?: number };

export default function FavoriteToggle({ lessonId, initial = false, size = 18 }: Props) {
  const [isFav, setIsFav] = useState<boolean>(initial);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFav(Boolean(data?.favorited));
      }
    });
  };

  return (
    <button
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={toggle}
      className="rounded-[10px] p-1 text-neutral-500 hover:text-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
      disabled={isPending}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isFav ? '#FF6A00' : 'none'}
        stroke={isFav ? '#FF6A00' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15 10 23 10 17 14 20 22 12 17 4 22 7 14 1 10 9 10 12 2" />
      </svg>
    </button>
  );
}


