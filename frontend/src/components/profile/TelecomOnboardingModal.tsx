import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Radio, 
  User as UserIcon, 
  CheckCircle2, 
  Zap,
  Globe2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resolveCarrier, LookupResult } from '../../utils/numberResolver';
import { cn } from '../../utils/cn';

export interface TelecomOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (phoneNumber: string) => void;
  isMandatory?: boolean;
}

export const TelecomOnboardingModal: React.FC<TelecomOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isMandatory = false,
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [rawPhone, setRawPhone] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [selectedRole, setSelectedRole] = useState<'Personal Shield' | 'Developer / Analyst' | 'Elder Guardian'>('Personal Shield');
  const [enableSmsAlerts, setEnableSmsAlerts] = useState(true);
  const [autoBlockScams, setAutoBlockScams] = useState(true);
  
  const [resolvedData, setResolvedData] = useState<LookupResult | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync display name if user loads
  useEffect(() => {
    if (user?.displayName && !displayName) {
      setDisplayName(user.displayName);
    }
    if (user?.phoneNumber) {
      const digits = user.phoneNumber.replace(/\D/g, '').slice(-10);
      setRawPhone(digits);
    }
  }, [user, isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMandatory) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isMandatory]);

  // Live Carrier Resolution as user types
  useEffect(() => {
    const digits = rawPhone.replace(/\D/g, '').slice(-10);
    setError(null);

    if (digits.length === 10) {
      setIsResolving(true);
      try {
        const result = resolveCarrier(digits, displayName || user?.displayName);
        setResolvedData(result);
      } catch (err: any) {
        setResolvedData(null);
        setError(err?.message || 'Invalid Indian mobile number');
      } finally {
        setIsResolving(false);
      }
    } else {
      setResolvedData(null);
      if (digits.length > 0 && digits.length < 10) {
        // partial
      }
    }
  }, [rawPhone, displayName, user]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, '').slice(0, 10);
    setRawPhone(digitsOnly);
  };

  const formatRawPhone = (digits: string) => {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = rawPhone.replace(/\D/g, '').slice(-10);

    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 98201 88472).');
      return;
    }

    setSaving(true);
    try {
      const formattedNumber = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
      const finalName = displayName.trim() || user?.displayName || 'Callix User';

      // Update auth profile
      updateProfile({
        phoneNumber: formattedNumber,
        displayName: finalName,
        preferences: {
          ...(user?.preferences || {
            autoBlockHighRisk: true,
            smsAlerts: true,
            pushAlerts: true,
            audioRecordingOptIn: true,
            riskSensitivity: 'STANDARD',
          }),
          autoBlockHighRisk: autoBlockScams,
          smsAlerts: enableSmsAlerts,
        }
      });

      // Show success toast
      showToast({
        type: 'success',
        title: '🛡️ Mobile Number Linked Successfully',
        message: `${formattedNumber} (${resolvedData?.operator || 'Telecom Network'}) is now protected by Callix Real-Time Fraud Shield.`,
      });

      if (onSuccess) {
        onSuccess(formattedNumber);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to link mobile number. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('dismissed_phone_onboarding', 'true');
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain animate-fade-in font-sans">
      {/* Dark Frosted Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={isMandatory ? undefined : onClose} 
      />

      {/* Main Glass Dialog */}
      <div className="relative w-full my-auto flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[92vh] max-w-xl bg-neutral-950 border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.2)] z-10 overflow-hidden backdrop-blur-xl">
        
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 blur-3xl rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-neutral-900/60 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Link Verified Mobile Number
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
                  TRAI STIR/SHAKEN
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Setup your caller identity for real-time scam & spoof defense
              </p>
            </div>
          </div>

          {!isMandatory && (
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0 space-y-5 text-xs text-zinc-300">
          
          {/* Informational Callout */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 flex items-start gap-3 text-cyan-200/90 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-white text-xs">Callix Scam Shield Requires Caller ID Verification</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Just like Truecaller, linking your Indian mobile number enables AI diarization, digital arrest spoof interception, and immediate SMS dispatch to your family guardians.
              </p>
            </div>
          </div>

          {/* Field 1: Phone Number Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white flex items-center justify-between">
              <span>Primary Indian Mobile Number</span>
              <span className="text-[11px] font-mono text-zinc-400">10-Digit Mobile</span>
            </label>

            <div className="relative flex items-center">
              {/* Country Code Pill */}
              <div className="absolute left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.08] border border-white/15 text-white font-mono text-xs select-none">
                <span className="text-sm">🇮🇳</span>
                <span className="font-bold">+91</span>
              </div>

              <input
                type="tel"
                autoFocus
                value={formatRawPhone(rawPhone)}
                onChange={handlePhoneInputChange}
                placeholder="98201 88472"
                maxLength={11}
                className="w-full h-12 bg-neutral-900/90 border border-white/15 focus:border-cyan-400 rounded-2xl pl-24 pr-10 text-sm sm:text-base font-mono text-white placeholder-zinc-600 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
              />

              {rawPhone.length === 10 && (
                <div className="absolute right-3 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Live Carrier Diagnostic Dossier (Appears dynamically when typing number) */}
          {resolvedData && (
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-white/15 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>LIVE CARRIER DIAGNOSTICS</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                  VERIFIED SS7 ROUTE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Telecom Operator</div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: resolvedData.brandAccent }} 
                    />
                    <span>{resolvedData.operator}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Telecom Circle</div>
                  <div className="font-semibold text-zinc-200 truncate">
                    {resolvedData.circle.split('(')[0].trim()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Attestation</div>
                  <div className="font-mono text-cyan-300 font-semibold">
                    {resolvedData.stirShakenAttestation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Field 2: Full Name / Caller ID Identity */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Full Name / Caller ID Identity
            </label>
            <div className="relative flex items-center">
              <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Mahi S"
                className="w-full h-11 bg-neutral-900/90 border border-white/15 focus:border-white/40 rounded-xl pl-10 pr-4 text-xs font-semibold text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Field 3: Shield Persona Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Primary Protection Persona
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Personal Shield', 'Developer / Analyst', 'Elder Guardian'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "py-2 px-2.5 rounded-xl text-[11px] font-medium transition-all text-center cursor-pointer border truncate",
                    selectedRole === role
                      ? "bg-white text-black border-white font-bold shadow-md"
                      : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Field 4: Security Preferences Toggles */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-semibold text-white">Auto-Disconnect High-Risk Scam Calls</div>
                <div className="text-[11px] text-zinc-400">Terminates audio stream when threat score reaches 80+</div>
              </div>
              <button
                type="button"
                onClick={() => setAutoBlockScams(!autoBlockScams)}
                className={cn(
                  "w-10 h-6 rounded-full transition-all duration-200 relative cursor-pointer border shrink-0",
                  autoBlockScams ? "bg-emerald-500 border-emerald-400" : "bg-white/10 border-white/15"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow",
                    autoBlockScams ? "left-5" : "left-0.5"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-semibold text-white">Emergency Guardian SMS Alerts</div>
                <div className="text-[11px] text-zinc-400">Instantly notify family contacts during extortion attempts</div>
              </div>
              <button
                type="button"
                onClick={() => setEnableSmsAlerts(!enableSmsAlerts)}
                className={cn(
                  "w-10 h-6 rounded-full transition-all duration-200 relative cursor-pointer border shrink-0",
                  enableSmsAlerts ? "bg-cyan-500 border-cyan-400" : "bg-white/10 border-white/15"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow",
                    enableSmsAlerts ? "left-5" : "left-0.5"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2.5">
            {!isMandatory && (
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all text-xs font-semibold cursor-pointer order-2 sm:order-1"
              >
                Set up later
              </button>
            )}

            <button
              type="submit"
              disabled={rawPhone.length !== 10 || saving}
              className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wide transition-all shadow-[0_4px_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying SS7 Carrier Route...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Link Mobile Number</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TelecomOnboardingModal;
