import React, { useRef, useEffect } from 'react';
import { TranscriptSegment } from '../../types/call.types';
import { cn } from '../../utils/cn';
import { formatDuration } from '../../utils/formatters';
import { User, PhoneIncoming, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface LiveTranscriptViewerProps {
  segments: TranscriptSegment[];
  highlightPhrases?: string[];
  autoScroll?: boolean;
  className?: string;
}

export const LiveTranscriptViewer: React.FC<LiveTranscriptViewerProps> = ({
  segments,
  highlightPhrases = [],
  autoScroll = true,
  className,
}) => {
  const scrollBottomRef = useRef<any>(null);

  useEffect(() => {
    if (autoScroll && scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [segments, autoScroll]);

  const renderHighlightedText = (text: string, triggerWords: string[] = []) => {
    const allTriggers = Array.from(new Set([...triggerWords, ...highlightPhrases])).filter(Boolean);
    if (allTriggers.length === 0) return text;

    try {
      const pattern = new RegExp(`(${allTriggers.map((t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      const parts = text.split(pattern);

      return parts.map((part: string, index: number) => {
        const isMatch = allTriggers.some((t: string) => t.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <span
              key={index}
              className="relative inline-block group"
            >
              <mark className="bg-red-500/30 text-red-300 font-semibold px-1.5 py-0.5 rounded border border-red-500/50 shadow-sm cursor-help">
                {part}
              </mark>

              {/* Tooltip explaining the fraud vector */}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center gap-1 z-30 px-2.5 py-1 text-[11px] font-mono text-white bg-slate-900 border border-red-500 rounded-md shadow-xl whitespace-nowrap pointer-events-none">
                <ShieldAlert className="w-3 h-3 text-red-400" />
                <span>Detected Threat Vector: "{part}"</span>
              </span>
            </span>
          );
        }
        return part;
      });
    } catch {
      return text;
    }
  };

  return (
    <div className={cn('space-y-3 overflow-y-auto pr-1 select-text scroll-smooth', className)}>
      {segments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-cyber-muted space-y-2 text-center">
          <div className="p-3 rounded-full bg-slate-900 border border-cyber-border text-brand-cyan animate-pulse">
            <PhoneIncoming className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-cyber-text">Awaiting Live Speech Audio Stream...</p>
          <p className="text-xs text-cyber-subtle font-mono">
            Deepgram nova-2 (`en-IN`) diarization active with sub-second STT
          </p>
        </div>
      ) : (
        segments.map((seg: TranscriptSegment, idx: number) => {
          const isCaller = seg.speaker === 'caller';
          const hasTriggers = (seg.triggerPhrases && seg.triggerPhrases.length > 0) || seg.isFlagged;

          return (
            <div
              key={seg.segmentId || idx}
              className={cn(
                'flex gap-3 p-3.5 rounded-xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2',
                isCaller
                  ? hasTriggers
                    ? 'bg-red-950/25 border-red-500/40 shadow-glow-danger/10'
                    : 'bg-slate-900/80 border-cyber-border'
                  : 'bg-indigo-950/20 border-indigo-500/30 ml-4'
              )}
            >
              {/* Speaker Avatar Badge */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm',
                  isCaller
                    ? hasTriggers
                      ? 'bg-red-900/60 text-red-300'
                      : 'bg-slate-800 text-cyber-muted'
                    : 'bg-indigo-900/60 text-indigo-300'
                )}
              >
                {isCaller ? (
                  hasTriggers ? (
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  ) : (
                    <PhoneIncoming className="w-4 h-4" />
                  )
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Speech Message Body */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyber-text">
                      {isCaller ? 'Incoming Caller' : 'User (Recipient)'}
                    </span>
                    <span className="text-[10px] font-mono text-cyber-subtle">
                      T+{formatDuration(seg.timestampOffset)}
                    </span>
                  </div>

                  {hasTriggers ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/90 border border-red-500/40 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Scam Trigger Flagged
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-cyber-subtle">
                      {Math.round(seg.confidence * 100)}% accuracy
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {renderHighlightedText(seg.text, seg.triggerPhrases)}
                </p>

                {seg.flaggedReason && (
                  <div className="flex items-center gap-1 text-xs text-red-400 font-mono pt-0.5">
                    <Sparkles className="w-3 h-3" /> {seg.flaggedReason}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={scrollBottomRef} />
    </div>
  );
};
