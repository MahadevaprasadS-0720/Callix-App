import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MetricsCard } from '../components/dashboard/MetricsCard';
import { RecentCallsTable } from '../components/dashboard/RecentCallsTable';
import { ThreatRadar } from '../components/dashboard/ThreatRadar';
import { RiskScoreGauge } from '../components/dashboard/RiskScoreGauge';
import { LiveWaveform } from '../components/dashboard/LiveWaveform';
import { VoicePlayground } from '../components/Playground/VoicePlayground';
import { ThreatDashboard } from '../components/dashboard/ThreatDashboard';
import { ThreatAnalytics } from '../components/Analytics/ThreatAnalytics';
import { useCallHistory } from '../hooks/useCallHistory';
import { useCallSimulation } from '../context/CallSimulationContext';
import { useAuth } from '../hooks/useAuth';
import { formatPhoneNumber } from '../utils/formatters';
import { cn } from '../utils/cn';
import { 
  ShieldCheck, 
  Radio, 
  Play, 
  PhoneOff, 
  Search, 
  Users, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Zap,
  Activity,
  Mic,
  BarChart3,
  Layers,
  Sparkles,
  CheckCircle2,
  MapPin,
  Phone,
  RefreshCw,
  Loader2,
  Check
} from 'lucide-react';
import { carrierLookupService, LiveCarrierLookupResponse } from '../services/carrierLookupService';
import { GroqFraudAlertBanner } from '../components/calls/GroqFraudAlertBanner';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { calls, metrics } = useCallHistory();
  const { 
    isCallActive, 
    currentRiskScore, 
    callerNumber, 
    callerName, 
    audioLevels, 
    startSimulation, 
    stopSimulation,
    groqAlert,
    dismissGroqAlert,
  } = useCallSimulation();

  type TabId = 'overview' | 'playground' | 'telemetry' | 'analytics';
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [lookupInput, setLookupInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<LiveCarrierLookupResponse | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const tabs: Array<{ id: TabId; label: string; icon: React.FC<{ className?: string }>; iconColor: string; badge?: string }> = [
    { id: 'overview', label: 'Security Overview', icon: Activity, iconColor: 'text-cyan-400' },
    { id: 'playground', label: 'Voice Detection Playground', icon: Mic, iconColor: 'text-pink-400' },
    { id: 'telemetry', label: 'Real-Time Threat Feed', icon: Radio, iconColor: 'text-emerald-400' },
    { id: 'analytics', label: 'Visual Threat Analytics', icon: BarChart3, iconColor: 'text-purple-400' },
  ];

  const handleQuickLookup = async (e?: React.FormEvent, presetPhone?: string) => {
    if (e) e.preventDefault();
    const phoneToScan = (presetPhone || lookupInput).trim();
    if (!phoneToScan) {
      setLookupError('Please enter a phone number to scan');
      return;
    }

    if (presetPhone) {
      setLookupInput(presetPhone);
    }

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const data = await carrierLookupService.lookupLivePhone(phoneToScan);
      if (!data.valid && data.error) {
        setLookupError(data.error);
      } else {
        setLookupResult(data);
      }
    } catch (err: any) {
      setLookupError(err?.message || 'Could not verify caller. Please check your network connection.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Apple Liquid Glass Hero Panel */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-neutral-950/35 border border-white/12 p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-semibold shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>AI DEFENSE ACTIVE</span>
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Diarization + Claude 3.5 Sonnet XAI
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Voice Scam &amp; Fraud Shield
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Monitoring audio streams for Indian cybercrime signatures: Digital Arrests, OTP extortion, UPI refund traps, and fake KYC notices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!isCallActive) startSimulation();
                navigate('/simulation');
              }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>{isCallActive ? 'View Active Sim' : 'Launch Call Simulator'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/guardian')}
              className="ios-frosted-btn px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 transform-gpu hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Guardian Hub</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Segmented Tab Navigation - Apple iOS Sliding Spring Pill Picker */}
      <div className="ios-segmented-bar p-1.5 inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex items-center gap-2 px-4 py-2 text-xs font-mono transition-colors duration-200 whitespace-nowrap cursor-pointer select-none rounded-full ${
                isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-white/12 to-white/5 border border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-md"
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${tab.iconColor}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-pink-500/20 text-pink-300 font-sans font-semibold">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Animated Tab Content Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Row */}
              <MetricsCard metrics={metrics} />

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Live Call Widget / Recent Calls & Threat Radar */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Groq Real-Time High Risk Alert Banner */}
                  {isCallActive && groqAlert && (
                    <GroqFraudAlertBanner
                      alert={groqAlert}
                      onDismiss={dismissGroqAlert}
                      onTerminateCall={() => stopSimulation('TERMINATED_BY_SYSTEM')}
                      onConsultAssistant={(reason) => {
                        window.dispatchEvent(
                          new CustomEvent('open-callix-ai-assistant', {
                            detail: {
                              prompt: `The Groq Real-Time Shield detected high fraud risk: "${reason}". Please investigate this threat and tell me how to protect myself.`,
                            },
                          })
                        );
                      }}
                    />
                  )}

                  {/* Live Call Telemetry Box (If Call Active) */}
                  {isCallActive ? (
                    <Card glow="danger" className="border-red-500/40 bg-gradient-to-br from-neutral-950/80 via-red-950/25 to-neutral-950/80 backdrop-blur-2xl shadow-[0_12px_40px_rgba(239,68,68,0.25),inset_0_1px_0_0_rgba(255,255,255,0.15)] space-y-4">
                      <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                          </span>
                          <span className="font-bold text-sm text-red-300 font-mono uppercase tracking-wider">
                            Live Stream Intercepted
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
                          onClick={() => stopSimulation('TERMINATED_BY_SYSTEM')}
                        >
                          Terminate Call
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                          <div className="text-xs text-zinc-400 font-mono">CALLER IDENTIFICATION:</div>
                          <div className="text-lg font-bold text-white">{callerName}</div>
                          <div className="text-sm font-mono text-cyan-400">{formatPhoneNumber(callerNumber)}</div>
                          
                          <div className="pt-2">
                            <LiveWaveform levels={audioLevels} isActive color={currentRiskScore >= 75 ? 'danger' : 'cyan'} />
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-3 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md">
                          <RiskScoreGauge score={currentRiskScore} size="sm" />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => navigate('/simulation')}
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 transition-colors"
                        >
                          Open Full Screen Simulation &amp; XAI Analysis <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ) : null}

                  {/* Recent Monitored Calls Table */}
                  <RecentCallsTable calls={calls} />

                  {/* Threat Radar */}
                  <ThreatRadar calls={calls} />
                </div>

                {/* Right Column: Quick Tools, Guardian Card, and Community Database */}
                <div className="space-y-6">
                  {/* Quick Number Lookup Card */}
                  <Card className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-sm">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">Caller Reputation Check</h3>
                        <p className="text-xs text-zinc-400">Verify any Indian mobile or VoIP number</p>
                      </div>
                    </div>

                    <form onSubmit={(e) => handleQuickLookup(e)} className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. +91 98201 88472 or 7975583509"
                          value={lookupInput}
                          onChange={(e) => {
                            setLookupInput(e.target.value);
                            if (lookupError) setLookupError(null);
                          }}
                          className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-md transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={lookupLoading}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-black bg-white hover:bg-zinc-100 shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {lookupLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            <span>Verifying with Numverify...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 text-black" />
                            <span>Scan Phone Number</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Frosted Glass Loading State */}
                    {lookupLoading && (
                      <div className="p-4 rounded-2xl bg-white/[0.04] border border-cyan-500/30 backdrop-blur-xl flex flex-col items-center justify-center space-y-2.5 animate-pulse">
                        <div className="relative flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                          <Radio className="w-4 h-4 text-cyan-400 absolute animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                          <div className="text-xs font-semibold text-white">Scanning Carrier &amp; Telecom Route...</div>
                          <div className="text-[10px] text-cyan-400/90 font-mono flex items-center justify-center gap-1">
                            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                            <span>⚡ Triple-Engine Synchronized (Abstract + Veriphone + Numverify)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Notice */}
                    {lookupError && !lookupLoading && (
                      <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-semibold">Lookup Notice</div>
                          <div className="text-[11px] text-red-200/80">{lookupError}</div>
                        </div>
                      </div>
                    )}

                    {/* Live Liquid Glass Results Badges */}
                    {lookupResult && !lookupLoading && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-cyan-950/20 border border-cyan-500/30 backdrop-blur-xl shadow-lg space-y-3 animate-fade-in">
                        {/* Prominent Truecaller-style Community Verified Caller ID Banner */}
                        {lookupResult.caller_name ? (
                          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-indigo-900/30 border border-blue-400/50 p-3.5 backdrop-blur-2xl shadow-[0_8px_32px_-6px_rgba(59,130,246,0.45)] transition-all duration-300 group">
                            {/* Ambient glowing orb */}
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/30 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                            
                            <div className="relative z-10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Apple-style Blue Verified Shield Checkmark Avatar */}
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] shrink-0 transform-gpu transition-transform duration-300 group-hover:scale-105">
                                  <ShieldCheck className="w-5 h-5 text-white" />
                                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-neutral-950 flex items-center justify-center shadow-md">
                                    <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                                    <span>Verified Registered Caller</span>
                                    <span className="inline-block w-1 h-1 rounded-full bg-cyan-400" />
                                    <span className="text-blue-200/90 font-medium">Community Identified</span>
                                  </div>
                                  <div className="text-base font-extrabold text-white tracking-tight truncate flex items-center gap-1.5 mt-0.5">
                                    <span className="text-zinc-300 font-medium">Verified User:</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-200">
                                      {lookupResult.caller_name}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 flex flex-col items-end">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/50 text-[11px] font-mono font-bold text-cyan-200 shadow-sm">
                                  <ShieldCheck className="w-3 h-3 text-cyan-300" />
                                  <span>{lookupResult.reputation || 100}% Trust</span>
                                </span>
                                <span className="text-[9px] text-blue-300/80 font-mono mt-0.5">Callix Directory</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-400 shrink-0">
                                  <Users className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-zinc-300 truncate">
                                    Name: <span className="text-zinc-400 font-normal">Not listed in Callix Community</span>
                                  </div>
                                  <div className="text-[10px] text-zinc-500 font-mono truncate">
                                    Unlisted / Community Not Registered • Telecom Carrier Registry Fallback
                                  </div>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-[10px] font-mono font-medium text-zinc-400 shrink-0">
                                Unlisted
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Header line: Phone, Source Micro-Badge & Valid status */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-white truncate">
                            <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{lookupResult.international_format || lookupResult.number}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide",
                              lookupResult.valid 
                                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" 
                                : "bg-red-500/15 border border-red-500/30 text-red-400"
                            )}>
                              {lookupResult.valid ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              <span>{lookupResult.valid ? "ACTIVE" : "INVALID"}</span>
                            </span>
                          </div>
                        </div>

                        {/* Subtle micro-badge: ⚡ Triple-Engine Synchronized */}
                        <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/[0.04] border border-cyan-500/20 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                          <span className="flex items-center gap-1.5 text-cyan-300 font-semibold tracking-wide">
                            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{lookupResult.engine_badge || "⚡ Triple-Engine Synchronized"}</span>
                          </span>
                          <span className="text-emerald-400 font-medium flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{lookupResult.confidence ? `${lookupResult.confidence}% Consensus` : 'Consensus Active'}</span>
                          </span>
                        </div>

                        {/* Badges Grid (Liquid Glass Capsules) */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* SIM Carrier with glowing neon accent */}
                          <div 
                            className="p-2.5 rounded-xl bg-black/40 border transition-all duration-300 space-y-1 relative overflow-hidden group"
                            style={{
                              borderColor: `${lookupResult.brand_accent || '#0084FF'}45`,
                              boxShadow: `0 0 16px -4px ${lookupResult.brand_accent || '#0084FF'}25`,
                            }}
                          >
                            <div 
                              className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full opacity-20 blur-lg pointer-events-none"
                              style={{ backgroundColor: lookupResult.brand_accent || '#0084FF' }}
                            />
                            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1">
                              <Radio className="w-3 h-3" style={{ color: lookupResult.brand_accent || '#0084FF' }} />
                              <span>SIM Carrier</span>
                            </div>
                            <div 
                              className="font-bold truncate text-sm" 
                              style={{ 
                                color: lookupResult.brand_accent || '#FFFFFF',
                                textShadow: `0 0 10px ${lookupResult.brand_accent || '#0084FF'}60`
                              }}
                            >
                              {lookupResult.carrier || lookupResult.operator || 'Unknown Operator'}
                            </div>
                          </div>

                          {/* Location / Circle */}
                          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-1 relative overflow-hidden">
                            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>Telecom Circle</span>
                            </div>
                            <div className="font-semibold text-zinc-200 truncate">
                              {lookupResult.location || lookupResult.circle || 'India (National)'}
                            </div>
                          </div>

                          {/* Line Type */}
                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>Line Type</span>
                            </div>
                            <div className="font-semibold text-zinc-200 capitalize truncate">
                              {lookupResult.line_type || 'Mobile (Cellular)'}
                            </div>
                          </div>

                          {/* Parallel Latency & Tri-Sync */}
                          <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
                            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-cyan-400" />
                              <span>Parallel Latency</span>
                            </div>
                            <div className="font-semibold text-cyan-300 text-[11px] truncate flex items-center gap-1">
                              <span>{lookupResult.roundtrip_seconds ? `${lookupResult.roundtrip_seconds}s (Tri-Sync)` : '⚡ 3 Concurrent'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/lookup?q=${encodeURIComponent(lookupResult.number || lookupInput)}`)}
                            className="flex-1 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Deep Reputation</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setLookupResult(null); setLookupInput(''); }}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
                            title="Clear scan"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-zinc-400 space-y-1.5 pt-1">
                      <span className="font-semibold text-zinc-300 block">Common Threat Numbers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickLookup(undefined, '+91 98201 88472')}
                          className="px-2.5 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-mono text-[10px] transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer"
                        >
                          +91 98201 88472 (CBI Scam)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLookup(undefined, '+91 78034 51928')}
                          className="px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 font-mono text-[10px] transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer"
                        >
                          +91 78034 51928 (Power Cut)
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Family Guardian Shield */}
                  <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white">Family Guardian Shield</h3>
                          <p className="text-xs text-zinc-400">
                            {user?.guardianLinks?.length || 0} Guardians Active
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold">
                        ARMED
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Automated emergency SMS and push alerts dispatched when call risk score exceeds 75/100.
                    </p>

                    <div className="space-y-2 pt-1">
                      {user?.guardianLinks?.map((g) => (
                        <div
                          key={g.guardianId}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-zinc-200">{g.name} ({g.relationship})</div>
                            <div className="text-[11px] text-zinc-400 font-mono">{g.phone}</div>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400">Alert @ {g.alertOnThreshold}+</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="ios-frosted-btn w-full mt-2 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer"
                      onClick={() => navigate('/guardian')}
                    >
                      Configure Emergency Contacts
                    </button>
                  </Card>

                  {/* Cybercrime Helpline Quick Reference */}
                  <Card className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      National Cyber Emergency
                    </div>
                    <div className="p-3 rounded-2xl bg-red-950/35 border border-red-500/30 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-xs text-red-300 font-medium block">Toll-Free Helpline:</span>
                        <span className="text-2xl font-extrabold font-mono text-red-400">1930</span>
                      </div>
                      <a
                        href="https://cybercrime.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 transform-gpu hover:-translate-y-0.5"
                      >
                        File Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VOICE DETECTION PLAYGROUND */}
          {activeTab === 'playground' && (
            <VoicePlayground id="dashboard-playground" />
          )}

          {/* TAB 3: REAL-TIME THREAT FEED & TELEMETRY */}
          {activeTab === 'telemetry' && (
            <ThreatDashboard id="dashboard-telemetry" />
          )}

          {/* TAB 4: VISUAL THREAT ANALYTICS & CHARTS */}
          {activeTab === 'analytics' && (
            <ThreatAnalytics id="dashboard-analytics" />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;

