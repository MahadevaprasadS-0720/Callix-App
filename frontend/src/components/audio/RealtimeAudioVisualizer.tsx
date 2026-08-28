import React, { useEffect, useRef } from 'react';

interface RealtimeAudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  className?: string;
}

export const RealtimeAudioVisualizer: React.FC<RealtimeAudioVisualizerProps> = ({
  audioElement,
  isPlaying,
  className = 'h-16 w-full',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          // Connect media element
          const source = ctx.createMediaElementSource(audioElement);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        }
      }
    } catch {
      // Browser security restriction or already connected source
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 32;
      const barWidth = (width / barCount) - 2;

      if (isPlaying && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor((i / barCount) * dataArray.length);
          const value = dataArray[index] || 0;
          const barHeight = Math.max(3, (value / 255) * height);

          // Cyber gradient: Cyan to Indigo
          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, '#06B6D4');
          gradient.addColorStop(1, '#6366F1');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2), height - barHeight, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else if (isPlaying) {
        // Dynamic simulated wave if Web Audio Source wasn't cross-origin permitted
        const time = Date.now() / 150;
        for (let i = 0; i < barCount; i++) {
          const sinVal = Math.sin(time + i * 0.4);
          const barHeight = Math.max(4, Math.abs(sinVal) * height * 0.8);

          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, '#06B6D4');
          gradient.addColorStop(1, '#6366F1');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2), height - barHeight, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else {
        // Idle state: subtle flat baseline bars
        for (let i = 0; i < barCount; i++) {
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2), height - 4, barWidth, 3, 1);
          ctx.fill();
        }
      }
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={50}
      className={className}
    />
  );
};
