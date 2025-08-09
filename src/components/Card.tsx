import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/components/cn';

type CardProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...rest }: CardProps) {
    return (
    <div
            className={cn(
        'rounded-[10px] bg-white text-neutral-900 overflow-hidden shadow-sm ring-1 ring-neutral-200 transition-all',
        'md:rounded-[12px]',
                'hover:shadow-md hover:ring-neutral-300 hover:-translate-y-0.5',
                'focus-within:ring-2 focus-within:ring-[#FF6A00]/40',
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}


