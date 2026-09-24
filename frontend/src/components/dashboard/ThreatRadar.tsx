import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import { ShieldAlert, ShieldCheck, Zap, Radio } from 'lucide-react';
import { SCAM_CATEGORIES } from '../../utils/constants';
import { ScamCategory } from '../../types/fraud.types';
import { CallRecord } from '../../types/call.types';

interface ThreatRadarProps {
  calls?: CallRecord[];
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ calls = [] }) => {
  const activeThreats = useMemo(() => {
    const threatCalls = calls.filter(
      (c) => c.primaryCategory && c.primaryCategory !== 'SAFE' && c.primaryCategory !== 'NONE'
    );
    if (threatCalls.length === 0) {
      return [];
    }

    const counts: Record<string, number> = {};
    threatCalls.forEach((c) => {
      const cat = c.primaryCategory as ScamCategory;
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = threatCalls.length;
    return Object.entries(counts)
      .map(([category, count]) => ({
        category: category as ScamCategory,
        count,
        prevalence: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [calls]);

  return (
    <Card className="flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Active Fraud Vectors</h3>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-red-300 bg-red-500/15 border border-red-500/30 px-2.5 py-1 rounded-full">
            <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Real-time threat prevalence across monitored telephony streams.
        </p>

        {/* Threat Distribution Bars or Clean Empty Status */}
        {activeThreats.length === 0 ? (
          <div className="py-8 px-4 text-center bg-white/[0.02] rounded-2xl border border-white/10 my-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">No Active Fraud Vectors Recorded</p>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed max-w-sm mx-auto">
              Zero malicious signatures detected across current streams. Heuristics are actively armed and ready.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {activeThreats.map((threat) => {
              const meta = SCAM_CATEGORIES[threat.category] || SCAM_CATEGORIES.SAFE;
              return (
                <div key={threat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      {meta.label}
                    </span>
                    <span className="font-mono text-zinc-400 font-semibold text-[11px]">
                      {threat.prevalence}% ({threat.count} {threat.count === 1 ? 'threat' : 'threats'})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
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
        )}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Decision Engine Status:</span>
        </div>
        <span className="font-mono font-semibold text-emerald-400">Heuristic + Claude Active</span>
      </div>
    </Card>
  );
};
