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
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchCalls}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Refresh Records
          </Button>
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
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs font-semibold text-cyber-muted mr-1">Filter:</span>
            {(['ALL', 'Fraudulent', 'Suspicious', 'Legitimate'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setVerdictFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  verdictFilter === filter
                    ? 'bg-brand-primary text-white shadow-glow-primary'
                    : 'bg-slate-800 text-cyber-muted hover:text-cyber-text hover:bg-slate-700'
                }`}
              >
                {filter === 'ALL' ? 'All Calls' : filter}
              </button>
            ))}
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
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/calls/${call.callId}`)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/lookup?q=${encodeURIComponent(call.callerNumber)}`)}
                            title="Lookup reputation"
                          >
                            <Flag className="w-3.5 h-3.5 text-cyber-muted hover:text-brand-cyan" />
                          </Button>
                          <button
                            onClick={() => setSelectedCallToDelete(call.callId)}
                            className="p-1.5 text-cyber-muted hover:text-red-400 rounded-md hover:bg-slate-800 transition-colors"
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
