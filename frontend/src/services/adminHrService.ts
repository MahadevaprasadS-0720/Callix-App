import { 
  EmployeeRecord, 
  CandidateRecord, 
  JobPostingRecord, 
  LeaveRequestRecord, 
  ShiftRosterItem, 
  HrAuditLogRecord,
  EmergencyMemo,
  ClearanceLevel,
  CandidateStage
} from '../types/adminHr.types';

const STORAGE_KEY = 'callix_admin_hr_database_v1';

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'EMP-1001',
    name: 'Mahadevaprasad S',
    email: (import.meta.env.VITE_ADMIN_HR_EMAIL as string) || 'admin@callix.ai',
    phone: '+91 98765 43210',
    department: 'Executive & HR',
    role: 'Chief HR Officer & Global Telephony SecOps Director',
    clearanceLevel: 'LEVEL_5',
    status: 'Active',
    shift: 'Executive Flexible (Bangalore Core)',
    joinedDate: '2023-01-15',
    performanceScore: 5.0,
    assignedWorkstation: 'Executive Suite - Node SEC-01',
    salaryAnnual: '₹48,00,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    city: 'Mysore / Bengaluru',
    emergencyContact: '+91 98450 99881',
    notes: 'Super Admin master cryptographic key holder. Oversees all workforce security clearance.',
  },
  {
    id: 'EMP-1002',
    name: 'Dr. Aarav Deshmukh',
    email: 'aarav.d@callix.ai',
    phone: '+91 98450 11234',
    department: 'Voice AI Research',
    role: 'Principal Audio Synthesizer Reverse-Engineer',
    clearanceLevel: 'LEVEL_4',
    status: 'On Duty',
    shift: 'Morning (06:00 - 14:00 UTC)',
    joinedDate: '2023-06-10',
    performanceScore: 4.9,
    assignedWorkstation: 'Acoustic Lab Workstation A-09',
    salaryAnnual: '₹36,00,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    city: 'Bengaluru',
    notes: 'Architected the neural spectral analysis pipeline for scam voice fingerprinting.',
  },
  {
    id: 'EMP-1003',
    name: 'Elena Rostova',
    email: 'elena.r@callix.ai',
    phone: '+44 7700 900142',
    department: 'SecOps & Threat Intel',
    role: 'Senior Telephony Scam Hunter & Heuristic Lead',
    clearanceLevel: 'LEVEL_3',
    status: 'On Duty',
    shift: 'Evening (14:00 - 22:00 UTC)',
    joinedDate: '2023-09-01',
    performanceScore: 4.8,
    assignedWorkstation: 'SecOps Threat Desk T-12',
    salaryAnnual: '$140,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    city: 'London / Remote',
    notes: 'Intercepted 12,000+ impersonation campaigns targeting senior citizens.',
  },
  {
    id: 'EMP-1004',
    name: 'Vikram Singhania',
    email: 'vikram.s@callix.ai',
    phone: '+91 99801 44521',
    department: 'Telephony Engineering',
    role: 'VoIP SIP Trunking Infrastructure Architect',
    clearanceLevel: 'LEVEL_4',
    status: 'Active',
    shift: 'Morning (06:00 - 14:00 UTC)',
    joinedDate: '2024-02-14',
    performanceScore: 4.9,
    assignedWorkstation: 'Carrier Grid Rack 04',
    salaryAnnual: '₹32,00,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    city: 'Bengaluru',
    notes: 'Handles high-throughput Asterisk clustering and truecaller live directory replication.',
  },
  {
    id: 'EMP-1005',
    name: 'Priya Nair',
    email: 'priya.n@callix.ai',
    phone: '+91 98210 77312',
    department: 'Compliance & Legal',
    role: 'Global Telecom Privacy & Regulatory Officer',
    clearanceLevel: 'LEVEL_3',
    status: 'Active',
    shift: 'General (09:00 - 18:00 IST)',
    joinedDate: '2023-11-20',
    performanceScore: 4.7,
    assignedWorkstation: 'Legal Operations Desk L-03',
    salaryAnnual: '₹28,00,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    city: 'Mumbai',
    notes: 'Ensures compliance with TRAI, FCC, and European GDPR telephony interception mandates.',
  },
  {
    id: 'EMP-1006',
    name: 'Marcus Vance',
    email: 'marcus.v@callix.ai',
    phone: '+1 (415) 890-4411',
    department: 'Incident Response',
    role: 'Voice Hijack Incident Commander',
    clearanceLevel: 'LEVEL_3',
    status: 'On Duty',
    shift: 'Night SecOps (22:00 - 06:00 UTC)',
    joinedDate: '2024-01-08',
    performanceScore: 4.9,
    assignedWorkstation: 'Dispatch Pod Alpha',
    salaryAnnual: '$135,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    city: 'San Francisco',
    notes: 'Night rotation commander for real-time deepfake extortion call takedowns.',
  },
  {
    id: 'EMP-1007',
    name: 'Ananya Iyer',
    email: 'ananya.i@callix.ai',
    phone: '+91 97401 22890',
    department: 'Voice AI Research',
    role: 'Deepfake Spectral Frequency Analyst',
    clearanceLevel: 'LEVEL_2',
    status: 'On Duty',
    shift: 'Morning (06:00 - 14:00 UTC)',
    joinedDate: '2024-04-15',
    performanceScore: 4.8,
    assignedWorkstation: 'Acoustic Lab Workstation A-03',
    salaryAnnual: '₹22,00,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    city: 'Bengaluru',
    notes: 'Specializes in detecting robotic voice artifacts and TTS breath inconsistencies.',
  },
  {
    id: 'EMP-1008',
    name: 'Devon Clark',
    email: 'devon.c@callix.ai',
    phone: '+1 (212) 555-0199',
    department: 'SecOps & Threat Intel',
    role: 'Carrier Routing & SIM-Swap Forensic Investigator',
    clearanceLevel: 'LEVEL_3',
    status: 'On Leave',
    shift: 'Flexible Rotation',
    joinedDate: '2023-08-12',
    performanceScore: 4.6,
    assignedWorkstation: 'SecOps Threat Desk T-05',
    salaryAnnual: '$128,000 / yr',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    city: 'New York',
    notes: 'Currently on approved personal leave.',
  },
];

const INITIAL_CANDIDATES: CandidateRecord[] = [
  {
    id: 'CAND-2001',
    name: 'Dr. Kavit Ramanathan',
    email: 'kavit.r@ai-audio.org',
    phone: '+91 99120 44556',
    roleApplied: 'Principal Neural Vocoder Architect',
    department: 'Voice AI Research',
    stage: 'Voice AI Challenge',
    experience: '8+ yrs (Ex-IISc Speech Lab)',
    appliedDate: '2026-09-22',
    score: 96,
    notes: 'Submitted flawless audio reconstruction code benchmarked on ElevenLabs spoof sets.',
  },
  {
    id: 'CAND-2002',
    name: 'Sarah Jenkins',
    email: 'sarah.j@telecomsec.io',
    phone: '+1 (312) 678-9921',
    roleApplied: 'Senior Telephony Fraud Heuristic Lead',
    department: 'SecOps & Threat Intel',
    stage: 'HR Cultural Interview',
    experience: '6 yrs (Ex-AT&T Security)',
    appliedDate: '2026-09-26',
    score: 91,
    notes: 'Passed technical screening with flying colors. Awaiting final executive interview with Mahi.',
  },
  {
    id: 'CAND-2003',
    name: 'Aditya Hegde',
    email: 'aditya.h@mysore-tech.edu',
    phone: '+91 94481 33221',
    roleApplied: 'WebRTC Low-Latency Audio DSP Engineer',
    department: 'Telephony Engineering',
    stage: 'Offer Sent',
    experience: '5 yrs (Karnataka Telephony Systems)',
    appliedDate: '2026-09-15',
    score: 94,
    notes: 'Offer package extended at ₹28 LPA. Awaiting candidate formal signature.',
  },
  {
    id: 'CAND-2004',
    name: 'Meera Sen',
    email: 'meera.sen@cbi-cyber.gov.in',
    phone: '+91 98110 55432',
    roleApplied: 'Global Regulatory Telephony Compliance Lead',
    department: 'Compliance & Legal',
    stage: 'Screening',
    experience: '9 yrs (Special Cyber Task Force)',
    appliedDate: '2026-09-30',
    score: 88,
    notes: 'Resume screened. Impressive background prosecuting digital arrest scam syndicates.',
  },
];

const INITIAL_JOBS: JobPostingRecord[] = [
  {
    id: 'JOB-301',
    title: 'Senior Deepfake Audio Forensic Engineer',
    department: 'Voice AI Research',
    location: 'Bengaluru HQ (Hybrid)',
    type: 'Full-Time',
    applicantsCount: 34,
    status: 'Active',
    salaryRange: '₹32L - ₹42L PA',
    postedDate: '2026-09-10',
    urgency: 'HIGH',
  },
  {
    id: 'JOB-302',
    title: 'Real-Time Voice Scam Heuristic Dispatcher',
    department: 'SecOps & Threat Intel',
    location: 'Remote (24/7 SecOps Rotation)',
    type: 'Full-Time',
    applicantsCount: 22,
    status: 'Active',
    salaryRange: '$90k - $125k',
    postedDate: '2026-09-18',
    urgency: 'HIGH',
  },
  {
    id: 'JOB-303',
    title: 'VoIP SIP Trunking Security Architect',
    department: 'Telephony Engineering',
    location: 'Bengaluru HQ',
    type: 'Full-Time',
    applicantsCount: 14,
    status: 'Active',
    salaryRange: '₹28L - ₹38L PA',
    postedDate: '2026-09-24',
    urgency: 'MEDIUM',
  },
];

const INITIAL_LEAVE_REQUESTS: LeaveRequestRecord[] = [
  {
    id: 'LR-4001',
    employeeId: 'EMP-1008',
    employeeName: 'Devon Clark',
    department: 'SecOps & Threat Intel',
    type: 'Annual Vacation',
    startDate: '2026-10-05',
    endDate: '2026-10-10',
    days: 5,
    reason: 'Family vacation and attending cyber conference in Seattle.',
    status: 'Approved',
    appliedAt: '2026-09-28',
  },
  {
    id: 'LR-4002',
    employeeId: 'EMP-1007',
    employeeName: 'Ananya Iyer',
    department: 'Voice AI Research',
    type: 'Burnout Recovery',
    startDate: '2026-10-06',
    endDate: '2026-10-07',
    days: 2,
    reason: 'Rest recovery following 72-hour continuous CBI scam wave mitigation sprint.',
    status: 'Pending',
    appliedAt: '2026-10-02',
  },
  {
    id: 'LR-4003',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Nair',
    department: 'Compliance & Legal',
    type: 'Sick / Medical',
    startDate: '2026-10-08',
    endDate: '2026-10-08',
    days: 1,
    reason: 'Scheduled diagnostic dental procedure.',
    status: 'Pending',
    appliedAt: '2026-10-03',
  },
];

const INITIAL_SHIFTS: ShiftRosterItem[] = [
  {
    id: 'SHIFT-01',
    shiftName: 'Morning Telephony Shield',
    timeRange: '06:00 - 14:00 UTC',
    leadName: 'Dr. Aarav Deshmukh',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    onDutyCount: 16,
    targetCapacity: 16,
    health: 'Optimal',
    telephonyCluster: 'Cluster APAC-South-1 (BLR)',
  },
  {
    id: 'SHIFT-02',
    shiftName: 'Afternoon Global Intercept',
    timeRange: '14:00 - 22:00 UTC',
    leadName: 'Elena Rostova',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    onDutyCount: 18,
    targetCapacity: 18,
    health: 'Optimal',
    telephonyCluster: 'Cluster EU-West-2 (LHR)',
  },
  {
    id: 'SHIFT-03',
    shiftName: 'Night SecOps Rapid Intercept',
    timeRange: '22:00 - 06:00 UTC',
    leadName: 'Marcus Vance',
    leadAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    onDutyCount: 12,
    targetCapacity: 10,
    health: 'Surge Alert',
    telephonyCluster: 'Cluster US-West-1 (SFO)',
  },
];

const INITIAL_LOGS: HrAuditLogRecord[] = [
  {
    id: 'LOG-901',
    action: 'Executive HR Portal Authentication Verified',
    actor: 'Root Administrator',
    target: 'Level 5 Master Console',
    timestamp: 'Just now',
    ip: '106.51.72.19 (Bengaluru, IN)',
    type: 'SECURITY',
  },
  {
    id: 'LOG-902',
    action: 'Granted Top Secret Clearance LEVEL_4',
    actor: 'Chief HR Officer (Mahi)',
    target: 'EMP-1002 (Dr. Aarav Deshmukh)',
    timestamp: '2 hours ago',
    ip: '106.51.72.19',
    type: 'CLEARANCE',
  },
  {
    id: 'LOG-903',
    action: 'Approved Annual Leave Request',
    actor: 'Chief HR Officer (Mahi)',
    target: 'EMP-1008 (Devon Clark)',
    timestamp: 'Yesterday',
    ip: '106.51.72.19',
    type: 'LEAVE',
  },
  {
    id: 'LOG-904',
    action: 'Executed Monthly Telephony Security Payroll Cycle',
    actor: 'Executive HR Automated Vault',
    target: '148 Active Personnel',
    timestamp: '3 days ago',
    ip: '10.0.4.1 (Internal SecOps VPN)',
    type: 'PAYROLL',
  },
];

const INITIAL_MEMO: EmergencyMemo = {
  id: 'MEMO-01',
  title: 'Protocol Alpha: Heightened Voice Deepfake Awareness During Festive Surge',
  message: 'All Level 2+ Telephony Analysts must perform double forensic spectrogram checks on all banking/CBI impersonation vectors. Overtime allowances automatically credited.',
  urgency: 'WARNING',
  postedBy: 'Chief HR Officer Mahi',
  timestamp: '2026-10-03',
  active: true,
};

interface StoredHrData {
  employees: EmployeeRecord[];
  candidates: CandidateRecord[];
  jobs: JobPostingRecord[];
  leaveRequests: LeaveRequestRecord[];
  shifts: ShiftRosterItem[];
  logs: HrAuditLogRecord[];
  memo: EmergencyMemo | null;
}

class AdminHrService {
  private loadData(): StoredHrData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          employees: parsed.employees || INITIAL_EMPLOYEES,
          candidates: parsed.candidates || INITIAL_CANDIDATES,
          jobs: parsed.jobs || INITIAL_JOBS,
          leaveRequests: parsed.leaveRequests || INITIAL_LEAVE_REQUESTS,
          shifts: parsed.shifts || INITIAL_SHIFTS,
          logs: parsed.logs || INITIAL_LOGS,
          memo: parsed.memo !== undefined ? parsed.memo : INITIAL_MEMO,
        };
      }
    } catch (e) {
      console.warn('Failed to parse HR storage data, falling back to defaults:', e);
    }
    const initial: StoredHrData = {
      employees: INITIAL_EMPLOYEES,
      candidates: INITIAL_CANDIDATES,
      jobs: INITIAL_JOBS,
      leaveRequests: INITIAL_LEAVE_REQUESTS,
      shifts: INITIAL_SHIFTS,
      logs: INITIAL_LOGS,
      memo: INITIAL_MEMO,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: StoredHrData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist HR data to localStorage:', e);
    }
  }

  // --- Employees ---
  getEmployees(): EmployeeRecord[] {
    return this.loadData().employees;
  }

  addEmployee(empData: Omit<EmployeeRecord, 'id' | 'joinedDate' | 'performanceScore'> & { performanceScore?: number }): EmployeeRecord {
    const data = this.loadData();
    const newEmp: EmployeeRecord = {
      ...empData,
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      performanceScore: 5.0,
      avatar: empData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };
    data.employees.unshift(newEmp);
    this.addLogInternal(data, {
      action: 'Onboarded New Personnel',
      actor: 'Chief HR Officer (Mahi)',
      target: `${newEmp.name} (${newEmp.role})`,
      type: 'STAFFING',
    });
    this.saveData(data);
    return newEmp;
  }

  updateEmployeeClearance(id: string, newClearance: ClearanceLevel): void {
    const data = this.loadData();
    const emp = data.employees.find(e => e.id === id);
    if (emp) {
      emp.clearanceLevel = newClearance;
      this.addLogInternal(data, {
        action: `Clearance Level Updated to ${newClearance}`,
        actor: 'Chief HR Officer (Mahi)',
        target: `${emp.name} (${emp.id})`,
        type: 'CLEARANCE',
      });
      this.saveData(data);
    }
  }

  updateEmployeeStatus(id: string, status: EmployeeRecord['status']): void {
    const data = this.loadData();
    const emp = data.employees.find(e => e.id === id);
    if (emp) {
      emp.status = status;
      this.addLogInternal(data, {
        action: `Employee Status Changed to "${status}"`,
        actor: 'Chief HR Officer (Mahi)',
        target: `${emp.name} (${emp.id})`,
        type: 'STAFFING',
      });
      this.saveData(data);
    }
  }

  deleteEmployee(id: string): void {
    const data = this.loadData();
    const emp = data.employees.find(e => e.id === id);
    data.employees = data.employees.filter(e => e.id !== id);
    if (emp) {
      this.addLogInternal(data, {
        action: 'Revoked Personnel Clearance & Offboarded',
        actor: 'Chief HR Officer (Mahi)',
        target: `${emp.name} (${emp.id})`,
        type: 'STAFFING',
      });
    }
    this.saveData(data);
  }

  // --- Candidates ---
  getCandidates(): CandidateRecord[] {
    return this.loadData().candidates;
  }

  updateCandidateStage(id: string, stage: CandidateStage): void {
    const data = this.loadData();
    const cand = data.candidates.find(c => c.id === id);
    if (cand) {
      cand.stage = stage;
      this.addLogInternal(data, {
        action: `Advanced Candidate Stage to "${stage}"`,
        actor: 'Chief HR Officer (Mahi)',
        target: `${cand.name} (${cand.roleApplied})`,
        type: 'STAFFING',
      });
      this.saveData(data);
    }
  }

  addCandidate(candData: Omit<CandidateRecord, 'id' | 'appliedDate'>): CandidateRecord {
    const data = this.loadData();
    const newCand: CandidateRecord = {
      ...candData,
      id: `CAND-${Math.floor(2000 + Math.random() * 8000)}`,
      appliedDate: new Date().toISOString().split('T')[0],
    };
    data.candidates.unshift(newCand);
    this.addLogInternal(data, {
      action: 'Registered Candidate in Talent Pipeline',
      actor: 'Chief HR Officer (Mahi)',
      target: `${newCand.name} - ${newCand.roleApplied}`,
      type: 'STAFFING',
    });
    this.saveData(data);
    return newCand;
  }

  // --- Jobs ---
  getJobs(): JobPostingRecord[] {
    return this.loadData().jobs;
  }

  addJob(jobData: Omit<JobPostingRecord, 'id' | 'applicantsCount' | 'postedDate'>): JobPostingRecord {
    const data = this.loadData();
    const newJob: JobPostingRecord = {
      ...jobData,
      id: `JOB-${Math.floor(300 + Math.random() * 600)}`,
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
    };
    data.jobs.unshift(newJob);
    this.addLogInternal(data, {
      action: 'Published New Telephony SecOps Requisition',
      actor: 'Chief HR Officer (Mahi)',
      target: newJob.title,
      type: 'STAFFING',
    });
    this.saveData(data);
    return newJob;
  }

  // --- Leave Requests ---
  getLeaveRequests(): LeaveRequestRecord[] {
    return this.loadData().leaveRequests;
  }

  reviewLeaveRequest(id: string, decision: 'Approved' | 'Rejected'): void {
    const data = this.loadData();
    const req = data.leaveRequests.find(r => r.id === id);
    if (req) {
      req.status = decision;
      this.addLogInternal(data, {
        action: `${decision} Leave Application (${req.days} days: ${req.type})`,
        actor: 'Chief HR Officer (Mahi)',
        target: `${req.employeeName} (${req.department})`,
        type: 'LEAVE',
      });
      this.saveData(data);
    }
  }

  // --- Shift Roster ---
  getShifts(): ShiftRosterItem[] {
    return this.loadData().shifts;
  }

  // --- Audit Logs ---
  getAuditLogs(): HrAuditLogRecord[] {
    return this.loadData().logs;
  }

  private addLogInternal(data: StoredHrData, log: Omit<HrAuditLogRecord, 'id' | 'timestamp' | 'ip'>) {
    const newLog: HrAuditLogRecord = {
      ...log,
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      ip: '106.51.72.19 (Bengaluru, IN)',
    };
    data.logs.unshift(newLog);
    if (data.logs.length > 50) {
      data.logs = data.logs.slice(0, 50);
    }
  }

  // --- Emergency Memo ---
  getMemo(): EmergencyMemo | null {
    return this.loadData().memo;
  }

  setMemo(memo: Omit<EmergencyMemo, 'id' | 'timestamp'> | null): void {
    const data = this.loadData();
    if (memo) {
      data.memo = {
        ...memo,
        id: `MEMO-${Date.now()}`,
        timestamp: new Date().toISOString().split('T')[0],
      };
      this.addLogInternal(data, {
        action: `Broadcasted Global HR Operational Alert: "${memo.title}"`,
        actor: 'Chief HR Officer (Mahi)',
        target: 'All 148 Callix Active Personnel',
        type: 'SECURITY',
      });
    } else {
      data.memo = null;
    }
    this.saveData(data);
  }

  // --- Export Full HR Dossier ---
  exportHrDataJson(): string {
    const data = this.loadData();
    return JSON.stringify({
      organization: 'Callix Voice Security AI Inc.',
      exportTimestamp: new Date().toISOString(),
      authorizedBy: 'Chief HR Officer',
      securityClearance: 'LEVEL_5_EXECUTIVE_RESTRICTED',
      data,
    }, null, 2);
  }
}

export const adminHrService = new AdminHrService();
