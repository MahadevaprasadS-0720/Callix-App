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
    primary: 'bg-indigo-500/10 text-brand-primary border-indigo-500/20',
    cyan: 'bg-cyan-500/10 text-brand-cyan border-cyan-500/20',
    safe: 'bg-emerald-500/10 text-threat-safe border-emerald-500/20',
    fraud: 'bg-red-500/10 text-threat-fraud border-red-500/20',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <Card hover className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyber-muted">{title}</p>
          <h4 className="text-2xl font-bold text-cyber-text tracking-tight font-mono">{value}</h4>
        </div>
        <div className={cn('p-3 rounded-xl border transition-all duration-300 group-hover:scale-110', iconVariants[variant] || iconVariants.neutral)}>
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-cyber-border/60 flex items-center justify-between text-xs">
          {change && (
            <span className={cn('font-medium', isPositive ? 'text-threat-safe' : 'text-threat-fraud')}>
              {change}
            </span>
          )}
          {subtitle && <span className="text-cyber-subtle truncate ml-auto">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
