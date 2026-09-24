import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CallRecord } from '../../types/call.types';
import { ScamCategory } from '../../types/fraud.types';
import { formatPhoneNumber, formatDuration, formatRelativeTime } from '../../utils/formatters';
import { getVerdictBadgeProps } from '../../utils/riskCalculator';
import { SCAM_CATEGORIES } from '../../utils/constants';
import { Phone, ChevronRight, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RecentCallsTableProps {
  calls: CallRecord[];
  onCallClick?: (callId: string) => void;
}

export const RecentCallsTable: React.FC<RecentCallsTableProps> = ({ calls, onCallClick }) => {
  const navigate = useNavigate();

  const handleRowClick = (callId: string) => {
    if (onCallClick) {
      onCallClick(callId);
    } else {
      navigate(`/calls/${callId}`);
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Fraudulent':
        return <ShieldAlert className="w-4 h-4 text-threat-fraud shrink-0" />;
      case 'Suspicious':
        return <AlertTriangle className="w-4 h-4 text-threat-suspicious shrink-0" />;
      case 'Legitimate':
      default:
        return <CheckCircle2 className="w-4 h-4 text-threat-safe shrink-0" />;
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white tracking-wide">Recent Monitored Calls</h3>
          <p className="text-xs text-zinc-400">Deepgram Speech Diarization & Claude NLP Scored Records</p>
        </div>
        <button
          onClick={() => navigate('/calls')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 transition-colors"
        >
          View All History <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              <th className="py-3 px-5">Caller ID &amp; Contact</th>
              <th className="py-3 px-4">Primary Category</th>
              <th className="py-3 px-4">Threat Score</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-5 text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {calls.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-5 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">No Monitored Calls Yet</h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        AI Guardian Defense is active and standing by. Incoming speech streams and simulations will populate here in real-time.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/simulation')}
                      className="text-xs font-mono font-medium text-cyan-400 hover:underline inline-flex items-center gap-1.5 pt-1"
                    >
                      Launch Call Simulator &rarr;
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              calls.slice(0, 5).map((call: CallRecord) => {
                const badgeProps = getVerdictBadgeProps(call.verdict);
                const category = SCAM_CATEGORIES[call.primaryCategory as ScamCategory] || SCAM_CATEGORIES.NONE;

                return (
                  <tr
                    key={call.callId}
                    onClick={() => handleRowClick(call.callId)}
                    className="hover:bg-white/[0.05] cursor-pointer transition-all duration-150 group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            {call.callerName || formatPhoneNumber(call.callerNumber)}
                          </div>
                          <div className="text-xs text-zinc-500 font-mono">
                            {formatPhoneNumber(call.callerNumber)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: category.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {call.finalScore}
                        </span>
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${call.finalScore}%`,
                              backgroundColor:
                                call.finalScore >= 75 ? '#EF4444' : call.finalScore >= 40 ? '#F59E0B' : '#10B981',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getVerdictIcon(call.verdict)}
                        <Badge variant={badgeProps.variant} size="sm">
                          {call.verdict}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-zinc-400">
                      {formatDuration(call.durationSeconds)}
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono text-xs text-zinc-500">
                      {formatRelativeTime(call.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
