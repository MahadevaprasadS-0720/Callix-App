import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { useCallHistory } from '../hooks/useCallHistory';
import { maskPhoneNumber, maskEmail } from '../utils/piiMasker';
import { 
  Settings as SettingsIcon, 
  Key, 
  ShieldCheck, 
  Sliders, 
  RotateCcw, 
  CheckCircle,
  Database,
  Download,
  Users,
  Eye,
  EyeOff,
  Bell,
  Lock,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  CreditCard,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateProfile, addGuardian, removeGuardian } = useAuth();
  const { calls, resetCalls } = useCallHistory();

  // API Keys state
  const [claudeKey, setClaudeKey] = useState('');
  const [deepgramKey, setDeepgramKey] = useState('');
  const [savedKeys, setSavedKeys] = useState(false);

  // Add guardian modal state
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState<'Parent' | 'Child' | 'Spouse' | 'Other'>('Child');

  // Permission settings per guardian state (persisted locally)
  const [transcriptAccess, setTranscriptAccess] = useState<Record<string, boolean>>({
    guard_1: true,
    guard_2: false,
  });

  // Export states
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  const toggleTranscriptPermission = (guardianId: string) => {
    setTranscriptAccess(prev => ({
      ...prev,
      [guardianId]: !prev[guardianId],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          updateProfile({ photoURL: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedKeys(true);
    setTimeout(() => setSavedKeys(false), 3000);
  };

  const handleCreateGuardian = (e: React.FormEvent) => {
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
    setIsAddGuardianOpen(false);
  };

  // Export Call Records to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(calls, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audio_guardian_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportMessage('JSON call history downloaded successfully.');
    setTimeout(() => setExportMessage(null), 3000);
  };

  // Export Call Records to CSV
  const handleExportCSV = () => {
    if (calls.length === 0) return;

    const headers = ['CallID', 'CallerNumber', 'CallerName', 'Date', 'DurationSeconds', 'Score', 'Verdict', 'Category', 'GuardianNotified'];
    const rows = calls.map(c => [
      c.callId,
      `"${c.callerNumber}"`,
      `"${c.callerName || 'Unknown'}"`,
      `"${new Date(c.startTime).toISOString()}"`,
      c.durationSeconds,
      c.finalScore,
      c.verdict,
      c.primaryCategory,
      c.guardianNotified ? 'TRUE' : 'FALSE'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `audio_guardian_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportMessage('CSV call history report downloaded successfully.');
    setTimeout(() => setExportMessage(null), 3000);
  };

  const handleResetData = () => {
    resetCalls();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-cyan" />
          Settings, Privacy & Account Preferences
        </h2>
        <p className="text-xs text-cyber-muted">
          Manage user profile, family guardian access delegation, in-call detection sensitivity, and privacy exports.
        </p>
      </div>

      {/* 1. Account & Subscription Profile Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border border-cyber-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="group relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-brand-primary shadow-glow-primary/20 shrink-0 bg-zinc-900 flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL.includes('googleusercontent.com') ? user.photoURL.replace(/=s\d+(-c)?$/, '=s256-c') : user.photoURL}
                  alt={user?.displayName || 'User Profile'}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
                  {(user?.displayName || 'CX').substring(0, 2).toUpperCase()}
                </span>
              )}
              <label 
                title="Change Profile Photo"
                className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-medium gap-0.5 z-10"
              >
                <Camera className="w-4 h-4 text-brand-cyan" />
                <span>Update</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
              </label>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{user?.displayName || 'Arjun Sharma'}</h3>
                <Badge variant="primary" size="sm">
                  {user?.plan || 'PRO_SHIELD'}
                </Badge>
              </div>
              <p className="text-xs font-mono text-brand-cyan">{maskPhoneNumber(user?.phoneNumber || '+91 98112 00412')}</p>
              <p className="text-xs text-cyber-muted">{maskEmail(user?.email || 'arjun.sharma@guardian.ai')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<CreditCard className="w-4 h-4 text-brand-cyan" />}
              onClick={() => alert('Subscription Tier: Guardian Pro Active. Includes unlimited real-time diarization & emergency SMS routing.')}
            >
              Manage Subscription
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Guardian Permissions & Delegation Manager */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base text-cyber-text">
                Family Guardian Delegation & Access Controls
              </h3>
              <p className="text-xs text-cyber-muted">
                Configure granular visibility permissions for each linked family member
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddGuardianOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Guardian
          </Button>
        </div>

        <div className="space-y-3 pt-1">
          {user?.guardianLinks.map((g) => {
            const hasTranscript = transcriptAccess[g.guardianId] ?? true;
            return (
              <div
                key={g.guardianId}
                className="p-4 rounded-xl bg-slate-900/70 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{g.name}</span>
                    <Badge variant="cyan" size="sm">
                      {g.relationship}
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-cyber-subtle">
                    {maskPhoneNumber(g.phone)} {g.email ? `• ${maskEmail(g.email)}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle Permission Button */}
                  <button
                    type="button"
                    onClick={() => toggleTranscriptPermission(g.guardianId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-colors ${
                      hasTranscript
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-950/80 text-cyber-muted border-cyber-border'
                    }`}
                  >
                    {hasTranscript ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-indigo-400" /> Full Transcripts Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-cyber-subtle" /> High-Risk Alerts Only
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeGuardian(g.guardianId)}
                    className="p-1.5 text-cyber-muted hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove Guardian"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. In-Call Detection Sensitivity & Privacy Preferences */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-cyber-border pb-3">
          <Sliders className="w-5 h-5 text-brand-cyan" />
          <div>
            <h3 className="font-bold text-base text-cyber-text">
              In-Call Threat Sensitivity & Privacy Rules
            </h3>
            <p className="text-xs text-cyber-muted">
              Control the AI detection threshold and telephony data retention preferences
            </p>
          </div>
        </div>

        {/* Sensitivity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-cyber-muted uppercase tracking-wider block">
            Detection Sensitivity Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                mode: 'STANDARD',
                title: 'Standard (Recommended)',
                desc: 'Balanced heuristic + Claude scoring (75+ trigger threshold).',
              },
              {
                mode: 'AGGRESSIVE',
                title: 'Aggressive (Elder Shield)',
                desc: 'Lower threshold (50+). Extra protective for elderly relatives.',
              },
              {
                mode: 'RELAXED',
                title: 'Relaxed (Business)',
                desc: 'Alerts only on confirmed fraud vectors (85+ threshold).',
              },
            ].map((item) => (
              <button
                key={item.mode}
                type="button"
                onClick={() =>
                  updateProfile({
                    preferences: { ...user!.preferences, riskSensitivity: item.mode as any },
                  })
                }
                className={`p-4 rounded-xl border text-left transition-all ${
                  user?.preferences.riskSensitivity === item.mode
                    ? 'border-brand-primary bg-brand-primary/15 shadow-glow-primary/20 text-white'
                    : 'border-cyber-border bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm">{item.title}</div>
                <p className="text-xs text-cyber-muted mt-1 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-3 border-t border-cyber-border/60">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-cyber-border">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">
                Automatic High-Risk Call Termination (95+ Score)
              </span>
              <p className="text-xs text-cyber-muted">
                Automatically hang up incoming calls when digital arrest or critical coercion is detected.
              </p>
            </div>
            <input
              type="checkbox"
              checked={user?.preferences.autoBlockHighRisk ?? true}
              onChange={(e) =>
                updateProfile({
                  preferences: { ...user!.preferences, autoBlockHighRisk: e.target.checked },
                })
              }
              className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-cyber-border">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">
                Audio Snippet Recording & Storage Opt-In
              </span>
              <p className="text-xs text-cyber-muted">
                Store encrypted 16kHz audio for forensic review. (Default: Off for maximum privacy).
              </p>
            </div>
            <input
              type="checkbox"
              checked={user?.preferences.audioRecordingOptIn ?? false}
              onChange={(e) =>
                updateProfile({
                  preferences: { ...user!.preferences, audioRecordingOptIn: e.target.checked },
                })
              }
              className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* 4. Data Export & Privacy GDPR Compliance */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base text-cyber-text">
                Data Portability & Forensic Export
              </h3>
              <p className="text-xs text-cyber-muted">
                Download your complete call records, diarized transcripts, and incident logs
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-cyber-muted leading-relaxed">
          Audio Guardian guarantees full user data ownership. You can download all telemetry dossiers in JSON or CSV format for submission to law enforcement or personal records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            leftIcon={<FileCode className="w-4 h-4 text-brand-cyan" />}
          >
            Export All Records (.JSON)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
          >
            Export Table (.CSV)
          </Button>
        </div>

        {exportMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            {exportMessage}
          </div>
        )}
      </Card>

      {/* 5. Optional Cloud AI API Credentials */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-cyan" />
            <h3 className="font-bold text-base text-cyber-text">AI Provider API Keys (Optional)</h3>
          </div>
          <Badge variant="cyan" size="sm">
            OFFLINE SIMULATION ACTIVE
          </Badge>
        </div>

        <p className="text-xs text-cyber-muted">
          The platform operates seamlessly in local simulation mode. If you wish to connect directly to Anthropic or Deepgram APIs in cloud production, input your API credentials below:
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-4 pt-1">
          <Input
            label="Anthropic Claude API Key"
            type="password"
            placeholder="sk-ant-api03-..."
            value={claudeKey}
            onChange={(e: any) => setClaudeKey(e.target.value)}
          />

          <Input
            label="Deepgram Speech-to-Text API Key"
            type="password"
            placeholder="dg_live_..."
            value={deepgramKey}
            onChange={(e: any) => setDeepgramKey(e.target.value)}
          />

          <div className="flex items-center justify-between pt-2">
            {savedKeys && (
              <span className="text-xs font-mono text-threat-safe flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Keys saved to session memory
              </span>
            )}
            <Button type="submit" variant="primary" size="sm" className="ml-auto">
              Save AI Credentials
            </Button>
          </div>
        </form>
      </Card>

      {/* 6. Clear Local Call Logs & Cache */}
      <Card className="p-6 space-y-3 bg-red-950/10 border border-red-500/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-red-400" />
              Clear Local Call Logs &amp; Telemetry Cache
            </h3>
            <p className="text-xs text-cyber-muted">
              Purge locally cached call records, session transcripts, and temporary forensic logs.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetData}
          >
            {resetDone ? 'Cache Cleared!' : 'Purge Local Cache'}
          </Button>
        </div>
      </Card>

      {/* Add Guardian Modal */}
      <Modal
        isOpen={isAddGuardianOpen}
        onClose={() => setIsAddGuardianOpen(false)}
        title="Link New Family Guardian"
      >
        <form onSubmit={handleCreateGuardian} className="space-y-4">
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
            <Button type="button" variant="ghost" onClick={() => setIsAddGuardianOpen(false)}>
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
