import React from 'react';
import { cn } from '../../utils/cn';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  className,
}) => {
  const sizes: Record<string, string> = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}>
      <div
        className={cn(
          'rounded-full border-brand-primary/20 border-t-brand-cyan animate-spin',
          sizes[size] || sizes.md
        )}
      />
      {text && <p className="text-xs text-cyber-muted font-medium font-mono">{text}</p>}
    </div>
  );
};
