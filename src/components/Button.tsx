'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/components/cn';

type ButtonProps = PropsWithChildren & ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', children, ...rest }: ButtonProps) {
    const base =
        'inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-[#FF6A00] text-white hover:bg-[#e55f00] active:bg-[#cc5600]',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300',
        ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200',
    } as const;
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}


