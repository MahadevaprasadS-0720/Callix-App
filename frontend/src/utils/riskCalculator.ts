import { CallVerdict } from '../types/call.types';

export function getVerdictFromScore(score: number): CallVerdict {
  if (score >= 75) return 'Fraudulent';
  if (score >= 40) return 'Suspicious';
  return 'Legitimate';
}

export function getThreatColor(score: number): {
  text: string;
  bg: string;
  border: string;
  glow: string;
  badgeClass: string;
} {
  if (score >= 75) {
    return {
      text: 'text-threat-fraud',
      bg: 'bg-threat-fraudBg',
      border: 'border-threat-fraud/50',
      glow: 'shadow-glow-danger',
      badgeClass: 'bg-red-950/80 text-red-400 border border-red-500/40',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-threat-suspicious',
      bg: 'bg-threat-suspiciousBg',
      border: 'border-threat-suspicious/50',
      glow: 'shadow-glow-primary',
      badgeClass: 'bg-amber-950/80 text-amber-400 border border-amber-500/40',
    };
  }
  return {
    text: 'text-threat-safe',
    bg: 'bg-threat-safeBg',
    border: 'border-threat-safe/50',
    glow: 'shadow-glow-safe',
    badgeClass: 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40',
  };
}

export function getVerdictBadgeProps(verdict: CallVerdict): {
  label: string;
  variant: 'safe' | 'suspicious' | 'fraud';
} {
  switch (verdict) {
    case 'Fraudulent':
      return { label: 'High Risk Scam', variant: 'fraud' };
    case 'Suspicious':
      return { label: 'Suspicious Activity', variant: 'suspicious' };
    case 'Legitimate':
    default:
      return { label: 'Safe & Verified', variant: 'safe' };
  }
}
