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
    primary: 'hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]',
    cyan: 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.22)]',
    danger: 'hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]',
    safe: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  };

  return (
    <div
      className={cn(
        'liquid-glass-card rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden transform-gpu',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        hover && 'hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.85)] cursor-pointer',
        glows[glow] || '',
        className
      )}
      style={{ willChange: 'transform, box-shadow' }}
      {...props}
    >
      {children}
    </div>
  );
};

