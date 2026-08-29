import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: 'primary' | 'cyan' | 'danger' | 'safe' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glow = 'none',
  ...props
}) => {
  const glows: Record<string, string> = {
    none: '',
    primary: 'hover:border-zinc-500/50 hover:shadow-glow-primary',
    cyan: 'hover:border-cyan-500/40 hover:shadow-glow-cyan',
    danger: 'hover:border-red-500/40 hover:shadow-glow-danger',
    safe: 'hover:border-emerald-500/40 hover:shadow-glow-safe',
  };

  return (
    <div
      className={cn(
        'bg-[#09090B] border border-white/[0.08] rounded-2xl p-5 shadow-2xl transition-all duration-200',
        hover && 'hover:bg-[#0E0E12] hover:border-white/[0.15]',
        glows[glow] || '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
