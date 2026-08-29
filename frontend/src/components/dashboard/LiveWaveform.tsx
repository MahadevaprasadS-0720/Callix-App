import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

interface LiveWaveformProps {
  isRecording?: boolean;
  isActive?: boolean;
  audioStream?: MediaStream | null;
  volume?: number;
  levels?: number[];
  color?: string;
  className?: string;
  threatLevel?: 'safe' | 'suspicious' | 'fraud';
}

export const LiveWaveform: React.FC<LiveWaveformProps> = ({
  isRecording = false,
  isActive = false,
  audioStream = null,
  volume = 0,
  levels,
  color,
  className,
  threatLevel = 'safe',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  const active = isRecording || isActive;

  // Connect MediaStream to Web Audio API Analyser
  useEffect(() => {
    if (!audioStream) return;

    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(audioStream);
        source.connect(analyser);
        sourceRef.current = source;
      }
    } catch {
      // Browser restriction
    }

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [audioStream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 28;
      const barWidth = width / barCount - 2.5;

      // Color scheme based on threat level
      let colorStart = '#06B6D4'; // Cyan
      let colorEnd = '#6366F1';   // Indigo

      if (threatLevel === 'fraud') {
        colorStart = '#EF4444'; // Red
        colorEnd = '#B91C1C';
      } else if (threatLevel === 'suspicious') {
        colorStart = '#F59E0B'; // Amber
        colorEnd = '#D97706';
      }

      if (active && analyserRef.current) {
        // Real microphone frequency data
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor((i / barCount) * dataArray.length);
          const val = dataArray[index] || 0;
          const barHeight = Math.max(4, (val / 255) * height * 0.95);

          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, colorStart);
          gradient.addColorStop(1, colorEnd);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2.5), height - barHeight, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else if (active) {
        // Fallback dynamic wave reacting to volume prop
        const time = Date.now() / 120;
        const volMultiplier = Math.max(0.2, volume / 50);

        for (let i = 0; i < barCount; i++) {
          const sin = Math.sin(time + i * 0.45);
          const barHeight = Math.max(4, Math.abs(sin) * height * 0.8 * volMultiplier);

          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, colorStart);
          gradient.addColorStop(1, colorEnd);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2.5), height - barHeight, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else {
        // Inactive baseline
        for (let i = 0; i < barCount; i++) {
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2.5), height - 4, barWidth, 3, 1);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [active, threatLevel, volume]);

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <canvas
        ref={canvasRef}
        width={360}
        height={48}
        className="w-full h-full"
      />
    </div>
  );
};
