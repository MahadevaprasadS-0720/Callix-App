import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useCallHistory } from '../hooks/useCallHistory';
import { CallRecord, CallVerdict } from '../types/call.types';
import { ScamCategory } from '../types/fraud.types';
import { formatPhoneNumber, formatDuration, formatTimestamp } from '../utils/formatters';
import { getVerdictBadgeProps } from '../utils/riskCalculator';
import { SCAM_CATEGORIES } from '../utils/constants';
import { 
  PhoneCall, 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RotateCcw, 
  Share2, 
  Eye,
  Flag
} from 'lucide-react';

export const CallHistory: React.FC = () => {
  const navigate = useNavigate();
  const { calls, loading, deleteCall, fetchCalls } = useCallHistory();

  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | CallVerdict>('ALL');
  const [selectedCallToDelete, setSelectedCallToDelete] = useState<string | null>(null);

  const filteredCalls = useMemo(() => {
    return calls.filter((call: CallRecord) => {
      const matchesVerdict = verdictFilter === 'ALL' || call.verdict === verdictFilter;
      const matchesSearch = 
        call.callerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (call.callerName && call.callerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (call.summaryExplanation && call.summaryExplanation.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesVerdict && matchesSearch;
    });
  }, [calls, verdictFilter, searchTerm]);

  const handleDeleteConfirm = async () => {
    if (selectedCallToDelete) {
      await deleteCall(selectedCallToDelete);
      setSelectedCallToDelete(null);
    }
  };

  const getVerdictIcon = (verdict: CallVerdict) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-brand-cyan" />
            Monitored Call Records & Forensics History
          </h2>
          <p className="text-xs text-cyber-muted">
            Search, filter, and inspect transcripts and real-time risk scores for all monitored telephony sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCalls}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-200 cursor-pointer transform-gpu hover:-translate-y-0.5 active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            <span>Refresh Records</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              placeholder="Search by caller, number, or keyword..."
              leftIcon={<Search className="w-4 h-4 text-cyber-muted" />}
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <span className="text-xs font-mono font-semibold text-cyber-muted uppercase tracking-wider mr-1">Filter:</span>
            {(
              [
                { id: 'ALL', label: 'All Calls', activeClasses: 'bg-white text-zinc-950 font-bold border-white shadow-[0_0_16px_rgba(255,255,255,0.35)]', inactiveClasses: 'bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/[0.08]', dot: null },
                { id: 'Fraudulent', label: 'Fraudulent', activeClasses: 'bg-red-500/25 text-red-200 border-red-500/60 shadow-[0_0_18px_rgba(239,68,68,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-semibold', inactiveClasses: 'bg-red-500/[0.08] text-red-400/90 border-red-500/25 hover:border-red-500/50 hover:text-red-200 hover:bg-red-500/[0.16]', dot: 'bg-red-400 animate-pulse' },
                { id: 'Suspicious', label: 'Suspicious', activeClasses: 'bg-amber-500/25 text-amber-200 border-amber-500/60 shadow-[0_0_18px_rgba(245,158,11,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-semibold', inactiveClasses: 'bg-amber-500/[0.08] text-amber-400/90 border-amber-500/25 hover:border-amber-500/50 hover:text-amber-200 hover:bg-amber-500/[0.16]', dot: 'bg-amber-400' },
                { id: 'Legitimate', label: 'Legitimate', activeClasses: 'bg-emerald-500/25 text-emerald-200 border-emerald-500/60 shadow-[0_0_18px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-semibold', inactiveClasses: 'bg-emerald-500/[0.08] text-emerald-400/90 border-emerald-500/25 hover:border-emerald-500/50 hover:text-emerald-200 hover:bg-emerald-500/[0.16]', dot: 'bg-emerald-400' },
              ] as const
            ).map((item) => {
              const isActive = verdictFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setVerdictFilter(item.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md transition-all duration-200 cursor-pointer transform-gpu hover:-translate-y-0.5 active:scale-95 ${
                    isActive ? item.activeClasses : item.inactiveClasses
                  }`}
                >
                  {item.dot && (
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Calls Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-cyber-border bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-cyber-subtle">
                <th className="py-3.5 px-5">Caller ID & Identity</th>
                <th className="py-3.5 px-4">Primary Category</th>
                <th className="py-3.5 px-4">Threat Score</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/60">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cyber-muted space-y-2">
                    <PhoneCall className="w-8 h-8 text-cyber-subtle opacity-40 mx-auto" />
                    <p className="text-sm font-medium">No call records found matching criteria.</p>
                    <p className="text-xs text-cyber-subtle">Try clearing filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call: CallRecord) => {
                  const badgeProps = getVerdictBadgeProps(call.verdict);
                  const category = SCAM_CATEGORIES[call.primaryCategory as ScamCategory] || SCAM_CATEGORIES.SAFE;

                  return (
                    <tr
                      key={call.callId}
                      className="hover:bg-cyber-cardHover/70 transition-colors duration-150 group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-800 text-cyber-muted group-hover:text-brand-cyan transition-colors">
                            <PhoneCall className="w-4 h-4" />
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

                      <td className="py-3.5 px-4 font-mono text-xs text-cyber-subtle">
                        {formatTimestamp(call.startTime)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/calls/${call.callId}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition-all cursor-pointer transform-gpu hover:-translate-y-0.5 active:scale-95 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => navigate(`/lookup?q=${encodeURIComponent(call.callerNumber)}`)}
                            title="Lookup phone reputation"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-300 bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer transform-gpu hover:-translate-y-0.5 active:scale-95"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedCallToDelete(call.callId)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 transition-all cursor-pointer transform-gpu hover:-translate-y-0.5 active:scale-95"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!selectedCallToDelete}
        onClose={() => setSelectedCallToDelete(null)}
        title="Delete Call Forensic Record"
      >
        <div className="space-y-4">
          <p className="text-sm text-cyber-muted">
            Are you sure you want to permanently delete this call record? All associated speech transcripts and risk event logs will be removed.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setSelectedCallToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
