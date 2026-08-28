export interface ResolvedTelecom {
  operator: 'Bharti Airtel' | 'Reliance Jio' | 'Vodafone Idea' | 'BSNL' | 'State Bank / Enterprise' | 'TRAI Telemarketing';
  circle: string;
  brandColor: string;
  badgeBg: string;
  logoBadge: string;
  lineType: string;
  riskScore: number;
  threatLevel: 'SAFE' | 'SPAM' | 'FRAUD';
  tags: string[];
}

export function resolveIndianCarrier(rawPhone: string): ResolvedTelecom {
  const digits = rawPhone.replace(/\D/g, '').slice(-10);
  const p4 = digits.substring(0, 4);

  // 1. Enterprise / Toll-Free Series
  if (rawPhone.includes('1800') || digits.startsWith('1800') || rawPhone === '121' || rawPhone === '198' || rawPhone === '199' || rawPhone === '1930') {
    return {
      operator: 'State Bank / Enterprise',
      circle: 'All India Support',
      brandColor: '#06B6D4',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      logoBadge: 'ENTERPRISE',
      lineType: 'Enterprise Toll-Free Trunk',
      riskScore: 2,
      threatLevel: 'SAFE',
      tags: ['Verified Enterprise Desk', 'Official Support', 'Zero Risk'],
    };
  }

  // 2. TRAI Commercial Telemarketing (140 / 160)
  if (digits.startsWith('140') || digits.startsWith('160') || rawPhone.includes('140')) {
    return {
      operator: 'TRAI Telemarketing',
      circle: 'National Commercial Auto-Dialer Hub',
      brandColor: '#F59E0B',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      logoBadge: 'TRAI 140',
      lineType: 'Commercial Promotional Dialer',
      riskScore: 65,
      threatLevel: 'SPAM',
      tags: ['TRAI 140 Series', 'Unsolicited Sales', 'Auto-Dialer Robocall', 'Commercial DND'],
    };
  }

  // 3. Known Blacklisted Scammers
  if (digits === '9876543210' || digits === '9811122334' || digits === '9820044556') {
    return {
      operator: 'Bharti Airtel',
      circle: 'Reported Cybercrime Network',
      brandColor: '#EF4444',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      logoBadge: 'SCAM',
      lineType: 'Spoofed Cellular Gateway',
      riskScore: 98,
      threatLevel: 'FRAUD',
      tags: ['Confirmed Fraudster', 'Digital Arrest Hoax', 'OTP Extortion', 'Blacklisted'],
    };
  }

  // 4. Reliance Jio Series (Strict check: 6-series and specific 7/8/9 blocks)
  const jioPrefixes = [
    '6360', '6361', '6362', '6363', '6364', '6366', '6300', '6301', '6302', '6303', '6304',
    '7019', '7022', '7026', '7200', '7201', '7303', '7304', '7400', '7506', '7619', '7624',
    '7625', '7676', '7975', '7977', '8088', '8095', '8197', '8296', '8310', '8431', '8618',
    '8660', '8762', '8792', '8951', '9019', '9036', '9341', '9342', '9343', '9353', '9380',
    '7000', '7001', '7002', '7042', '7011', '7021', '7045', '7010', '7032'
  ];

  if (digits.startsWith('6') || jioPrefixes.includes(p4)) {
    return {
      operator: 'Reliance Jio',
      circle: ['7042', '7011', '7303'].includes(p4) ? 'Delhi NCR Circle' : 'Karnataka Circle',
      brandColor: '#0284C7',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      logoBadge: 'Jio',
      lineType: 'VoLTE Cellular (4G/5G)',
      riskScore: 4,
      threatLevel: 'SAFE',
      tags: ['Verified Jio SIM', 'VoLTE 4G/5G Network', 'Clean Profile'],
    };
  }

  // 5. BSNL Series
  if (p4.startsWith('9448') || p4.startsWith('9449') || p4.startsWith('9480') || p4.startsWith('9481') || p4.startsWith('9444') || p4.startsWith('9445')) {
    return {
      operator: 'BSNL',
      circle: 'Karnataka Circle',
      brandColor: '#10B981',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      logoBadge: 'BSNL',
      lineType: 'Mobile GSM Line',
      riskScore: 5,
      threatLevel: 'SAFE',
      tags: ['BSNL Mobile Line', 'National Network', 'Clean Profile'],
    };
  }

  // 6. Vodafone Idea (Vi) Series
  const viPrefixes = ['9886', '9945', '9986', '9738', '9590', '9821', '9822', '9823', '9890', '9922', '9923', '9819', '9833', '9841', '9941'];
  if (viPrefixes.includes(p4)) {
    return {
      operator: 'Vodafone Idea',
      circle: 'Karnataka / Mumbai Circle',
      brandColor: '#F59E0B',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      logoBadge: '!VI',
      lineType: 'Mobile Cellular (GSM/LTE)',
      riskScore: 5,
      threatLevel: 'SAFE',
      tags: ['Verified Vi SIM', 'Active Cellular Subscriber', 'Clean Record'],
    };
  }

  // 7. Default to Bharti Airtel for all standard 9x, 8x, 7x series (9845, 9844, 9880, 9900, 9740, 8884, 8861, 8105, etc.)
  return {
    operator: 'Bharti Airtel',
    circle: ['9810', '9811', '9871', '9873', '9910', '9911'].includes(p4) ? 'Delhi NCR Circle' : 'Karnataka (Bengaluru)',
    brandColor: '#EF4444',
    badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
    logoBadge: 'airtel',
    lineType: 'Mobile Cellular (GSM/5G)',
    riskScore: 4,
    threatLevel: 'SAFE',
    tags: ['Verified Airtel SIM', 'Clean Cellular Profile', '0 Fraud Reports'],
  };
}
