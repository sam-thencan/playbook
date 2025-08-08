import type { HTMLAttributes } from 'react';
import { cn } from '@/components/cn';

type ProgressRingProps = HTMLAttributes<HTMLDivElement> & {
    value: number;
    size?: number;
    strokeWidth?: number;
};

export function ProgressRing({ value, size = 96, strokeWidth = 8, className, ...rest }: ProgressRingProps) {
    const normalized = Math.max(0, Math.min(100, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalized / 100) * circumference;

    return (
        <div className={cn('inline-block', className)} style={{ width: size, height: size }} {...rest}>
            <svg width={size} height={size}>
                <circle stroke="#e5e7eb" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
                <circle
                    stroke="#FF6A00"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
        </div>
    );
}


