import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { MOCK_ANALYTICS_DATA } from '../services/mockDataService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Download, 
  TrendingUp, 
  Calendar,
  Zap
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const kpis = [
    {
      title: 'Total Calls Monitored',
      value: '1,428',
      change: '+14.2% vs last week',
      isPositive: true,
      subtitle: '100% Speech Stream Coverage',
      icon: <BarChart3 className="w-5 h-5" />,
      variant: 'primary' as const,
    },
    {
      title: 'Scams Intercepted',
      value: '84',
      change: '100% Intercepted',
      isPositive: true,
      subtitle: 'Zero Financial Breaches',
      icon: <ShieldAlert className="w-5 h-5 text-threat-fraud" />,
      variant: 'fraud' as const,
    },
    {
      title: 'Suspicious Calls Flagged',
      value: '142',
      change: 'Score 40-74 / 100',
      isPositive: true,
      subtitle: 'Heuristic Review Recommended',
      icon: <AlertTriangle className="w-5 h-5 text-threat-suspicious" />,
      variant: 'cyan' as const,
    },
    {
      title: 'AI Response Benchmark',
      value: '1.24s',
      change: 'Target < 4.0s SLA',
      isPositive: true,
      subtitle: 'Sub-second STT + Claude NLP',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      variant: 'safe' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-cyan" />
            Threat Analytics & Forensics Intelligence
          </h2>
          <p className="text-xs text-cyber-muted">
            Aggregated scam trends, vector breakdown, and detection performance benchmarks across monitored telephony circles.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-cyber-border rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                timeRange === '7d' ? 'bg-brand-primary text-white shadow-glow-primary' : 'text-cyber-muted hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                timeRange === '30d' ? 'bg-brand-primary text-white shadow-glow-primary' : 'text-cyber-muted hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                timeRange === '90d' ? 'bg-brand-primary text-white shadow-glow-primary' : 'text-cyber-muted hover:text-white'
              }`}
            >
              Year to Date
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
            variant={kpi.variant}
          />
        ))}
      </div>

      {/* Row 1: Weekly Threat Trends & Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Call Threat Trends Over Time (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div>
                <h3 className="font-bold text-base text-cyber-text tracking-wide">
                  Call Threat Trends Over Time
                </h3>
                <p className="text-xs text-cyber-muted">
                  Daily distribution of Legitimate, Suspicious, and Intercepted Fraud Calls
                </p>
              </div>
              <Badge variant="cyan" size="sm">
                Live Data Stream
              </Badge>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_ANALYTICS_DATA.weeklyThreats}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorFraud" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSusp" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLegit" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="legitimate"
                    name="Legitimate Calls"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorLegit)"
                  />
                  <Area
                    type="monotone"
                    dataKey="suspicious"
                    name="Suspicious Calls"
                    stroke="#F59E0B"
                    fillOpacity={1}
                    fill="url(#colorSusp)"
                  />
                  <Area
                    type="monotone"
                    dataKey="fraud"
                    name="Fraudulent Scams"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorFraud)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono pt-2 border-t border-cyber-border/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-cyber-muted">Legitimate (86%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-cyber-muted">Suspicious (9%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-cyber-muted">Fraud Scams (5%)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Scam Categories Breakdown (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-5 space-y-4 h-full flex flex-col justify-between">
            <div className="border-b border-cyber-border pb-3">
              <h3 className="font-bold text-base text-cyber-text tracking-wide">
                Scam Vector Distribution
              </h3>
              <p className="text-xs text-cyber-muted">
                Prevalence breakdown across Indian scam techniques
              </p>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_ANALYTICS_DATA.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {MOCK_ANALYTICS_DATA.categoryBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 pt-2 border-t border-cyber-border/60">
              {MOCK_ANALYTICS_DATA.categoryBreakdown.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-cyber-text font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-cyber-subtle">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Row 2: Peak Scam-Call Hours (24 Hour Bar Chart) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-cyan" />
            <div>
              <h3 className="font-bold text-base text-cyber-text tracking-wide">
                Peak Attack Hours Distribution (24-Hour Time Profile)
              </h3>
              <p className="text-xs text-cyber-muted">
                Observed concentration of social engineering calls across Indian Standard Time (IST)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-threat-fraud font-semibold bg-red-950/80 px-2.5 py-1 rounded-md border border-red-500/30">
            Peak Danger Window: 17:00 – 21:00 IST
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_ANALYTICS_DATA.hourlyDistribution}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="hour" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Bar dataKey="threats" name="Scam Incidents" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-cyber-border/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-cyber-muted">
            <ShieldCheck className="w-4 h-4 text-threat-safe" />
            <span>Behavioral Pattern Insight:</span>
          </div>
          <span className="text-slate-300 font-normal">
            Attackers predominantly target victims in the late afternoon and evening hours (5 PM – 9 PM) exploiting end-of-day fatigue and bank branch closing panics.
          </span>
        </div>
      </Card>
    </div>
  );
};
