import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { RiskScoreGauge } from '../components/dashboard/RiskScoreGauge';
import { LiveTranscriptViewer } from '../components/dashboard/LiveTranscriptViewer';
import { RiskExplanationCard } from '../components/calls/RiskExplanationCard';
import { XAIHighlights } from '../components/calls/XAIHighlights';
import { AudioPlayerBar } from '../components/calls/AudioPlayerBar';
import { Loader } from '../components/common/Loader';
import { firestoreService } from '../services/firestoreService';
import { CallRecord } from '../types/call.types';
import { ScamCategory } from '../types/fraud.types';
import { SCAM_CATEGORIES } from '../utils/constants';
import { formatPhoneNumber, formatTimestamp, formatDuration } from '../utils/formatters';
import { getVerdictBadgeProps } from '../utils/riskCalculator';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Share2, 
  FileText,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  HelpCircle,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const CallDetails: React.FC = () => {
  const params: any = useParams();
  const callId = params?.callId as string | undefined;
  const navigate = useNavigate();
  const [call, setCall] = useState<CallRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // User Feedback / RLHF State
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<'UP' | 'DOWN' | null>(null);
  const [isFalsePositiveModalOpen, setIsFalsePositiveModalOpen] = useState<boolean>(false);
  const [correctionCategory, setCorrectionCategory] = useState<ScamCategory>('SAFE');
  const [correctionNote, setCorrectionNote] = useState('');

  useEffect(() => {
    const loadCall = async () => {
      if (!callId) return;
      setLoading(true);
      const data = await firestoreService.getCallById(callId);
      setCall(data);
      
      // Check if feedback already submitted in localStorage
      const savedFeedback = localStorage.getItem(`feedback_${callId}`);
      if (savedFeedback) {
        setFeedbackSubmitted(true);
      }
      
      setLoading(false);
    };
    loadCall();
  }, [callId]);

  const handleThumbsUp = () => {
    if (!callId) return;
    setUserRating('UP');
    setFeedbackSubmitted(true);
    localStorage.setItem(`feedback_${callId}`, JSON.stringify({ rating: 'UP', timestamp: Date.now() }));
  };

  const handleThumbsDown = () => {
    setUserRating('DOWN');
    setIsFalsePositiveModalOpen(true);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callId) return;
    setFeedbackSubmitted(true);
    setIsFalsePositiveModalOpen(false);
    localStorage.setItem(
      `feedback_${callId}`, 
      JSON.stringify({ 
        rating: 'DOWN', 
        correctionCategory, 
        note: correctionNote, 
        timestamp: Date.now() 
      })
    );
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" text="Loading Forensic Call Analysis..." />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-threat-suspicious mx-auto" />
        <h3 className="text-xl font-bold text-white">Call Record Not Found</h3>
        <p className="text-sm text-cyber-muted">The requested call ID does not exist or has been purged.</p>
        <Button variant="primary" onClick={() => navigate('/calls')}>
          Back to Call Records
        </Button>
      </div>
    );
  }

  const badgeProps = getVerdictBadgeProps(call.verdict);
  const allTriggers = (call.riskEvents || []).map((e: any) => e.triggerPhrase);

  return (
    <div className="space-y-6">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/calls')}
        >
          Back to Call Records
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={() => alert(`Forensic report link copied for Call #${call.callId}`)}
          >
            Export Incident Dossier
          </Button>
        </div>
      </div>

      {/* Call Summary Top Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border border-cyber-border space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={badgeProps.variant} size="md">
                {call.verdict} Threat Level
              </Badge>
              <span className="text-xs text-cyber-muted font-mono">ID: {call.callId}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {call.callerName || formatPhoneNumber(call.callerNumber)}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-cyber-muted">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-cyan" /> {formatPhoneNumber(call.callerNumber)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyber-subtle" /> {call.callerLocation || 'India Telecom Circle'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyber-subtle" /> {formatTimestamp(call.startTime)}
              </span>
              <span>Duration: {formatDuration(call.durationSeconds)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <RiskScoreGauge score={call.finalScore} size="sm" />
          </div>
        </div>

        {/* Audio Recording & Waveform Playback */}
        <AudioPlayerBar duration={call.durationSeconds || 60} />
      </Card>

      {/* Forensic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Diarized Audio Transcript & Real-Time Risk Triggers Log */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-cyan" />
                <h3 className="font-bold text-base text-cyber-text">Diarized Audio Transcript</h3>
              </div>
              <span className="text-xs text-cyber-subtle font-mono">
                Deepgram nova-2 en-IN (100% Diarized)
              </span>
            </div>

            <LiveTranscriptViewer
              segments={call.transcript || []}
              highlightPhrases={allTriggers}
              autoScroll={false}
              className="max-h-[460px]"
            />
          </Card>

          {/* Risk Events Timeline */}
          {call.riskEvents && call.riskEvents.length > 0 && (
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyber-border pb-3">
                <ShieldAlert className="w-5 h-5 text-threat-fraud" />
                <h3 className="font-bold text-base text-cyber-text">Forensic Threat Event Log</h3>
              </div>

              <div className="space-y-3">
                {call.riskEvents.map((evt: any) => (
                  <div
                    key={evt.eventId}
                    className="p-3 rounded-lg bg-slate-900/80 border border-cyber-border flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-400">
                          T+{formatDuration(evt.timestampOffset)}
                        </span>
                        <span className="text-xs font-bold text-white uppercase font-mono">
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-xs text-red-300 font-mono">"{evt.triggerPhrase}"</p>
                      <p className="text-xs text-cyber-muted">{evt.modelExplanation}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-red-950/80 text-red-400 border border-red-500/40 shrink-0">
                      {evt.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* User Feedback & RLHF / False Positive Correction Section */}
          <Card className="p-5 space-y-3 bg-gradient-to-r from-slate-900 to-indigo-950/20 border-cyber-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <h4 className="text-sm font-bold text-cyber-text">
                  AI Model Feedback & Accuracy Verification
                </h4>
              </div>
              <span className="text-[11px] font-mono text-cyber-subtle">
                Continuous RLHF Learning
              </span>
            </div>

            <p className="text-xs text-cyber-muted">
              Was the AI fraud classification for this call accurate? Your feedback directly tunes the decision engine weights and prevents future false alerts.
            </p>

            {feedbackSubmitted ? (
              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Feedback recorded. Thank you for helping refine Audio Guardian's AI detection models.
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleThumbsUp}
                  leftIcon={<ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Accurate ({call.verdict})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleThumbsDown}
                  leftIcon={<ThumbsDown className="w-3.5 h-3.5 text-amber-400" />}
                >
                  Report False Positive / Inaccurate
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right 5 Columns: Explainable AI & Vector Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <RiskExplanationCard
            score={call.finalScore}
            category={call.primaryCategory}
            explanation={call.summaryExplanation}
            triggerPhrases={allTriggers}
            guardianNotified={call.guardianNotified}
            confidence={call.confidence || 0.96}
          />

          <Card className="p-4">
            <XAIHighlights score={call.finalScore} category={call.primaryCategory} />
          </Card>
        </div>

      </div>

      {/* False Positive Correction Modal */}
      <Modal
        isOpen={isFalsePositiveModalOpen}
        onClose={() => setIsFalsePositiveModalOpen(false)}
        title="Report Inaccurate Classification / False Positive"
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
          <p className="text-xs text-cyber-muted">
            Help our AI architects understand what went wrong with this evaluation.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">What was the actual nature of this call?</label>
            <select
              value={correctionCategory}
              onChange={(e: any) => setCorrectionCategory(e.target.value as ScamCategory)}
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-brand-primary"
            >
              {Object.entries(SCAM_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Additional Clarification / Notes</label>
            <textarea
              rows={3}
              value={correctionNote}
              onChange={(e: any) => setCorrectionNote(e.target.value)}
              placeholder="e.g. This was my bank calling for a scheduled appointment, not a scammer..."
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg p-3 text-sm text-cyber-text placeholder-cyber-subtle focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsFalsePositiveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Correction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
