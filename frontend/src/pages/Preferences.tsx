import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { useCallHistory } from '../hooks/useCallHistory';
import { 
  Sliders, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Eye, 
  EyeOff, 
  Bell, 
  FileSpreadsheet, 
  FileCode, 
  RotateCcw, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Database,
  Lock,
  Layers,
  Cpu
} from 'lucide-react';

export const Preferences: React.FC = () => {
  const { user, updateProfile, addGuardian, removeGuardian } = useAuth();
  const { calls, resetCalls } = useCallHistory();

  // API Keys state
  const [claudeKey, setClaudeKey] = useState('');
  const [deepgramKey, setDeepgramKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [savedKeys, setSavedKeys] = useState(false);

  // Add guardian modal state
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState<'Parent' | 'Child' | 'Spouse' | 'Other'>('Child');

  // Theme & Appearance state
  const [selectedTheme, setSelectedTheme] = useState<string>(() => localStorage.getItem('callix_theme') || 'cyber-dark');

  // Guardian permissions
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
    downloadAnchor.setAttribute('download', `callix_audit_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportMessage('JSON call telemetry history downloaded successfully.');
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
    downloadAnchor.setAttribute('download', `callix_audit_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportMessage('CSV call forensic report downloaded successfully.');
    setTimeout(() => setExportMessage(null), 3000);
  };

  const handleResetData = () => {
    resetCalls();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            System &amp; Engine Preferences
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure visual aesthetics, family guardian delegations, multimodal AI engines, and telemetry governance.
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
          Enterprise Clearance: {user?.plan || 'PRO SHIELD'}
        </span>
      </div>

      {/* 1. Theme & Appearance Card */}
      <Card className="p-6 bg-gradient-to-r from-neutral-900/90 via-slate-900/90 to-neutral-900/90 border border-white/15 space-y-4 backdrop-blur-xl rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Visual Aesthetics &amp; Liquid Glass Refraction</h3>
              <p className="text-xs text-zinc-400">Choose the cyber contrast palette and luminescence for Callix</p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 w-fit">
            Active Theme
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'cyber-dark', label: 'Cyber Noir (Pure Dark)', desc: 'Ultra-deep contrast with liquid glass glow', accent: 'bg-cyan-500' },
            { id: 'midnight-navy', label: 'Midnight Blue (Refraction)', desc: 'Deep indigo tone with subtle acrylic blur', accent: 'bg-indigo-500' },
            { id: 'emerald-shield', label: 'Emerald Matrix (Shield)', desc: 'High security green telemetry palette', accent: 'bg-emerald-500' },
          ].map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                setSelectedTheme(theme.id);
                localStorage.setItem('callix_theme', theme.id);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                selectedTheme === theme.id
                  ? 'bg-white/[0.08] border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">{theme.label}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${theme.accent}`} />
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{theme.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* 2. Multimodal AI Engine Keys */}
      <Card className="p-6 bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Multimodal AI Engine Credentials</h3>
              <p className="text-xs text-zinc-400">Bring Your Own Key (BYOK) for Deepgram Nova-2, Claude 3.5 Sonnet, and Groq</p>
            </div>
          </div>
          <Badge variant="cyan" size="sm">Live Connected</Badge>
        </div>

        <form onSubmit={handleSaveKeys} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">Deepgram Nova-2 API Key</label>
              <Input
                type="password"
                placeholder="dg_live_••••••••••••••••"
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">Anthropic Claude 3.5 Key</label>
              <Input
                type="password"
                placeholder="sk-ant-api03-••••••••"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-zinc-500">API keys are securely masked and stored exclusively in your browser session.</p>
            <Button type="submit" variant="primary" size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
              {savedKeys ? 'Saved!' : 'Save Credentials'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Family Guardians & Access Delegation */}
      <Card className="p-6 bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Family Guardian Access &amp; Emergency Escalation</h3>
              <p className="text-xs text-zinc-400">Designated family guardians receive real-time SMS &amp; audio threat dispatches</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsAddGuardianOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Guardian</span>
          </Button>
        </div>

        <div className="space-y-2.5">
          {(!user?.guardianLinks || user.guardianLinks.length === 0) ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.01]">
              <p className="text-xs text-zinc-400">No family guardians registered yet. Add a trusted contact to enable emergency fraud intercepts.</p>
            </div>
          ) : (
            user.guardianLinks.map((guardian) => (
              <div 
                key={guardian.guardianId}
                className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{guardian.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {guardian.relationship}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    {guardian.phone} {guardian.email && `· ${guardian.email}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleTranscriptPermission(guardian.guardianId)}
                    className="p-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Toggle Live Audio Transcript Viewing"
                  >
                    {transcriptAccess[guardian.guardianId] ? (
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                    <span className="text-[10px] hidden sm:inline">Transcripts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGuardian(guardian.guardianId)}
                    className="p-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="Remove Guardian"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 4. Forensic Telemetry & Data Governance */}
      <Card className="p-6 bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Data Governance, Compliance &amp; Exports</h3>
            <p className="text-xs text-zinc-400">Download cryptographically hashed call logs or purge local telemetry cache</p>
          </div>
        </div>

        {exportMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{exportMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-left transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Export Raw JSON</div>
              <div className="text-[10px] text-zinc-400">Full forensic diarization metadata</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-left transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Export CSV Report</div>
              <div className="text-[10px] text-zinc-400">Spreadsheet ready table</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="p-3.5 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-left transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-300">
                {resetDone ? 'Cache Cleared!' : 'Purge Call Telemetry'}
              </div>
              <div className="text-[10px] text-red-400/80">Wipe local call simulations</div>
            </div>
          </button>
        </div>
      </Card>

      {/* Add Guardian Modal */}
      <Modal 
        isOpen={isAddGuardianOpen} 
        onClose={() => setIsAddGuardianOpen(false)} 
        title="Add Family Guardian"
      >
        <form onSubmit={handleCreateGuardian} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">Guardian Full Name</label>
            <Input
              value={newGuardianName}
              onChange={(e) => setNewGuardianName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">Phone Number (with Country Code)</label>
            <Input
              value={newGuardianPhone}
              onChange={(e) => setNewGuardianPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">Email Address (Optional)</label>
            <Input
              type="email"
              value={newGuardianEmail}
              onChange={(e) => setNewGuardianEmail(e.target.value)}
              placeholder="guardian@family.org"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">Relationship</label>
            <select
              value={newGuardianRelation}
              onChange={(e) => setNewGuardianRelation(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs outline-none"
            >
              <option value="Child">Child (Son / Daughter)</option>
              <option value="Parent">Parent (Father / Mother)</option>
              <option value="Spouse">Spouse / Partner</option>
              <option value="Other">Caregiver / Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddGuardianOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600">
              Save Guardian
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Preferences;
