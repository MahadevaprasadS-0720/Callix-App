import React from 'react';
import { Card } from '../common/Card';
import { ShieldAlert, Zap, Radio } from 'lucide-react';
import { SCAM_CATEGORIES } from '../../utils/constants';
import { ScamCategory } from '../../types/fraud.types';

export const ThreatRadar: React.FC = () => {
  const activeThreats: Array<{ category: ScamCategory; prevalence: number; count: number }> = [
    { category: 'CUSTOMS_PARCEL_SCAM', prevalence: 38, count: 32 },
    { category: 'OTP_THEFT', prevalence: 28, count: 24 },
    { category: 'UPI_FRAUD', prevalence: 18, count: 15 },
    { category: 'KYC_EXPIRY', prevalence: 12, count: 10 },
    { category: 'IMPERSONATION', prevalence: 4, count: 3 },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-threat-fraud" />
            <h3 className="font-bold text-base text-cyber-text">Active Fraud Vectors</h3>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-threat-fraud bg-red-950/70 border border-red-500/30 px-2 py-0.5 rounded-full">
            <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
          </span>
        </div>
        <p className="text-xs text-cyber-muted">
          Real-time threat prevalence across Indian telecom circles in the last 24 hours.
        </p>

        {/* Threat Distribution Bars */}
        <div className="space-y-3 pt-2">
          {activeThreats.map((threat) => {
            const meta = SCAM_CATEGORIES[threat.category] || SCAM_CATEGORIES.SAFE;
            return (
              <div key={threat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-cyber-text flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                    {meta.label}
                  </span>
                  <span className="font-mono text-cyber-subtle font-semibold">
                    {threat.prevalence}% ({threat.count} attacks)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${threat.prevalence}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 p-3 rounded-lg bg-slate-900/60 border border-cyber-border/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyber-muted">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Decision Engine Status:</span>
        </div>
        <span className="font-mono font-semibold text-threat-safe">Heuristic + Claude Active</span>
      </div>
    </Card>
  );
};
