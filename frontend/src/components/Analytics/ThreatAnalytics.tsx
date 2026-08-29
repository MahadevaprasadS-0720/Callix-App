import React, { useState } from 'react';
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

// 24-Hour Trend Data
const TREND_24H = [
  { time: '00:00', totalCalls: 1240, interceptedClones: 48 },
  { time: '03:00', totalCalls: 820, interceptedClones: 22 },
  { time: '06:00', totalCalls: 1650, interceptedClones: 65 },
  { time: '09:00', totalCalls: 4890, interceptedClones: 280 },
  { time: '12:00', totalCalls: 6920, interceptedClones: 410 },
  { time: '15:00', totalCalls: 7850, interceptedClones: 490 },
  { time: '18:00', totalCalls: 6210, interceptedClones: 360 },
  { time: '21:00', totalCalls: 3400, interceptedClones: 190 },
];

// 7-Day Trend Data
const TREND_7D = [
  { time: 'Mon', totalCalls: 38400, interceptedClones: 2180 },
  { time: 'Tue', totalCalls: 42100, interceptedClones: 2450 },
  { time: 'Wed', totalCalls: 45600, interceptedClones: 2890 },
  { time: 'Thu', totalCalls: 44200, interceptedClones: 2610 },
  { time: 'Fri', totalCalls: 49800, interceptedClones: 3120 },
  { time: 'Sat', totalCalls: 28900, interceptedClones: 1420 },
  { time: 'Sun', totalCalls: 24500, interceptedClones: 1120 },
];

// Attack Type Breakdown
const ATTACK_TYPES = [
  { name: 'Voice Cloning (Deepfake)', value: 55, count: '7,860', color: '#ec4899', desc: 'Diffusion vocoder synthesis mimicking real human targets' },
  { name: 'Replay & Audio Injection', value: 25, count: '3,572', color: '#38bdf8', desc: 'Pre-recorded voice samples injected into carrier SIP channel' },
  { name: 'Synthetic Text-to-Speech', value: 20, count: '2,858', color: '#a855f7', desc: 'Robotic automated IVR extortion and OTP harvester bots' },
];

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
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const activeTrendData = timeframe === '24h' ? TREND_24H : TREND_7D;

  return (
    <section id={id} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative font-sans">
      {/* Background Glows */}
      <div className="pointer-events-none absolute bottom-10 left-1/4 w-[550px] h-[350px] bg-purple-500/5 blur-[130px] rounded-full" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-purple-500/30 text-purple-400 text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <BarChart3 className="w-3.5 h-3.5 animate-pulse" />
          <span>GLOBAL THREAT INTELLIGENCE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Visual Threat Analytics & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            Carrier Attack Vectors
          </span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
          Aggregated acoustic telemetry across enterprise telephony trunks. Identify attack surges, deepfake vector distributions, and carrier vulnerabilities in real time.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Fraud Detection Trends Area Chart (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#09090B] border border-white/[0.12] p-6 sm:p-7 shadow-2xl space-y-6">
          
          {/* Header with Timeframe Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Detection Volume & Intercept Trends</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                Stream ingress vs deepfake interception rates
              </p>
            </div>

            {/* Timeframe Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setTimeframe('24h')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === '24h'
                    ? 'bg-zinc-800 text-white font-semibold border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                24 Hours
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('7d')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === '7d'
                    ? 'bg-zinc-800 text-white font-semibold border border-white/10'
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
                  {/* Cyan Gradient for Total Calls */}
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Pink Gradient for Intercepted Clones */}
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
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Background Area: Total Calls */}
                <Area 
                  type="monotone" 
                  dataKey="totalCalls" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCalls)" 
                />

                {/* Foreground Area: Intercepted Clones */}
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
                <span className="text-zinc-400">Total Stream Ingress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-pink-500 rounded-full" />
                <span className="text-pink-400 font-semibold">Intercepted Voice Clones</span>
              </div>
            </div>

            <div className="text-zinc-500">
              Peak: 490 clones/hr @ 15:00 IST
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
                    data={ATTACK_TYPES}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ATTACK_TYPES.map((entry, index) => (
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
                <span className="text-2xl font-bold font-mono text-white">55%</span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Clones</span>
              </div>
            </div>

            {/* Compact Breakdown Tags */}
            <div className="space-y-2.5 w-full text-xs font-mono">
              {ATTACK_TYPES.map((type, idx) => (
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

export default ThreatAnalytics;
