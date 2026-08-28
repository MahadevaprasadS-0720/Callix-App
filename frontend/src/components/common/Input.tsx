import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-cyber-muted tracking-wider uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-cyber-subtle pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-cyber-bg border border-cyber-border rounded-lg px-3.5 py-2.5 text-sm text-cyber-text placeholder-cyber-subtle transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-threat-fraud focus:border-threat-fraud focus:ring-threat-fraud',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-cyber-subtle">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-threat-fraud font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
