import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Cpu, 
  Clock, 
  DollarSign, 
  Award, 
  AlertTriangle,
  UserCheck,
  UserX,
  FileText,
  KeyRound,
  Check
} from 'lucide-react';
import { EmployeeRecord, ClearanceLevel, EmployeeStatus } from '../../types/adminHr.types';
import { adminHrService } from '../../services/adminHrService';
import { useToast } from '../../context/ToastContext';

interface EmployeeDossierModalProps {
  employee: EmployeeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EmployeeDossierModal: React.FC<EmployeeDossierModalProps> = ({
  employee,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { showToast } = useToast();
  const [selectedClearance, setSelectedClearance] = useState<ClearanceLevel | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  if (!isOpen || !employee) return null;

  const currentClearance = selectedClearance || employee.clearanceLevel;

  const handleClearanceChange = (newLevel: ClearanceLevel) => {
    setSelectedClearance(newLevel);
    adminHrService.updateEmployeeClearance(employee.id, newLevel);
    showToast({
      type: 'success',
      title: 'Security Clearance Updated',
      message: `${employee.name} is now elevated to ${newLevel}.`,
    });
    onUpdate();
  };

  const handleStatusChange = (status: EmployeeStatus) => {
    adminHrService.updateEmployeeStatus(employee.id, status);
    showToast({
      type: 'info',
      title: 'Personnel Status Updated',
      message: `Status updated to ${status}.`,
    });
    onUpdate();
  };

  const handleRevoke = () => {
    adminHrService.deleteEmployee(employee.id);
    showToast({
      type: 'danger',
      title: 'Credentials Revoked',
      message: `${employee.name}'s clearance and badge access have been terminated.`,
    });
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-neutral-950/95 border border-white/15 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Bar */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-indigo-950/40 via-neutral-900 to-purple-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={employee.avatar} 
              alt={employee.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">{employee.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-semibold border border-white/10">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">{employee.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-300">
          {/* Clearance & Status Strip */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Clearance Level</span>
              </label>
              <select
                value={currentClearance}
                onChange={(e) => handleClearanceChange(e.target.value as ClearanceLevel)}
                className="w-full bg-neutral-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
              >
                <option value="LEVEL_1">Level 1 - Basic Operator</option>
                <option value="LEVEL_2">Level 2 - SecOps Telephony Analyst</option>
                <option value="LEVEL_3">Level 3 - Senior Audio Forensic</option>
                <option value="LEVEL_4">Level 4 - Neural Architecture Lead</option>
                <option value="LEVEL_5">Level 5 - Executive Chief HR / SuperAdmin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Duty / Roster Status</span>
              </label>
              <select
                value={employee.status}
                onChange={(e) => handleStatusChange(e.target.value as EmployeeStatus)}
                className="w-full bg-neutral-900 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="On Duty">On Duty (Live Monitoring)</option>
                <option value="On Break">On Break</option>
                <option value="On Leave">On Approved Leave</option>
                <option value="Suspended">Suspended / Credential Hold</option>
              </select>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Official Email</span>
              <div className="flex items-center gap-2 text-white font-mono text-xs truncate">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Secure Phone Line</span>
              <div className="flex items-center gap-2 text-white font-mono text-xs">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{employee.phone}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Assigned Workstation Node</span>
              <div className="flex items-center gap-2 text-white font-mono text-xs truncate">
                <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{employee.assignedWorkstation}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Shift Rotation</span>
              <div className="flex items-center gap-2 text-white font-mono text-xs truncate">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{employee.shift}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Annual Compensation</span>
              <div className="flex items-center gap-2 text-white font-mono text-xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{employee.salaryAnnual}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Performance Score</span>
              <div className="flex items-center gap-2 text-white font-mono text-xs">
                <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-bold text-cyan-300">{employee.performanceScore} / 5.0</span>
                <span className="text-[10px] text-emerald-400 font-sans font-medium">(Top 5% Voice AI)</span>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          {employee.notes && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <span className="text-zinc-500 font-mono text-[10px] uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span>Executive Dossier Notes</span>
              </span>
              <p className="text-zinc-300 text-xs leading-relaxed">{employee.notes}</p>
            </div>
          )}

          {/* Terminate / Revoke Credentials Section */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-300">Administrative Termination Action</h4>
                <p className="text-[11px] text-zinc-400">
                  Revoking credentials will immediately cancel biometric badges, SIP trunking access, and internal Callix audio databases.
                </p>
              </div>
            </div>

            {!confirmRevoke ? (
              <button
                type="button"
                onClick={() => setConfirmRevoke(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
              >
                Revoke Credentials & Offboard
              </button>
            ) : (
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="text-xs text-red-300 font-semibold">Confirm immediate termination?</span>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all cursor-pointer"
                >
                  Yes, Revoke Now
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRevoke(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
