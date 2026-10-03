import React, { useState } from 'react';
import { X, Megaphone, Send, AlertTriangle } from 'lucide-react';
import { adminHrService } from '../../services/adminHrService';
import { useToast } from '../../context/ToastContext';

interface BroadcastMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoUpdated: () => void;
}

export const BroadcastMemoModal: React.FC<BroadcastMemoModalProps> = ({
  isOpen,
  onClose,
  onMemoUpdated,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'CRITICAL' | 'WARNING' | 'NOTICE'>('WARNING');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast({
        type: 'danger',
        title: 'Incomplete Memo',
        message: 'Please provide both a memo title and operational directive.',
      });
      return;
    }

    adminHrService.setMemo({
      title: title.trim(),
      message: message.trim(),
      urgency,
      postedBy: 'Chief HR Officer Mahi',
      active: true,
    });

    showToast({
      type: 'warning',
      title: 'Global HR Operational Directive Broadcasted',
      message: 'Announcement successfully dispatched to all 148 active telephony terminals.',
    });

    onMemoUpdated();
    onClose();
  };

  const handleClear = () => {
    adminHrService.setMemo(null);
    showToast({
      type: 'info',
      title: 'Broadcast Cleared',
      message: 'Active HR operational directive dismissed.',
    });
    onMemoUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-neutral-950/95 border border-white/15 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Broadcast HR Memo</h2>
              <p className="text-xs text-zinc-400">Dispatch urgent directive to all personnel</p>
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
              Directive Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Protocol Delta: Mandatory Voice Biometrics Verification"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              Priority Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full bg-neutral-900 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
            >
              <option value="CRITICAL">Critical Alert (Red Banner - Mandatory Immediate Action)</option>
              <option value="WARNING">Warning (Amber Banner - Procedural Shift)</option>
              <option value="NOTICE">Standard Notice (Cyan Banner - General Info)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              Directive Body & Instructions *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detail the operational changes, shift handoff instructions, or policy reminders..."
              className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
            >
              Dismiss Current Memo
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Live</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
