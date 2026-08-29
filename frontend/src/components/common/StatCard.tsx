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
    primary: 'bg-white/10 text-white border-white/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    fraud: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  };

  return (
    <Card hover className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{title}</p>
          <h4 className="text-2xl font-semibold text-white tracking-tight font-mono">{value}</h4>
        </div>
        <div className={cn('p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-105', iconVariants[variant] || iconVariants.neutral)}>
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          {change && (
            <span className={cn('font-medium font-mono text-[11px]', isPositive ? 'text-emerald-400' : 'text-red-400')}>
              {change}
            </span>
          )}
          {subtitle && <span className="text-zinc-500 text-[11px] truncate ml-auto">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
