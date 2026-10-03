import React, { useState } from 'react';
import { X, UserPlus, Shield, Building2, Phone, Mail, DollarSign, MapPin, Check } from 'lucide-react';
import { Department, ClearanceLevel, EmployeeStatus } from '../../types/adminHr.types';
import { adminHrService } from '../../services/adminHrService';
import { useToast } from '../../context/ToastContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onEmployeeAdded }) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [department, setDepartment] = useState<Department>('Voice AI Research');
  const [role, setRole] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState<ClearanceLevel>('LEVEL_2');
  const [shift, setShift] = useState('Morning (06:00 - 14:00 UTC)');
  const [salaryAnnual, setSalaryAnnual] = useState('₹24,00,000 / yr');
  const [assignedWorkstation, setAssignedWorkstation] = useState('Acoustic Lab Workstation A-10');
  const [city, setCity] = useState('Bengaluru');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim()) {
      showToast({
        type: 'danger',
        title: 'Missing Required Information',
        message: 'Please provide full name, official email, and job title.',
      });
      return;
    }

    setLoading(true);
    try {
      adminHrService.addEmployee({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        department,
        role: role.trim(),
        clearanceLevel,
        status: 'Active',
        shift,
        salaryAnnual,
        assignedWorkstation,
        city,
        notes: notes.trim(),
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`,
      });

      showToast({
        type: 'success',
        title: 'Personnel Successfully Onboarded',
        message: `${name} has been enrolled with ${clearanceLevel} clearance.`,
      });

      onEmployeeAdded();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'danger',
        title: 'Onboarding Failed',
        message: err?.message || 'Could not save employee profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-neutral-950/95 border border-white/15 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Onboard New Personnel</h2>
              <p className="text-xs text-zinc-400">Enroll new engineer or SecOps analyst into Callix security grid</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium text-zinc-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohith Varma"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all"
              />
            </div>

            {/* Official Email */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Official Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohith.v@callix.ai"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 pl-9 text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Official / Emergency Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 pl-9 text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
                />
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-neutral-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all"
              >
                <option value="Voice AI Research">Voice AI Research</option>
                <option value="SecOps & Threat Intel">SecOps & Threat Intel</option>
                <option value="Telephony Engineering">Telephony Engineering</option>
                <option value="Compliance & Legal">Compliance & Legal</option>
                <option value="Incident Response">Incident Response</option>
                <option value="Executive & HR">Executive & HR</option>
              </select>
            </div>

            {/* Job Title / Role */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Job Title / Position *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Deepfake Forensic Analyst"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all"
              />
            </div>

            {/* Security Clearance */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Security Clearance Level
              </label>
              <select
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(e.target.value as ClearanceLevel)}
                className="w-full bg-neutral-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all font-mono"
              >
                <option value="LEVEL_1">Level 1 - Basic Operator</option>
                <option value="LEVEL_2">Level 2 - SecOps Telephony Analyst</option>
                <option value="LEVEL_3">Level 3 - Senior Audio Forensic</option>
                <option value="LEVEL_4">Level 4 - Neural Architecture Lead</option>
                <option value="LEVEL_5">Level 5 - Executive Chief HR / SuperAdmin</option>
              </select>
            </div>

            {/* Shift Assignment */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Shift Schedule
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all"
              >
                <option value="Morning (06:00 - 14:00 UTC)">Morning (06:00 - 14:00 UTC)</option>
                <option value="Evening (14:00 - 22:00 UTC)">Evening (14:00 - 22:00 UTC)</option>
                <option value="Night SecOps (22:00 - 06:00 UTC)">Night SecOps (22:00 - 06:00 UTC)</option>
                <option value="General (09:00 - 18:00 IST)">General (09:00 - 18:00 IST)</option>
                <option value="Flexible Rotation">Flexible Rotation</option>
              </select>
            </div>

            {/* Compensation */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Annual Compensation Tier
              </label>
              <input
                type="text"
                value={salaryAnnual}
                onChange={(e) => setSalaryAnnual(e.target.value)}
                placeholder="₹24,00,000 / yr or $130,000 / yr"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Workstation Node */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Assigned Workstation / Node
              </label>
              <input
                type="text"
                value={assignedWorkstation}
                onChange={(e) => setAssignedWorkstation(e.target.value)}
                placeholder="e.g. Lab Pod B-02"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Base Location */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Base Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru / Mysore / Remote"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Operational Notes */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              Security Notes & Specializations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Top performer in synthetic speech detection. Holds dual certification in telecommunications forensics."
              className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-zinc-600 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Enroll Personnel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
