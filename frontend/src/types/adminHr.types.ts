export type ClearanceLevel = 
  | 'LEVEL_1' // Basic Internal Intranet
  | 'LEVEL_2' // SecOps Telephony Analyst
  | 'LEVEL_3' // Senior Deepfake Forensic Investigator
  | 'LEVEL_4' // Neural Weights & Carrier Data Architect
  | 'LEVEL_5'; // Super Admin & Chief HR Officer

export type Department =
  | 'Voice AI Research'
  | 'SecOps & Threat Intel'
  | 'Telephony Engineering'
  | 'Compliance & Legal'
  | 'Executive & HR'
  | 'Incident Response';

export type EmployeeStatus = 'Active' | 'On Duty' | 'On Break' | 'On Leave' | 'Suspended';

export interface EmployeeRecord {
  id: string; // EMP-XXXX
  name: string;
  email: string;
  phone: string;
  department: Department;
  role: string;
  clearanceLevel: ClearanceLevel;
  status: EmployeeStatus;
  shift: string;
  joinedDate: string;
  performanceScore: number; // e.g. 4.9
  assignedWorkstation: string;
  salaryAnnual: string;
  avatar: string;
  city?: string;
  emergencyContact?: string;
  notes?: string;
}

export type CandidateStage = 
  | 'Applied' 
  | 'Screening' 
  | 'Voice AI Challenge' 
  | 'HR Cultural Interview' 
  | 'Offer Sent' 
  | 'Hired' 
  | 'Archived';

export interface CandidateRecord {
  id: string; // CAND-XXXX
  name: string;
  email: string;
  phone: string;
  roleApplied: string;
  department: Department;
  stage: CandidateStage;
  experience: string;
  appliedDate: string;
  score: number; // match %
  resumeUrl?: string;
  notes?: string;
}

export interface JobPostingRecord {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: 'Full-Time' | 'Contract' | 'Remote Priority';
  applicantsCount: number;
  status: 'Active' | 'Reviewing' | 'Closed';
  salaryRange: string;
  postedDate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'STANDARD';
}

export interface LeaveRequestRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  type: 'Sick / Medical' | 'Burnout Recovery' | 'Casual Leave' | 'Annual Vacation' | 'Family Emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

export interface ShiftRosterItem {
  id: string;
  shiftName: string;
  timeRange: string;
  leadName: string;
  leadAvatar?: string;
  onDutyCount: number;
  targetCapacity: number;
  health: 'Optimal' | 'Understaffed' | 'Surge Alert';
  telephonyCluster: string;
}

export interface HrAuditLogRecord {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  ip: string;
  type: 'SECURITY' | 'STAFFING' | 'LEAVE' | 'CLEARANCE' | 'PAYROLL';
}

export interface EmergencyMemo {
  id: string;
  title: string;
  message: string;
  urgency: 'CRITICAL' | 'WARNING' | 'NOTICE';
  postedBy: string;
  timestamp: string;
  active: boolean;
}
