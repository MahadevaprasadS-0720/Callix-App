import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

export const ResendCube3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app: Application | null = null;
    let isMounted = true;

    try {
      // Direct Spline WebGL 3D Application - pure 3D canvas from millisecond 0
      app = new Application(canvas);
      app.load('/cube.splinecode').catch((err) => {
        console.warn('Spline load error:', err);
      });
    } catch (err) {
      console.warn('Spline init error:', err);
    }

    return () => {
      isMounted = false;
      if (app) {
        try {
          app.dispose();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center select-none pointer-events-auto ${className}`}
    >
      {/* Soft ambient glow backdrop behind 3D cube */}
      <div 
        className="absolute w-[85%] h-[85%] rounded-full bg-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" 
      />

      {/* Pure 100% 3D WebGL Canvas - direct 3D model with zero photo delay */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default ResendCube3D;


