import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ScamCategory } from '../../types/fraud.types';
import { SCAM_CATEGORIES } from '../../utils/constants';
import { Sparkles, ShieldAlert, CheckCircle, Bell, ExternalLink, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RiskExplanationCardProps {
  score: number;
  category: ScamCategory;
  explanation: string;
  triggerPhrases?: string[];
  guardianNotified?: boolean;
  confidence?: number;
  className?: string;
}

export const RiskExplanationCard: React.FC<RiskExplanationCardProps> = ({
  score,
  category,
  explanation,
  triggerPhrases = [],
  guardianNotified = false,
  confidence = 0.95,
  className,
}) => {
  const categoryMeta = SCAM_CATEGORIES[category as ScamCategory] || SCAM_CATEGORIES.NONE;
  const isHighRisk = score >= 75;
  const isSuspicious = score >= 40 && score < 75;

  return (
    <Card
      className={cn(
        'space-y-4 border transition-all duration-200',
        isHighRisk
          ? 'bg-red-950/20 border-red-500/40'
          : isSuspicious
          ? 'bg-amber-950/20 border-amber-500/40'
          : 'bg-emerald-950/10 border-emerald-500/30',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-cyber-text flex items-center gap-2">
              Explainable AI (XAI) Fraud Assessment
            </h4>
            <span className="text-[11px] text-cyber-muted font-mono">
              Model: Claude 3.5 Sonnet NLP Engine
            </span>
          </div>
        </div>

        <Badge variant="primary" size="sm">
          Confidence: {Math.round(confidence * 100)}%
        </Badge>
      </div>

      {/* Primary Category Banner */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/80 border border-cyber-border">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: categoryMeta.color }}
        />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider block">
            Detected Fraud Pattern
          </span>
          <span className="text-sm font-bold text-white block truncate">
            {categoryMeta.label}
          </span>
        </div>
        <span
          className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
          style={{
            borderColor: categoryMeta.color,
            color: categoryMeta.color,
          }}
        >
          {score}/100 Risk
        </span>
      </div>

      {/* Model Natural Language Explanation */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyber-muted flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" /> Why this call was scored:
        </span>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-cyber-border/50 font-normal">
          {explanation}
        </p>
      </div>

      {/* Extracted Trigger Phrases */}
      {triggerPhrases.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyber-muted">
            Linguistic Threat Triggers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {triggerPhrases.map((phrase: string, i: number) => (
              <span
                key={i}
                className="text-xs font-mono px-2 py-1 rounded bg-red-950/80 text-red-300 border border-red-500/30 flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3 text-red-400" />
                "{phrase}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action & Guardian Notification Alert */}
      <div className="pt-2 border-t border-cyber-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {guardianNotified ? (
            <span className="flex items-center gap-1.5 text-threat-safe font-mono font-semibold">
              <CheckCircle className="w-4 h-4" /> Guardian Emergency Alert Dispatched
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-cyber-subtle font-mono">
              <Bell className="w-3.5 h-3.5" /> Guardian standby (Threshold 75+)
            </span>
          )}
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-cyan hover:underline inline-flex items-center gap-1 font-mono font-medium"
        >
          National Cybercrime Portal (1930) <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Card>
  );
};
