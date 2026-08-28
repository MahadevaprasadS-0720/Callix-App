import React from 'react';
import { TranscriptSegment } from '../../types/call.types';
import { cn } from '../../utils/cn';
import { formatDuration } from '../../utils/formatters';
import { User, PhoneIncoming, AlertCircle, ShieldAlert } from 'lucide-react';

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  highlightPhrases?: string[];
  onSegmentClick?: (segment: TranscriptSegment) => void;
  className?: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  highlightPhrases = [],
  onSegmentClick,
  className,
}) => {
  const highlightText = (text: string, triggers: string[] = []) => {
    const allTriggers = Array.from(new Set([...triggers, ...highlightPhrases])).filter(Boolean);
    if (allTriggers.length === 0) return text;

    try {
      const pattern = new RegExp(`(${allTriggers.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      const parts = text.split(pattern);

      return parts.map((part: string, index: number) => {
        const isMatch = allTriggers.some(t => t.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-red-500/25 text-red-300 font-semibold px-1 py-0.5 rounded border border-red-500/40 shadow-sm"
            >
              {part}
            </mark>
          );
        }
        return part;
      });
    } catch {
      return text;
    }
  };

  return (
    <div className={cn('space-y-3 overflow-y-auto pr-1', className)}>
      {segments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-cyber-muted space-y-2 text-center">
          <PhoneIncoming className="w-8 h-8 text-cyber-subtle opacity-40" />
          <p className="text-sm">Awaiting speech audio stream...</p>
          <p className="text-xs text-cyber-subtle">Deepgram nova-2 transcription will appear in real time</p>
        </div>
      ) : (
        segments.map((seg: TranscriptSegment, idx: number) => {
          const isCaller = seg.speaker === 'caller';
          const isFlagged = seg.isFlagged || (seg.triggerPhrases && seg.triggerPhrases.length > 0);

          return (
            <div
              key={seg.segmentId || idx}
              onClick={() => onSegmentClick && onSegmentClick(seg)}
              className={cn(
                'flex gap-3 p-3.5 rounded-xl border transition-all duration-150',
                isCaller
                  ? isFlagged
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-slate-900/60 border-cyber-border'
                  : 'bg-indigo-950/20 border-indigo-500/30 ml-4',
                onSegmentClick && 'cursor-pointer hover:border-brand-primary'
              )}
            >
              {/* Speaker Avatar Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  isCaller
                    ? isFlagged
                      ? 'bg-red-900/50 text-red-400'
                      : 'bg-slate-800 text-cyber-muted'
                    : 'bg-indigo-900/50 text-indigo-300'
                )}
              >
                {isCaller ? (
                  isFlagged ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <PhoneIncoming className="w-4 h-4" />
                  )
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyber-text">
                      {isCaller ? 'Caller (Incoming)' : 'You (Recipient)'}
                    </span>
                    <span className="text-[10px] font-mono text-cyber-subtle">
                      T+{formatDuration(seg.timestampOffset)}
                    </span>
                  </div>

                  {isFlagged && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Flagged Trigger
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {highlightText(seg.text, seg.triggerPhrases)}
                </p>

                {seg.flaggedReason && (
                  <p className="text-xs text-red-400/90 font-mono pt-1">
                    ↳ Analysis: {seg.flaggedReason}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
