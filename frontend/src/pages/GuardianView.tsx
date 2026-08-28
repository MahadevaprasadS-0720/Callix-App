import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useCallHistory } from '../hooks/useCallHistory';
import { formatPhoneNumber, formatTimestamp, formatDuration } from '../utils/formatters';
import { getVerdictBadgeProps } from '../utils/riskCalculator';
import { SCAM_CATEGORIES } from '../utils/constants';
import { ScamCategory } from '../types/fraud.types';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Phone, 
  Plus, 
  Trash2, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Radio,
  Send,
  ExternalLink
} from 'lucide-react';

interface ProtectedAccount {
  id: string;
  name: string;
  relation: string;
  phone: string;
  status: 'ARMED' | 'ACTIVE_ALERT';
  lastRiskScore: number;
  lastCallTime: string;
  avatarUrl: string;
}

export const GuardianView: React.FC = () => {
  const { user, addGuardian, removeGuardian } = useAuth();
  const { calls } = useCallHistory();

  // Multi-account switcher state
  const protectedAccounts: ProtectedAccount[] = [
    {
      id: 'acc_1',
      name: 'Ramesh Sharma (Father)',
      relation: 'Father - Senior Citizen',
      phone: '+91 98112 00412',
      status: 'ARMED',
      lastRiskScore: 94,
      lastCallTime: '15 mins ago',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'acc_2',
      name: 'Sunita Sharma (Mother)',
      relation: 'Mother - Senior Citizen',
      phone: '+91 98200 44912',
      status: 'ARMED',
      lastRiskScore: 12,
      lastCallTime: '2 hours ago',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    }
  ];

  const [selectedAccountId, setSelectedAccountId] = useState<string>(protectedAccounts[0].id);
  const currentAccount = protectedAccounts.find(a => a.id === selectedAccountId) || protectedAccounts[0];

  // Add guardian modal state
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState<'Parent' | 'Child' | 'Spouse' | 'Other'>('Child');
  const [testAlertSent, setTestAlertSent] = useState(false);

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardianName || !newGuardianPhone) return;

    addGuardian({
      name: newGuardianName,
      phone: newGuardianPhone,
      email: newGuardianEmail,
      relationship: newGuardianRelation,
      notificationsEnabled: true,
      alertOnThreshold: 75,
    });

    setNewGuardianName('');
    setNewGuardianPhone('');
    setNewGuardianEmail('');
    setIsAddOpen(false);
  };

  const handleTriggerTestAlert = () => {
    setTestAlertSent(true);
    setTimeout(() => setTestAlertSent(false), 3000);
  };

  // Filter high-risk calls
  const flaggedCalls = calls.filter(c => c.finalScore >= 40);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-cyan" />
            Family Guardian & Elder Shield Hub
          </h2>
          <p className="text-xs text-cyber-muted">
            Monitor and protect elderly family members with automated real-time scam interception alerts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Link Emergency Guardian
        </Button>
      </div>

      {/* Account Switcher Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {protectedAccounts.map((acc) => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <Card
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-4 cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-900 to-indigo-950/40 border-brand-cyan shadow-glow-cyan/20'
                  : 'bg-cyber-card border-cyber-border hover:bg-cyber-cardHover'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-brand-primary/40"
                  />
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {acc.name}
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-cyber-subtle font-mono">{acc.phone}</p>
                    <p className="text-[11px] text-cyber-muted">{acc.relation}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <Badge variant="safe" size="sm">
                    {acc.status}
                  </Badge>
                  <div className="text-[10px] font-mono text-cyber-subtle">
                    Last Call: {acc.lastCallTime}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Protection Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Active Monitoring Status & Flagged Threat Stream */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-5 space-y-4 bg-gradient-to-b from-slate-900 to-cyber-card">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-threat-safe border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-cyber-text">
                    Protection Active: {currentAccount.name}
                  </h3>
                  <p className="text-xs text-cyber-muted">
                    Audio Guardian background audio classifier active on mobile client
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-xs font-mono text-threat-safe font-semibold">
                <Radio className="w-3 h-3 animate-pulse" /> Telemetry Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-cyber-border space-y-1">
                <span className="text-[11px] font-mono uppercase text-cyber-muted">Alert Threshold</span>
                <div className="text-lg font-bold font-mono text-brand-cyan">75+ Risk Score</div>
                <span className="text-[10px] text-cyber-subtle">Instant SMS & Push</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-cyber-border space-y-1">
                <span className="text-[11px] font-mono uppercase text-cyber-muted">Auto-Block Scam</span>
                <div className="text-lg font-bold font-mono text-threat-safe">Enabled</div>
                <span className="text-[10px] text-cyber-subtle">95+ Critical Risk</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-cyber-border space-y-1">
                <span className="text-[11px] font-mono uppercase text-cyber-muted">Active Guardians</span>
                <div className="text-lg font-bold font-mono text-indigo-300">
                  {user?.guardianLinks.length || 2} Linked
                </div>
                <span className="text-[10px] text-cyber-subtle">Ready to receive</span>
              </div>
            </div>

            {/* Test Trigger Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-cyber-muted">Verify emergency alert pipeline:</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTriggerTestAlert}
                isLoading={testAlertSent}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                {testAlertSent ? 'Alert Dispatched via SMS & Push!' : 'Send Test Guardian Alert'}
              </Button>
            </div>
          </Card>

          {/* High-Risk Calls Stream for Protected Account */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-threat-fraud" />
                <h3 className="font-bold text-base text-cyber-text">
                  Recent High-Risk Calls on Account
                </h3>
              </div>
              <Badge variant="fraud" size="sm">
                {flaggedCalls.length} Intercepted
              </Badge>
            </div>

            <div className="space-y-3">
              {flaggedCalls.map((call) => {
                const category = SCAM_CATEGORIES[call.primaryCategory as ScamCategory] || SCAM_CATEGORIES.SAFE;
                return (
                  <div
                    key={call.callId}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-cyber-border space-y-2 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-500/30">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {call.callerName || formatPhoneNumber(call.callerNumber)}
                          </span>
                          <span className="text-[11px] font-mono text-cyber-subtle">
                            {formatPhoneNumber(call.callerNumber)} • {formatTimestamp(call.startTime)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40">
                          {call.finalScore}/100 Risk
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/40 p-2.5 rounded-lg border border-cyber-border/40">
                      {call.summaryExplanation}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-cyber-muted">
                      <span style={{ color: category.color }}>• Vector: {category.label}</span>
                      <span className="text-threat-safe font-semibold">✓ Guardian Emergency Notice Dispatched</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 5 Columns: Linked Guardians Contact Roster */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-cyan" />
                <h4 className="font-bold text-base text-cyber-text">Emergency Contact Guardians</h4>
              </div>
              <span className="text-xs font-mono text-cyber-subtle">
                {user?.guardianLinks.length || 0} Contacts
              </span>
            </div>

            <p className="text-xs text-cyber-muted leading-relaxed">
              These verified family contacts are immediately alerted via automated SMS and mobile push notifications whenever a scam attempt is detected.
            </p>

            <div className="space-y-2.5 pt-1">
              {user?.guardianLinks.map((g) => (
                <div
                  key={g.guardianId}
                  className="p-3 rounded-xl bg-slate-900/80 border border-cyber-border flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-white">{g.name}</div>
                    <div className="text-[11px] font-mono text-brand-cyan">{g.phone}</div>
                    {g.email && <div className="text-[10px] text-cyber-subtle">{g.email}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">
                      {g.relationship}
                    </Badge>
                    <button
                      onClick={() => removeGuardian(g.guardianId)}
                      className="p-1 text-cyber-muted hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setIsAddOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Family Member
            </Button>
          </Card>

          {/* National Cyber Helpline Assistance */}
          <Card className="p-4 bg-slate-950/70 border-cyber-border space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">
              National Victim Assistance
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              If a family member has unfortunately fallen victim to an unauthorized bank transaction, immediately contact the National Cybercrime Portal within the 24-hour golden window.
            </p>
            <div className="pt-1">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-brand-cyan hover:underline inline-flex items-center gap-1"
              >
                Dial 1930 Helpline <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>

      </div>

      {/* Add Guardian Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Link New Family Guardian"
      >
        <form onSubmit={handleAddGuardian} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Guardian Full Name</label>
            <Input
              required
              value={newGuardianName}
              onChange={(e: any) => setNewGuardianName(e.target.value)}
              placeholder="e.g. Pooja Sharma"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Mobile Number (with +91)</label>
            <Input
              required
              value={newGuardianPhone}
              onChange={(e: any) => setNewGuardianPhone(e.target.value)}
              placeholder="e.g. +91 99201 55431"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Email Address (Optional)</label>
            <Input
              type="email"
              value={newGuardianEmail}
              onChange={(e: any) => setNewGuardianEmail(e.target.value)}
              placeholder="e.g. pooja.sharma@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Relationship</label>
            <select
              value={newGuardianRelation}
              onChange={(e: any) => setNewGuardianRelation(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-brand-primary"
            >
              <option value="Child">Child / Daughter / Son</option>
              <option value="Parent">Parent / Mother / Father</option>
              <option value="Spouse">Spouse / Partner</option>
              <option value="Other">Sibling / Relative / Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Link Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
