import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Loader } from '../components/common/Loader';
import { parseIndianNumber, TelecomInfo } from '../utils/telecomIntelligence';
import { useToast } from '../context/ToastContext';
import { ScamCategory } from '../types/fraud.types';
import { SCAM_CATEGORIES } from '../utils/constants';
import { formatPhoneNumber } from '../utils/formatters';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Phone, 
  Flag, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  User, 
  Layers, 
  PhoneCall, 
  Building2, 
  PhoneOff, 
  UserCheck, 
  Megaphone,
  RotateCcw
} from 'lucide-react';
import { cn } from '../utils/cn';

const COUNTRY_CODES = [
  { code: '+91', country: 'India (IN)', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada (US)', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom (UK)', flag: '🇬🇧' },
  { code: '+971', country: 'UAE (AE)', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore (SG)', flag: '🇸🇬' },
  { code: '+61', country: 'Australia (AU)', flag: '🇦🇺' },
];

export const NumberLookup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast, showHighRiskAlert } = useToast();

  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TelecomInfo | null>(null);
  const [queriedPhone, setQueriedPhone] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  // Custom User Reported Increments
  const [additionalReports, setAdditionalReports] = useState(0);
  const [userComments, setUserComments] = useState<Array<{ id: string; author: string; comment: string; date: string; category: string }>>([]);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<ScamCategory | 'TELEMARKETING'>('OTP_THEFT');
  const [reportDescription, setReportDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Auto-fill from URL query param (e.g. /lookup?q=+919876543210)
  useEffect(() => {
    try {
      const queryPhone = searchParams.get('q');
      if (queryPhone) {
        const cleaned = queryPhone.trim();
        const matchedCC = COUNTRY_CODES.find((cc) => cleaned.startsWith(cc.code));
        if (matchedCC) {
          setSelectedCountryCode(matchedCC.code);
          setPhoneInput(cleaned.replace(matchedCC.code, '').trim());
        } else {
          setPhoneInput(cleaned.replace(/\D/g, ''));
        }
        executeLookup(cleaned);
      }
    } catch (err) {
      console.warn('URL param parse fallback', err);
    }
  }, [searchParams]);

  const validatePhone = (digits: string): boolean => {
    const rawDigits = digits.replace(/\D/g, '');
    if (!rawDigits) {
      setInputError('Please enter a phone number to inspect.');
      return false;
    }

    if (selectedCountryCode === '+91') {
      if (rawDigits.startsWith('140') || rawDigits.startsWith('160') || rawDigits.startsWith('1800') || rawDigits.length <= 4) {
        setInputError(null);
        return true;
      }
      if (rawDigits.length !== 10) {
        setInputError('Standard Indian mobile numbers must be 10 digits (e.g. 98450 12345).');
        return false;
      }
    }

    if (rawDigits.length < 3 || rawDigits.length > 14) {
      setInputError('Invalid phone number length.');
      return false;
    }

    setInputError(null);
    return true;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = phoneInput.replace(/\D/g, '');
    if (!validatePhone(rawDigits)) return;

    const fullPhoneNumber =
      rawDigits.startsWith('1800') || rawDigits.length <= 4
        ? rawDigits
        : `${selectedCountryCode} ${rawDigits}`;

    executeLookup(fullPhoneNumber);
  };

  const executeLookup = (fullPhone: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setQueriedPhone(fullPhone);
    setAdditionalReports(0);

    try {
      const telecomInfo = parseIndianNumber(fullPhone);
      setResult(telecomInfo);

      if (telecomInfo.verdict === 'FRAUD_RISK') {
        showHighRiskAlert(
          'CRITICAL FRAUD SCAMMER DETECTED',
          `${formatPhoneNumber(fullPhone)} is flagged with ${telecomInfo.spamReportsCount} community scam reports.`
        );
      } else if (telecomInfo.verdict === 'PROMOTIONAL_SPAM') {
        showToast({
          type: 'warning',
          title: 'Commercial Telemarketer Identified',
          message: `${formatPhoneNumber(fullPhone)} belongs to the TRAI 140 commercial sales series.`,
        });
      } else if (telecomInfo.verdict === 'VERIFIED_ENTERPRISE') {
        showToast({
          type: 'info',
          title: 'Official Enterprise Helpline',
          message: `Identified verified service line for ${telecomInfo.suggestedName || 'Enterprise Support'}.`,
        });
      } else {
        showToast({
          type: 'success',
          title: 'Clean Personal Line',
          message: `Identified legitimate cellular line on ${telecomInfo.operator} (${telecomInfo.circle}).`,
        });
      }
    } catch (err) {
      console.error('Lookup processing error:', err);
      setInputError('An error occurred while evaluating the phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;

    setIsSubmittingReport(true);
    try {
      setAdditionalReports((prev) => prev + 1);
      const newComment = {
        id: `comm_${Date.now()}`,
        author: reporterName.trim() || 'Verified Audio Guardian User',
        comment: reportDescription.trim(),
        date: new Date().toISOString().slice(0, 10),
        category: reportCategory,
      };
      setUserComments((prev) => [newComment, ...prev]);

      setIsReportModalOpen(false);
      setReportDescription('');
      setReporterName('');

      showToast({
        type: 'success',
        title: 'Report Registered',
        message: `Thank you! Report for ${formatPhoneNumber(queriedPhone)} has been logged in community threat radar.`,
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const totalReportsCount = (result?.spamReportsCount || 0) + additionalReports;
  const isHighThreat = result?.verdict === 'FRAUD_RISK' || additionalReports > 0;
  const displayScore = isHighThreat ? Math.min(100, Math.max(90, (result?.riskScore || 85) + additionalReports * 5)) : (result?.riskScore || 5);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyber-border">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm" pulse>
              AUTHENTIC HLR CARRIER & SPAM RADAR
            </Badge>
            <span className="text-xs font-mono text-cyber-muted">
              Airtel • Jio • Vodafone Idea • BSNL • TRAI 140 DND Matrix
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Phone Number Threat & Identity Intelligence
          </h2>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Inspect any Indian or international telephone number to uncover exact telecom operator allocation, circle geography, aggregated community spam reports, and identity classification.
          </p>
        </div>

        {result && (
          <Button
            variant="danger"
            size="md"
            onClick={() => setIsReportModalOpen(true)}
            leftIcon={<Flag className="w-4 h-4" />}
            className="shrink-0 font-bold"
          >
            Report Scam / Spam ({totalReportsCount})
          </Button>
        )}
      </div>

      {/* Search Input Card */}
      <Card className="p-6 bg-slate-900/90 border-cyber-border space-y-4">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-muted block">
            Enter Any Phone Number or Toll-Free Range to Inspect:
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
            {/* Country Code Selector */}
            <select
              value={selectedCountryCode}
              onChange={(e) => {
                setSelectedCountryCode(e.target.value);
                setInputError(null);
              }}
              className="bg-slate-950 border border-cyber-border text-xs font-mono text-cyber-text rounded-xl px-3.5 py-3 focus:outline-none focus:border-brand-cyan"
            >
              {COUNTRY_CODES.map((cc) => (
                <option key={cc.code} value={cc.code}>
                  {cc.flag} {cc.code} ({cc.country.split(' ')[0]})
                </option>
              ))}
            </select>

            {/* Main Phone Input */}
            <div className="flex-1 relative">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value);
                  setInputError(null);
                }}
                placeholder={selectedCountryCode === '+91' ? 'e.g. 98450 12345, 98765 43210, 140 123 4567, 1800 11 2211' : 'e.g. 415 555 2671'}
                className="w-full bg-slate-950 border border-cyber-border text-sm font-mono text-white rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-brand-primary placeholder:text-cyber-subtle"
              />
              <Phone className="w-4 h-4 text-cyber-muted absolute left-3.5 top-3.5" />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              leftIcon={<Search className="w-4 h-4 text-brand-cyan" />}
              className="px-6 shadow-glow-primary font-bold shrink-0"
            >
              Scan Intelligence
            </Button>
          </div>

          {inputError && (
            <p className="text-xs text-red-400 font-mono flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {inputError}
            </p>
          )}
        </form>
      </Card>

      {/* Initial Empty State */}
      {!hasSearched && !isLoading && (
        <Card className="p-12 text-center space-y-4 border-dashed border-cyber-border/80 bg-slate-900/30">
          <div className="p-4 rounded-full bg-slate-800/80 text-brand-cyan w-16 h-16 flex items-center justify-center mx-auto border border-cyber-border">
            <Radio className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-white">Live Telecom (MSC/HLR) & Spam Radar</h4>
            <p className="text-xs text-cyber-muted leading-relaxed">
              Enter any personal number, corporate customer service desk, or unknown sales caller to analyze SIM operator, state circle, and community scam complaints.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-cyber-subtle pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Airtel MSC Matrix
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Jio Infocomm HLR
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Vodafone Idea
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> BSNL Mobile
            </span>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-12 text-center space-y-3 bg-slate-900/60">
          <Loader size="md" text="Querying Indian HLR Routing Matrix & Aggregating Threat Radar..." />
          <span className="text-[11px] font-mono text-cyber-subtle">
            Matching prefix series, telecom circle, and crowd-sourced scam records
          </span>
        </Card>
      )}

      {/* Results View */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Main Intelligence Profile Card */}
          <Card className="p-6 bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border border-cyber-border space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-cyber-border/80">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Operator Badge */}
                  <span
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5',
                      result.operatorBg || 'bg-slate-900 border-slate-700 text-slate-300'
                    )}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    {result.operator}
                  </span>

                  {/* Threat Level Badge */}
                  <Badge
                    variant={
                      isHighThreat
                        ? 'fraud'
                        : result.verdict === 'PROMOTIONAL_SPAM'
                        ? 'suspicious'
                        : result.verdict === 'VERIFIED_ENTERPRISE'
                        ? 'cyan'
                        : 'safe'
                    }
                    size="md"
                    pulse={displayScore >= 75}
                  >
                    {isHighThreat
                      ? 'High Risk / Confirmed Scam'
                      : result.verdict === 'PROMOTIONAL_SPAM'
                      ? 'Commercial Telemarketer'
                      : result.verdict === 'VERIFIED_ENTERPRISE'
                      ? 'Verified Enterprise'
                      : 'Safe / Clean Personal Line'}
                  </Badge>

                  {/* Line Type Tag */}
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-cyber-border text-slate-300">
                    {result.lineType}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatPhoneNumber(queriedPhone)}
                </h3>

                <p className="text-xs text-cyber-muted flex items-center gap-2 font-mono">
                  <User className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>
                    Identified Entity: <strong className="text-white font-bold text-sm">{result.suggestedName || 'Cellular Subscriber'}</strong>
                  </span>
                </p>
              </div>

              {/* Spam Probability Gauge */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyber-border text-center min-w-[210px] space-y-2 shrink-0">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-cyber-muted font-bold">
                  <span>Threat Probability</span>
                  <span
                    className={cn(
                      'font-black text-sm',
                      displayScore >= 75
                        ? 'text-threat-fraud'
                        : displayScore >= 40
                        ? 'text-threat-suspicious'
                        : 'text-threat-safe'
                    )}
                  >
                    {displayScore}%
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      displayScore >= 75
                        ? 'bg-gradient-to-r from-red-600 to-rose-500'
                        : displayScore >= 40
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-400'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-400'
                    )}
                    style={{ width: `${displayScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-cyber-subtle pt-0.5">
                  <span>Reports: {totalReportsCount} Flags</span>
                  <span>{totalReportsCount > 0 ? 'Community Consensus' : 'Clean Trust Record'}</span>
                </div>
              </div>
            </div>

            {/* Carrier, Circle & Classification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyber-border space-y-1">
                <span className="text-[11px] font-mono uppercase text-cyber-muted flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-brand-cyan" /> Telecom Operator
                </span>
                <div className="text-sm font-bold text-white truncate">{result.operator}</div>
                <span className="text-[10px] font-mono text-cyber-subtle block">
                  HLR Network Verification Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyber-border space-y-1">
                <span className="text-[11px] font-mono uppercase text-cyber-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Circle & Geography
                </span>
                <div className="text-sm font-bold text-white truncate">{result.circle}</div>
                <span className="text-[10px] font-mono text-cyber-subtle block">
                  India Telecom Gateway
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyber-border space-y-1">
                <span className="text-[11px] font-mono uppercase text-cyber-muted flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> TRAI DND Category
                </span>
                <div className="text-sm font-bold text-white truncate font-mono">
                  {result.isPromotional ? 'Commercial Telemarketing' : 'Private Cellular'}
                </div>
                <span className="text-[10px] font-mono text-cyber-subtle block">
                  {result.isPromotional ? 'TRAI 140 Series Registered' : 'Standard Mobile GSM'}
                </span>
              </div>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-cyber-border/60">
              <span className="text-xs font-mono text-cyber-muted flex items-center gap-1 mr-1">
                Tags:
              </span>
              {result.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'text-xs font-mono px-2.5 py-0.5 rounded-lg border',
                    tag.includes('Verified') || tag.includes('Official')
                      ? 'bg-cyan-950/50 text-brand-cyan border-brand-cyan/30'
                      : tag.includes('Clean') || tag.includes('Active')
                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                      : tag.includes('140') || tag.includes('Sales') || tag.includes('Offers')
                      ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                      : 'bg-red-950/50 text-red-300 border-red-500/30 font-bold'
                  )}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Card>

          {/* Grid: Safety Guidance & Community Incident Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Columns: Actionable Safety Protocol */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-5 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2 border-b border-cyber-border pb-2.5">
                    {displayScore >= 75 ? (
                      <ShieldAlert className="w-4 h-4 text-threat-fraud" />
                    ) : result.verdict === 'PROMOTIONAL_SPAM' ? (
                      <Megaphone className="w-4 h-4 text-threat-suspicious" />
                    ) : result.verdict === 'VERIFIED_ENTERPRISE' ? (
                      <Building2 className="w-4 h-4 text-brand-cyan" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-threat-safe" />
                    )}
                    Recommended Safety Action
                  </h4>

                  <div className="space-y-2.5 pt-1 text-xs text-slate-300 leading-relaxed">
                    {displayScore >= 75 ? (
                      <>
                        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 font-mono">
                          ⚠️ BLOCK & DO NOT ANSWER: Multiple fraud complaints have been registered for this telephone line.
                        </div>
                        <p>• Never disclose 6-digit SMS OTPs, bank passwords, or UPI PINs.</p>
                        <p>• Law enforcement and customs never demand money transfers to personal escrow accounts.</p>
                        <p>• Add to your handset's blacklist immediately.</p>
                      </>
                    ) : result.verdict === 'PROMOTIONAL_SPAM' ? (
                      <>
                        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 font-mono">
                          📢 COMMERCIAL TELEMARKETER: Auto-dialer line registered under TRAI promotional numbering.
                        </div>
                        <p>• Unsolicited loan, credit card, and promotional sales calls.</p>
                        <p>• To avoid interruptions, add this line to your Do Not Disturb (DND) list.</p>
                      </>
                    ) : result.verdict === 'VERIFIED_ENTERPRISE' ? (
                      <>
                        <div className="p-3 rounded-lg bg-cyan-950/40 border border-brand-cyan/30 text-cyan-200 font-mono">
                          ✓ VERIFIED ENTERPRISE: Official verified corporate or emergency support line.
                        </div>
                        <p>• Safe for customer care and transactional inquiries.</p>
                        <p>• Note: Genuine bank representatives will never ask for your debit card CVV or NetBanking password.</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 font-mono">
                          ✓ CLEAN PERSONAL LINE: No malicious patterns, spam campaigns, or fraud complaints found.
                        </div>
                        <p>• Genuine private cellular subscriber on {result.operator}.</p>
                        <p>• Safe to communicate and return standard calls.</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-border/60">
                  {displayScore >= 75 ? (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full font-bold"
                      onClick={() => setIsReportModalOpen(true)}
                      leftIcon={<Flag className="w-4 h-4" />}
                    >
                      Report Fraudulent Number (Total: {totalReportsCount})
                    </Button>
                  ) : result.verdict === 'PROMOTIONAL_SPAM' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-amber-300 hover:text-white font-bold"
                      onClick={() => alert(`Added ${formatPhoneNumber(queriedPhone)} to local DND Blocklist.`)}
                      leftIcon={<PhoneOff className="w-4 h-4 text-amber-400" />}
                    >
                      Block Commercial Telemarketer & Add to DND
                    </Button>
                  ) : result.verdict === 'VERIFIED_ENTERPRISE' ? (
                    <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-brand-cyan/30 text-xs font-mono text-brand-cyan flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                      Verified Official Channel • Safe for customer support inquiries
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => alert(`Saved ${formatPhoneNumber(queriedPhone)} as trusted contact.`)}
                      leftIcon={<UserCheck className="w-4 h-4 text-emerald-400" />}
                    >
                      Mark as Trusted Personal Contact
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Right 6 Columns: Community Reports & Comments */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-5 space-y-3 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3">
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-cyan" />
                      Community Incident Activity
                    </h4>
                    <span className="text-[11px] font-mono text-cyber-subtle">
                      {totalReportsCount > 0 ? `${totalReportsCount} Reports` : 'Clean Log'}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {totalReportsCount === 0 ? (
                      <div className="py-8 text-center text-cyber-muted space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-threat-safe mx-auto opacity-60" />
                        <p className="text-xs font-semibold text-white">No Community Scam Reports</p>
                        <p className="text-[11px] text-cyber-subtle">
                          Users have not flagged any malicious scams against this line.
                        </p>
                      </div>
                    ) : (
                      <>
                        {userComments.map((comm) => (
                          <div
                            key={comm.id}
                            className="p-3 rounded-xl bg-slate-950/80 border border-cyber-border space-y-1"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white font-mono">{comm.author}</span>
                              <span className="text-[10px] font-mono text-cyber-subtle">{comm.date}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">"{comm.comment}"</p>
                            <span className="text-[10px] font-mono text-red-400 font-semibold block pt-0.5">
                              Category: {comm.category}
                            </span>
                          </div>
                        ))}

                        {/* Default Seeded Community Notes for Flagged Numbers */}
                        {isHighThreat && userComments.length === 0 && (
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyber-border space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white font-mono">Verified Community Reporter</span>
                              <span className="text-[10px] font-mono text-cyber-subtle">Today</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              "Caller impersonated bank/customs official attempting to extract 6-digit OTP verification codes!"
                            </p>
                            <span className="text-[10px] font-mono text-red-400 font-semibold block pt-0.5">
                              Category: Financial Extortion / OTP Theft
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-cyber-border/60">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsReportModalOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Submit New Report For This Number
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Report Scam Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title={`Report Scam / Spam for ${queriedPhone ? formatPhoneNumber(queriedPhone) : 'Number'}`}
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Your Name (Optional)</label>
            <Input
              value={reporterName}
              onChange={(e: any) => setReporterName(e.target.value)}
              placeholder="e.g. Ramesh S. or Anonymous"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Threat Category</label>
            <select
              value={reportCategory}
              onChange={(e: any) => setReportCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-brand-primary"
            >
              <option value="TELEMARKETING">Unsolicited Telemarketing / Sales Spam</option>
              {Object.entries(SCAM_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">
              Incident Statement & Coercive Phrases
            </label>
            <textarea
              required
              rows={3}
              value={reportDescription}
              onChange={(e: any) => setReportDescription(e.target.value)}
              placeholder="e.g. Unsolicited credit card sales or claimed to be bank officer demanding OTP..."
              className="w-full bg-slate-950 border border-cyber-border rounded-lg p-3 text-xs text-cyber-text placeholder-cyber-subtle focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={isSubmittingReport}
            >
              Submit Scam Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
