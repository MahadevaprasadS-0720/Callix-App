import React from 'react';
import { cn } from '../../utils/cn';
import { getThreatColor, getVerdictBadgeProps, getVerdictFromScore } from '../../utils/riskCalculator';

interface RiskScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showVerdict?: boolean;
  className?: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  size = 'md',
  showVerdict = true,
  className,
}) => {
  const verdict = getVerdictFromScore(score);
  const colors = getThreatColor(score);
  const badge = getVerdictBadgeProps(verdict);

  // SVG Gauge calculations (Semi-circle 180 degrees)
  const radius = 80;
  const strokeWidth = 14;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const circumference = Math.PI * radius; // Half circumference
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const sizeStyles: Record<string, { width: number; height: number; fontSize: string; labelSize: string }> = {
    sm: { width: 140, height: 85, fontSize: 'text-2xl', labelSize: 'text-[10px]' },
    md: { width: 220, height: 130, fontSize: 'text-4xl', labelSize: 'text-xs' },
    lg: { width: 280, height: 165, fontSize: 'text-5xl', labelSize: 'text-sm' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={cn('flex flex-col items-center justify-center select-none', className)}>
      <div className="relative flex items-center justify-center">
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 200 110"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Dynamic Value Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className={cn('font-black font-mono tracking-tight leading-none', currentSize.fontSize, colors.text)}>
            {score}
          </span>
          <span className={cn('font-mono text-cyber-muted uppercase tracking-widest font-semibold', currentSize.labelSize)}>
            / 100 Risk
          </span>
        </div>
      </div>

      {showVerdict && (
        <div className="mt-2">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase border',
              colors.badgeClass
            )}
          >
            {badge.label}
          </span>
        </div>
      )}
    </div>
  );
};
