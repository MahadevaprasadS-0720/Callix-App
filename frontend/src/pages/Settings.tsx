import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserProfileModal } from '../components/profile/UserProfileModal';
import { 
  ArrowLeft, 
  Search, 
  Camera, 
  Settings as SettingsIcon, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Crown, 
  Lock, 
  ShieldAlert, 
  Watch, 
  Info, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  X, 
  Volume2, 
  Globe, 
  Sliders, 
  ShieldCheck, 
  Trash2, 
  Save, 
  RotateCcw, 
  Zap, 
  Activity, 
  Bell, 
  Cpu, 
  PhoneCall, 
  FileText 
} from 'lucide-react';
import { cn } from '../utils/cn';

interface BlockRule {
  id: string;
  number: string;
  label: string;
  reason: string;
  dateAdded: string;
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active category in desktop master-detail layout (default to 'general')
  const [activeSection, setActiveSection] = useState<string>('general');

  // Profile modal trigger
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // 1. GENERAL SETTINGS
  const [language, setLanguage] = useState<'English' | 'Kannada' | 'Hindi' | 'Tamil'>('English');
  const [autoStart, setAutoStart] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [pollingRate, setPollingRate] = useState<'1s' | '5s' | 'manual'>('1s');

  // 2. CALLS & AUDIO SHIELD
  const [threatCutoff, setThreatCutoff] = useState(75);
  const [autoHangup, setAutoHangup] = useState(true);
  const [evidenceRecord, setEvidenceRecord] = useState(true);
  const [callerIdPopup, setCallerIdPopup] = useState(true);
  const [diarizationEngine, setDiarizationEngine] = useState<'nova-2' | 'whisper'>('nova-2');

  // 3. MESSAGING & OTP GUARD
  const [smsPhishingFilter, setSmsPhishingFilter] = useState(true);
  const [inCallOtpMasking, setInCallOtpMasking] = useState(true);
  const [quarantineApkLinks, setQuarantineApkLinks] = useState(true);

  // 4. AI ASSISTANT & HEURISTICS
  const [aiWhisperMode, setAiWhisperMode] = useState<'hud' | 'audio' | 'both'>('hud');
  const [deepfakeSensitivity, setDeepfakeSensitivity] = useState<'STANDARD' | 'AGGRESSIVE' | 'STRICT'>('STANDARD');
  const [patternDigitalArrest, setPatternDigitalArrest] = useState(true);
  const [patternOtpDemands, setPatternOtpDemands] = useState(true);
  const [patternKycNotice, setPatternKycNotice] = useState(true);
  const [patternUpiReversal, setPatternUpiReversal] = useState(true);

  // 5. PRIVACY & DPDPA
  const [piiMasking, setPiiMasking] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [dpdpaConsent, setDpdpaConsent] = useState(true);

  // 6. BLOCKLIST
  const [blockKnownSpamPool, setBlockKnownSpamPool] = useState(true);
  const [blockPrivateNumbers, setBlockPrivateNumbers] = useState(true);
  const [blockForeignVoip, setBlockForeignVoip] = useState(true);
  const [blockedNumbers, setBlockedNumbers] = useState<BlockRule[]>([
    { id: 'b1', number: '+91 98201 44102', label: 'Fake MSEDCL Officer', reason: 'Power Disconnection Scam', dateAdded: 'Yesterday' },
    { id: 'b2', number: '+91 80492 77190', label: 'Mumbai Police Impersonator', reason: 'Digital Arrest Threat', dateAdded: '3 days ago' },
    { id: 'b3', number: '+91 79261 99234', label: 'Fastag Toll Overdue Bot', reason: 'Phishing Highway APK Link', dateAdded: 'Last week' },
  ]);
  const [newRuleNumber, setNewRuleNumber] = useState('');
  const [newRuleLabel, setNewRuleLabel] = useState('');
  const [newRuleReason, setNewRuleReason] = useState('');

  // 7. WEAR OS
  const [wristThreatHaptics, setWristThreatHaptics] = useState(true);
  const [sosWristTap, setSosWristTap] = useState(true);

  const handleAddBlockedNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleNumber.trim()) return;
    const rule: BlockRule = {
      id: 'b_' + Date.now(),
      number: newRuleNumber.trim(),
      label: newRuleLabel.trim() || 'Suspected Scammer',
      reason: newRuleReason.trim() || 'Manual user block',
      dateAdded: 'Just now'
    };
    setBlockedNumbers([rule, ...blockedNumbers]);
    setNewRuleNumber('');
    setNewRuleLabel('');
    setNewRuleReason('');
    showToast(`Added ${rule.number} to Blocklist`);
  };

  const handleRemoveBlockedNumber = (id: string) => {
    setBlockedNumbers(blockedNumbers.filter(b => b.id !== id));
    showToast('Number removed from Blocklist');
  };

  const settingsMenuItems = [
    { id: 'general', title: 'General', icon: <SettingsIcon className="w-5 h-5 text-cyan-400" />, desc: 'Language, sound alerts, startup daemon' },
    { id: 'calls', title: 'Calls & Audio Shield', icon: <Phone className="w-5 h-5 text-emerald-400" />, desc: 'Threat auto-drop, live diarization, evidence recording' },
    { id: 'messaging', title: 'Messaging & OTP Guard', icon: <MessageSquare className="w-5 h-5 text-blue-400" />, desc: 'SMS phishing filter, in-call OTP shielding' },
    { id: 'assistant', title: 'AI Whisper & Heuristics', icon: <Sparkles className="w-5 h-5 text-purple-400" />, desc: 'AI coaching, deepfake sensitivity, scam patterns' },
    { id: 'block', title: 'Block & Spam Filter', icon: <ShieldAlert className="w-5 h-5 text-red-400" />, desc: '1.2M+ India spam pool, hidden caller IDs, custom rules' },
    { id: 'privacy', title: 'Privacy & DPDPA Center', icon: <Lock className="w-5 h-5 text-amber-400" />, desc: 'PII masking, biometric unlock, DPDPA 2023 compliance' },
    { id: 'premium', title: 'Callix Pro Enterprise', icon: <Crown className="w-5 h-5 text-amber-400" />, desc: 'Enterprise Sentinel clearances & unlimited lookups' },
    { id: 'wear-os', title: 'Wear OS & Smartwatch', icon: <Watch className="w-5 h-5 text-teal-400" />, desc: 'Wrist threat vibration, Emergency SOS guardian tap' },
    { id: 'about', title: 'About Callix Systems', icon: <Info className="w-5 h-5 text-zinc-300" />, desc: 'Version Callix v2.4.0 Live Enterprise, telemetry' },
    { id: 'help', title: 'Help & Incident Desk', icon: <HelpCircle className="w-5 h-5 text-sky-400" />, desc: 'FAQ, report false positives, 1930 Cyber helpline' },
  ];

  const filteredItems = settingsMenuItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] pb-12 font-sans select-none animate-fade-in">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center gap-2 animate-fade-in backdrop-blur-xl">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Professional Header Bar */}
      <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-white">Callix Security Settings</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                PRO SENTINEL
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure dual-engine scam interception, deepfake thresholds, caller blocklists, and privacy controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              showToast('Settings saved to local encrypted vault');
            }}
            className="px-5 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_4px_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Full-Width Laptop / Desktop Master-Detail Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: User Profile Card & Navigation Rail (lg:col-span-4)          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          
          {/* User Profile Card (Interactive, opens UserProfileModal) */}
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full rounded-3xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.07] hover:border-cyan-400/40 p-4.5 backdrop-blur-2xl transition-all cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center justify-between group active:scale-[0.99]"
            title="Click to view & manage profile credentials"
          >
            <div className="flex items-center gap-3.5">
              {/* Circular Avatar with Meter */}
              <div className="relative w-13 h-13 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-13 h-13 -rotate-90 transform absolute inset-0" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="transparent" />
                  <circle cx="28" cy="28" r="24" stroke="#007AFF" strokeWidth="2.5" strokeDasharray={150} strokeDashoffset={40} strokeLinecap="round" fill="transparent" />
                </svg>

                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-950/40 border border-blue-500/30">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="relative">
                      <Camera className="w-4.5 h-4.5 text-[#007AFF]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Subtitle */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {user?.displayName || 'Mahi S'}
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-xs text-cyan-400 font-medium group-hover:underline">
                  Manage your profile &amp; credentials
                </span>
              </div>
            </div>

            {/* Notification Badge */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#007AFF] text-white text-xs font-bold flex items-center justify-center shadow-md">
                12
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Search Box */}
          <div className="relative rounded-2xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 flex items-center backdrop-blur-xl">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category or setting..."
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Vertical Category Navigation Rail */}
          <div className="rounded-3xl border border-white/12 bg-neutral-900/60 backdrop-blur-2xl overflow-hidden divide-y divide-white/[0.06] shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            {filteredItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer group active:scale-[0.99]",
                    isActive 
                      ? "bg-cyan-500/15 border-l-4 border-cyan-400 shadow-inner" 
                      : "hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={cn(
                      "shrink-0 p-2 rounded-xl transition-all",
                      isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/[0.04] text-zinc-400 group-hover:text-white"
                    )}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={cn(
                        "font-semibold text-xs transition-colors truncate",
                        isActive ? "text-cyan-300 font-bold" : "text-zinc-200 group-hover:text-white"
                      )}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={cn(
                    "w-4 h-4 shrink-0 transition-all",
                    isActive ? "text-cyan-400 translate-x-1" : "text-zinc-600 group-hover:text-zinc-300"
                  )} />
                </button>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Active Section Detailed Settings (lg:col-span-8)            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-5">
          
          {/* Active Section Banner */}
          <div className="rounded-3xl border border-white/12 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/90 p-6 backdrop-blur-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                {settingsMenuItems.find(s => s.id === activeSection)?.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {settingsMenuItems.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {settingsMenuItems.find(s => s.id === activeSection)?.desc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Configuration synchronized')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-200 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* 1. GENERAL SECTION */}
          {activeSection === 'general' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Language &amp; Environment</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Choose speech recognition transcript dialect and system locale.</p>
              </div>

              <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Interface &amp; Voice Interception Language
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['English', 'Kannada', 'Hindi', 'Tamil'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        showToast(`Language set to ${lang}`);
                      }}
                      className={cn(
                        "py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer shadow-sm",
                        language === lang
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="font-semibold">{lang === 'Kannada' ? 'ಕನ್ನಡ' : lang === 'Hindi' ? 'हिंदी' : lang === 'Tamil' ? 'தமிழ்' : 'English'}</div>
                      <div className="text-[10px] text-zinc-500">{lang}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Auto-Start on Boot</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Keep scam defense listening in background</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoStart(!autoStart)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", autoStart ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", autoStart ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Acoustic Threat Chime</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Plays audio warning chime on risk spikes</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundAlerts(!soundAlerts)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", soundAlerts ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", soundAlerts ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-time Telemetry Polling Rate</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Latency interval for live audio guardian threat updates</div>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  {(['1s', '5s', 'manual'] as const).map(rate => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPollingRate(rate)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer",
                        pollingRate === rate ? "bg-cyan-500 text-black font-bold" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. CALLS SECTION */}
          {activeSection === 'calls' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Screening &amp; Auto-Interception</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Threshold policies, automated disconnect, and phoneme stream diarization.</p>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Auto-Disconnect Threat Threshold</div>
                    <div className="text-[11px] text-zinc-400">Instantly terminates incoming call stream if risk score exceeds this level</div>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 shadow-sm">
                    {threatCutoff}/100 Risk
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={threatCutoff}
                  onChange={(e) => setThreatCutoff(Number(e.target.value))}
                  className="w-full accent-red-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>30 (Strict Security)</span>
                  <span>75 (Recommended)</span>
                  <span>95 (Permissive)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Emergency Auto-Hangup</div>
                    <div className="text-[11px] text-zinc-400">Protects elderly users by severing call on high risk</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoHangup(!autoHangup)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", autoHangup ? "bg-red-500 border-red-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", autoHangup ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Legal Audio Evidence Recording</div>
                    <div className="text-[11px] text-zinc-400">Retains encrypted audio for police 1930 dispatch</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEvidenceRecord(!evidenceRecord)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", evidenceRecord ? "bg-emerald-500 border-emerald-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", evidenceRecord ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Speech Diarization Engine</div>
                  <div className="text-[11px] text-zinc-400">Separates Caller vs Receiver audio channels in real-time</div>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setDiarizationEngine('nova-2')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer",
                      diarizationEngine === 'nova-2' ? "bg-cyan-500 text-black font-bold" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    Deepgram Nova-2
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiarizationEngine('whisper')}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer",
                      diarizationEngine === 'whisper' ? "bg-cyan-500 text-black font-bold" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    OpenAI Whisper
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. MESSAGING SECTION */}
          {activeSection === 'messaging' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>SMS Phishing &amp; OTP Shield</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time heuristics for incoming SMS, APK download links, and banking OTPs.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Deep SMS Phishing Heuristics</div>
                    <div className="text-[11px] text-zinc-400">Analyzes urgent banking SMS links, lottery claims, and fake electricity disconnection threats</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsPhishingFilter(!smsPhishingFilter)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", smsPhishingFilter ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", smsPhishingFilter ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">In-Call Active OTP Screen Masking</div>
                    <div className="text-[11px] text-zinc-400">Prevents caller from coaxing you into reading 4-digit / 6-digit banking codes out loud</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInCallOtpMasking(!inCallOtpMasking)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", inCallOtpMasking ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", inCallOtpMasking ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Suspicious APK &amp; Web Link Quarantine</div>
                    <div className="text-[11px] text-zinc-400">Automatically disarms sideload links received via WhatsApp, Telegram, or SMS</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuarantineApkLinks(!quarantineApkLinks)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", quarantineApkLinks ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", quarantineApkLinks ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. ASSISTANT SECTION */}
          {activeSection === 'assistant' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Whisper Guardian &amp; Deepfake Engine</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time LLM coaching and acoustic synthetic voice biometrics.</p>
              </div>

              <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="text-xs font-bold text-white">Deepfake Voice Biometric Sensitivity</div>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['STANDARD', 'AGGRESSIVE', 'STRICT'] as const).map(sens => (
                    <button
                      key={sens}
                      type="button"
                      onClick={() => setDeepfakeSensitivity(sens)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-mono border text-center transition-all cursor-pointer",
                        deepfakeSensitivity === sens
                          ? "bg-purple-500/20 border-purple-400 text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                          : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white"
                      )}
                    >
                      {sens}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="text-xs font-bold text-white">Indian Cybercrime Heuristic Scanners</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Digital Arrest / Fake Police', state: patternDigitalArrest, set: setPatternDigitalArrest },
                    { label: 'Urgent OTP Demands', state: patternOtpDemands, set: setPatternOtpDemands },
                    { label: 'Bank KYC Expiry Threats', state: patternKycNotice, set: setPatternKycNotice },
                    { label: 'Accidental UPI Refund Scam', state: patternUpiReversal, set: setPatternUpiReversal },
                  ].map((pat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => pat.set(!pat.state)}
                      className={cn(
                        "p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer",
                        pat.state ? "bg-white/[0.05] border-cyan-500/30 text-white" : "bg-neutral-900 border-white/5 text-zinc-500"
                      )}
                    >
                      <span className="text-xs font-medium">{pat.label}</span>
                      <Check className={cn("w-4 h-4", pat.state ? "text-cyan-400" : "text-transparent")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. BLOCKLIST SECTION */}
          {activeSection === 'block' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Blocklist &amp; Call Shielding Engine</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Manage custom blocked phone numbers and automated spam pool rules.</p>
              </div>

              {/* Quick Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="text-xs font-bold text-white">Block 1.2M+ Spam Pool</div>
                  <button
                    type="button"
                    onClick={() => setBlockKnownSpamPool(!blockKnownSpamPool)}
                    className={cn("w-9 h-5 rounded-full transition-all relative border shrink-0 cursor-pointer", blockKnownSpamPool ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md", blockKnownSpamPool ? "left-4.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="text-xs font-bold text-white">Block Private Numbers</div>
                  <button
                    type="button"
                    onClick={() => setBlockPrivateNumbers(!blockPrivateNumbers)}
                    className={cn("w-9 h-5 rounded-full transition-all relative border shrink-0 cursor-pointer", blockPrivateNumbers ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md", blockPrivateNumbers ? "left-4.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="text-xs font-bold text-white">Block Spoofed VoIP</div>
                  <button
                    type="button"
                    onClick={() => setBlockForeignVoip(!blockForeignVoip)}
                    className={cn("w-9 h-5 rounded-full transition-all relative border shrink-0 cursor-pointer", blockForeignVoip ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md", blockForeignVoip ? "left-4.5" : "left-0.5")} />
                  </button>
                </div>
              </div>

              {/* Add Custom Number Form */}
              <form onSubmit={handleAddBlockedNumber} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="text-xs font-bold text-white">Add Custom Phone Number to Blocklist</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={newRuleNumber}
                    onChange={(e) => setNewRuleNumber(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Courier Scammer)"
                    value={newRuleLabel}
                    onChange={(e) => setNewRuleLabel(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Reason (e.g. Phishing link)"
                    value={newRuleReason}
                    onChange={(e) => setNewRuleReason(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Add to Blocklist
                  </button>
                </div>
              </form>

              {/* Blocked Numbers Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-300">Active Custom Blocked Rules ({blockedNumbers.length})</div>
                <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                  {blockedNumbers.map((b) => (
                    <div key={b.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{b.number}</span>
                          <span className="text-xs text-zinc-300">· {b.label}</span>
                        </div>
                        <div className="text-[11px] text-red-400 mt-0.5">
                          {b.reason} <span className="text-zinc-600">·</span> <span className="text-zinc-500 font-mono text-[10px]">{b.dateAdded}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlockedNumber(b.id)}
                        className="p-2 rounded-xl hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Unblock number"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. PRIVACY CENTER */}
          {activeSection === 'privacy' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Privacy &amp; DPDPA Compliance Center</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Compliant with the Digital Personal Data Protection Act (DPDPA 2023).</p>
              </div>

              <div className="space-y-4">
                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Autonomous PII Masking</div>
                    <div className="text-[11px] text-zinc-400">Redacts Aadhaar, PAN card, Credit Card, and bank account numbers from transcripts</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPiiMasking(!piiMasking)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", piiMasking ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", piiMasking ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Biometric Unlock for Call Recordings</div>
                    <div className="text-[11px] text-zinc-400">Requires Windows Hello / Fingerprint sensor to export evidence audio</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBiometricLock(!biometricLock)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", biometricLock ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", biometricLock ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">DPDPA 2023 User Data Consent</div>
                    <div className="text-[11px] text-zinc-400">Audio phonemes are analyzed locally and never stored on public 3rd party servers</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDpdpaConsent(!dpdpaConsent)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", dpdpaConsent ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", dpdpaConsent ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. PREMIUM SECTION */}
          {activeSection === 'premium' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-neutral-900 to-amber-500/5 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="font-black text-sm text-white uppercase tracking-wider">Callix Pro Sentinel</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">Enterprise license active with real-time Deepgram Nova-2 dual-channel streaming.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs text-zinc-400">Number Lookups</div>
                  <div className="text-lg font-black text-white mt-1">Unlimited</div>
                  <div className="text-[10px] text-emerald-400">Federated API Live</div>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs text-zinc-400">Deepfake Scans</div>
                  <div className="text-lg font-black text-white mt-1">Real-Time</div>
                  <div className="text-[10px] text-cyan-400">Dual-Channel Engine</div>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="text-xs text-zinc-400">Police 1930 Integration</div>
                  <div className="text-lg font-black text-white mt-1">Automated</div>
                  <div className="text-[10px] text-amber-400">Encrypted Dossier</div>
                </div>
              </div>
            </div>
          )}

          {/* 8. WEAR OS SECTION */}
          {activeSection === 'wear-os' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Watch className="w-4 h-4 text-teal-400" />
                  <span>Wear OS &amp; Smartwatch Synchronization</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time wrist haptics and silent scam emergency tap.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Smartwatch Threat Haptic Vibration</div>
                    <div className="text-[11px] text-zinc-400">Double-pulse wrist vibration triggered when synthetic deepfake audio is detected</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWristThreatHaptics(!wristThreatHaptics)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", wristThreatHaptics ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", wristThreatHaptics ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">One-Tap Emergency SOS Guardian Dispatch</div>
                    <div className="text-[11px] text-zinc-400">Allows elderly family members to press watch dial to immediately alert guardians</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSosWristTap(!sosWristTap)}
                    className={cn("w-11 h-6 rounded-full transition-all relative border shrink-0 cursor-pointer", sosWristTap ? "bg-cyan-500 border-cyan-400" : "bg-neutral-800 border-white/10")}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md", sosWristTap ? "left-5.5" : "left-0.5")} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. ABOUT SECTION */}
          {activeSection === 'about' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-5 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white">About Callix Voice AI Security</h3>
                  <div className="text-xs font-mono text-cyan-400 mt-0.5">Version v2.4.0 (Enterprise Live)</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  PRODUCTION READY
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Callix is an advanced multimodal scam defense and deepfake audio interception system. Designed for high-volume enterprise telecom routing and personal device security, Callix inspects incoming audio streams in real-time using Deepgram Nova-2 diarization and Claude 3.5 Sonnet NLP inference models.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[10px] text-zinc-500 uppercase">Detection Engine</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">Deepgram Nova-2</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[10px] text-zinc-500 uppercase">NLP Heuristics</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">Claude 3.5 Sonnet</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[10px] text-zinc-500 uppercase">Compliance</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">DPDPA 2023</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[10px] text-zinc-500 uppercase">Helpline Sync</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">1930 Cybercrime</div>
                </div>
              </div>
              <div className="text-[11px] text-zinc-500 pt-3 border-t border-white/10">
                &copy; 2026 Callix AI Systems Inc. All rights reserved.
              </div>
            </div>
          )}

          {/* 10. HELP SECTION */}
          {activeSection === 'help' && (
            <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>Help &amp; Incident Dispatch Desk</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">24/7 technical assistance, false positive reporting, and emergency reporting.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="text-xs font-bold text-white">National Cyber Crime Helpline</div>
                  <p className="text-[11px] text-zinc-400">
                    If you have been targeted by financial fraud or digital arrest:
                  </p>
                  <div className="text-lg font-mono font-black text-red-400 pt-1">
                    Dial 1930
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="text-xs font-bold text-white">Direct Technical Support</div>
                  <p className="text-[11px] text-zinc-400">
                    Report false positive number reputation or API questions:
                  </p>
                  <a href="mailto:support@callix.ai" className="inline-block text-xs font-semibold text-cyan-400 hover:underline pt-1">
                    support@callix.ai
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* User Profile Modal when user taps "Manage your profile" */}
      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

    </div>
  );
};

export default Settings;
