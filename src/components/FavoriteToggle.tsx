"use client";
import { useState, useTransition } from 'react';
import { useToast } from '@/components/Toast';

type Props = { lessonId: string; initial?: boolean; size?: number; onChange?: (favorited: boolean) => void };

export default function FavoriteToggle({ lessonId, initial = false, size = 18, onChange }: Props) {
  const [isFav, setIsFav] = useState<boolean>(initial);
  const [isPending, startTransition] = useTransition();
  const { notify } = useToast();

  const toggle = () => {
    // optimistic UI
    setIsFav((prev) => !prev);
    startTransition(async () => {
      try {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const raw = await res.text();
        const data = (() => { try { return JSON.parse(raw); } catch { return {}; } })() as any;
        if (!res.ok) throw new Error(data?.error || raw || 'Request failed');
        const nextVal = Boolean(data?.favorited);
        setIsFav(nextVal);
        notify(data?.favorited ? 'Added to favorites' : 'Removed from favorites');
        onChange?.(nextVal);
        window.dispatchEvent(new Event('favorite:changed'));
      } catch (e) {
        // revert on failure
        setIsFav((prev) => !prev);
        notify((e as Error)?.message || 'Could not save favorite');
      }
    });
  };

  return (
    <button
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={toggle}
      className={`rounded-[10px] p-1 ${isFav ? 'text-[#FF6A00]' : 'text-neutral-500'} hover:text-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/40`}
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


