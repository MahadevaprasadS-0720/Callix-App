import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CallRecord } from '../../types/call.types';
import { ScamCategory } from '../../types/fraud.types';
import { formatPhoneNumber, formatDuration, formatRelativeTime } from '../../utils/formatters';
import { getVerdictBadgeProps } from '../../utils/riskCalculator';
import { SCAM_CATEGORIES } from '../../utils/constants';
import { Phone, ChevronRight, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

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
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-cyber-text tracking-wide">Recent Monitored Calls</h3>
          <p className="text-xs text-cyber-muted">Deepgram Speech Diarization & Claude NLP Scored Records</p>
        </div>
        <button
          onClick={() => navigate('/calls')}
          className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
        >
          View All History <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyber-border bg-slate-900/50 text-[11px] font-mono uppercase tracking-wider text-cyber-subtle">
              <th className="py-3 px-5">Caller ID & Contact</th>
              <th className="py-3 px-4">Primary Category</th>
              <th className="py-3 px-4">Threat Score</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-5 text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/60">
            {calls.slice(0, 5).map((call: CallRecord) => {
              const badgeProps = getVerdictBadgeProps(call.verdict);
              const category = SCAM_CATEGORIES[call.primaryCategory as ScamCategory] || SCAM_CATEGORIES.NONE;

              return (
                <tr
                  key={call.callId}
                  onClick={() => handleRowClick(call.callId)}
                  className="hover:bg-cyber-cardHover/70 cursor-pointer transition-colors duration-150 group"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-cyber-muted group-hover:text-brand-cyan transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-cyber-text group-hover:text-white">
                          {call.callerName || formatPhoneNumber(call.callerNumber)}
                        </div>
                        <div className="text-xs text-cyber-subtle font-mono">
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
                      <span className="font-mono font-bold text-sm text-cyber-text">
                        {call.finalScore}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
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

                  <td className="py-3.5 px-4 font-mono text-xs text-cyber-muted">
                    {formatDuration(call.durationSeconds)}
                  </td>

                  <td className="py-3.5 px-5 text-right font-mono text-xs text-cyber-subtle">
                    {formatRelativeTime(call.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
