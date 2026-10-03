import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Megaphone, 
  Sparkles, 
  Cpu, 
  Lock, 
  KeyRound, 
  Crown, 
  Check, 
  Sliders, 
  PhoneCall, 
  Radio, 
  RefreshCw,
  Building2,
  DollarSign,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  EmployeeRecord, 
  CandidateRecord, 
  JobPostingRecord, 
  LeaveRequestRecord, 
  ShiftRosterItem, 
  HrAuditLogRecord,
  EmergencyMemo,
  Department,
  ClearanceLevel,
  CandidateStage
} from '../types/adminHr.types';
import { adminHrService } from '../services/adminHrService';
import { getAdminHrEmail } from '../utils/adminPermissions';
import { AddEmployeeModal } from '../components/admin/AddEmployeeModal';
import { EmployeeDossierModal } from '../components/admin/EmployeeDossierModal';
import { PostJobModal } from '../components/admin/PostJobModal';
import { BroadcastMemoModal } from '../components/admin/BroadcastMemoModal';
import { StatCard } from '../components/common/StatCard';
import { cn } from '../utils/cn';

type ActiveTab = 'overview' | 'employees' | 'recruitment' | 'shifts-leaves' | 'compliance' | 'settings';

export const AdminHrPanel: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [jobs, setJobs] = useState<JobPostingRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>([]);
  const [shifts, setShifts] = useState<ShiftRosterItem[]>([]);
  const [logs, setLogs] = useState<HrAuditLogRecord[]>([]);
  const [memo, setMemo] = useState<EmergencyMemo | null>(null);

  // Search & Filter state for Employee Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedClearance, setSelectedClearance] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Candidate Filter
  const [candidateStageFilter, setCandidateStageFilter] = useState<string>('ALL');

  // Modals state
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [dossierEmployee, setDossierEmployee] = useState<EmployeeRecord | null>(null);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [memoModalOpen, setMemoModalOpen] = useState(false);

  // Time state for Bangalore / UTC live display
  const [currentTime, setCurrentTime] = useState<string>('');

  const reloadData = () => {
    setEmployees(adminHrService.getEmployees());
    setCandidates(adminHrService.getCandidates());
    setJobs(adminHrService.getJobs());
    setLeaveRequests(adminHrService.getLeaveRequests());
    setShifts(adminHrService.getShifts());
    setLogs(adminHrService.getAuditLogs());
    setMemo(adminHrService.getMemo());
  };

  useEffect(() => {
    reloadData();
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
      const matchesClearance = selectedClearance === 'ALL' || emp.clearanceLevel === selectedClearance;

      return matchesSearch && matchesDept && matchesClearance;
    });
  }, [employees, searchQuery, selectedDept, selectedClearance]);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      return candidateStageFilter === 'ALL' || cand.stage === candidateStageFilter;
    });
  }, [candidates, candidateStageFilter]);

  const pendingLeavesCount = useMemo(() => {
    return leaveRequests.filter((r) => r.status === 'Pending').length;
  }, [leaveRequests]);

  const onDutyCount = useMemo(() => {
    return employees.filter((e) => e.status === 'On Duty').length;
  }, [employees]);

  // Leave approval / reject
  const handleReviewLeave = (id: string, decision: 'Approved' | 'Rejected') => {
    adminHrService.reviewLeaveRequest(id, decision);
    showToast({
      type: decision === 'Approved' ? 'success' : 'danger',
      title: `Leave Request ${decision}`,
      message: `Employee notification dispatched.`,
    });
    reloadData();
  };

  // Candidate stage change
  const handleAdvanceCandidate = (id: string, currentStage: CandidateStage) => {
    const stageOrder: CandidateStage[] = [
      'Applied',
      'Screening',
      'Voice AI Challenge',
      'HR Cultural Interview',
      'Offer Sent',
      'Hired',
    ];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      adminHrService.updateCandidateStage(id, nextStage);
      showToast({
        type: 'success',
        title: 'Candidate Advanced',
        message: `Progressed to "${nextStage}".`,
      });
      reloadData();
    }
  };

  // Export full JSON report
  const handleExportData = () => {
    const jsonStr = adminHrService.exportHrDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Callix_Workforce_Security_Audit_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({
      type: 'info',
      title: 'Personnel Database Exported',
      message: 'Encrypted JSON audit report downloaded to local device.',
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-12 select-none">
      {/* Top Banner: Executive Identification & Clearance Indicator */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-neutral-950 via-indigo-950/40 to-neutral-950 border border-white/15 shadow-[0_15px_45px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.2)] overflow-hidden">
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full [background:radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)] pointer-events-none blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 rounded-full [background:radial-gradient(circle,rgba(6,182,212,0.14)_0%,transparent_70%)] pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Root HR Authority: LEVEL 5 CLEARANCE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Executive People Operations & SecOps Portal
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Global workforce administration, telephony fraud monitoring shift roster, talent acquisition pipeline, and security clearance governance for Callix AI.
            </p>
          </div>

          {/* Quick Executive Profile Pill & Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left font-mono">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{user?.displayName || 'Administrator'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[170px]">
                  {user?.email || getAdminHrEmail() || 'Administrator'}
                </div>
                <div className="text-[9px] text-cyan-300 mt-0.5">
                  IST {currentTime || 'Live Sync'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAddEmpOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_4px_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer transform-gpu hover:-translate-y-0.5 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Onboard Personnel</span>
              </button>

              <button
                type="button"
                onClick={() => setMemoModalOpen(true)}
                className="p-2.5 rounded-2xl text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                title="Broadcast Operational HR Memo"
              >
                <Megaphone className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={handleExportData}
                className="p-2.5 rounded-2xl text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                title="Download Encrypted HR Database Dossier"
              >
                <Download className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Operational Directive Banner (if active) */}
      {memo && memo.active && (
        <div className={cn(
          'p-4 rounded-2xl border flex items-start justify-between gap-4 backdrop-blur-md animate-fade-in shadow-lg',
          memo.urgency === 'CRITICAL' 
            ? 'bg-red-950/40 border-red-500/40 text-red-200'
            : memo.urgency === 'WARNING'
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
        )}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-current animate-pulse" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-extrabold px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
                  {memo.urgency} DIRECTIVE
                </span>
                <h4 className="text-sm font-bold text-white">{memo.title}</h4>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{memo.message}</p>
              <div className="text-[10px] text-zinc-400 font-mono pt-1">
                Issued by {memo.postedBy} • Effective across all 148 active telephony terminals
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMemoModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shrink-0 cursor-pointer"
          >
            Manage Memo
          </button>
        </div>
      )}

      {/* Executive Stat Cards (6 Responsive Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Personnel"
          value={employees.length + 140}
          change="+8 this month"
          isPositive
          subtitle="Worldwide"
          icon={<Users className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Active On Shift"
          value={onDutyCount + 38}
          change="100% capacity"
          isPositive
          subtitle="Monitoring fraud"
          icon={<Activity className="w-5 h-5" />}
          variant="cyan"
        />
        <StatCard
          title="Talent Pipeline"
          value={candidates.length + 12}
          change="4 interviews today"
          isPositive
          subtitle="In evaluation"
          icon={<Briefcase className="w-5 h-5" />}
          variant="neutral"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeavesCount}
          change={pendingLeavesCount > 0 ? 'Requires action' : 'All cleared'}
          isPositive={pendingLeavesCount === 0}
          subtitle="Leave & shifts"
          icon={<Calendar className="w-5 h-5" />}
          variant={pendingLeavesCount > 0 ? 'fraud' : 'safe'}
        />
        <StatCard
          title="Security Clearance"
          value="100%"
          change="SOC2 / HIPAA"
          isPositive
          subtitle="Audited"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="safe"
        />
        <StatCard
          title="Monthly Payroll"
          value="₹48.2L"
          change="Status: Disbursed"
          isPositive
          subtitle="Cycle completed"
          icon={<DollarSign className="w-5 h-5" />}
          variant="cyan"
        />
      </div>

      {/* Liquid-Glass Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Workforce Pulse', icon: <Activity className="w-4 h-4" /> },
          { id: 'employees', label: 'Personnel Directory', icon: <Users className="w-4 h-4" />, badge: employees.length },
          { id: 'recruitment', label: 'Talent Acquisition', icon: <Briefcase className="w-4 h-4" />, badge: candidates.length },
          { id: 'shifts-leaves', label: '24/7 Shifts & Leaves', icon: <Calendar className="w-4 h-4" />, badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined, badgeColor: 'bg-red-500/20 text-red-300' },
          { id: 'compliance', label: 'Clearance & Audits', icon: <Lock className="w-4 h-4" /> },
          { id: 'settings', label: 'SuperAdmin Controls', icon: <Sliders className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer transform-gpu',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-white/[0.18] to-white/[0.08] text-white border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.25)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold', tab.badgeColor || 'bg-white/10 text-white')}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW / WORKFORCE PULSE */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Department Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Voice AI Research</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold">42 Analysts</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Reverse-engineering ElevenLabs & OpenAI synthetic voices; building real-time spectrogram neural classifiers.
              </p>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SecOps & Threat Intel</span>
                </span>
                <span className="font-mono text-emerald-300 font-bold">38 Analysts</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                24/7 monitoring of digital arrest fraud syndicates, CBI impersonation spikes, and telecom SIM spoofing.
              </p>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-purple-400" />
                  <span>Telephony Engineering</span>
                </span>
                <span className="font-mono text-purple-300 font-bold">32 Engineers</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Carrier trunking, SIP low-latency proxy routing, Truecaller Live caller ID synchronization clusters.
              </p>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* Active Shift Telephony Grid Preview */}
          <div className="rounded-3xl bg-neutral-950/80 border border-white/10 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Real-Time On-Duty Roster</h3>
                <p className="text-xs text-zinc-400">Personnel currently signed into live fraud detection workstations</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('shifts-leaves')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Shifts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 pl-2">Personnel</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Clearance</th>
                    <th className="pb-3">Workstation Node</th>
                    <th className="pb-3">Shift Rotation</th>
                    <th className="pb-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {employees.slice(0, 5).map((emp) => (
                    <tr 
                      key={emp.id} 
                      onClick={() => setDossierEmployee(emp)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-3 pl-2 flex items-center gap-3">
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <div className="font-bold text-white">{emp.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{emp.id}</div>
                        </div>
                      </td>
                      <td className="py-3 text-zinc-300">{emp.department}</td>
                      <td className="py-3 font-mono">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-semibold border',
                          emp.clearanceLevel === 'LEVEL_5' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                          emp.clearanceLevel === 'LEVEL_4' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                          emp.clearanceLevel === 'LEVEL_3' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                          'bg-zinc-800 text-zinc-300 border-zinc-700'
                        )}>
                          {emp.clearanceLevel}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-400 font-mono text-[11px]">{emp.assignedWorkstation}</td>
                      <td className="py-3 text-zinc-400 text-[11px]">{emp.shift}</td>
                      <td className="py-3 pr-2 text-right">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold',
                          emp.status === 'On Duty' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                          emp.status === 'Active' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                          emp.status === 'On Leave' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                          'bg-zinc-800 text-zinc-400'
                        )}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{emp.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EMPLOYEES / PERSONNEL DIRECTORY */}
      {activeTab === 'employees' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-3xl bg-neutral-950/80 border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, email, or employee ID..."
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-2xl px-4 py-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-neutral-900 border border-white/10 focus:border-cyan-400 rounded-2xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Voice AI Research">Voice AI Research</option>
              <option value="SecOps & Threat Intel">SecOps & Threat Intel</option>
              <option value="Telephony Engineering">Telephony Engineering</option>
              <option value="Compliance & Legal">Compliance & Legal</option>
              <option value="Incident Response">Incident Response</option>
              <option value="Executive & HR">Executive & HR</option>
            </select>

            {/* Clearance Filter */}
            <select
              value={selectedClearance}
              onChange={(e) => setSelectedClearance(e.target.value)}
              className="bg-neutral-900 border border-white/10 focus:border-cyan-400 rounded-2xl px-3 py-2 text-xs text-zinc-300 focus:outline-none font-mono"
            >
              <option value="ALL">All Clearances</option>
              <option value="LEVEL_1">Level 1 - Basic</option>
              <option value="LEVEL_2">Level 2 - SecOps</option>
              <option value="LEVEL_3">Level 3 - Forensic</option>
              <option value="LEVEL_4">Level 4 - Neural Lead</option>
              <option value="LEVEL_5">Level 5 - HR SuperAdmin</option>
            </select>

            <button
              type="button"
              onClick={() => setAddEmpOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Personnel</span>
            </button>
          </div>

          {/* Employee Records Table */}
          <div className="rounded-3xl bg-neutral-950/80 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="py-4 pl-6">Personnel & Contact</th>
                    <th className="py-4">Role & Department</th>
                    <th className="py-4">Clearance Level</th>
                    <th className="py-4">Workstation Node</th>
                    <th className="py-4">Compensation</th>
                    <th className="py-4">Status</th>
                    <th className="py-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredEmployees.map((emp) => (
                    <tr 
                      key={emp.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={emp.avatar} 
                            alt={emp.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-1 ring-white/15 group-hover:scale-105 transition-transform" 
                          />
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{emp.name}</span>
                              {emp.clearanceLevel === 'LEVEL_5' && (
                                <Crown className="w-3 h-3 text-amber-400" />
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 font-mono">{emp.email}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{emp.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="text-zinc-200 font-semibold">{emp.role}</div>
                        <div className="text-[10px] text-zinc-400">{emp.department}</div>
                      </td>

                      <td className="py-3.5 font-mono">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border',
                          emp.clearanceLevel === 'LEVEL_5' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                          emp.clearanceLevel === 'LEVEL_4' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                          emp.clearanceLevel === 'LEVEL_3' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' :
                          'bg-zinc-800 text-zinc-300 border-zinc-700'
                        )}>
                          <Shield className="w-3 h-3" />
                          <span>{emp.clearanceLevel}</span>
                        </span>
                      </td>

                      <td className="py-3.5 text-zinc-300 font-mono text-[11px]">
                        <div>{emp.assignedWorkstation}</div>
                        <div className="text-[10px] text-zinc-500">{emp.city || 'Bengaluru HQ'}</div>
                      </td>

                      <td className="py-3.5 font-mono text-emerald-400 text-xs">
                        {emp.salaryAnnual}
                      </td>

                      <td className="py-3.5">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold',
                          emp.status === 'On Duty' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                          emp.status === 'Active' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                          emp.status === 'On Leave' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                          'bg-red-500/15 text-red-300 border border-red-500/30'
                        )}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{emp.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => setDossierEmployee(emp)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: RECRUITMENT & TALENT PIPELINE */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6 animate-fade-in">
          {/* Open Requisitions Bar */}
          <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Open Telephony Requisitions</h3>
                <p className="text-xs text-zinc-400">Active hiring requisitions for Callix engineering and fraud analysis</p>
              </div>
              <button
                type="button"
                onClick={() => setPostJobOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md transition-all cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>+ Post New Role</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {job.urgency} PRIORITY
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{job.applicantsCount} Applicants</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{job.title}</h4>
                  <div className="text-[11px] text-zinc-400">{job.department} • {job.location}</div>
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold pt-1">
                    {job.salaryRange}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Pipeline */}
          <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Candidate Evaluation Pipeline</h3>
                <p className="text-xs text-zinc-400">Advance candidates through audio deepfake challenges and HR cultural fit</p>
              </div>

              {/* Stage Filter */}
              <select
                value={candidateStageFilter}
                onChange={(e) => setCandidateStageFilter(e.target.value)}
                className="bg-neutral-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="ALL">All Stages</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Voice AI Challenge">Voice AI Challenge</option>
                <option value="HR Cultural Interview">HR Cultural Interview</option>
                <option value="Offer Sent">Offer Sent</option>
                <option value="Hired">Hired</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 pl-3">Candidate</th>
                    <th className="pb-3">Role Applied</th>
                    <th className="pb-3">Experience</th>
                    <th className="pb-3">Acoustic Score</th>
                    <th className="pb-3">Pipeline Stage</th>
                    <th className="pb-3 pr-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pl-3">
                        <div className="font-bold text-white text-xs">{cand.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{cand.email}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="text-zinc-200">{cand.roleApplied}</div>
                        <div className="text-[10px] text-zinc-400">{cand.department}</div>
                      </td>
                      <td className="py-3.5 text-zinc-300 text-[11px]">{cand.experience}</td>
                      <td className="py-3.5 font-mono text-cyan-300 font-bold">{cand.score}% match</td>
                      <td className="py-3.5 font-mono">
                        <span className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-semibold border',
                          cand.stage === 'Offer Sent' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                          cand.stage === 'HR Cultural Interview' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                          cand.stage === 'Voice AI Challenge' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' :
                          'bg-zinc-800 text-zinc-300 border-zinc-700'
                        )}>
                          {cand.stage}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-right">
                        {cand.stage !== 'Hired' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceCandidate(cand.id, cand.stage)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <span>Advance Stage</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: 24/7 SHIFTS & LEAVE MANAGEMENT */}
      {activeTab === 'shifts-leaves' && (
        <div className="space-y-6 animate-fade-in">
          {/* Pending Leave Requests */}
          <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Personnel Leave Applications</h3>
                <p className="text-xs text-zinc-400">Review time-off requests, sick leaves, and burnout recovery applications</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {pendingLeavesCount} Pending Review
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 pl-3">Employee</th>
                    <th className="pb-3">Leave Type</th>
                    <th className="pb-3">Dates & Duration</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-3 text-right">HR Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pl-3">
                        <div className="font-bold text-white">{req.employeeName}</div>
                        <div className="text-[10px] text-zinc-400">{req.department}</div>
                      </td>
                      <td className="py-3.5 font-mono text-zinc-300">{req.type}</td>
                      <td className="py-3.5 font-mono text-[11px] text-zinc-300">
                        <div>{req.startDate} to {req.endDate}</div>
                        <div className="text-[10px] text-cyan-400">({req.days} days)</div>
                      </td>
                      <td className="py-3.5 text-zinc-300 max-w-xs text-xs">{req.reason}</td>
                      <td className="py-3.5">
                        <span className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold',
                          req.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                          req.status === 'Pending' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                          'bg-red-500/15 text-red-300 border border-red-500/30'
                        )}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleReviewLeave(req.id, 'Approved')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewLeave(req.id, 'Rejected')}
                              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-[11px] font-mono">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 24/7 SecOps Shift Rotation Matrix */}
          <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">24/7 Telephony SecOps Shift Rotation</h3>
            <p className="text-xs text-zinc-400">Guarantees zero-blindspot real-time AI scam intercept across global timezones</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shifts.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.shiftName}</span>
                    <span className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded-full font-bold',
                      s.health === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    )}>
                      {s.health}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">{s.timeRange}</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="text-zinc-500">Lead Analyst:</span>
                    <span className="font-semibold text-white">{s.leadName}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono truncate">{s.telephonyCluster}</div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Staffing Capacity:</span>
                    <span className="font-mono text-emerald-300 font-bold">{s.onDutyCount} / {s.targetCapacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: COMPLIANCE & SECURITY AUDIT */}
      {activeTab === 'compliance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Security Clearance Levels Matrix */}
          <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Callix Clearance Governance Matrix</h3>
            <p className="text-xs text-zinc-400">Hierarchy of cryptographic access to voice synthesizers, carrier lookup APIs, and audio records</p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { lvl: 'LEVEL_1', title: 'Basic Operator', desc: 'Internal ticketing & CRM', badge: 'bg-zinc-800 text-zinc-300' },
                { lvl: 'LEVEL_2', title: 'SecOps Analyst', desc: 'Live call telemetry review', badge: 'bg-cyan-500/15 text-cyan-300' },
                { lvl: 'LEVEL_3', title: 'Forensic Lead', desc: 'Raw spectrogram & voice clone analysis', badge: 'bg-indigo-500/15 text-indigo-300' },
                { lvl: 'LEVEL_4', title: 'Neural Architect', desc: 'Core model weights & SIP cluster control', badge: 'bg-purple-500/15 text-purple-300' },
                { lvl: 'LEVEL_5', title: 'Chief HR / SuperAdmin', desc: 'Full root authority & workforce termination (Mahi)', badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]' },
              ].map((c) => (
                <div key={c.lvl} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className={cn('text-[10px] font-mono font-bold px-2 py-0.5 rounded inline-block', c.badge)}>
                    {c.lvl}
                  </div>
                  <h4 className="text-xs font-bold text-white">{c.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tamper-Proof Audit Log */}
          <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Administrative Audit Trail</h3>
                <p className="text-xs text-zinc-400">Immutable ledger of security clearance modifications, onboardings, and directives</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SHA-256 Verifiable</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 pl-3">Action</th>
                    <th className="pb-3">Actor Authority</th>
                    <th className="pb-3">Target Subject</th>
                    <th className="pb-3">Network IP</th>
                    <th className="pb-3 pr-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium font-mono text-[11px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pl-3 font-sans text-xs font-semibold text-white">
                        {log.action}
                      </td>
                      <td className="py-3 text-indigo-300">{log.actor}</td>
                      <td className="py-3 text-zinc-300">{log.target}</td>
                      <td className="py-3 text-zinc-500">{log.ip}</td>
                      <td className="py-3 pr-3 text-right text-zinc-400">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: SETTINGS / SUPERADMIN CONTROLS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in max-w-4xl">
          <div className="p-6 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Root HR Authority Configuration</h3>
                <p className="text-xs text-zinc-400">Master cryptographic keys and access whitelist</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">ADMINISTRATOR SESSION:</span>
                <span className="font-bold text-emerald-400">{user?.email || getAdminHrEmail()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">CLEARANCE TIER:</span>
                <span className="font-bold text-white">LEVEL_5_ROOT_EXECUTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">MFA HARDWARE KEY:</span>
                <span className="text-cyan-300">Yubikey FIPS-140-2 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">SUPERADMIN NAME:</span>
                <span className="text-zinc-200">Mahadevaprasad S (Mahi)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Full Encrypted Workforce JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast({
                    type: 'success',
                    title: 'Integrity Check Passed',
                    message: 'All 148 personnel digital credentials, NDAs, and biometric hashes verified.',
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credential Hashes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={addEmpOpen}
        onClose={() => setAddEmpOpen(false)}
        onEmployeeAdded={reloadData}
      />

      <EmployeeDossierModal
        employee={dossierEmployee}
        isOpen={!!dossierEmployee}
        onClose={() => setDossierEmployee(null)}
        onUpdate={reloadData}
      />

      <PostJobModal
        isOpen={postJobOpen}
        onClose={() => setPostJobOpen(false)}
        onJobPosted={reloadData}
      />

      <BroadcastMemoModal
        isOpen={memoModalOpen}
        onClose={() => setMemoModalOpen(false)}
        onMemoUpdated={reloadData}
      />
    </div>
  );
};
