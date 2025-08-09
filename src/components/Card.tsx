import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/components/cn';

type CardProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...rest }: CardProps) {
    return (
    <div
            className={cn(
        'rounded-[10px] bg-white text-neutral-900 overflow-hidden shadow-sm ring-1 ring-neutral-200',
        'md:rounded-[12px]',
                'focus-within:ring-2 focus-within:ring-[#FF6A00]',
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}


