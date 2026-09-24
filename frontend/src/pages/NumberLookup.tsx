import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Radio, 
  MapPin, 
  Building2, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Wifi, 
  Cpu, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Fingerprint,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { cn } from '../utils/cn';

interface LookupResult {
  phone: string;
  formatted: string;
  operator: 'Bharti Airtel' | 'Reliance Jio' | 'Vodafone Idea' | 'BSNL';
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

const PRESET_NUMBERS = [
  { label: 'Jio 5G', number: '7019188291', type: 'safe', op: 'Reliance Jio' },
  { label: 'Airtel VoLTE', number: '9845012345', type: 'safe', op: 'Bharti Airtel' },
  { label: 'Vi Cellular', number: '9886011982', type: 'safe', op: 'Vodafone Idea' },
  { label: 'BSNL Rural', number: '9448055412', type: 'safe', op: 'BSNL' },
  { label: 'Spam Robocall', number: '1409288219', type: 'spam', op: 'Telemarketer' },
  { label: 'Deepfake Threat', number: '9110044921', type: 'fraud', op: 'Spoofed SIM' },
];

export const NumberLookup: React.FC = () => {
  const navigate = useNavigate();
  const searchInputId = useId();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentLookups, setRecentLookups] = useState<Array<{ number: string; operator: string; level: string }>>([
    { number: '+91 70191 88291', operator: 'Reliance Jio', level: 'SAFE' },
    { number: '+91 98450 12345', operator: 'Bharti Airtel', level: 'SAFE' },
    { number: '+91 14092 88219', operator: 'Telemarketer', level: 'SPAM' },
  ]);

  const resolveCarrier = (rawInput: string): LookupResult => {
    const cleaned = rawInput.replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number');
    }

    const p4 = cleaned.substring(0, 4);

    // Known scam/robocall test targets
    if (cleaned.startsWith('140') || cleaned === '1409288219') {
      return {
        phone: `+91 ${cleaned}`,
        formatted: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
        operator: 'Bharti Airtel',
        operatorCode: 'AIRTEL',
        circle: 'Delhi / NCR Circle',
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
        operator: 'Vodafone Idea',
        operatorCode: 'VI',
        circle: 'Mumbai Metro Circle',
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
      operator,
      operatorCode,
      circle: 'Karnataka Circle (KA)',
      gateway: 'Bengaluru Multi-Service Gateway-14',
      lineType: 'Individual Postpaid / Prepaid SIM',
      networkGen,
      threatLevel: 'SAFE',
      riskScore: 4,
      simSwapAge: '> 360 days (Verified Stable)',
      dndStatus: 'Registered (Compliant Tier-0)',
      stirShakenAttestation: 'LEVEL_A',
      brandAccent,
      brandGlowClass,
      badgeBg,
      tags: ['Verified Identity KYC', 'Zero Spam Reports', 'Active Network Subscriber', 'Cryptographically Signed CallerID'],
      summaryNote: 'Safe verified subscriber with high trust score across all Indian telecom circles.'
    };
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) return;

    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const data = resolveCarrier(phoneNumber);
        setResult(data);
        setRecentLookups(prev => {
          const filtered = prev.filter(item => item.number !== data.formatted);
          return [{ number: data.formatted, operator: data.operator, level: data.threatLevel }, ...filtered].slice(0, 5);
        });
      } catch (err: any) {
        setError(err.message || 'Error resolving number');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelectPreset = (num: string) => {
    setPhoneNumber(num);
    setError(null);
    setLoading(true);
    setTimeout(() => {
      try {
        const data = resolveCarrier(num);
        setResult(data);
        setRecentLookups(prev => {
          const filtered = prev.filter(item => item.number !== data.formatted);
          return [{ number: data.formatted, operator: data.operator, level: data.threatLevel }, ...filtered].slice(0, 5);
        });
      } catch (err: any) {
        setError(err.message || 'Error resolving number');
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.formatted} - ${result.operator} (${result.circle}) - Status: ${result.threatLevel}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white pb-12">
      {/* Top macOS Traffic Light Bar & Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl liquid-glass-card-sm border border-white/10">
        <div className="flex items-center gap-3">
          {/* macOS window traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Telecom Radar & Caller Dossier</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  TRAI Tier-1
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              Live cryptographic attestation, operator HLR diagnostics, and fraud score analysis
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-mono text-zinc-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>CELLULAR GATEWAY ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Glass Search Section */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-white/15">
        {/* Ambient Liquid Sheen Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 text-xs font-mono shadow-sm">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Multi-Signal Mobile Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Instant Indian Mobile & Carrier Identification
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Verify caller legitimacy before accepting suspicious audio calls. Inspect SIM swap velocity, STIR/SHAKEN signatures, and fraud flags in milliseconds.
          </p>

          {/* Liquid Search Input Bar */}
          <form onSubmit={handleSearch} className="relative pt-2">
            <div className="relative flex items-center liquid-glass-card-sm p-1.5 rounded-2xl border border-white/20 shadow-2xl focus-within:border-cyan-400/60 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all">
              <div className="flex items-center gap-1.5 pl-3.5 pr-2 py-2 text-zinc-400 font-mono text-sm border-r border-white/10 select-none">
                <span className="text-base">🇮🇳</span>
                <span className="font-semibold text-white">+91</span>
              </div>
              <input
                id={searchInputId}
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number (e.g. 9845012345)"
                className="w-full bg-transparent px-3 py-2 text-white font-mono text-sm placeholder:text-zinc-500 focus:outline-none"
                maxLength={14}
              />
              <button
                type="submit"
                disabled={loading || !phoneNumber.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95 shrink-0"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>{loading ? 'Scanning...' : 'Scan Radar'}</span>
              </button>
            </div>
          </form>

          {/* Fast Preset Number Selector Pills (Apple iOS Style) */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-zinc-400 mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Click a test preset to preview instant liquid evaluation:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESET_NUMBERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.number)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm",
                    preset.type === 'safe'
                      ? "bg-white/[0.04] hover:bg-white/[0.1] border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                      : preset.type === 'spam'
                      ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300 hover:border-amber-500/50"
                      : "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300 hover:border-red-500/50"
                  )}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    preset.type === 'safe' ? "bg-emerald-400" : preset.type === 'spam' ? "bg-amber-400" : "bg-red-400"
                  )} />
                  <span className="font-semibold">{preset.label}</span>
                  <span className="font-mono text-[10px] opacity-70">{preset.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center flex items-center justify-center gap-2 animate-fade-in font-mono">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Lookup Dossier Result (Apple Liquid Glass Inspection Card) */}
      {result && (
        <div className={cn(
          "liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-6 border transition-all duration-500 animate-fade-in",
          result.threatLevel === 'SAFE' && "border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.12)]",
          result.threatLevel === 'SPAM' && "border-amber-500/30 shadow-[0_20px_50px_rgba(245,158,11,0.15)]",
          result.threatLevel === 'CRITICAL_FRAUD' && "border-rose-500/40 shadow-[0_20px_50px_rgba(244,63,94,0.2)]"
        )}>
          {/* Header Row: Target & Live Verdict */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Target Caller Identification</span>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono border", result.badgeBg)}>
                  {result.threatLevel === 'SAFE' ? 'AUTHENTICATED' : result.threatLevel === 'SPAM' ? 'ELEVATED SUSPICION' : 'THREAT ADVISORY'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                  {result.formatted}
                </h2>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  title="Copy Dossier Summary"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Operator Brand Pill & Threat Gauge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={cn("px-4 py-2 rounded-2xl border flex items-center gap-2.5 backdrop-blur-md shadow-sm", result.badgeBg)}>
                <Building2 className="w-4 h-4" />
                <div>
                  <div className="text-[10px] font-mono uppercase opacity-75">Cellular Operator</div>
                  <div className="text-sm font-bold">{result.operator}</div>
                </div>
              </div>

              {/* Threat Score Badge */}
              <div className={cn(
                "px-4 py-2 rounded-2xl border flex items-center gap-2.5 backdrop-blur-md shadow-sm",
                result.threatLevel === 'SAFE' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                result.threatLevel === 'SPAM' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                "bg-red-500/15 border-red-500/30 text-red-400"
              )}>
                {result.threatLevel === 'SAFE' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> :
                 result.threatLevel === 'SPAM' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                 <ShieldAlert className="w-5 h-5 text-rose-400" />}
                <div>
                  <div className="text-[10px] font-mono uppercase opacity-75">Fraud Probability</div>
                  <div className="text-sm font-bold font-mono">{result.riskScore}% {result.threatLevel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Grid Liquid Glass Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Card 1: Circle & Routing Switch */}
            <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 shadow-sm">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Circle / Telecom Node</span>
              </div>
              <div className="text-sm font-semibold text-white">{result.circle}</div>
              <div className="text-[11px] font-mono text-zinc-500 truncate">{result.gateway}</div>
            </div>

            {/* Card 2: Network Standard & Line Type */}
            <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 shadow-sm">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                <span>Line Type & Protocol</span>
              </div>
              <div className="text-sm font-semibold text-white">{result.lineType}</div>
              <div className="text-[11px] font-mono text-zinc-500 truncate">{result.networkGen}</div>
            </div>

            {/* Card 3: Cryptographic Attestation */}
            <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 shadow-sm">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                <span>STIR/SHAKEN Attestation</span>
              </div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span>{result.stirShakenAttestation === 'LEVEL_A' ? 'Level A (Full Attestation)' : result.stirShakenAttestation === 'LEVEL_C' ? 'Level C (Gateway Only)' : 'Spoofed / Unsigned'}</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 truncate">
                {result.stirShakenAttestation === 'LEVEL_A' ? 'Originating SIM cryptographically verified' : 'No cryptographic proof of subscriber identity'}
              </div>
            </div>

            {/* Card 4: SIM Swap / IMSI Age */}
            <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 shadow-sm">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>SIM Swap Velocity</span>
              </div>
              <div className="text-sm font-semibold text-white">{result.simSwapAge}</div>
              <div className="text-[11px] font-mono text-zinc-500">IMSI registration lifecycle</div>
            </div>

            {/* Card 5: National DND Registry */}
            <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 shadow-sm">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>TRAI DND Compliance</span>
              </div>
              <div className="text-sm font-semibold text-white">{result.dndStatus}</div>
              <div className="text-[11px] font-mono text-zinc-500">National Do Not Call registry status</div>
            </div>

            {/* Card 6: AI Threat Vector Assessment */}
            <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 shadow-sm">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Heuristic AI Engine</span>
              </div>
              <div className="text-sm font-semibold text-white">Callix Neural Radar v2.4</div>
              <div className="text-[11px] font-mono text-zinc-500">Sub-second speech & routing profiling</div>
            </div>
          </div>

          {/* Tags & Security Notes */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Subscriber Metadata & Behavioral Tags</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">{result.summaryNote}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300 text-xs font-medium border border-white/10 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Deep Action Bar (Simulate Call or Scan Audio) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-zinc-400">
              Need to test voice biometric response against this caller?
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/scanner')}
                className="ios-frosted-btn px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Deep Audio Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/simulation?caller=${encodeURIComponent(result.phone)}`)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Simulate Call Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Lookups Strip (Apple iOS Frosted Style) */}
      {recentLookups.length > 0 && (
        <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Recent Radar Lookups</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Cached in local session</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {recentLookups.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item.number.replace(/\s+/g, '').replace('+91', ''))}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  item.level === 'SAFE' ? "bg-emerald-400" : item.level === 'SPAM' ? "bg-amber-400" : "bg-red-400"
                )} />
                <span>{item.number}</span>
                <span className="text-zinc-500 text-[10px]">({item.operator})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberLookup;
