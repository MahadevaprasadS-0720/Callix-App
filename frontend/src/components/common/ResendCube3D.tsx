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
    let observer: IntersectionObserver | null = null;

    try {
      // Direct Spline WebGL 3D Application
      app = new Application(canvas);
      
      app.load('/cube.splinecode')
        .then(() => {
          if (isMounted) {
            setIsLoaded(true);
          }
        })
        .catch((err) => {
          console.warn('Spline load error:', err);
        });

      // Pause/resume when element scrolls in and out of view to save 100% GPU
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!app) return;
            // When scrolled out of view, hide canvas rendering to eliminate GPU lag
            if (canvas) {
              canvas.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

    } catch (err) {
      console.warn('Spline init error:', err);
    }

    return () => {
      isMounted = false;
      if (observer) {
        observer.disconnect();
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
      style={{ touchAction: 'pan-y' }}
    >
      {/* Soft ambient glow backdrop behind 3D cube */}
      <div 
        className="absolute w-[85%] h-[85%] rounded-full bg-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" 
      />

      {/* Subtle glowing fallback wireframe while 3D scene compiles */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_0_30px_rgba(56,189,248,0.15)] animate-pulse" />
        </div>
      )}

      {/* Pure 100% 3D WebGL Canvas with touch-action pan-y for silky smooth scrolling */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'transparent', touchAction: 'pan-y' }}
      />
    </div>
  );
};

export default ResendCube3D;
