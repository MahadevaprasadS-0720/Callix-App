import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Activity, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Lock
} from 'lucide-react';

interface ThreatEvent {
  id: string;
  timestamp: string;
  callerId: string;
  carrier: string;
  category: string;
  riskScore: number;
  status: 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
  latency: string;
  acousticSignature: string;
}

const INITIAL_THREATS: ThreatEvent[] = [
  {
    id: 'evt-01',
    timestamp: '14s ago',
    callerId: '+91 98201 88472',
    carrier: 'Airtel VoIP Gateway',
    category: 'Digital Arrest / Fake CBI Parcel',
    riskScore: 96,
    status: 'BLOCKED',
    latency: '62ms',
    acousticSignature: 'ElevenLabs Multilingual v2 Match'
  },
  {
    id: 'evt-02',
    timestamp: '48s ago',
    callerId: '+91 88261 40918',
    carrier: 'Reliance Jio SIP',
    category: 'Bank KYC & OTP Extortion',
    riskScore: 94,
    status: 'BLOCKED',
    latency: '78ms',
    acousticSignature: 'OpenAI TTS HD Clone'
  },
  {
    id: 'evt-03',
    timestamp: '2m ago',
    callerId: '+1 (415) 890-2341',
    carrier: 'Twilio Voice Trunk',
    category: 'Executive Impersonation / CEO Wire',
    riskScore: 78,
    status: 'FLAGGED',
    latency: '85ms',
    acousticSignature: 'Replay Synthesis Attack'
  },
  {
    id: 'evt-04',
    timestamp: '4m ago',
    callerId: '+91 93150 94821',
    carrier: 'Vodafone Idea Cell',
    category: 'Paytm Refund / Fake Link Trap',
    riskScore: 72,
    status: 'FLAGGED',
    latency: '91ms',
    acousticSignature: 'Robotic Cadence Jitter'
  },
  {
    id: 'evt-05',
    timestamp: '7m ago',
    callerId: '+91 98450 12390',
    carrier: 'Tata Teleservices',
    category: 'Authentic Customer Support Call',
    riskScore: 8,
    status: 'ALLOWED',
    latency: '54ms',
    acousticSignature: 'Organic Laryngeal Resonance'
  },
  {
    id: 'evt-06',
    timestamp: '11m ago',
    callerId: '+44 20 7946 0912',
    carrier: 'BT Global SIP',
    category: 'Whitelisted Corporate Conference',
    riskScore: 4,
    status: 'ALLOWED',
    latency: '66ms',
    acousticSignature: 'Verified Human Biometrics'
  }
];

export const ThreatDashboard: React.FC<{ id?: string }> = ({ id = 'telemetry' }) => {
  const [threats, setThreats] = useState<ThreatEvent[]>(INITIAL_THREATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BLOCKED' | 'FLAGGED' | 'ALLOWED'>('ALL');
  const [liveCounter, setLiveCounter] = useState(2481920);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);

  // Simulate incoming live telemetry stream every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = 
      threat.callerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.carrier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || threat.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section id={id} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative font-sans">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-blue-500/5 blur-[140px] rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/[0.08] pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>TELEMETRY FEED · LIVE STREAM ACTIVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Real-Time Security <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
              Dashboard & Telemetry
            </span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl">
            Live carrier stream monitoring, AI voice clone interceptions, and acoustic risk scores scored by Claude 3.5 Sonnet XAI and Deepgram Nova-2.
          </p>
        </div>

        {/* Global Protection Counter Badge */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Total Scanned Streams</div>
            <div className="text-xl font-bold font-mono text-white tracking-tight">
              {liveCounter.toLocaleString()}+
            </div>
          </div>
        </div>
      </div>

      {/* 1. Key Metrics Cards (Glassmorphism Dark UI with Neon Glow Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        
        {/* Metric 1: Total Calls */}
        <div className="p-6 rounded-3xl bg-[#09090B] border border-white/[0.12] hover:border-cyan-500/30 transition-all duration-300 shadow-xl space-y-3 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Total Calls Analyzed</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            2.48M+
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% volume this month</span>
          </div>
        </div>

        {/* Metric 2: Deepfakes Intercepted */}
        <div className="p-6 rounded-3xl bg-[#09090B] border border-white/[0.12] hover:border-pink-500/30 transition-all duration-300 shadow-xl space-y-3 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Deepfakes Intercepted</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-pink-400 tracking-tight">
            14,290
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% blocked · ₹0 loss</span>
          </div>
        </div>

        {/* Metric 3: Average Latency */}
        <div className="p-6 rounded-3xl bg-[#09090B] border border-white/[0.12] hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-3 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Average Latency</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
            85ms
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <span>Sub-second real-time scoring</span>
          </div>
        </div>

        {/* Metric 4: Defense Rating */}
        <div className="p-6 rounded-3xl bg-[#09090B] border border-white/[0.12] hover:border-blue-500/30 transition-all duration-300 shadow-xl space-y-3 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">System Defense SLA</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            99.8%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
            <span>Carrier-grade 99.999% SLA</span>
          </div>
        </div>

      </div>

      {/* 2. Live Threat Feed / Activity Table */}
      <div className="rounded-3xl bg-[#09090B] border border-white/[0.12] shadow-2xl overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search caller ID, threat category, or carrier..."
                className="w-full bg-black border border-white/10 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono w-full sm:w-auto justify-center sm:justify-start">
            {(['ALL', 'BLOCKED', 'FLAGGED', 'ALLOWED'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filter === 'ALL' && 'All Streams'}
                {filter === 'BLOCKED' && 'Blocked (High Risk)'}
                {filter === 'FLAGGED' && 'Flagged'}
                {filter === 'ALLOWED' && 'Allowed'}
              </button>
            ))}
          </div>
        </div>

        {/* Threat Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-white/[0.08]">
              <tr>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Source / Caller ID</th>
                <th className="py-3.5 px-5">Category & Telecom Carrier</th>
                <th className="py-3.5 px-5">Risk Score</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300">
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 text-xs">
                    No telecom streams match your search filters.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((t) => (
                  <tr 
                    key={t.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedThreat(t)}
                  >
                    {/* Timestamp */}
                    <td className="py-4 px-5 whitespace-nowrap text-zinc-500">
                      {t.timestamp}
                    </td>

                    {/* Caller ID */}
                    <td className="py-4 px-5 whitespace-nowrap font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{t.callerId}</span>
                      </div>
                    </td>

                    {/* Category & Carrier */}
                    <td className="py-4 px-5">
                      <div className="font-sans font-medium text-zinc-200 text-xs">{t.category}</div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{t.carrier}</div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              t.riskScore >= 75
                                ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]'
                                : t.riskScore >= 50
                                ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                                : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                            }`}
                            style={{ width: `${t.riskScore}%` }}
                          />
                        </div>
                        <span className={`font-bold ${
                          t.riskScore >= 75 ? 'text-pink-400' : t.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {t.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {t.status === 'BLOCKED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-semibold">
                          <XCircle className="w-3 h-3" />
                          <span>BLOCKED</span>
                        </span>
                      )}
                      {t.status === 'FLAGGED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>FLAGGED</span>
                        </span>
                      )}
                      {t.status === 'ALLOWED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ALLOWED</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedThreat(t);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Trace</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Showing {filteredThreats.length} active live intercepts</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Automatic SIP Session Termination Armed
          </span>
        </div>

      </div>

      {/* Trace Inspector Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedThreat(null)}
          />
          <div className="relative w-full max-w-lg bg-[#09090B] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-pink-400" />
                <h3 className="font-semibold text-base">Acoustic Trace Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex justify-between">
                <span className="text-zinc-400">Caller ID</span>
                <span className="text-white font-bold">{selectedThreat.callerId}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex justify-between">
                <span className="text-zinc-400">Carrier Trunk</span>
                <span className="text-cyan-400">{selectedThreat.carrier}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex justify-between">
                <span className="text-zinc-400">Category</span>
                <span className="text-pink-300">{selectedThreat.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex justify-between">
                <span className="text-zinc-400">Risk Score</span>
                <span className={`font-bold ${selectedThreat.riskScore > 50 ? 'text-pink-400' : 'text-emerald-400'}`}>
                  {selectedThreat.riskScore}/100
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex justify-between">
                <span className="text-zinc-400">Acoustic Signature</span>
                <span className="text-zinc-300 truncate max-w-[200px]">{selectedThreat.acousticSignature}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex justify-between">
                <span className="text-zinc-400">Detection Latency</span>
                <span className="text-emerald-400 font-bold">{selectedThreat.latency}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedThreat(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white transition-colors"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ThreatDashboard;
