import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Fingerprint, 
  Copy, 
  Check, 
  Edit2, 
  Save, 
  Key, 
  LogOut, 
  Calendar, 
  Globe, 
  Bell, 
  Lock, 
  Sliders, 
  Sparkles,
  ExternalLink,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';


export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'preferences' | 'security'>('overview');
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  // Editable display name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable preferences
  const [autoBlock, setAutoBlock] = useState(user?.preferences?.autoBlockHighRisk ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.preferences?.smsAlerts ?? true);
  const [pushAlerts, setPushAlerts] = useState(user?.preferences?.pushAlerts ?? true);
  const [riskSensitivity, setRiskSensitivity] = useState<'STANDARD' | 'AGGRESSIVE' | 'RELAXED'>(
    user?.preferences?.riskSensitivity || 'STANDARD'
  );

  if (!isOpen || !user) return null;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(user.uid || 'usr_callix_dev');
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleCopyApiKey = () => {
    const mockKey = `cx_live_${(user.uid || 'dev').substring(0, 8)}_${Math.random().toString(36).substring(2, 10)}`;
    navigator.clipboard.writeText(mockKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      updateProfile({ displayName: editName.trim() });
      setIsEditingName(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          updateProfile({ photoURL: base64 });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePreferences = () => {
    updateProfile({
      preferences: {
        autoBlockHighRisk: autoBlock,
        smsAlerts: smsAlerts,
        pushAlerts: pushAlerts,
        audioRecordingOptIn: user.preferences?.audioRecordingOptIn ?? true,
        riskSensitivity: riskSensitivity,
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSignOut = async () => {
    onClose();
    await logout();
    navigate('/?auth=login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CX';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'August 2026';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Window (Apple macOS / iOS Liquid Sheet) */}
      <div className="relative w-full max-w-2xl liquid-modal-sheet rounded-3xl overflow-hidden z-10 text-[#EDEDED] animate-scale-in">
        
        {/* Top Cover Banner */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-indigo-950/40 border-b border-white/10 overflow-hidden p-4 sm:p-6 flex items-start justify-between">
          {/* Ambient Specular Highlights */}
          <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 bg-cyan-500/15 blur-3xl rounded-full" />
          <div className="pointer-events-none absolute -bottom-12 right-12 w-56 h-56 bg-indigo-500/15 blur-3xl rounded-full" />
          
          {/* macOS Traffic Lights + Status Badge */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-1">
              <button 
                onClick={onClose} 
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
                title="Close"
              />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-sm" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-300 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>ACTIVE SECURITY AGENT</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="relative z-10 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Close Profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 sm:px-8 -mt-12 sm:-mt-14 pb-4 border-b border-white/10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            {/* Avatar & Names */}
            <div className="flex items-end gap-4">
              <div className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-[#080B11] bg-zinc-900 border border-white/20 overflow-hidden shrink-0 shadow-2xl flex items-center justify-center text-xl font-bold text-white">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL.includes('googleusercontent.com') ? user.photoURL.replace(/=s\d+(-c)?$/, '=s256-c') : user.photoURL} 
                    alt={user.displayName} 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent text-2xl font-bold">
                    {getInitials(user.displayName)}
                  </span>
                )}
                {/* Active Indicator dot */}
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#080B11] rounded-full z-10 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />

                {/* Change photo hover button */}
                <label 
                  title="Change Profile Photo"
                  className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-medium gap-1 z-20"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span>Update</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarFileChange} 
                  />
                </label>
              </div>

              <div className="space-y-1 pb-1">
                {/* Display Name with inline editing */}
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="liquid-input rounded-xl px-3 py-1 text-sm font-semibold text-white outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                      title="Save Name"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="p-1.5 rounded-lg bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {user.displayName || 'Authorized Callix Agent'}
                    </h2>
                    <button
                      onClick={() => { setEditName(user.displayName || ''); setIsEditingName(true); }}
                      className="p-1 text-zinc-400 hover:text-white transition-colors rounded cursor-pointer"
                      title="Edit Display Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Email & Provider Badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                  <span>{user.email || 'developer@callix.ai'}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-zinc-300 shadow-sm">
                    {user.authProvider === 'google' ? (
                      <>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Google Account</span>
                      </>
                    ) : user.authProvider === 'github' ? (
                      <>
                        <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>GitHub Account</span>
                      </>
                    ) : (
                      <span>Direct Credential</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.plan || 'PRO SHIELD'}</span>
              </span>
            </div>

          </div>

          {/* Success Toast */}
          {saveSuccess && (
            <div className="mt-3 p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-mono shadow-sm">
              <Check className="w-3.5 h-3.5" />
              <span>Profile preferences updated successfully.</span>
            </div>
          )}
        </div>

        {/* Tab Selector (Apple iOS Segmented Control) */}
        <div className="px-6 sm:px-8 pt-4 pb-1">
          <div className="ios-segmented-bar p-1 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all cursor-pointer text-center",
                activeTab === 'overview'
                  ? "ios-segmented-active text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Account Overview
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={cn(
                "flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all cursor-pointer text-center",
                activeTab === 'preferences'
                  ? "ios-segmented-active text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Voice AI Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all cursor-pointer text-center",
                activeTab === 'security'
                  ? "ios-segmented-active text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              API Credentials & Keys
            </button>
          </div>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 sm:p-8 max-h-[58vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* UID Card */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-1.5 shadow-sm">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Account UID</span>
                    <button
                      onClick={handleCopyUid}
                      className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy UID"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-zinc-200 truncate select-all">
                    {user.uid}
                  </div>
                </div>

                {/* Role / Clearance Card */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-1.5 shadow-sm">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Security Clearance
                  </div>
                  <div className="text-xs font-medium text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lead Security Operator (L3)</span>
                  </div>
                </div>

                {/* Member Since Card */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-1.5 shadow-sm">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>Member Since</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-200">
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                {/* Server Region Card */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-1.5 shadow-sm">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>Edge Region</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>asia-south1 (Mumbai / Bengaluru)</span>
                  </div>
                </div>
              </div>

              {/* Connected Telephony Protection Status */}
              <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real-Time Voice Scam Shield</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                    ONLINE & PROTECTED
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your calls and streams are continuously analyzed by Claude 3.5 Sonnet XAI and Deepgram Nova-2 with sub-second diarization for instant threat neutralizations.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Sensitivity Selector */}
              <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-2.5 shadow-sm">
                <label className="block text-xs font-medium text-zinc-300">
                  Risk Sensitivity Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STANDARD', 'AGGRESSIVE', 'RELAXED'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setRiskSensitivity(level)}
                      className={cn(
                        "py-2 px-3 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border",
                        riskSensitivity === level
                          ? "bg-white text-black border-white font-bold shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                          : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500">
                  {riskSensitivity === 'AGGRESSIVE' && 'Alerts trigger at 60+ risk score. Recommended for vulnerable elder protection.'}
                  {riskSensitivity === 'STANDARD' && 'Alerts trigger at 75+ risk score. Balanced enterprise calibration.'}
                  {riskSensitivity === 'RELAXED' && 'Alerts trigger at 85+ risk score. Only flags definitive high-threat attacks.'}
                </p>
              </div>

              {/* iOS Frosted Sliding Switches */}
              <div className="space-y-2.5">
                {/* Auto Block */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs font-semibold text-white">Auto-Block High-Risk Scams</div>
                    <div className="text-[11px] text-zinc-400">Automatically disconnect calls when threat score hits 80+</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoBlock(!autoBlock)}
                    className={cn(
                      "w-12 h-6.5 rounded-full transition-all duration-300 relative cursor-pointer border shadow-inner shrink-0",
                      autoBlock 
                        ? "bg-emerald-500 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                        : "bg-white/10 border-white/15"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md",
                        autoBlock ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </div>

                {/* SMS Alerts */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs font-semibold text-white">SMS Emergency Dispatch</div>
                    <div className="text-[11px] text-zinc-400">Send emergency SMS alerts to designated family guardians</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={cn(
                      "w-12 h-6.5 rounded-full transition-all duration-300 relative cursor-pointer border shadow-inner shrink-0",
                      smsAlerts 
                        ? "bg-cyan-500 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                        : "bg-white/10 border-white/15"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md",
                        smsAlerts ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </div>

                {/* Push Alerts */}
                <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs font-semibold text-white">Browser Push Notifications</div>
                    <div className="text-[11px] text-zinc-400">Instant audio scanner and deepfake warning toasts</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushAlerts(!pushAlerts)}
                    className={cn(
                      "w-12 h-6.5 rounded-full transition-all duration-300 relative cursor-pointer border shadow-inner shrink-0",
                      pushAlerts 
                        ? "bg-cyan-500 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                        : "bg-white/10 border-white/15"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md",
                        pushAlerts ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Save Preferences Button */}
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-[0_4px_16px_rgba(6,182,212,0.3)] cursor-pointer active:scale-98"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* TAB 3: API KEYS */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Telephony API Key</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    Production
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="cx_live_98a7b6c5d4e3f210a9b8c7d6e5"
                    className="w-full liquid-input rounded-xl px-3 py-2 text-xs font-mono text-zinc-300"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedApiKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedApiKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Use this key in Authorization headers for carrier SIP trunk webhooks and real-time audio socket streams.
                </p>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card-sm border border-white/10 space-y-2 text-xs shadow-sm">
                <div className="font-semibold text-white">SDK Quickstart</div>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-300 overflow-x-auto shadow-inner">
{`curl -X POST https://api.callix.ai/v1/telecom/stream \\
  -H "Authorization: Bearer cx_live_..." \\
  -H "Content-Type: audio/x-raw"`}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions Bar */}
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 flex items-center justify-between backdrop-blur-md">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="ios-frosted-btn px-5 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;

