import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MetricsCard } from '../components/dashboard/MetricsCard';
import { RecentCallsTable } from '../components/dashboard/RecentCallsTable';
import { ThreatRadar } from '../components/dashboard/ThreatRadar';
import { RiskScoreGauge } from '../components/dashboard/RiskScoreGauge';
import { LiveWaveform } from '../components/dashboard/LiveWaveform';
import { useCallHistory } from '../hooks/useCallHistory';
import { useCallSimulation } from '../context/CallSimulationContext';
import { useAuth } from '../hooks/useAuth';
import { MOCK_METRICS } from '../services/mockDataService';
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
  Zap
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { calls } = useCallHistory();
  const { 
    isCallActive, 
    currentRiskScore, 
    callerNumber, 
    callerName, 
    audioLevels, 
    startSimulation, 
    stopSimulation 
  } = useCallSimulation();

  const [lookupInput, setLookupInput] = useState('');

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      navigate(`/lookup?q=${encodeURIComponent(lookupInput.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Cyber Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-cyber-border p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="safe" size="sm" pulse>
                AI DEFENSE ACTIVE
              </Badge>
              <span className="text-xs font-mono text-cyber-muted">
                Diarization + Claude 3.5 Sonnet XAI
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Voice Scam & Fraud Shield
            </h2>
            <p className="text-sm text-cyber-muted leading-relaxed">
              Monitoring audio streams for Indian cybercrime signatures: Digital Arrests, OTP extortion, UPI refund traps, and fake KYC notices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => {
                if (!isCallActive) startSimulation();
                navigate('/simulation');
              }}
            >
              {isCallActive ? 'View Active Sim' : 'Launch Call Simulator'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Users className="w-4 h-4" />}
              onClick={() => navigate('/guardian')}
            >
              Guardian Hub
            </Button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <MetricsCard metrics={MOCK_METRICS} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Call Widget / Recent Calls & Threat Radar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Call Telemetry Box (If Call Active) */}
          {isCallActive ? (
            <Card glow="danger" className="border-red-500/40 bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 space-y-4">
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
                  <div className="text-xs text-cyber-muted font-mono">CALLER IDENTIFICATION:</div>
                  <div className="text-lg font-bold text-white">{callerName}</div>
                  <div className="text-sm font-mono text-brand-cyan">{formatPhoneNumber(callerNumber)}</div>
                  
                  <div className="pt-2">
                    <LiveWaveform levels={audioLevels} isActive color={currentRiskScore >= 75 ? 'danger' : 'cyan'} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 bg-slate-950/60 rounded-xl border border-cyber-border">
                  <RiskScoreGauge score={currentRiskScore} size="sm" />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => navigate('/simulation')}
                  className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                >
                  Open Full Screen Simulation & XAI Analysis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ) : null}

          {/* Recent Monitored Calls Table */}
          <RecentCallsTable calls={calls} />

          {/* Threat Radar */}
          <ThreatRadar />
        </div>

        {/* Right Column: Quick Tools, Guardian Card, and Community Database */}
        <div className="space-y-6">
          {/* Quick Number Lookup Card */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-brand-cyan">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-cyber-text">Caller Reputation Check</h3>
                <p className="text-xs text-cyber-muted">Verify any Indian mobile or VoIP number</p>
              </div>
            </div>

            <form onSubmit={handleQuickLookup} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. +91 98201 88472"
                  value={lookupInput}
                  onChange={(e) => setLookupInput(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3.5 py-2.5 text-sm text-cyber-text font-mono placeholder-cyber-subtle focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Scan Phone Number
              </Button>
            </form>

            <div className="text-[11px] text-cyber-subtle space-y-1 pt-1">
              <span className="font-semibold text-cyber-muted block">Common Threat Numbers:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => {
                    setLookupInput('+91 98201 88472');
                    navigate('/lookup?q=%2B919820188472');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 text-red-400 font-mono text-[10px] hover:bg-slate-700"
                >
                  +91 98201 88472 (CBI Scam)
                </button>
                <button
                  onClick={() => {
                    setLookupInput('+91 70034 51920');
                    navigate('/lookup?q=%2B917003451920');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-mono text-[10px] hover:bg-slate-700"
                >
                  +91 70034 51920 (Power Cut)
                </button>
              </div>
            </div>
          </Card>

          {/* Elder Guardian Protection Overview */}
          <Card className="space-y-3 bg-gradient-to-b from-cyber-card to-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-cyber-text">Family Guardian Shield</h3>
                  <span className="text-xs text-threat-safe font-mono font-medium">
                    {user?.guardianLinks.length || 0} Guardians Active
                  </span>
                </div>
              </div>
              <Badge variant="safe" size="sm">
                ARMED
              </Badge>
            </div>

            <p className="text-xs text-cyber-muted leading-relaxed">
              Automated emergency SMS and push alerts dispatched when call risk score exceeds 75/100.
            </p>

            <div className="space-y-2 pt-1">
              {user?.guardianLinks.map((g) => (
                <div
                  key={g.guardianId}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-cyber-border flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-cyber-text">{g.name}</div>
                    <div className="text-[11px] text-cyber-subtle font-mono">{g.phone}</div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-cyan">Alert @ {g.alertOnThreshold}+</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/guardian')}
            >
              Configure Emergency Contacts
            </Button>
          </Card>

          {/* Cybercrime Helpline Quick Reference */}
          <Card className="space-y-2.5 bg-slate-950/60 border-cyber-border">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyber-muted">
              <Zap className="w-4 h-4 text-brand-cyan" />
              National Cyber Emergency
            </div>
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-red-300 font-medium block">Toll-Free Helpline:</span>
                <span className="text-xl font-bold font-mono text-red-400">1930</span>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-red-900/50 hover:bg-red-800 text-red-200 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                File Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
