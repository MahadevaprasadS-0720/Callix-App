import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ToastMessage {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const icons = {
    danger: <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-cyan shrink-0" />,
  };

  const styles = {
    danger: 'bg-red-950/90 border-red-500/60 text-red-100 shadow-glow-danger/20',
    warning: 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-glow-primary/20',
    success: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100 shadow-glow-safe/20',
    info: 'bg-slate-900/95 border-brand-cyan/60 text-slate-100 shadow-glow-cyan/20',
  };

  return (
    <div
      className={cn(
        'w-80 sm:w-96 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 flex items-start gap-3 relative animate-in fade-in slide-in-from-top-4',
        styles[toast.type]
      )}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <h5 className="font-bold text-xs tracking-wide uppercase font-mono">{toast.title}</h5>
        <p className="text-xs leading-relaxed opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-white/60 hover:text-white rounded hover:bg-black/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
