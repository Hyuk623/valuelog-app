import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: boolean;
}

export const Card = ({ children, className, padding = true, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
                padding && 'p-4',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
