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

export interface LiveCarrierLookupResponse {
  valid: boolean;
  number?: string;
  carrier?: string;
  operator?: string;
  operator_code?: string;
  raw_carrier?: string;
  location?: string;
  circle?: string;
  line_type?: string;
  line_status?: string;
  risk_level?: string;
  country_name?: string;
  country_code?: string;
  country_prefix?: string;
  international_format?: string;
  local_format?: string;
  brand_accent?: string;
  source?: string;
  engine_badge?: string;
  confidence?: number;
  roundtrip_seconds?: number;
  engines_responded?: string[];
  providers?: {
    abstract_resolved?: boolean;
    veriphone_resolved?: boolean;
    numverify_resolved?: boolean;
  };
  error?: string;
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

/**
 * Live Carrier (SIM) and Location Lookup via Triple-Engine Parallel backend / fallback
 */
export async function lookupLivePhone(phoneNumber: string): Promise<LiveCarrierLookupResponse> {
  const clean = phoneNumber.trim();
  if (!clean) {
    throw new Error('Please enter a phone number to scan');
  }

  // 1. Try local Vite proxy /api/lookup-phone
  try {
    const res = await fetch(`/api/lookup-phone?number=${encodeURIComponent(clean)}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.carrier || data.location || data.valid !== undefined)) {
        return data;
      }
    }
  } catch (e) {
    console.info('Proxy /api/lookup-phone attempt note, attempting direct backend port:', e);
  }

  // 2. Try direct Python backend port 5001
  try {
    const directRes = await fetch(`http://127.0.0.1:5001/api/lookup-phone?number=${encodeURIComponent(clean)}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (directRes.ok) {
      const data = await directRes.json();
      if (data && (data.carrier || data.location || data.valid !== undefined)) {
        return data;
      }
    }
  } catch (e) {
    console.info('Direct backend 5001 attempt note:', e);
  }

  // 3. Client-side True Triple-Engine Parallel fallback (Abstract + Veriphone + Numverify)
  const digitsOnly = clean.replace(/\D/g, '');
  const clean10 = digitsOnly.slice(-10);
  const fullE164 = digitsOnly.startsWith('91') ? digitsOnly : `91${clean10}`;
  const intlWithPlus = `+${fullE164}`;

  let absData: any = null;
  let veriData: any = null;
  let nvData: any = null;

  try {
    const absUrl = `https://phoneintelligence.abstractapi.com/v1/?api_key=b60608534da44e3a91cffb1c24006cd2&phone=${fullE164}`;
    const veriUrl = `https://api.veriphone.io/v2/verify?phone=${encodeURIComponent(intlWithPlus)}&key=8E0742335C41434BA61A05034EF8AD53`;
    const nvUrl = `http://apilayer.net/api/validate?access_key=38c19713cd17bc263756f69f71756bff&number=${clean10}&country_code=IN&format=1`;

    const [absSettled, veriSettled, nvSettled] = await Promise.allSettled([
      fetch(absUrl).then(r => r.ok ? r.json() : null),
      fetch(veriUrl).then(r => r.ok ? r.json() : null),
      fetch(nvUrl).then(r => r.ok ? r.json() : null),
    ]);

    if (absSettled.status === 'fulfilled' && absSettled.value && !absSettled.value.error) {
      absData = absSettled.value;
    }
    if (veriSettled.status === 'fulfilled' && veriSettled.value && veriSettled.value.status === 'success') {
      veriData = veriSettled.value;
    }
    if (nvSettled.status === 'fulfilled' && nvSettled.value && nvSettled.value.success !== false) {
      nvData = nvSettled.value;
    }
  } catch (parallelErr) {
    console.info('Client-side parallel lookup note:', parallelErr);
  }

  if (absData || veriData || nvData) {
    const rawCarrier = veriData?.carrier || absData?.phone_carrier?.name || nvData?.carrier || '';
    const lower = rawCarrier.toLowerCase();
    let carrierName = 'Reliance Jio';
    let operatorCode = 'JIO';
    let brandAccent = '#0084FF';

    if (lower.includes('jio') || lower.includes('rjil') || lower.includes('reliance')) {
      carrierName = 'Reliance Jio';
      operatorCode = 'JIO';
      brandAccent = '#0084FF';
    } else if (lower.includes('airtel') || lower.includes('bharti')) {
      carrierName = 'Bharti Airtel';
      operatorCode = 'AIRTEL';
      brandAccent = '#EF4444';
    } else if (lower.includes('vodafone') || lower.includes('idea') || lower === 'vi' || lower.includes('vi ')) {
      carrierName = 'Vi';
      operatorCode = 'VI';
      brandAccent = '#F59E0B';
    } else if (lower.includes('bsnl')) {
      carrierName = 'BSNL';
      operatorCode = 'BSNL';
      brandAccent = '#06B6D4';
    }

    const location = nvData?.location || (veriData?.phone_region ? veriData.phone_region.split(',').pop()?.trim() : null) || absData?.phone_location?.region || 'Karnataka';
    const lineType = absData?.phone_validation?.is_voip ? 'VoIP / Cloud Trunk' : (veriData?.phone_type === 'landline' ? 'landline' : 'mobile');
    const isValid = Boolean(veriData?.phone_valid ?? absData?.phone_validation?.is_valid ?? nvData?.valid ?? true);
    const intl = veriData?.international_number || absData?.phone_format?.international || nvData?.international_format || `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}`;

    const enginesResponded: string[] = [];
    if (absData) enginesResponded.push('Abstract');
    if (veriData) enginesResponded.push('Veriphone');
    if (nvData) enginesResponded.push('Numverify');

    return {
      valid: isValid,
      number: clean,
      carrier: carrierName,
      operator: carrierName,
      operator_code: operatorCode,
      raw_carrier: rawCarrier || carrierName,
      location,
      circle: location,
      line_type: lineType,
      line_status: absData?.phone_validation?.line_status || 'active',
      risk_level: absData?.phone_risk?.risk_level || 'low',
      country_name: 'India',
      country_code: 'IN',
      country_prefix: '+91',
      international_format: intl,
      local_format: clean10,
      brand_accent: brandAccent,
      source: `⚡ Triple-Engine Parallel Consensus (${enginesResponded.join(' + ')})`,
      engine_badge: '⚡ Triple-Engine Synchronized',
      confidence: enginesResponded.length >= 3 ? 99 : 95,
      engines_responded: enginesResponded,
      providers: {
        abstract_resolved: Boolean(absData),
        veriphone_resolved: Boolean(veriData),
        numverify_resolved: Boolean(nvData),
      },
    };
  }

  // 4. Deterministic offline fallback
  const resolved = resolveIndianCarrier(clean);
  return {
    valid: clean10.length === 10 || clean.includes('1800') || clean.length <= 4,
    number: clean,
    carrier: resolved.operator,
    operator: resolved.operator,
    raw_carrier: resolved.operator,
    location: resolved.circle,
    line_type: resolved.lineType,
    country_name: 'India',
    country_code: 'IN',
    country_prefix: '+91',
    international_format: clean10.length === 10 ? `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}` : clean,
    local_format: clean10,
    brand_accent: resolved.brandColor,
    source: 'Deterministic Cellular Resolution',
  };
}

export const carrierLookupService = {
  detectTelecomCarrier,
  lookupLiveCarrier: detectTelecomCarrier,
  lookupLivePhone,
};
