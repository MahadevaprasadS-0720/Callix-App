import React, { useState } from 'react';
import { X, Briefcase, Plus, Check } from 'lucide-react';
import { Department } from '../../types/adminHr.types';
import { adminHrService } from '../../services/adminHrService';
import { useToast } from '../../context/ToastContext';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobPosted }) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('Voice AI Research');
  const [location, setLocation] = useState('Bengaluru HQ (Hybrid)');
  const [type, setType] = useState<'Full-Time' | 'Contract' | 'Remote Priority'>('Full-Time');
  const [salaryRange, setSalaryRange] = useState('₹30L - ₹45L PA');
  const [urgency, setUrgency] = useState<'HIGH' | 'MEDIUM' | 'STANDARD'>('HIGH');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast({
        type: 'danger',
        title: 'Missing Title',
        message: 'Please provide a requisition job title.',
      });
      return;
    }

    adminHrService.addJob({
      title: title.trim(),
      department,
      location,
      type,
      salaryRange,
      status: 'Active',
      urgency,
    });

    showToast({
      type: 'success',
      title: 'Requisition Published',
      message: `Open position for "${title}" posted to Callix talent portal.`,
    });

    onJobPosted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-neutral-950/95 border border-white/15 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Open Job Requisition</h2>
              <p className="text-xs text-zinc-400">Recruit voice AI or telephony security talent</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-zinc-300">
          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              Position Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Voice Bio-Acoustic Defense Engineer"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-neutral-900 border border-white/10 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-white focus:outline-none"
              >
                <option value="Voice AI Research">Voice AI Research</option>
                <option value="SecOps & Threat Intel">SecOps & Threat Intel</option>
                <option value="Telephony Engineering">Telephony Engineering</option>
                <option value="Compliance & Legal">Compliance & Legal</option>
                <option value="Incident Response">Incident Response</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-neutral-900 border border-white/10 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-white focus:outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote Priority">Remote Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru HQ / Remote"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="₹25L - ₹40L PA"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              Hiring Priority / Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full bg-neutral-900 border border-white/10 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
            >
              <option value="HIGH">High Priority (Immediate SecOps Need)</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="STANDARD">Standard Growth</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Publish Requisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
