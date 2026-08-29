import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'safe' | 'suspicious' | 'fraud' | 'primary' | 'cyan' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  ...props
}) => {
  const variants: Record<string, string> = {
    safe: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    suspicious: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    fraud: 'bg-red-500/10 text-red-300 border-red-500/20',
    primary: 'bg-zinc-800 text-white border-zinc-700',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    neutral: 'bg-zinc-900/90 text-zinc-300 border-zinc-800',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.8 text-xs font-medium',
    lg: 'px-3 py-1 text-xs font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-normal font-mono',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};
