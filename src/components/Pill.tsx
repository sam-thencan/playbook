import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/components/cn';

type PillProps = PropsWithChildren &
    HTMLAttributes<HTMLSpanElement> & {
        variant?: 'solid' | 'soft';
    };

export function Pill({ children, variant = 'solid', className, ...rest }: PillProps) {
    const styles = variant === 'solid' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900';
    return (
        <span
            className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', styles, className)}
            {...rest}
        >
            {children}
        </span>
    );
}


