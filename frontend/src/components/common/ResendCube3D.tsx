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
    let lastZoom = -1;

    // Dynamically adjust camera zoom so the 3D cube automatically fits any screen size
    // and never clips its corners when rotating.
    const applyZoom = (force = false) => {
      if (!app || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const minDim = Math.min(width, height);
      if (minDim <= 0) return;

      // On mobile (minDim < 460px): comfortably larger presentation (~0.60-0.68) with safe rotation clearance.
      // On desktop (minDim >= 460px): spacious hero presentation (~0.74-0.78) with zero edge clipping.
      const targetZoom = minDim < 460
        ? Math.max(0.60, Math.min(0.68, (minDim / 460) * 0.74))
        : Math.min(0.85, (minDim / 460) * 0.76);

      if (force || Math.abs(lastZoom - targetZoom) > 0.01) {
        lastZoom = targetZoom;
        try {
          app.setZoom(targetZoom);
        } catch (err) {
          console.warn('Spline setZoom error:', err);
        }
      }
    };

    let intersectionObserver: IntersectionObserver | null = null;

    try {
      // Direct Spline WebGL 3D Application
      app = new Application(canvas);

      const handleSplineReady = () => {
        if (isMounted && app) {
          try {
            app.setBackgroundColor('transparent');
          } catch {
            // ignore
          }
          if (canvas) {
            canvas.style.backgroundColor = 'transparent';
          }
          // Multiple ticks ensure zoom reliably overrides Spline's initial camera timeline
          applyZoom(true);
          requestAnimationFrame(() => applyZoom(true));
          setTimeout(() => applyZoom(true), 150);
          setTimeout(() => applyZoom(true), 400);
          setTimeout(() => applyZoom(true), 800);
          setIsLoaded(true);
        }
      };

      app.load('/cube.splinecode')
        .then(handleSplineReady)
        .catch((err) => {
          console.warn('Spline load error:', err);
        });

      // Pause rendering when element scrolls out of view to eliminate 100% of GPU scroll lag
      if (typeof IntersectionObserver !== 'undefined') {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (canvas) {
                canvas.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
              }
            });
          },
          { threshold: 0.05 }
        );
        intersectionObserver.observe(container);
      }

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
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
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
        WebkitMaskImage: 'radial-gradient(circle at center, black 72%, rgba(0,0,0,0.85) 86%, transparent 100%)',
        maskImage: 'radial-gradient(circle at center, black 72%, rgba(0,0,0,0.85) 86%, transparent 100%)'
      }}
    >
      {/* Soft ambient glow backdrop behind 3D cube */}
      <div 
        className="absolute w-[80%] h-[80%] rounded-full bg-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" 
      />

      {/* Pure 100% 3D WebGL Canvas - direct instant load with radial edge feathering */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ 
          background: 'transparent', 
          touchAction: 'pan-y',
          WebkitMaskImage: 'radial-gradient(circle at center, black 72%, rgba(0,0,0,0.85) 86%, transparent 100%)',
          maskImage: 'radial-gradient(circle at center, black 72%, rgba(0,0,0,0.85) 86%, transparent 100%)'
        }}
      />
    </div>
  );
};

export default ResendCube3D;
