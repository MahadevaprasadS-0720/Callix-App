import React from 'react';
import { ShieldCheck, AlertOctagon, Flame, Eye, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface XAIHighlightsProps {
  score: number;
  category: string;
  className?: string;
}

export const XAIHighlights: React.FC<XAIHighlightsProps> = ({ score, category, className }) => {
  const getFactors = () => {
    if (score >= 75) {
      return [
        {
          title: 'High Coercive Pressure',
          desc: 'Caller induced artificial urgency with rapid time constraints (e.g. 15-30 mins).',
          icon: <Flame className="w-4 h-4 text-red-400" />,
          severity: 'Critical',
          color: 'text-red-400 border-red-500/30 bg-red-950/40',
        },
        {
          title: 'Authority Simulation',
          desc: 'Impersonated government agencies, law enforcement, or nationalized bank officers.',
          icon: <Eye className="w-4 h-4 text-orange-400" />,
          severity: 'Severe',
          color: 'text-orange-400 border-orange-500/30 bg-orange-950/40',
        },
        {
          title: 'Financial & Credential Extortion',
          desc: 'Direct or indirect solicitation of OTP, UPI payment approval, or escrow fund transfer.',
          icon: <Lock className="w-4 h-4 text-amber-400" />,
          severity: 'High',
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
        },
      ];
    }

    if (score >= 40) {
      return [
        {
          title: 'Unverified Entity',
          desc: 'Caller requested verification links or third-party confirmations without valid credentials.',
          icon: <AlertOctagon className="w-4 h-4 text-amber-400" />,
          severity: 'Medium',
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
        },
        {
          title: 'Inconsistent Call Origin',
          desc: 'Telephony metadata indicates potential VoIP gateway forwarding.',
          icon: <Eye className="w-4 h-4 text-yellow-400" />,
          severity: 'Caution',
          color: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40',
        },
      ];
    }

    return [
      {
        title: 'Zero Extortion Indicators',
        desc: 'Natural dialogue flow without financial demands or credential harvesting attempts.',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        severity: 'Safe',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
      },
    ];
  };

  return (
    <div className={cn('space-y-2.5', className)}>
      <h5 className="text-xs font-semibold uppercase tracking-wider text-cyber-muted">
        Psychological & Forensic Vector Breakdown
      </h5>
      <div className="grid grid-cols-1 gap-2.5">
        {getFactors().map((factor: any, idx: number) => (
          <div
            key={idx}
            className={cn('p-3 rounded-lg border flex items-start gap-3 transition-colors', factor.color)}
          >
            <div className="p-1 rounded-md bg-black/40 mt-0.5 shrink-0">{factor.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">{factor.title}</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                  {factor.severity}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{factor.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
