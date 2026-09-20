import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'frosted' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 select-none cursor-pointer will-change-transform';

  const variants: Record<string, string> = {
    primary: 'bg-white text-black font-semibold hover:bg-zinc-100 hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)] border border-white/90',
    secondary: 'bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 hover:shadow-lg border border-zinc-800',
    frosted: 'resend-frosted-btn text-white',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    outline: 'border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900/60',
    ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 hover:translate-y-0',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-medium',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  );
};
