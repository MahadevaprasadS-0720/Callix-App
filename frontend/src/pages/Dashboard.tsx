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
  Sparkles
} from 'lucide-react';

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
    stopSimulation 
  } = useCallSimulation();

  type TabId = 'overview' | 'playground' | 'telemetry' | 'analytics';
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [lookupInput, setLookupInput] = useState('');

  const tabs: Array<{ id: TabId; label: string; icon: React.FC<{ className?: string }>; iconColor: string; badge?: string }> = [
    { id: 'overview', label: 'Security Overview', icon: Activity, iconColor: 'text-cyan-400' },
    { id: 'playground', label: 'Voice Detection Playground', icon: Mic, iconColor: 'text-pink-400' },
    { id: 'telemetry', label: 'Real-Time Threat Feed', icon: Radio, iconColor: 'text-emerald-400' },
    { id: 'analytics', label: 'Visual Threat Analytics', icon: BarChart3, iconColor: 'text-purple-400' },
  ];

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      navigate(`/lookup?q=${encodeURIComponent(lookupInput.trim())}`);
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

                    <form onSubmit={handleQuickLookup} className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. +91 98201 88472"
                          value={lookupInput}
                          onChange={(e) => setLookupInput(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-md transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-black bg-white hover:bg-zinc-100 shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer active:scale-95"
                      >
                        Scan Phone Number
                      </button>
                    </form>

                    <div className="text-[11px] text-zinc-400 space-y-1.5 pt-1">
                      <span className="font-semibold text-zinc-300 block">Common Threat Numbers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => {
                            setLookupInput('+91 98201 88472');
                            navigate('/lookup?q=%2B919820188472');
                          }}
                          className="px-2.5 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-mono text-[10px] transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer"
                        >
                          +91 98201 88472 (CBI Scam)
                        </button>
                        <button
                          onClick={() => {
                            setLookupInput('+91 78034 51928');
                            navigate('/lookup?q=%2B917803451928');
                          }}
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

