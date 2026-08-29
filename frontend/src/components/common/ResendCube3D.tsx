import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

export const ResendCube3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app: Application | null = null;
    let isMounted = true;

    try {
      app = new Application(canvas);
      app.load('/cube.splinecode')
        .then(() => {
          if (isMounted) {
            setLoaded(true);
          }
        })
        .catch((err) => {
          console.warn('Spline load warning, using fallback:', err);
        });
    } catch (e) {
      console.warn('Spline runtime initialization error:', e);
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
    <div className={`relative flex items-center justify-center select-none pointer-events-auto ${className}`}>
      {/* 100% Official Resend Spline 3D Scene */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'transparent' }}
      />

      {/* Fallback while loading */}
      {!loaded && (
        <img
          src="/cube-fallback.jpg"
          alt="Resend 3D Cube"
          className="absolute inset-0 m-auto w-4/5 h-4/5 object-contain pointer-events-none opacity-80"
        />
      )}
    </div>
  );
};

export default ResendCube3D;
