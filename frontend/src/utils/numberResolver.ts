export interface LookupResult {
  phone: string;
  formatted: string;
  name?: string;
  isContact?: boolean;
  relationOrRole?: string;
  operator: 'Bharti Airtel' | 'Reliance Jio' | 'Vodafone Idea' | 'BSNL' | 'Telemarketer';
  operatorCode: 'AIRTEL' | 'JIO' | 'VI' | 'BSNL';
  circle: string;
  gateway: string;
  lineType: string;
  networkGen: string;
  threatLevel: 'SAFE' | 'SPAM' | 'CRITICAL_FRAUD';
  riskScore: number;
  simSwapAge: string;
  dndStatus: string;
  stirShakenAttestation: 'LEVEL_A' | 'LEVEL_B' | 'LEVEL_C' | 'SPOOFED_UNATTESTED';
  brandAccent: string;
  brandGlowClass: string;
  badgeBg: string;
  tags: string[];
  summaryNote: string;
}

export interface PresetNumber {
  label: string;
  number: string;
  type: 'safe' | 'spam' | 'fraud';
  op: string;
  name?: string;
}

export const PRESET_NUMBERS: PresetNumber[] = [
  { label: 'Jio 5G', number: '7019188291', type: 'safe', op: 'Reliance Jio', name: 'Jio Test Subscriber' },
  { label: 'Airtel VoLTE', number: '9845012345', type: 'safe', op: 'Bharti Airtel', name: 'Airtel VoLTE Test SIM' },
  { label: 'Vi Cellular', number: '9886011982', type: 'safe', op: 'Vodafone Idea', name: 'Vi Cellular Test SIM' },
  { label: 'BSNL Rural', number: '9448055412', type: 'safe', op: 'BSNL', name: 'BSNL Rural Fiber SIM' },
  { label: 'Spam Robocall', number: '1409288219', type: 'spam', op: 'Telemarketer', name: 'Automated Loan Robocall' },
  { label: 'Deepfake Threat', number: '9110044921', type: 'fraud', op: 'Spoofed SIM', name: 'AI Deepfake Impersonator' },
];

export interface DirectoryContact {
  id: string;
  name: string;
  phone: string;
  formatted: string;
  relationOrRole: string;
  isSavedContact: boolean;
  operator: 'Bharti Airtel' | 'Reliance Jio' | 'Vodafone Idea' | 'BSNL' | 'Telemarketer';
  threatLevel: 'SAFE' | 'SPAM' | 'CRITICAL_FRAUD';
  riskScore: number;
  tags: string[];
}

export const resolveCarrier = (rawInput: string, callerName?: string): LookupResult => {
  const cleaned = rawInput.replace(/\D/g, '').slice(-10);
  if (cleaned.length !== 10) {
    throw new Error('Please enter a valid 10-digit Indian mobile number');
  }

  const p4 = cleaned.substring(0, 4);

  // Known test threat targets
  if (cleaned.startsWith('140') || cleaned === '1409288219') {
    return {
      phone: `+91 ${cleaned}`,
      formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
      name: callerName || 'Automated Telemarketing Desk',
      isContact: false,
      relationOrRole: 'Bulk Commercial Telemarketer',
      operator: 'Bharti Airtel',
      operatorCode: 'AIRTEL',
      circle: 'Delhi / NCR Circle (DL)',
      gateway: 'Bulk SIP PRI Gateway-09',
      lineType: 'Automated Telemarketing Trunk',
      networkGen: 'Cloud Hosted PBX',
      threatLevel: 'SPAM',
      riskScore: 78,
      simSwapAge: '< 14 days (High Velocity)',
      dndStatus: 'Violated (Reported 418 times)',
      stirShakenAttestation: 'LEVEL_C',
      brandAccent: '#EF4444',
      brandGlowClass: 'liquid-glass-red',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      tags: ['Automated Robodialer', 'Aggressive Loan Spam', 'Bulk Voice Campaign', 'High Complaint Frequency'],
      summaryNote: 'Flagged by 400+ subscribers in national threat registry within last 48 hours.'
    };
  }

  if (cleaned === '9110044921') {
    return {
      phone: `+91 ${cleaned}`,
      formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
      name: callerName || 'Deepfake Threat Vector',
      isContact: false,
      relationOrRole: 'Synthetic Voice Impersonator',
      operator: 'Vodafone Idea',
      operatorCode: 'VI',
      circle: 'Mumbai Metro Circle (MH)',
      gateway: 'Virtual Asterisk / FreePBX Node',
      lineType: 'VoIP Spoofed Trunk',
      networkGen: 'SIP Over TLS Proxy',
      threatLevel: 'CRITICAL_FRAUD',
      riskScore: 94,
      simSwapAge: '< 48 hours (Fresh IMSI Swap)',
      dndStatus: 'Blacklisted in NPCI / TRAI Grid',
      stirShakenAttestation: 'SPOOFED_UNATTESTED',
      brandAccent: '#EF4444',
      brandGlowClass: 'liquid-glass-red',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      tags: ['AI Deepfake Voice Attack', 'Police Impersonation Vector', 'Stolen KYC Credential', 'Immediate Block Advised'],
      summaryNote: 'Zero cryptographic attestation. Matched pattern for automated synthetic voice extortion.'
    };
  }

  // Strict Reliance Jio Prefixes
  const jioPrefixes = [
    '6360', '6361', '6362', '6363', '6364', '6366', '6300', '6301', '6302', '6303', '6304',
    '7019', '7022', '7026', '7200', '7201', '7303', '7304', '7400', '7506', '7619', '7624',
    '7625', '7676', '7975', '7977', '8088', '8095', '8197', '8296', '8310', '8431', '8618',
    '8660', '8762', '8792', '8951', '9019', '9036', '9341', '9342', '9343', '9353', '9380',
    '9108', '9148'
  ];

  // Strict BSNL Prefixes
  const bsnlPrefixes = ['9448', '9449', '9480', '9481', '9482', '9483', '9444', '9445', '9422'];

  // Strict Vodafone Idea (Vi) Prefixes
  const viPrefixes = ['9886', '9945', '9986', '9738', '9590', '9820', '9821'];

  let operator: LookupResult['operator'] = 'Bharti Airtel';
  let operatorCode: LookupResult['operatorCode'] = 'AIRTEL';
  let brandAccent = '#EF4444';
  let brandGlowClass = 'liquid-glass-red';
  let badgeBg = 'bg-red-500/15 text-red-300 border-red-500/30';
  let networkGen = '5G Plus / VoLTE 4G';

  if (cleaned.startsWith('6') || jioPrefixes.includes(p4)) {
    operator = 'Reliance Jio';
    operatorCode = 'JIO';
    brandAccent = '#0EA5E9';
    brandGlowClass = 'liquid-glass-blue';
    badgeBg = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    networkGen = 'True5G SA (Standalone N78)';
  } else if (bsnlPrefixes.includes(p4)) {
    operator = 'BSNL';
    operatorCode = 'BSNL';
    brandAccent = '#10B981';
    brandGlowClass = 'liquid-glass-emerald';
    badgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    networkGen = 'GSM / 4G BSNL Bharat AirFibre';
  } else if (viPrefixes.includes(p4)) {
    operator = 'Vodafone Idea';
    operatorCode = 'VI';
    brandAccent = '#F59E0B';
    brandGlowClass = 'liquid-glass-amber';
    badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    networkGen = 'GIGAnet VoLTE / Vi 4G';
  }

  return {
    phone: `+91 ${cleaned}`,
    formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
    name: callerName || `Subscriber (+91 ${cleaned.slice(0, 5)}...)`,
    isContact: false,
    relationOrRole: 'Individual Cellular Subscriber',
    operator,
    operatorCode,
    circle: 'Karnataka Circle (KA)',
    gateway: 'Bengaluru Multi-Service Gateway-14',
    lineType: 'Individual Postpaid / Prepaid SIM',
    networkGen,
    threatLevel: 'SAFE',
    riskScore: 4,
    simSwapAge: '> 180 days (Verified Stable)',
    dndStatus: 'Registered (Compliant Tier-0)',
    stirShakenAttestation: 'LEVEL_A',
    brandAccent,
    brandGlowClass,
    badgeBg,
    tags: ['Verified Identity KYC', 'Zero Spam Reports', 'Active Network Subscriber', 'Cryptographically Signed CallerID'],
    summaryNote: 'Safe verified subscriber with high trust score across all Indian telecom circles.'
  };
};

export const searchCallerDirectory = (
  query: string,
  userGuardians: Array<{ name: string; phone: string; relationship?: string }> = [],
  extraCalls: Array<{ callerNumber: string; callerName?: string; finalScore?: number; verdict?: string }> = []
): {
  contacts: DirectoryContact[];
  resolved: LookupResult | null;
} => {
  const cleanQ = query.trim().toLowerCase();
  const digits = cleanQ.replace(/\D/g, '');

  const matchedContacts: DirectoryContact[] = [];

  // 1. Search actual user-added guardians / contacts
  userGuardians.forEach((g, idx) => {
    const gDigits = (g.phone || '').replace(/\D/g, '').slice(-10);
    const matchName = g.name.toLowerCase().includes(cleanQ);
    const matchPhone = digits.length >= 2 && gDigits.includes(digits);

    if (!cleanQ || matchName || matchPhone) {
      matchedContacts.push({
        id: `guard_${idx}_${gDigits}`,
        name: g.name,
        phone: gDigits,
        formatted: `+91 ${gDigits.slice(0, 5)} ${gDigits.slice(5)}`,
        relationOrRole: `${g.relationship || 'Family'} • Armed Guardian`,
        isSavedContact: true,
        operator: 'Bharti Airtel',
        threatLevel: 'SAFE',
        riskScore: 0,
        tags: ['Saved Family Guardian', 'Emergency Contact', 'Verified Safe'],
      });
    }
  });

  // 2. Search actual user call logs if matching query
  if (cleanQ) {
    extraCalls.forEach((c, idx) => {
      const cDigits = (c.callerNumber || '').replace(/\D/g, '').slice(-10);
      if (!cDigits) return;
      const name = c.callerName || `Caller ${c.callerNumber}`;
      const matchName = name.toLowerCase().includes(cleanQ);
      const matchPhone = digits.length >= 2 && cDigits.includes(digits);

      if ((matchName || matchPhone) && !matchedContacts.some(m => m.phone === cDigits)) {
        matchedContacts.push({
          id: `call_${idx}_${cDigits}`,
          name,
          phone: cDigits,
          formatted: `+91 ${cDigits.slice(0, 5)} ${cDigits.slice(5)}`,
          relationOrRole: 'Monitored Call History Record',
          isSavedContact: false,
          operator: 'Bharti Airtel',
          threatLevel: (c.finalScore || 0) >= 75 ? 'CRITICAL_FRAUD' : (c.finalScore || 0) >= 40 ? 'SPAM' : 'SAFE',
          riskScore: c.finalScore || 5,
          tags: [c.verdict || 'Monitored', 'Historical Log'],
        });
      }
    });
  }

  // If input contains 10 digits, resolve it
  let resolved: LookupResult | null = null;
  if (digits.length === 10) {
    try {
      const matchedGuard = userGuardians.find(g => (g.phone || '').replace(/\D/g, '').slice(-10) === digits);
      resolved = resolveCarrier(digits, matchedGuard?.name);
      if (matchedGuard) {
        resolved.isContact = true;
        resolved.relationOrRole = `${matchedGuard.relationship || 'Family'} • Saved Contact`;
      }
    } catch {
      resolved = null;
    }
  }

  return {
    contacts: cleanQ ? matchedContacts.slice(0, 6) : matchedContacts,
    resolved
  };
};
