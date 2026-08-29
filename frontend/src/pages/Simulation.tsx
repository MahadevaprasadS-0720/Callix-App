import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { RiskScoreGauge } from '../components/dashboard/RiskScoreGauge';
import { LiveWaveform } from '../components/dashboard/LiveWaveform';
import { RiskExplanationCard } from '../components/calls/RiskExplanationCard';
import { XAIHighlights } from '../components/calls/XAIHighlights';
import { useLiveMicrophone, LiveTranscriptChunk } from '../hooks/useLiveMicrophone';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/apiService';
import { firestoreService } from '../services/firestoreService';
import { formatPhoneNumber, formatDuration } from '../utils/formatters';
import { SCAM_CATEGORIES } from '../utils/constants';
import { ScamCategory } from '../types/fraud.types';
import { CallRecord } from '../types/call.types';
import { 
  Mic, 
  MicOff, 
  PhoneCall, 
  PhoneOff, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Sparkles, 
  Send, 
  Volume2, 
  CheckCircle, 
  Share2, 
  HelpCircle, 
  Flame, 
  Clock, 
  MessageSquare,
  Activity
} from 'lucide-react';
import { cn } from '../utils/cn';

export const Simulation: React.FC = () => {
  const { showHighRiskAlert, showToast } = useToast();

  // Mode: Live Microphone vs Benchmark Presets
  const [activeTab, setActiveTab] = useState<'mic' | 'presets'>('mic');

  // Live Microphone Hook
  const {
    isRecording,
    permissionStatus,
    interimTranscript,
    finalTranscriptList,
    audioStream,
    audioVolume,
    startRecording,
    stopRecording,
    clearTranscript,
    injectUtterance,
    error: micError,
  } = useLiveMicrophone();

  // Call State
  const [callerNumber, setCallerNumber] = useState('+91 98765 43210');
  const [callerName, setCallerName] = useState('Unknown Incoming Caller');
  const [callDuration, setCallDuration] = useState(0);
  const durationTimerRef = useRef<any>(null);

  // Dynamic Real-Time Fraud Assessment State
  const [currentScore, setCurrentScore] = useState(0);
  const [verdict, setVerdict] = useState<'Legitimate' | 'Suspicious' | 'Fraudulent'>('Legitimate');
  const [primaryCategory, setPrimaryCategory] = useState<ScamCategory>('SAFE');
  const [triggerPhrases, setTriggerPhrases] = useState<string[]>([]);
  const [modelExplanation, setModelExplanation] = useState<string>('Listening to real-time speech stream. No threat signals detected yet.');
  const [confidence, setConfidence] = useState(0.95);
  const [guardianNotified, setGuardianNotified] = useState(false);

  // Manual Utterance Input State
  const [customUtterance, setCustomUtterance] = useState('');
  const [injectSpeaker, setInjectSpeaker] = useState<'caller' | 'user'>('caller');

  // Post-Call Summary Modal
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);

  // Auto-scroll transcript window
  const transcriptScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [finalTranscriptList, interimTranscript]);

  // Duration Timer
  useEffect(() => {
    if (isRecording) {
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [isRecording]);

  // Evaluate accumulated spoken words whenever a final sentence is recorded
  useEffect(() => {
    if (finalTranscriptList.length === 0) return;

    const fullText = finalTranscriptList.map((c) => c.text).join(' ');
    const latestSentence = finalTranscriptList[finalTranscriptList.length - 1].text;

    const runLiveScoring = async () => {
      try {
        const response = await apiService.analyzeLiveTranscript({
          callId: `live_session_${Date.now()}`,
          userId: 'user_live_01',
          callerNumber,
          textSegment: latestSentence,
          fullTranscriptHistory: fullText,
        });

        const dec = response.decision;
        setCurrentScore(dec.finalScore);
        setVerdict(dec.verdict);
        setPrimaryCategory(dec.category);
        setTriggerPhrases(dec.triggerPhrases || []);
        setModelExplanation(dec.explanation);

        if (dec.finalScore >= 75) {
          setGuardianNotified(true);
          showHighRiskAlert(
            `HIGH-RISK SCAM DETECTED: ${dec.category}`,
            `Trigger: "${dec.triggerPhrases?.[0] || latestSentence}" • Score: ${dec.finalScore}/100`
          );
        }
      } catch (err) {
        console.error('Live scoring error:', err);
      }
    };

    runLiveScoring();
  }, [finalTranscriptList, callerNumber, showHighRiskAlert]);

  const handleStartCall = async () => {
    clearTranscript();
    setCallDuration(0);
    setCurrentScore(0);
    setVerdict('Legitimate');
    setPrimaryCategory('SAFE');
    setTriggerPhrases([]);
    setModelExplanation('Microphone active. Speak naturally or simulate a phone call.');
    setGuardianNotified(false);
    setSavedToHistory(false);

    const started = await startRecording();
    if (started) {
      showToast({
        type: 'info',
        title: 'Live Voice Monitoring Armed',
        message: 'Microphone stream is active. Listening for fraud and extortion keywords.',
      });
    }
  };

  const handleEndCall = () => {
    stopRecording();
    setIsSummaryModalOpen(true);
  };

  const handleSaveToHistory = async () => {
    const now = Date.now();
    const callRecord: CallRecord = {
      callId: `call_${now}`,
      uid: 'user_live_01',
      callerNumber,
      callerName,
      startTime: now - callDuration * 1000,
      endTime: now,
      durationSeconds: callDuration,
      status: currentScore >= 75 ? ('FLAGGED' as const) : ('COMPLETED' as const),
      finalScore: currentScore,
      verdict,
      primaryCategory,
      summaryExplanation: modelExplanation,
      guardianNotified,
      riskEvents: triggerPhrases.map((phrase, idx) => ({
        eventId: `evt_${now}_${idx}`,
        callId: `call_${now}`,
        score: currentScore,
        category: primaryCategory,
        triggerPhrase: phrase,
        modelExplanation,
        timestampOffset: idx * 4,
        createdAt: now,
      })),
      confidence: 0.96,
      transcript: finalTranscriptList.map((t, idx) => ({
        segmentId: t.id,
        speaker: t.speaker,
        text: t.text,
        timestampOffset: idx * 4,
        confidence: 0.95,
      })),
      createdAt: now,
    };

    await firestoreService.saveCallRecord(callRecord);
    setSavedToHistory(true);
    showToast({
      type: 'success',
      title: 'Session Saved',
      message: 'Call transcript and risk assessment added to Call History records.',
    });
  };

  const handleInjectCustomUtterance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUtterance.trim()) return;

    injectUtterance(customUtterance, injectSpeaker);
    setCustomUtterance('');
  };

  const quickScamPrompts = [
    { label: 'Bank OTP Extortion', text: 'Good afternoon, this is State Bank security. Share your 6-digit OTP code to avoid account block.' },
    { label: 'Customs Digital Arrest', text: 'This is Inspector Rathore. A parcel under your Aadhaar has narcotics. You are under Digital Arrest.' },
    { label: 'UPI Cashback Trap', text: 'You have won Rs 5,000 cashback! Open Google Pay and enter your UPI PIN to claim reward.' },
    { label: 'Safe Food Delivery', text: 'Hello sir, I have arrived at your apartment gate with your dinner delivery.' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border border-cyber-border">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm" pulse>
              REAL-TIME VOICE FRAUD INTERCEPTOR
            </Badge>
            <span className="text-xs font-mono text-cyber-muted">
              Live Speech-to-Text & Sub-Second Claude XAI Scoring
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Live Call Scam & Extortion Detector
          </h2>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Speak into your microphone to simulate an active phone conversation. Audio Guardian transcribes your actual voice in real time and flags financial coercion or fake authority threats instantly.
          </p>
        </div>

        {/* Start / Stop Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {!isRecording ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartCall}
              leftIcon={<Mic className="w-5 h-5 text-brand-cyan animate-pulse" />}
              className="shadow-glow-primary text-sm font-bold"
            >
              Start Live Voice Monitoring
            </Button>
          ) : (
            <Button
              variant="danger"
              size="lg"
              onClick={handleEndCall}
              leftIcon={<PhoneOff className="w-5 h-5" />}
              className="shadow-glow-danger text-sm font-bold animate-pulse"
            >
              Stop & Finalize Call ({formatDuration(callDuration)})
            </Button>
          )}
        </div>
      </div>

      {micError && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Main Grid: Live Telemetry & Diarized Transcript Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Live Audio Stream, Mic HUD & Spoken Transcript */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Call Status & Waveform Card */}
          <Card className="p-5 space-y-4 bg-slate-900/90 border-cyber-border">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                  )}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase font-bold text-white">
                      {isRecording ? 'LIVE TELEPHONY STREAM ACTIVE' : 'CALL MONITOR STANDBY'}
                    </span>
                    {isRecording && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold">
                        REC LIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-cyber-muted">
                    Caller: {formatPhoneNumber(callerNumber)} • Duration: {formatDuration(callDuration)}
                  </span>
                </div>
              </div>

              {/* Volume dB Meter */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyber-muted" />
                <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-primary transition-all duration-100 rounded-full"
                    style={{ width: `${audioVolume}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-cyber-subtle w-7 text-right">
                  {audioVolume}%
                </span>
              </div>
            </div>

            {/* Dynamic Waveform Reacting to Microphone Stream */}
            <div className="py-2 px-3 bg-slate-950/80 rounded-xl border border-cyber-border">
              <LiveWaveform
                isRecording={isRecording}
                audioStream={audioStream}
                volume={audioVolume}
                threatLevel={currentScore >= 75 ? 'fraud' : currentScore >= 40 ? 'suspicious' : 'safe'}
                className="h-12 w-full"
              />
            </div>
          </Card>

          {/* Diarized Spoken Conversation Stream */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-brand-cyan" />
                <div>
                  <h3 className="font-bold text-base text-cyber-text">
                    Live Speech Transcript Stream
                  </h3>
                  <p className="text-xs text-cyber-muted">
                    Transcribing your voice on the fly with automatic trigger word highlighting
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyber-subtle">
                {finalTranscriptList.length} Utterances
              </span>
            </div>

            {/* Transcript Box */}
            <div
              ref={transcriptScrollRef}
              className="space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto pr-2"
            >
              {finalTranscriptList.length === 0 && !interimTranscript ? (
                <div className="py-12 text-center text-cyber-muted space-y-2">
                  <Mic className="w-8 h-8 text-cyber-subtle opacity-30 mx-auto" />
                  <p className="text-sm font-medium">No spoken speech recorded yet.</p>
                  <p className="text-xs text-cyber-subtle">
                    Click "Start Live Voice Monitoring" and speak into your microphone.
                  </p>
                </div>
              ) : (
                finalTranscriptList.map((chunk) => {
                  const isCaller = chunk.speaker === 'caller';
                  const isDanger = triggerPhrases.some((tp) =>
                    chunk.text.toLowerCase().includes(tp.toLowerCase())
                  );

                  return (
                    <div
                      key={chunk.id}
                      className={cn(
                        'p-3.5 rounded-xl border transition-all duration-150',
                        isDanger
                          ? 'bg-red-950/30 border-red-500/40 text-red-200'
                          : isCaller
                          ? 'bg-slate-900/80 border-cyber-border text-slate-200'
                          : 'bg-indigo-950/30 border-brand-primary/40 text-indigo-200'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono uppercase text-white">
                            {isCaller ? 'Caller (Remote Voice)' : 'You (User)'}
                          </span>
                          <span className="text-[10px] font-mono text-cyber-subtle">
                            {new Date(chunk.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        {isDanger && (
                          <Badge variant="fraud" size="sm">
                            Threat Trigger Detected
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed font-normal">{chunk.text}</p>
                    </div>
                  );
                })
              )}

              {/* Interim Real-Time Live Speech Typing Indicator */}
              {interimTranscript && (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-brand-cyan/40 text-brand-cyan text-sm italic animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                  <span>"{interimTranscript}..."</span>
                </div>
              )}
            </div>

            {/* Quick Test Prompt Buttons */}
            <div className="space-y-2 pt-2 border-t border-cyber-border/60">
              <span className="text-[11px] font-mono uppercase text-cyber-muted block">
                Quick Scam Phrase Injection (Click to Test AI Reaction):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickScamPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => injectUtterance(p.text, 'caller')}
                    className="p-2 rounded-lg bg-slate-950/80 border border-cyber-border hover:border-brand-primary hover:bg-slate-900 text-left text-xs transition-colors group"
                  >
                    <span className="font-bold text-white group-hover:text-brand-cyan block">
                      ⚡ {p.label}
                    </span>
                    <span className="text-[11px] text-cyber-subtle truncate block">
                      "{p.text}"
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Utterance Input */}
            <form onSubmit={handleInjectCustomUtterance} className="flex gap-2 pt-1">
              <select
                value={injectSpeaker}
                onChange={(e: any) => setInjectSpeaker(e.target.value as 'caller' | 'user')}
                className="bg-slate-900 border border-cyber-border text-xs text-cyber-text rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="caller">Caller</option>
                <option value="user">User</option>
              </select>

              <Input
                value={customUtterance}
                onChange={(e: any) => setCustomUtterance(e.target.value)}
                placeholder="Or type custom speech phrase to test..."
                className="flex-1 text-xs"
              />

              <Button type="submit" variant="secondary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Inject
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 5 Columns: Dynamic Risk Score Gauge, XAI Breakdown & Trigger Log */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dynamic Real-Time Risk Score Card */}
          <Card className="p-6 text-center space-y-5 bg-gradient-to-b from-slate-900 to-cyber-card border-cyber-border">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyber-muted flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-cyan" /> Real-Time Threat Score
              </span>
              <Badge
                variant={currentScore >= 75 ? 'fraud' : currentScore >= 40 ? 'suspicious' : 'safe'}
                size="sm"
                pulse={currentScore >= 75}
              >
                {verdict} Level
              </Badge>
            </div>

            <div className="py-2 flex justify-center">
              <RiskScoreGauge score={currentScore} size="lg" />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyber-border text-left space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyber-muted">Primary Threat Vector:</span>
                <span
                  className="font-bold uppercase"
                  style={{ color: SCAM_CATEGORIES[primaryCategory]?.color || '#10B981' }}
                >
                  {SCAM_CATEGORIES[primaryCategory]?.label || 'Safe Conversation'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1">
                {modelExplanation}
              </p>
            </div>

            {guardianNotified && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
                <span>Emergency Guardian Alert Dispatched to Linked Contacts!</span>
              </div>
            )}
          </Card>

          {/* Trigger Words Found in Conversation */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-cyber-border pb-2.5">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-threat-fraud" /> Flagged Trigger Phrases
              </h4>
              <span className="text-[11px] font-mono text-cyber-subtle">
                {triggerPhrases.length} Detected
              </span>
            </div>

            {triggerPhrases.length === 0 ? (
              <p className="text-xs text-cyber-muted">No fraudulent or coercive phrases detected.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {triggerPhrases.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-semibold"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* XAI Context Card */}
          <Card className="p-5">
            <XAIHighlights score={currentScore} category={primaryCategory} />
          </Card>

        </div>

      </div>

      {/* Post-Call Final Forensic Summary Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="Post-Call Forensic Summary Report"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-900 border border-cyber-border flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyber-muted">Call Session Final Score</span>
              <div className="text-2xl font-black text-white font-mono">
                {currentScore} / 100 ({verdict})
              </div>
              <span className="text-xs text-cyber-subtle">
                Duration: {formatDuration(callDuration)} • {finalTranscriptList.length} Utterances
              </span>
            </div>

            <Badge
              variant={currentScore >= 75 ? 'fraud' : currentScore >= 40 ? 'suspicious' : 'safe'}
              size="lg"
            >
              {verdict}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase text-cyber-muted font-bold">AI Threat Analysis:</span>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-cyber-border leading-relaxed">
              {modelExplanation}
            </p>
          </div>

          {triggerPhrases.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-cyber-muted font-bold">Flagged Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {triggerPhrases.map((tp, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-xs font-mono border border-red-500/30">
                    "{tp}"
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSummaryModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveToHistory}
              disabled={savedToHistory}
              leftIcon={<CheckCircle className="w-4 h-4" />}
            >
              {savedToHistory ? 'Saved to Records!' : 'Save Session to Call Records'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
