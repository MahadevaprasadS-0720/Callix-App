import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft,
  X, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Check, 
  Edit2, 
  Save, 
  Key, 
  LogOut, 
  Calendar, 
  Globe, 
  Camera, 
  Phone,
  ChevronDown,
  Building,
  Briefcase,
  MapPin,
  Sparkles,
  Shield,
  Copy,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { TelecomOnboardingModal } from './TelecomOnboardingModal';
import { userDirectoryService } from '../../services/userDirectoryService';
import { isHrAdminUser } from '../../utils/adminPermissions';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Mode: 'truecaller' (primary profile view) or 'security' (Callix voice shield & API credentials)
  const [activeMode, setActiveMode] = useState<'truecaller' | 'security'>('truecaller');

  const [isTelecomOpen, setIsTelecomOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [googleFillSuccess, setGoogleFillSuccess] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State initialized strictly with real user data or empty strings (NO hardcoded fake defaults)
  const [firstName, setFirstName] = useState(
    user?.firstName || 
    (user?.displayName && !user.displayName.includes('@') && user.displayName !== 'User' && user.displayName !== 'Callix User' ? user.displayName.split(' ')[0] : '') || 
    ''
  );
  const [lastName, setLastName] = useState(
    user?.lastName || 
    (user?.displayName && !user.displayName.includes('@') && user.displayName !== 'User' && user.displayName !== 'Callix User' ? user.displayName.split(' ').slice(1).join(' ') : '') || 
    ''
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber && user.phoneNumber !== '+917975583509' ? user.phoneNumber : ''
  );
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState(user?.secondaryPhoneNumber || '');
  const [gender, setGender] = useState(
    user?.gender && !(user.gender === 'Male' && !user.street) ? user.gender : ''
  );
  const [birthDate, setBirthDate] = useState(
    user?.birthDate && user.birthDate !== '07/08/2006' ? user.birthDate : ''
  );
  
  // Address Fields
  const [street, setStreet] = useState(user?.street || '');
  const [city, setCity] = useState(
    user?.city && user.city !== 'Mysore' ? user.city : ''
  );
  const [zipCode, setZipCode] = useState(user?.zipCode || '');
  const [country, setCountry] = useState(
    user?.country && !(user.country === 'India' && !user.street) ? user.country : ''
  );

  // About Fields
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
  const [email, setEmail] = useState(user?.email || '');
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

  // Callix Security Preferences
  const [autoBlock, setAutoBlock] = useState(user?.preferences?.autoBlockHighRisk ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.preferences?.smsAlerts ?? true);
  const [pushAlerts, setPushAlerts] = useState(user?.preferences?.pushAlerts ?? true);
  const [riskSensitivity, setRiskSensitivity] = useState<'STANDARD' | 'AGGRESSIVE' | 'RELAXED'>(
    user?.preferences?.riskSensitivity || 'STANDARD'
  );

  // Track focused field for floating notch effect
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Sync state if user object updates
  useEffect(() => {
    if (user) {
      if (user.firstName) {
        setFirstName(user.firstName);
      } else if (user.displayName && !user.displayName.includes('@') && user.displayName !== 'User' && user.displayName !== 'Callix User') {
        setFirstName(user.displayName.split(' ')[0] || '');
      }
      
      if (user.lastName) {
        setLastName(user.lastName);
      } else if (user.displayName && !user.displayName.includes('@') && user.displayName !== 'User' && user.displayName !== 'Callix User') {
        setLastName(user.displayName.split(' ').slice(1).join(' ') || '');
      }

      if (user.phoneNumber && user.phoneNumber !== '+917975583509') {
        setPhoneNumber(user.phoneNumber);
      }
      if (user.secondaryPhoneNumber !== undefined) {
        setSecondaryPhoneNumber(user.secondaryPhoneNumber);
      }
      if (user.gender && !(user.gender === 'Male' && !user.street)) {
        setGender(user.gender);
      }
      if (user.birthDate && user.birthDate !== '07/08/2006') {
        setBirthDate(user.birthDate);
      }
      if (user.street !== undefined) setStreet(user.street);
      if (user.city && user.city !== 'Mysore') setCity(user.city);
      if (user.zipCode !== undefined) setZipCode(user.zipCode);
      if (user.country && !(user.country === 'India' && !user.street)) setCountry(user.country);
      if (user.companyName !== undefined) setCompanyName(user.companyName);
      if (user.jobTitle !== undefined) setJobTitle(user.jobTitle);
      if (user.aboutMe !== undefined) setAboutMe(user.aboutMe);
      if (user.email) setEmail(user.email);
      if (user.websiteUrl !== undefined) setWebsiteUrl(user.websiteUrl);
      if (user.photoURL) setPhotoURL(user.photoURL);
    }
  }, [user]);

  // Compute profile completion percentage dynamically (0% to 100% based on what is actually filled)
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (firstName.trim()) score += 10;
    if (lastName.trim()) score += 10;
    if (phoneNumber.trim()) score += 10;
    if (gender.trim()) score += 10;
    if (birthDate.trim()) score += 10;
    if (city.trim()) score += 10;
    if (country.trim()) score += 10;
    if (email.trim()) score += 10;
    if (photoURL.trim()) score += 10;
    if (
      companyName.trim() || 
      jobTitle.trim() || 
      aboutMe.trim() || 
      websiteUrl.trim() || 
      street.trim() || 
      zipCode.trim() || 
      secondaryPhoneNumber.trim()
    ) {
      score += 10;
    }
    return Math.min(100, score);
  }, [
    firstName, lastName, phoneNumber, gender, birthDate, 
    city, country, email, photoURL, companyName, jobTitle, 
    aboutMe, websiteUrl, street, zipCode, secondaryPhoneNumber
  ]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = () => {
    const fullDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim() || user.displayName || 'Callix User';
    updateProfile({
      displayName: fullDisplayName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      secondaryPhoneNumber: secondaryPhoneNumber.trim(),
      gender,
      birthDate: birthDate.trim(),
      street: street.trim(),
      city: city.trim(),
      zipCode: zipCode.trim(),
      country: country.trim(),
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      aboutMe: aboutMe.trim(),
      email: email.trim(),
      websiteUrl: websiteUrl.trim(),
      photoURL,
      profileCompletion,
      preferences: {
        autoBlockHighRisk: autoBlock,
        smsAlerts: smsAlerts,
        pushAlerts: pushAlerts,
        audioRecordingOptIn: user.preferences?.audioRecordingOptIn ?? true,
        riskSensitivity,
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    if (phoneNumber.trim()) {
      userDirectoryService.syncUserProfile({
        phoneNumber: phoneNumber.trim(),
        fullName: fullDisplayName,
        email: email.trim() || undefined,
        isVerified: true,
        reputationScore: 100,
      }).catch((e) => console.info('User directory profile save note:', e));
    }
  };

  const handleFillWithGoogle = async () => {
    try {
      if (user.authProvider === 'google' && user.displayName) {
        const parts = user.displayName.split(' ');
        setFirstName(parts[0] || firstName);
        setLastName(parts.slice(1).join(' ') || lastName);
        if (user.email) setEmail(user.email);
        if (user.photoURL) setPhotoURL(user.photoURL);
        setGoogleFillSuccess(true);
        setTimeout(() => setGoogleFillSuccess(false), 2500);
      } else {
        await loginWithGoogle();
        setGoogleFillSuccess(true);
        setTimeout(() => setGoogleFillSuccess(false), 2500);
      }
    } catch (err) {
      console.warn('Google auto-fill note:', err);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setPhotoURL(base64);
          updateProfile({ photoURL: base64 });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    onClose();
    await logout();
    navigate('/?auth=login');
  };

  const handleCopyApiKey = () => {
    const mockKey = `cx_live_${(user.uid || 'dev').substring(0, 8)}_${Math.random().toString(36).substring(2, 10)}`;
    navigator.clipboard.writeText(mockKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  // Circular progress calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

  const currentDisplayName = `${firstName} ${lastName}`.trim() || user.displayName || 'Callix User';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 font-sans animate-fade-in select-none">
      {/* Dark Liquid Glass Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Main Container: Callix Dark Liquid Glass Modal Frame */}
      <div 
        className="relative w-full sm:max-w-[480px] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col z-10 overflow-hidden border border-white/15 bg-neutral-950/90 sm:bg-neutral-950/85 backdrop-blur-3xl text-white transition-all duration-200"
      >
        {/* Subtle Top Glint Accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

        {/* Sticky Liquid Glass Header Bar */}
        <div 
          className="sticky top-0 z-20 px-5 py-4 flex items-center justify-between border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl"
        >
          {/* Back Arrow & User Display Name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Close Profile"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col truncate max-w-[200px]">
              <span className="font-semibold text-sm tracking-tight text-white truncate">
                {activeMode === 'truecaller' ? currentDisplayName : 'Security & AI Voice Shield'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80">
                {user.plan || 'PRO SHIELD'}
              </span>
            </div>
          </div>

          {/* Right Action Controls: Mode Switcher & Quick Save */}
          <div className="flex items-center gap-2">
            {/* View Switcher: Profile vs Callix Security */}
            <button
              type="button"
              onClick={() => setActiveMode(prev => prev === 'truecaller' ? 'security' : 'truecaller')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer",
                activeMode === 'security'
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-white/[0.06] text-zinc-300 border-white/15 hover:bg-white/10 hover:text-white"
              )}
              title="Switch between Profile Info & Voice Shield"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeMode === 'truecaller' ? 'Shield' : 'Profile'}</span>
            </button>

            {/* Quick Save Checkmark Button */}
            <button
              type="button"
              onClick={handleSaveProfile}
              className="p-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-[0_0_14px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95"
              title="Save Profile"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Save & Autofill Notifications */}
        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in backdrop-blur-md">
            <Check className="w-3.5 h-3.5" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        {googleFillSuccess && (
          <div className="px-4 py-2 bg-cyan-500/15 border-b border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filled from Google Account details!</span>
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">

          {/* HR SuperAdmin Exclusive Clearance Card */}
          {isHrAdminUser(user) && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-950/30 to-amber-500/10 border border-amber-500/35 shadow-[0_0_20px_rgba(245,158,11,0.18)] flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Chief HR Officer & SuperAdmin</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">● Active</span>
                  </div>
                  <div className="text-[10px] text-amber-300 font-mono">
                    Clearance Level 5: People Operations & SecOps Core
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/hr-admin');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                Open HR Portal
              </button>
            </div>
          )}

          {activeMode === 'truecaller' ? (
            <>
              {/* Profile Avatar with Circular Meter (Strict Circle, No Box Outline) */}
              <div className="flex flex-col items-center justify-center pt-2 pb-1">
                <div 
                  className="relative cursor-pointer group rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to upload profile photo"
                >
                  {/* SVG Circular Progress Meter */}
                  <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 110 110">
                    {/* Background Ring Track */}
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    {/* Active Cyan Glow Arc */}
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      stroke="#06B6D4"
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Inner Circular Avatar */}
                  <div className="absolute inset-0 m-auto w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-neutral-900 shadow-inner">
                    {photoURL ? (
                      <img 
                        src={photoURL.includes('googleusercontent.com') ? photoURL.replace(/=s\d+(-c)?$/, '=s256-c') : photoURL}
                        alt={currentDisplayName}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative bg-cyan-950/30 group-hover:bg-cyan-950/50 transition-colors">
                        <div className="relative">
                          <Camera className="w-8 h-8 text-cyan-400" strokeWidth={1.8} />
                          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[11px] font-bold shadow-xs">
                            +
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Hover Change Photo Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold tracking-wider uppercase">
                      <span>Change</span>
                    </div>
                  </div>

                  {/* Dynamic Completion Percentage Pill Badge */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-neutral-950/90 backdrop-blur-md shadow-[0_0_10px_rgba(6,182,212,0.3)] text-xs font-mono font-bold text-cyan-400 select-none">
                    {profileCompletion}%
                  </div>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleAvatarFileChange} 
                  />
                </div>
              </div>

              {/* Fill In With Google Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFillWithGoogle}
                  className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] transition-all cursor-pointer group"
                >
                  <div className="absolute left-4 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <span className="font-medium tracking-wide text-zinc-100 group-hover:text-white">
                    Fill in with Google
                  </span>
                </button>
              </div>

              {/* Form Fields: Dark Liquid Glass Outlined Notch Style */}
              <div className="space-y-4 pt-1">
                
                {/* First Name */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(firstName || focusedField === 'firstName') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      First Name
                    </label>
                  )}
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!firstName && focusedField !== 'firstName' ? 'First Name' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Last Name */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(lastName || focusedField === 'lastName') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Last Name
                    </label>
                  )}
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!lastName && focusedField !== 'lastName' ? 'Last Name' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Primary Phone Number with Telecom Verification Pencil */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(phoneNumber || focusedField === 'phoneNumber') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Primary Phone Number
                    </label>
                  )}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!phoneNumber && focusedField !== 'phoneNumber' ? 'Primary Phone Number (e.g. +91 98765 43210)' : ''}
                    className="w-full px-4 py-3 pr-11 bg-transparent rounded-xl text-sm font-medium outline-none font-mono text-white placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsTelecomOpen(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Telecom Onboarding & Line Verification"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Secondary Phone Number */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(secondaryPhoneNumber || focusedField === 'secondaryPhoneNumber') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Secondary Phone Number
                    </label>
                  )}
                  <input
                    type="tel"
                    value={secondaryPhoneNumber}
                    onChange={(e) => setSecondaryPhoneNumber(e.target.value)}
                    onFocus={() => setFocusedField('secondaryPhoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!secondaryPhoneNumber && focusedField !== 'secondaryPhoneNumber' ? 'Secondary Phone Number (Optional)' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none font-mono text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06]">
                  {(gender || focusedField === 'gender') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Gender
                    </label>
                  )}
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onFocus={() => setFocusedField('gender')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none appearance-none cursor-pointer text-white [&>option]:bg-neutral-900 [&>option]:text-white"
                  >
                    <option value="" disabled className="text-zinc-500">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Birth Date */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(birthDate || focusedField === 'birthDate') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Birth Date
                    </label>
                  )}
                  <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    onFocus={() => setFocusedField('birthDate')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!birthDate && focusedField !== 'birthDate' ? 'Birth Date (DD/MM/YYYY)' : ''}
                    className="w-full px-4 py-3 pr-11 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                  {birthDate && (
                    <button
                      type="button"
                      onClick={() => setBirthDate('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Clear date"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Section Header: Address */}
                <div className="flex items-center gap-2 pt-4 pb-1">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
                    Address Details
                  </h3>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Street */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(street || focusedField === 'street') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Street Address
                    </label>
                  )}
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    onFocus={() => setFocusedField('street')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!street && focusedField !== 'street' ? 'Street Address' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* City */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(city || focusedField === 'city') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      City
                    </label>
                  )}
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!city && focusedField !== 'city' ? 'City' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Zip Code */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(zipCode || focusedField === 'zipCode') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Zip / Postal Code
                    </label>
                  )}
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onFocus={() => setFocusedField('zipCode')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!zipCode && focusedField !== 'zipCode' ? 'Zip / Postal Code' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none font-mono text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Country */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(country || focusedField === 'country') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Country
                    </label>
                  )}
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onFocus={() => setFocusedField('country')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!country && focusedField !== 'country' ? 'Country' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Section Header: About & Professional */}
                <div className="flex items-center gap-2 pt-4 pb-1">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
                    Professional & About
                  </h3>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Company Name */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(companyName || focusedField === 'companyName') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Company Name
                    </label>
                  )}
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onFocus={() => setFocusedField('companyName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!companyName && focusedField !== 'companyName' ? 'Company Name' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Job Title */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(jobTitle || focusedField === 'jobTitle') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Job Title
                    </label>
                  )}
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    onFocus={() => setFocusedField('jobTitle')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!jobTitle && focusedField !== 'jobTitle' ? 'Job Title' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* About Me */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(aboutMe || focusedField === 'aboutMe') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      About Me
                    </label>
                  )}
                  <textarea
                    rows={3}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    onFocus={() => setFocusedField('aboutMe')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!aboutMe && focusedField !== 'aboutMe' ? 'About Me / Bio' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none resize-none text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Email with Verified Badge */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(email || focusedField === 'email') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Email Address
                    </label>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!email && focusedField !== 'email' ? 'Email Address' : ''}
                    className="w-full px-4 py-3 pr-11 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                  {email && (
                    <div 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 flex items-center justify-center shadow-sm"
                      title="Verified Identity"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Website URL */}
                <div className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-all focus-within:border-cyan-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                  {(websiteUrl || focusedField === 'websiteUrl') && (
                    <label className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded text-[11px] font-mono pointer-events-none transition-all z-10 bg-neutral-950 text-cyan-400 font-semibold shadow-xs">
                      Website / Portfolio URL
                    </label>
                  )}
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    onFocus={() => setFocusedField('websiteUrl')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={!websiteUrl && focusedField !== 'websiteUrl' ? 'Website URL (e.g. https://...)' : ''}
                    className="w-full px-4 py-3 bg-transparent rounded-xl text-sm font-medium outline-none text-white placeholder:text-zinc-500"
                  />
                </div>

              </div>

              {/* Disclaimer Notice */}
              <div className="pt-3 pb-2 space-y-1.5 text-center">
                <p className="text-[11px] leading-relaxed px-2 text-zinc-400 select-none">
                  Please note that this information is stored securely in your Callix account profile and is not shared with unverified callers.
                </p>
                <p className="text-[11px] text-zinc-400 select-none">
                  For support or telecom provisioning assistance, contact{' '}
                  <a 
                    href="mailto:support@callix.ai" 
                    className="text-cyan-400 font-semibold hover:underline"
                  >
                    support@callix.ai
                  </a>
                </p>
              </div>
            </>
          ) : (
            /* SECURITY & VOICE AI SHIELD VIEW */
            <div className="space-y-4 animate-fade-in pt-1">
              {/* Account Clearance Card */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
                      Security Clearance
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {user.plan || 'PRO SHIELD'}
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 truncate">
                  UID: {user.uid}
                </div>
              </div>

              {/* Threat Risk Sensitivity Selector */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-2.5 backdrop-blur-md">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
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
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/80 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                          : "bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white hover:bg-white/[0.08]"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {riskSensitivity === 'AGGRESSIVE' && 'Alerts trigger at 60+ risk score. Recommended for elder protection.'}
                  {riskSensitivity === 'STANDARD' && 'Alerts trigger at 75+ risk score. Balanced enterprise calibration.'}
                  {riskSensitivity === 'RELAXED' && 'Alerts trigger at 85+ risk score. Only flags definitive high-threat attacks.'}
                </p>
              </div>

              {/* Protective AI Toggles */}
              <div className="space-y-2">
                {/* Auto Block */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-between backdrop-blur-md">
                  <div>
                    <div className="text-xs font-semibold text-white">Auto-Block High-Risk Scams</div>
                    <div className="text-[10px] text-zinc-400">Instantly disconnect calls when threat score hits 80+</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoBlock(!autoBlock)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer border shrink-0",
                      autoBlock ? "bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-neutral-800 border-white/10"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md",
                        autoBlock ? "left-5.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* SMS Emergency Dispatch */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-between backdrop-blur-md">
                  <div>
                    <div className="text-xs font-semibold text-white">SMS Emergency Dispatch</div>
                    <div className="text-[10px] text-zinc-400">Send emergency alerts to designated family guardians</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer border shrink-0",
                      smsAlerts ? "bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-neutral-800 border-white/10"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md",
                        smsAlerts ? "left-5.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* Browser Push Alerts */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-between backdrop-blur-md">
                  <div>
                    <div className="text-xs font-semibold text-white">Browser Push Notifications</div>
                    <div className="text-[10px] text-zinc-400">Instant audio scanner and deepfake warning toasts</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushAlerts(!pushAlerts)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer border shrink-0",
                      pushAlerts ? "bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-neutral-800 border-white/10"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md",
                        pushAlerts ? "left-5.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* API Key Card */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-2.5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Telephony API Key</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Production
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="cx_live_98a7b6c5d4e3f210a9b8c7d6e5"
                    className="w-full rounded-xl px-3 py-2 text-xs font-mono border outline-none bg-black/40 border-white/10 text-zinc-300"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-white/15 bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedApiKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedApiKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Liquid Glass Bottom Actions Bar */}
        <div 
          className="p-4 border-t border-white/10 bg-neutral-950/95 backdrop-blur-xl flex items-center justify-between gap-3"
        >
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white text-xs font-semibold shadow-[0_0_18px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>

      {/* Telecom Onboarding & Phone Number Verification Modal */}
      <TelecomOnboardingModal
        isOpen={isTelecomOpen}
        onClose={() => setIsTelecomOpen(false)}
      />
    </div>
  );
};

export default UserProfileModal;
