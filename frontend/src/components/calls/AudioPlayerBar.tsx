import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

interface AudioPlayerBarProps {
  duration?: number;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  duration = 60,
  onTimeUpdate,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev: number) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1 * speed;
          if (onTimeUpdate) onTimeUpdate(next);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, speed, onTimeUpdate]);

  const togglePlay = () => {
    setIsPlaying((p: boolean) => !p);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (onTimeUpdate) onTimeUpdate(val);
  };

  const cycleSpeed = () => {
    if (speed === 1) setSpeed(1.5);
    else if (speed === 1.5) setSpeed(2);
    else setSpeed(1);
  };

  return (
    <Card className={`p-4 bg-slate-950/80 border border-cyber-border space-y-3 ${className || ''}`}>
      {/* Waveform & Scrubber */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-cyber-muted">
          <span>{formatDuration(currentTime)}</span>
          <span className="text-brand-cyan">Recorded Call Diarization Audio</span>
          <span>{formatDuration(duration)}</span>
        </div>

        <input
          type="range"
          min="0"
          max={duration || 60}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-brand-primary hover:bg-indigo-500 text-white flex items-center justify-center shadow-glow-primary transition-all duration-150"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            className="p-2 text-cyber-muted hover:text-cyber-text rounded-lg hover:bg-cyber-cardHover"
            title="Reset Playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={cycleSpeed}
            className="px-2 py-1 text-xs font-mono font-bold bg-slate-800 text-brand-cyan hover:bg-slate-700 rounded-md border border-cyber-border"
          >
            {speed}x
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyber-subtle">
          <Volume2 className="w-4 h-4 text-cyber-muted" />
          <span>PCM 16kHz Diarized</span>
        </div>
      </div>
    </Card>
  );
};
