import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  Fingerprint, 
  Play,
  ArrowRight,
  Clock,
  UserCheck,
  Building2,
  Trash2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { 
  resolveCarrier, 
  searchCallerDirectory, 
  LookupResult, 
  DirectoryContact 
} from '../../utils/numberResolver';
import { useCallSimulation } from '../../context/CallSimulationContext';
import { useCallHistory } from '../../hooks/useCallHistory';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

export interface RecentLookupItem {
  number: string;
  formatted: string;
  operator: string;
  threatLevel: string;
  riskScore: number;
  name?: string;
  timestamp: number;
}

export const HeaderNumberLookup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startSimulation } = useCallSimulation();
  const { calls } = useCallHistory();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LookupResult | null>(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Recent lookups saved in localStorage
  const [recentLookups, setRecentLookups] = useState<RecentLookupItem[]>(() => {
    try {
      const stored = localStorage.getItem('callix_recent_lookups');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global hotkey: '/' or 'Ctrl+K' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add to recent search history
  const recordRecentLookup = (result: LookupResult) => {
    setRecentLookups(prev => {
      const filtered = prev.filter(r => r.number !== result.phone);
      const updated: RecentLookupItem[] = [
        {
          number: result.phone,
          formatted: result.formatted,
          operator: result.operator,
          threatLevel: result.threatLevel,
          riskScore: result.riskScore,
          name: result.name,
          timestamp: Date.now()
        },
        ...filtered
      ].slice(0, 8);
      try {
        localStorage.setItem('callix_recent_lookups', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentLookups([]);
    localStorage.removeItem('callix_recent_lookups');
  };

  // Perform directory search on real user contacts and call logs
  const { contacts, resolved } = searchCallerDirectory(query, user?.guardianLinks || [], calls || []);

  const handleSelectContact = (contact: DirectoryContact) => {
    try {
      const data = resolveCarrier(contact.phone, contact.name);
      setSelectedResult(data);
      recordRecentLookup(data);
      setQuery(contact.phone);
    } catch {
      // ignore
    }
  };

  const handleSelectRecent = (item: RecentLookupItem) => {
    try {
      const digits = item.number.replace(/\D/g, '').slice(-10);
      const data = resolveCarrier(digits, item.name);
      setSelectedResult(data);
      setQuery(item.number);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = query.replace(/\D/g, '').slice(-10);
    if (digits.length === 10) {
      try {
        const data = resolveCarrier(digits);
        setSelectedResult(data);
        recordRecentLookup(data);
        setIsDossierModalOpen(true);
        setIsOpen(false);
        return;
      } catch {
        // fallback
      }
    }

    if (query.trim()) {
      navigate(`/lookup?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateCall = (phone: string, name?: string) => {
    startSimulation();
    setIsDossierModalOpen(false);
    setIsOpen(false);
    navigate(`/simulation?number=${encodeURIComponent(phone)}&name=${encodeURIComponent(name || 'Caller')}`);
  };

  const activeDisplayResult = resolved || selectedResult;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar (Truecaller Style) */}
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-3.5 h-3.5 text-cyan-400/90" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedResult(null);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Lookup caller name or number (+91)..."
          className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-20 rounded-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-neutral-950/90 border border-white/15 focus:border-cyan-500/50 text-xs text-white placeholder:text-zinc-500 placeholder:text-[11px] sm:placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
        />

        {/* Right side controls inside input */}
        <div className="absolute right-2 sm:right-2.5 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedResult(null);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-400 bg-white/[0.06] border border-white/10">
              ⌘K
            </kbd>
          )}

          <button
            type="submit"
            className="px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            title="Search Directory"
          >
            <span>Check</span>
          </button>
        </div>
      </form>

      {/* Floating Truecaller Results Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2.5 z-50 rounded-2xl sm:rounded-3xl border border-white/15 bg-neutral-950/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.12)] overflow-hidden flex flex-col max-h-[82vh] animate-fade-in-up">
          {/* Header Banner */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-neutral-900/90 via-cyan-950/30 to-neutral-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white tracking-wide">
                TRUECALLER RADAR DIRECTORY
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Tier-1 TRAI &amp; STIR/SHAKEN
            </span>
          </div>

          <div className="overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {/* 1. Direct Live Telecom Resolution (If 10-digit number is typed or selected) */}
            {activeDisplayResult && (
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/20 flex items-center justify-center font-bold text-sm text-cyan-300 shadow-sm shrink-0">
                      {activeDisplayResult.name ? activeDisplayResult.name.charAt(0).toUpperCase() : <Phone className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white leading-tight">
                          {activeDisplayResult.name || 'Unsaved Cellular Number'}
                        </span>
                        {activeDisplayResult.isContact && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-semibold">
                            Saved Contact
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-zinc-300">
                        <span>{activeDisplayResult.formatted}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-[11px] text-cyan-400 font-sans font-medium">
                          {activeDisplayResult.operator}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Threat Verdict Pill */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider shrink-0 border ${
                    activeDisplayResult.threatLevel === 'SAFE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : activeDisplayResult.threatLevel === 'SPAM'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  }`}>
                    {activeDisplayResult.threatLevel === 'SAFE' && 'VERIFIED SAFE (4%)'}
                    {activeDisplayResult.threatLevel === 'SPAM' && `SPAM ALERT (${activeDisplayResult.riskScore}%)`}
                    {activeDisplayResult.threatLevel === 'CRITICAL_FRAUD' && `CRITICAL FRAUD (${activeDisplayResult.riskScore}%)`}
                  </span>
                </div>

                {/* Micro Diagnostics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-white/[0.06] text-[10px] text-zinc-400 font-mono">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[9px]">CIRCLE & GATEWAY:</span>
                    <span className="text-zinc-200 truncate">{activeDisplayResult.circle}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[9px]">NETWORK GEN:</span>
                    <span className="text-zinc-200 truncate">{activeDisplayResult.networkGen}</span>
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-zinc-500 text-[9px]">STIR/SHAKEN:</span>
                    <span className="text-cyan-300 truncate">{activeDisplayResult.stirShakenAttestation}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDossierModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>View Telecom Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateCall(activeDisplayResult.phone, activeDisplayResult.name)}
                    className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Launch simulation stream for this number"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span className="hidden sm:inline">Simulate Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeDisplayResult.formatted)}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                    title="Copy phone number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* 2. Matched Contacts / Calls in Directory (Only when user types query) */}
            {query.trim().length > 0 && contacts.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-1">
                  <span>MATCHING CONTACTS &amp; LOGS</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{contacts.length} found</span>
                </div>

                <div className="space-y-1">
                  {contacts.map((contact) => {
                    const isSelected = selectedResult?.phone === `+91 ${contact.phone}`;
                    return (
                      <div
                        key={contact.id}
                        onClick={() => handleSelectContact(contact)}
                        className={`p-2 rounded-xl flex items-center justify-between gap-3 text-xs transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border border-transparent hover:border-white/10 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            contact.threatLevel === 'SAFE' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : contact.threatLevel === 'SPAM'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {contact.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-zinc-100 group-hover:text-white truncate flex items-center gap-1.5">
                              <span>{contact.name}</span>
                              {contact.isSavedContact && (
                                <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate">
                              {contact.formatted} • <span className="text-zinc-500">{contact.operator}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            contact.threatLevel === 'SAFE'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : contact.threatLevel === 'SPAM'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/10 text-red-300 border-red-500/30'
                          }`}>
                            {contact.threatLevel}
                          </span>
                          <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Search History (Only after user has searched or inspected numbers) */}
            {!query.trim() && recentLookups.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>RECENT SEARCH HISTORY</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllRecent}
                    className="text-[10px] text-zinc-400 hover:text-red-400 transition-colors font-mono cursor-pointer flex items-center gap-1"
                    title="Clear search history"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-1">
                  {recentLookups.map((item, idx) => (
                    <div
                      key={`${item.number}_${idx}`}
                      onClick={() => handleSelectRecent(item)}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-transparent hover:border-white/10 text-xs flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-zinc-400 text-[10px] shrink-0">
                          <Phone className="w-3 h-3" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-zinc-200 group-hover:text-white truncate">
                            {item.name || item.formatted}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {item.formatted} • {item.operator}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                        item.threatLevel === 'SAFE'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : item.threatLevel === 'SPAM'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/10 text-red-300 border-red-500/30'
                      }`}>
                        {item.threatLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Empty State Prompt when no query and no recent searches */}
            {!query.trim() && recentLookups.length === 0 && !activeDisplayResult && (
              <div className="p-5 text-center space-y-1.5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 my-1">
                <p className="text-xs text-zinc-300 font-medium">
                  Enter a 10-digit Indian mobile number or name
                </p>
                <p className="text-[11px] text-zinc-500">
                  Instant live carrier diagnostics, circle lookup, and TRAI threat assessment
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-neutral-900/90 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Press <kbd className="px-1 py-0.2 bg-white/10 rounded font-mono text-white">Enter</kbd> to inspect dossier</span>
            <button
              type="button"
              onClick={() => {
                navigate(`/lookup?q=${encodeURIComponent(query)}`);
                setIsOpen(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Open Telecom Radar Page</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Telecom Dossier Modal (Truecaller Level Diagnostics) */}
      {isDossierModalOpen && activeDisplayResult && (
        <Modal
          isOpen={isDossierModalOpen}
          onClose={() => setIsDossierModalOpen(false)}
          title="Subscriber Identity & Telecom Dossier"
          maxWidth="2xl"
        >
          <div className="space-y-5 text-white">
            {/* Top Identity Capsule */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-slate-900 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/20 flex items-center justify-center text-xl font-bold text-cyan-300 shadow-md">
                  {activeDisplayResult.name ? activeDisplayResult.name.charAt(0).toUpperCase() : <Phone className="w-7 h-7 text-cyan-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{activeDisplayResult.name || 'Unsaved Subscriber'}</span>
                    {activeDisplayResult.isContact && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        Saved in Contacts
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-mono text-zinc-300 mt-0.5">
                    <span>{activeDisplayResult.formatted}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-xs text-cyan-400 font-sans">{activeDisplayResult.operator}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {activeDisplayResult.relationOrRole}
                  </p>
                </div>
              </div>

              {/* Threat Verdict Ribbon */}
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                  activeDisplayResult.threatLevel === 'SAFE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-safe/20'
                    : activeDisplayResult.threatLevel === 'SPAM'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber/20'
                    : 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse shadow-glow-fraud/30'
                }`}>
                  {activeDisplayResult.threatLevel === 'SAFE' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  {activeDisplayResult.threatLevel === 'SPAM' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {activeDisplayResult.threatLevel === 'CRITICAL_FRAUD' && <ShieldAlert className="w-4 h-4 text-red-400" />}
                  <span>{activeDisplayResult.threatLevel.replace('_', ' ')} ({activeDisplayResult.riskScore}/100)</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">
                  Cryptographic STIR/SHAKEN Attestation
                </div>
              </div>
            </div>

            {/* Telecom Technical Diagnostics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Licensed Operator</span>
                <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeDisplayResult.operator}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{activeDisplayResult.networkGen}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Telecom Circle</span>
                <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeDisplayResult.circle}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono truncate block">{activeDisplayResult.gateway}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">SIM Swap Age</span>
                <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeDisplayResult.simSwapAge}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">HLR Database Query</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">National DND Registry</span>
                <div className="text-sm font-semibold text-white">
                  {activeDisplayResult.dndStatus}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">TRAI Tier-1 Scrub</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Attestation Signature</span>
                <div className="text-sm font-semibold text-cyan-300 font-mono">
                  {activeDisplayResult.stirShakenAttestation}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">SHA-256 CallerID Token</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Line Classification</span>
                <div className="text-sm font-semibold text-white truncate">
                  {activeDisplayResult.lineType}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">SS7 / SIP Trunk Type</span>
              </div>
            </div>

            {/* Heuristic Tags */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                Intelligence Signatures &amp; Heuristic Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeDisplayResult.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/[0.05] border border-white/15 text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                {activeDisplayResult.summaryNote}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCopy(activeDisplayResult.formatted)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Number Copied!' : 'Copy Formatted Number'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsDossierModalOpen(false);
                    navigate(`/lookup?q=${encodeURIComponent(activeDisplayResult.phone)}`);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  View In Full Radar Page
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateCall(activeDisplayResult.phone, activeDisplayResult.name)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Launch Live Sim</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
