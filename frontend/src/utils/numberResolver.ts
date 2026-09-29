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
  { label: 'Jio 5G', number: '7019188291', type: 'safe', op: 'Reliance Jio', name: 'Jio Verified User' },
  { label: 'Airtel VoLTE', number: '9845012345', type: 'safe', op: 'Bharti Airtel', name: 'Dr. Suman Rao (Apollo)' },
  { label: 'Vi Cellular', number: '9886011982', type: 'safe', op: 'Vodafone Idea', name: 'Swiggy Partner Delivery' },
  { label: 'BSNL Rural', number: '9448055412', type: 'safe', op: 'BSNL', name: 'Karnataka Rural SIM' },
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
  operator: 'Bharti Airtel' | 'Reliance Jio' | 'Vodafone Idea' | 'BSNL';
  threatLevel: 'SAFE' | 'SPAM' | 'CRITICAL_FRAUD';
  riskScore: number;
  tags: string[];
}

export const KNOWN_CONTACTS: DirectoryContact[] = [
  {
    id: 'c_ramesh_f',
    name: 'Ramesh Sharma (Father)',
    phone: '9811200412',
    formatted: '+91 98112 00412',
    relationOrRole: 'Father • Senior Citizen (Armed)',
    isSavedContact: true,
    operator: 'Bharti Airtel',
    threatLevel: 'SAFE',
    riskScore: 2,
    tags: ['Family Guardian Contact', 'Senior Shield Armed', 'Verified Identity'],
  },
  {
    id: 'c_sunita_m',
    name: 'Sunita Sharma (Mother)',
    phone: '9820044912',
    formatted: '+91 98200 44912',
    relationOrRole: 'Mother • Senior Citizen (Armed)',
    isSavedContact: true,
    operator: 'Vodafone Idea',
    threatLevel: 'SAFE',
    riskScore: 3,
    tags: ['Family Guardian Contact', 'Elder Shield Active', 'Emergency Contact'],
  },
  {
    id: 'c_pooja_d',
    name: 'Pooja Sharma (Daughter)',
    phone: '9920155431',
    formatted: '+91 99201 55431',
    relationOrRole: 'Daughter • Emergency Responder',
    isSavedContact: true,
    operator: 'Bharti Airtel',
    threatLevel: 'SAFE',
    riskScore: 0,
    tags: ['Family Guardian Link', 'SMS Alerts Enabled', 'Primary Beneficiary'],
  },
  {
    id: 'c_suman_doc',
    name: 'Dr. Suman Rao (Apollo Clinic)',
    phone: '9845012345',
    formatted: '+91 98450 12345',
    relationOrRole: 'Verified Medical Doctor • Apollo Healthcare',
    isSavedContact: true,
    operator: 'Bharti Airtel',
    threatLevel: 'SAFE',
    riskScore: 4,
    tags: ['Verified Healthcare Provider', 'Clinic Appointment Line', 'Safe Caller'],
  },
  {
    id: 'c_swiggy_del',
    name: 'Swiggy Delivery Executive',
    phone: '9886011982',
    formatted: '+91 98860 11982',
    relationOrRole: 'Food Delivery Partner • Bangalore South',
    isSavedContact: true,
    operator: 'Vodafone Idea',
    threatLevel: 'SAFE',
    riskScore: 8,
    tags: ['Verified Service Partner', 'Masked Delivery Relay', 'Safe Contact'],
  },
  {
    id: 'c_cbi_scam',
    name: 'Fake CBI Officer / Customs Desk',
    phone: '9820188472',
    formatted: '+91 98201 88472',
    relationOrRole: 'Digital Arrest Scam Impersonator',
    isSavedContact: false,
    operator: 'Bharti Airtel',
    threatLevel: 'CRITICAL_FRAUD',
    riskScore: 96,
    tags: ['Digital Arrest Threat', 'Narcotics Parcel Extortion', 'RBI Escrow Trap', 'Flagged in National Threat DB'],
  },
  {
    id: 'c_sbi_fraud',
    name: 'SBI KYC Expiry Desk (Fake)',
    phone: '8826140918',
    formatted: '+91 88261 40918',
    relationOrRole: 'Banking KYC Phishing & OTP Theft',
    isSavedContact: false,
    operator: 'Reliance Jio',
    threatLevel: 'CRITICAL_FRAUD',
    riskScore: 94,
    tags: ['Bank OTP Extortion', 'Account Deactivation Threat', 'Blacklisted by NPCI'],
  },
  {
    id: 'c_upi_refund',
    name: 'Paytm Refund Desk (Fake)',
    phone: '9315094821',
    formatted: '+91 93150 94821',
    relationOrRole: 'Duplicate UPI PIN Cashback Scammer',
    isSavedContact: false,
    operator: 'Reliance Jio',
    threatLevel: 'SPAM',
    riskScore: 72,
    tags: ['UPI Cashback Trap', 'Malicious Payment Link', 'Suspicious Call'],
  },
  {
    id: 'c_robo_spam',
    name: 'Automated Loan Robocall',
    phone: '1409288219',
    formatted: '+91 14092 88219',
    relationOrRole: 'Automated Telemarketing PRI Trunk',
    isSavedContact: false,
    operator: 'Bharti Airtel',
    threatLevel: 'SPAM',
    riskScore: 78,
    tags: ['Aggressive Loan Spam', 'Bulk Voice Dialer', 'DND Violated'],
  },
  {
    id: 'c_deepfake_ext',
    name: 'AI Deepfake Impersonator',
    phone: '9110044921',
    formatted: '+91 91100 44921',
    relationOrRole: 'Synthetic Voice Clone • Coercion Vector',
    isSavedContact: false,
    operator: 'Vodafone Idea',
    threatLevel: 'CRITICAL_FRAUD',
    riskScore: 94,
    tags: ['AI Synthetic Voice Attack', 'Spoofed PRI Route', 'Immediate Block Advised'],
  }
];

export const resolveCarrier = (rawInput: string, callerName?: string): LookupResult => {
  const cleaned = rawInput.replace(/\D/g, '').slice(-10);
  if (cleaned.length !== 10) {
    throw new Error('Please enter a valid 10-digit Indian mobile number');
  }

  // Check known directory first
  const known = KNOWN_CONTACTS.find(c => c.phone === cleaned);
  const resolvedName = callerName || known?.name;

  const p4 = cleaned.substring(0, 4);

  // Known scam/robocall test targets
  if (cleaned.startsWith('140') || cleaned === '1409288219') {
    return {
      phone: `+91 ${cleaned}`,
      formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
      name: resolvedName || 'Automated Telemarketing Desk',
      isContact: !!known?.isSavedContact,
      relationOrRole: known?.relationOrRole || 'Bulk Commercial Telemarketer',
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
      name: resolvedName || 'Deepfake Threat Vector',
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

  if (cleaned === '9820188472') {
    return {
      phone: `+91 ${cleaned}`,
      formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
      name: resolvedName || 'Fake CBI Officer / Customs Desk',
      isContact: false,
      relationOrRole: 'Digital Arrest Extortion Desk',
      operator: 'Bharti Airtel',
      operatorCode: 'AIRTEL',
      circle: 'Maharashtra & Goa Circle',
      gateway: 'Unverified Hosted Trunk',
      lineType: 'Prepaid SIM (Suspicious Route)',
      networkGen: 'VoLTE 4G',
      threatLevel: 'CRITICAL_FRAUD',
      riskScore: 96,
      simSwapAge: '< 7 days (Recent Re-registration)',
      dndStatus: 'Reported as Impersonation Hazard',
      stirShakenAttestation: 'LEVEL_C',
      brandAccent: '#EF4444',
      brandGlowClass: 'liquid-glass-red',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      tags: ['Digital Arrest Threat', 'Narcotics Parcel Trap', 'High Coercion Language', 'Immediate Block Advised'],
      summaryNote: 'Coercive police/customs impersonation reported across Bengaluru and Mumbai circles.'
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

  // Check if safe or fraud from known directory
  const threatLevel = known ? known.threatLevel : 'SAFE';
  const riskScore = known ? known.riskScore : 4;
  const isSaved = !!known?.isSavedContact;

  return {
    phone: `+91 ${cleaned}`,
    formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
    name: resolvedName || (isSaved ? known?.name : `Subscriber (+91 ${cleaned.slice(0, 5)}...)`),
    isContact: isSaved,
    relationOrRole: known?.relationOrRole || 'Individual Cellular Subscriber',
    operator,
    operatorCode,
    circle: 'Karnataka Circle (KA)',
    gateway: 'Bengaluru Multi-Service Gateway-14',
    lineType: 'Individual Postpaid / Prepaid SIM',
    networkGen,
    threatLevel,
    riskScore,
    simSwapAge: isSaved ? '> 360 days (Verified Stable)' : '> 180 days (Verified Stable)',
    dndStatus: 'Registered (Compliant Tier-0)',
    stirShakenAttestation: 'LEVEL_A',
    brandAccent,
    brandGlowClass,
    badgeBg,
    tags: known?.tags || ['Verified Identity KYC', 'Zero Spam Reports', 'Active Network Subscriber', 'Cryptographically Signed CallerID'],
    summaryNote: known 
      ? `Verified entry in Callix address book: ${known.name}. High trust rating.` 
      : 'Safe verified subscriber with high trust score across all Indian telecom circles.'
  };
};

export const searchCallerDirectory = (
  query: string,
  extraCalls: Array<{ callerNumber: string; callerName?: string; finalScore?: number; verdict?: string }> = []
): {
  contacts: DirectoryContact[];
  resolved: LookupResult | null;
} => {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) {
    return { contacts: KNOWN_CONTACTS.slice(0, 5), resolved: null };
  }

  const digits = cleanQ.replace(/\D/g, '');

  // Search existing known contacts
  const matchedContacts = KNOWN_CONTACTS.filter(contact => {
    const matchName = contact.name.toLowerCase().includes(cleanQ);
    const matchRole = contact.relationOrRole.toLowerCase().includes(cleanQ);
    const matchPhone = digits.length >= 2 && contact.phone.includes(digits);
    return matchName || matchRole || matchPhone;
  });

  // Also include dynamic calls if not already present
  extraCalls.forEach((c, idx) => {
    const cDigits = (c.callerNumber || '').replace(/\D/g, '').slice(-10);
    if (!cDigits) return;
    const name = c.callerName || `Caller ${c.callerNumber}`;
    const matchName = name.toLowerCase().includes(cleanQ);
    const matchPhone = digits.length >= 2 && cDigits.includes(digits);

    if ((matchName || matchPhone) && !matchedContacts.some(m => m.phone === cDigits)) {
      matchedContacts.push({
        id: `dyn_${idx}_${cDigits}`,
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

  // If input contains 10 digits or is a direct number lookup
  let resolved: LookupResult | null = null;
  if (digits.length === 10) {
    try {
      const matchKnown = KNOWN_CONTACTS.find(k => k.phone === digits);
      resolved = resolveCarrier(digits, matchKnown?.name);
    } catch {
      resolved = null;
    }
  }

  return {
    contacts: matchedContacts.slice(0, 6),
    resolved
  };
};
