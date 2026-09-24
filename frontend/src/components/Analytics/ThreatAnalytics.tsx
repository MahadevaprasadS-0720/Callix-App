import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Radio, 
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useCallHistory } from '../../hooks/useCallHistory';

// Carrier Distribution
const CARRIER_DATA = [
  { name: 'GSM / Cellular Trunks', share: '46%', status: 'Carrier Active', icon: '📶' },
  { name: 'VoIP SIP RFC Gateways', share: '38%', status: 'TLS Protected', icon: '🌐' },
  { name: 'WhatsApp Voice Gateway', share: '16%', status: 'Encrypted Stream', icon: '📱' },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl bg-[#09090B] border border-white/15 p-3.5 shadow-2xl font-mono text-xs space-y-1.5 backdrop-blur-md">
        <div className="text-zinc-400 font-bold border-b border-white/10 pb-1">{label}</div>
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Total Calls: {payload[0]?.value?.toLocaleString()}</span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2 text-pink-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Clones Intercepted: {payload[1]?.value?.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const ThreatAnalytics: React.FC<{ id?: string }> = ({ id = 'analytics' }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const { calls, totalCalls, scamsIntercepted } = useCallHistory();

  const activeTrendData = useMemo(() => {
    if (timeframe === '24h') {
      const times = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
      const data = times.map((time) => ({ time, totalCalls: 0, interceptedClones: 0 }));
      calls.forEach((c) => {
        const d = new Date(c.createdAt || Date.now());
        const hour = d.getHours();
        const slot = Math.min(Math.floor(hour / 3), times.length - 1);
        data[slot].totalCalls += 1;
        if (c.verdict === 'Fraudulent' || c.finalScore >= 75) {
          data[slot].interceptedClones += 1;
        }
      });
      return data;
    } else {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const data = days.map((time) => ({ time, totalCalls: 0, interceptedClones: 0 }));
      calls.forEach((c) => {
        const d = new Date(c.createdAt || Date.now());
        const dayIdx = (d.getDay() + 6) % 7;
        data[dayIdx].totalCalls += 1;
        if (c.verdict === 'Fraudulent' || c.finalScore >= 75) {
          data[dayIdx].interceptedClones += 1;
        }
      });
      return data;
    }
  }, [calls, timeframe]);

  const attackTypes = useMemo(() => {
    const cloneCount = calls.filter(
      (c) => c.finalScore >= 75 && (c.primaryCategory?.includes('Cloning') || (c as any).deepfakeScore >= 60 || c.verdict === 'Fraudulent')
    ).length;
    const replayCount = calls.filter(
      (c) => c.primaryCategory?.includes('Replay') || (c.finalScore >= 50 && c.finalScore < 75)
    ).length;
    const ttsCount = calls.filter(
      (c) => c.primaryCategory?.includes('OTP') || c.primaryCategory?.includes('KYC')
    ).length;
    const total = cloneCount + replayCount + ttsCount;

    return [
      {
        name: 'Voice Cloning (Deepfake)',
        value: total > 0 ? Math.round((cloneCount / total) * 100) : 0,
        count: cloneCount.toLocaleString(),
        color: '#ec4899',
        desc: 'Diffusion vocoder synthesis mimicking real human targets',
      },
      {
        name: 'Replay & Audio Injection',
        value: total > 0 ? Math.round((replayCount / total) * 100) : 0,
        count: replayCount.toLocaleString(),
        color: '#38bdf8',
        desc: 'Pre-recorded voice audio injected into carrier SIP channel',
      },
      {
        name: 'Synthetic Text-to-Speech',
        value: total > 0 ? Math.round((ttsCount / total) * 100) : 0,
        count: ttsCount.toLocaleString(),
        color: '#a855f7',
        desc: 'Robotic automated IVR extortion and OTP harvester bots',
      },
    ];
  }, [calls]);

  return (
    <section id={id} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative font-sans">
      {/* Background Glows */}
      <div className="pointer-events-none absolute bottom-10 left-1/4 w-[550px] h-[350px] bg-purple-500/5 blur-[130px] rounded-full" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-purple-500/30 text-purple-400 text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <BarChart3 className="w-3.5 h-3.5 animate-pulse" />
          <span>REAL-TIME FRAUD TELEMETRY & ATTACK SURFACES</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Visual Threat Analytics & <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Acoustic Clone Vectors
          </span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-400">
          Aggregated carrier telemetry showing live voice cloning interceptions and synthetic speech patterns scored by multi-classifier models.
        </p>
      </div>

      {/* Grid: Trends Chart (7 Cols) & Attack Types (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Stream Ingress & Interceptions (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#09090B] border border-white/[0.12] p-6 sm:p-7 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Call Volume & Interceptions Over Time</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Total analyzed audio streams vs intercepted threats
              </p>
            </div>

            {/* Timeframe Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setTimeframe('24h')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === '24h'
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                24 Hours
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('7d')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === '7d'
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
            </div>
          </div>

          {/* Recharts Area Chart Container */}
          <div className="w-full h-72 sm:h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorClones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <XAxis 
                  dataKey="time" 
                  stroke="#52525b" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="monospace"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />

                <Area 
                  type="monotone" 
                  dataKey="totalCalls" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCalls)" 
                />

                <Area 
                  type="monotone" 
                  dataKey="interceptedClones" 
                  stroke="#ec4899" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorClones)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend & Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.06] text-xs font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                <span className="text-zinc-400">Total Ingress ({totalCalls})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-pink-500 rounded-full" />
                <span className="text-pink-400 font-semibold">Intercepted Voice Clones ({scamsIntercepted})</span>
              </div>
            </div>

            <div className="text-zinc-500">
              {scamsIntercepted > 0 ? `${scamsIntercepted} clones intercepted` : 'Zero threats detected'}
            </div>
          </div>

        </div>

        {/* Right: Attack Type Breakdown Doughnut Chart (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#09090B] border border-white/[0.12] p-6 sm:p-7 shadow-2xl space-y-6">
          
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-pink-400" />
              <span>Attack Type Breakdown</span>
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Identified AI voice fraud signatures
            </p>
          </div>

          {/* Doughnut Chart Display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attackTypes.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#09090b"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white">{attackTypes[0]?.value || 0}%</span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Clones</span>
              </div>
            </div>

            {/* Compact Breakdown Tags */}
            <div className="space-y-2.5 w-full text-xs font-mono">
              {attackTypes.map((type) => (
                <div 
                  key={type.name}
                  className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-zinc-200 text-[11px] truncate max-w-[130px]">
                      {type.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-zinc-400">{type.count}</span>
                    <span className="text-white font-bold">{type.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrier Distribution Strip */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Traffic by Gateway Vector
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              {CARRIER_DATA.map((c) => (
                <div key={c.name} className="p-2 rounded-xl bg-zinc-950 border border-white/[0.06]">
                  <div className="text-base mb-1">{c.icon}</div>
                  <div className="font-bold text-white">{c.share}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{c.name}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
