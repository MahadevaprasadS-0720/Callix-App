import { resolveIndianCarrier, ResolvedTelecom } from '../utils/telecomResolver';

export interface CarrierResult {
  phone: string;
  formatted: string;
  valid: boolean;
  operator: ResolvedTelecom['operator'];
  circle: string;
  lineType: string;
  riskScore: number;
  threatLevel: ResolvedTelecom['threatLevel'];
  brandColor: string;
  badgeBg: string;
  logoBadge: string;
  tags: string[];
}

export async function detectTelecomCarrier(rawPhone: string): Promise<CarrierResult> {
  const digitsOnly = rawPhone.replace(/\D/g, '');
  const clean10 = digitsOnly.slice(-10);
  const formatted = clean10.length === 10 ? `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}` : rawPhone;

  // Perform deterministic resolution
  const resolved = resolveIndianCarrier(rawPhone);

  return {
    phone: `+91${clean10}`,
    formatted,
    valid: clean10.length === 10 || rawPhone.includes('1800') || rawPhone.length <= 4,
    operator: resolved.operator,
    circle: resolved.circle,
    lineType: resolved.lineType,
    riskScore: resolved.riskScore,
    threatLevel: resolved.threatLevel,
    brandColor: resolved.brandColor,
    badgeBg: resolved.badgeBg,
    logoBadge: resolved.logoBadge,
    tags: resolved.tags,
  };
}

export const carrierLookupService = {
  detectTelecomCarrier,
  lookupLiveCarrier: detectTelecomCarrier,
};
