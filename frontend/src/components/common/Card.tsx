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
    primary: 'hover:shadow-glow-primary hover:border-brand-primary/40',
    cyan: 'hover:shadow-glow-cyan hover:border-brand-cyan/40',
    danger: 'hover:shadow-glow-danger hover:border-threat-fraud/40',
    safe: 'hover:shadow-glow-safe hover:border-threat-safe/40',
  };

  return (
    <div
      className={cn(
        'bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-card-cyber transition-all duration-200',
        hover && 'hover:bg-cyber-cardHover hover:border-cyber-borderLight',
        glows[glow] || '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
