import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Zap, ShieldAlert, Sparkles, X, PhoneOff, ArrowRight } from 'lucide-react';

export interface GroqAlertProps {
  alert: {
    isFraud: boolean;
    confidence: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reason: string;
    latencyMs?: number;
    model?: string;
    engine?: string;
  } | null;
  onDismiss?: () => void;
  onTerminateCall?: () => void;
  onConsultAssistant?: (contextReason: string) => void;
  className?: string;
}

export const GroqFraudAlertBanner: React.FC<GroqAlertProps> = ({
  alert,
  onDismiss,
  onTerminateCall,
  onConsultAssistant,
  className = '',
}) => {
  if (!alert || !alert.isFraud || alert.riskLevel !== 'HIGH') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`relative overflow-hidden rounded-2xl border border-red-500/60 bg-gradient-to-r from-red-950/90 via-red-900/50 to-neutral-950/90 p-4 sm:p-5 shadow-[0_0_40px_rgba(239,68,68,0.45),inset_0_1px_0_0_rgba(255,255,255,0.25)] backdrop-blur-2xl text-white ${className}`}
      >
        {/* Animated ambient warning shimmer */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-red-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Column: Icon + Headline + Reason */}
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0 mt-0.5">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/25 border border-red-500/50 text-red-200 text-xs font-bold font-mono uppercase tracking-wider shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  ⚠️ HIGH FRAUD RISK DETECTED BY GROQ REAL-TIME SHIELD
                </span>

                {alert.latencyMs !== undefined && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono font-semibold text-emerald-300">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    {alert.latencyMs}ms LPU Speed
                  </span>
                )}

                <span className="text-[11px] font-mono text-zinc-400">
                  Confidence: {Math.round((alert.confidence || 0.95) * 100)}%
                </span>
              </div>

              <p className="text-sm font-semibold text-white/95 leading-snug">
                {alert.reason}
              </p>

              <div className="text-[11px] text-red-200/80 font-mono">
                Engine: <span className="text-white font-semibold">{alert.engine || 'Groq Ultra-Fast LPU'}</span> • Model: <span className="text-zinc-300 font-mono">{alert.model || 'Groq LPU'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {onConsultAssistant && (
              <button
                type="button"
                onClick={() => onConsultAssistant(alert.reason)}
                className="ios-frosted-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-200 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Ask Callix AI</span>
              </button>
            )}

            {onTerminateCall && (
              <button
                type="button"
                onClick={onTerminateCall}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/50 transition-all cursor-pointer active:scale-95"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss Alert"
                aria-label="Dismiss Alert"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
