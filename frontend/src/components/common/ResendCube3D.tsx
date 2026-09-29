import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

export const ResendCube3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let app: Application | null = null;
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    // Dynamically adjust camera zoom cleanly without resetting animation timeline
    const applyZoom = () => {
      if (!app || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const minDim = Math.min(width, height);
      if (minDim <= 0) return;

      const targetZoom = minDim < 460
        ? Math.max(0.60, Math.min(0.68, (minDim / 460) * 0.74))
        : Math.min(0.85, (minDim / 460) * 0.76);

      try {
        app.setZoom(targetZoom);
      } catch (err) {
        // Safe fallback
      }
    };

    try {
      // Direct Spline WebGL 3D Application
      app = new Application(canvas);

      app.load('/cube.splinecode')
        .then(() => {
          if (isMounted && app) {
            try {
              app.setBackgroundColor('transparent');
            } catch {
              // ignore
            }
            if (canvas) {
              canvas.style.backgroundColor = 'transparent';
            }
            applyZoom();
            setIsLoaded(true);
          }
        })
        .catch((err) => {
          console.warn('Spline load error:', err);
        });

      // Resize observer to maintain optimal framing without stuttering
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          if (isMounted) {
            applyZoom();
          }
        });
        resizeObserver.observe(container);
      }

    } catch (err) {
      console.warn('Spline init error:', err);
    }

    return () => {
      isMounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
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
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ 
        touchAction: 'pan-y',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Soft ambient glow backdrop behind 3D cube */}
      <div 
        className="absolute w-[85%] h-[85%] rounded-full bg-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" 
      />

      {/* Pure 100% 3D WebGL Canvas - direct GPU DirectComposition without software alpha masking */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          background: 'transparent', 
          touchAction: 'pan-y',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};

export default ResendCube3D;
