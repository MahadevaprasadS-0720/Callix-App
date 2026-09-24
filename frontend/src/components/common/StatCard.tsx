import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'cyan' | 'safe' | 'fraud' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
  icon,
  variant = 'neutral',
}) => {
  const iconVariants: Record<string, string> = {
    primary: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    safe: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    fraud: 'bg-red-500/15 text-red-300 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    neutral: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
  };

  const cardGlowClass: Record<string, string> = {
    safe: 'liquid-glass-emerald',
    fraud: 'liquid-glass-red',
    cyan: 'liquid-glass-cyan',
    primary: 'liquid-glass-emerald',
    neutral: 'liquid-glass-amber',
  };

  const ambientOrbColor: Record<string, string> = {
    safe: 'bg-emerald-500/15 group-hover:bg-emerald-500/30',
    fraud: 'bg-red-500/15 group-hover:bg-red-500/30',
    cyan: 'bg-cyan-500/15 group-hover:bg-cyan-500/30',
    primary: 'bg-emerald-500/15 group-hover:bg-emerald-500/30',
    neutral: 'bg-amber-500/15 group-hover:bg-amber-500/30',
  };

  return (
    <Card 
      hover 
      className={cn(
        'relative overflow-hidden group p-5 rounded-2xl transition-all duration-200 ease-out transform-gpu select-none hover:-translate-y-0.5',
        cardGlowClass[variant] || ''
      )}
    >
      {/* Dynamic Ambient Accent Glow Orb in card background */}
      <div 
        className={cn(
          'absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all duration-300',
          ambientOrbColor[variant] || 'bg-white/5'
        )} 
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono group-hover:text-white transition-colors duration-300">
            {value}
          </h4>
        </div>
        <div className={cn(
          'p-3 rounded-2xl border backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 shadow-sm',
          iconVariants[variant] || iconVariants.neutral
        )}>
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
          {change && (
            <span className={cn(
              'font-semibold font-mono text-[11px] px-2 py-0.5 rounded-full backdrop-blur-md',
              isPositive 
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            )}>
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-zinc-400 text-[11px] truncate ml-auto font-mono">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

