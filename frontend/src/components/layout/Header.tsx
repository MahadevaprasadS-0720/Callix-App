import React from 'react';
import { Menu, Play, Radio, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCallSimulation } from '../../context/CallSimulationContext';
import { useNavigate } from 'react-router-dom';
import { HeaderNumberLookup } from './HeaderNumberLookup';

interface HeaderProps {
  onMenuToggle: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { logout } = useAuth();
  const { isCallActive, startSimulation, currentRiskScore } = useCallSimulation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/?auth=login');
  };

  return (
    <header className="dashboard-glass-capsule w-full h-14 px-3 sm:px-5 rounded-full flex items-center justify-between relative shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/12 backdrop-blur-2xl bg-neutral-950/35 gap-2 sm:gap-3">
      {/* 4-Point Sparkle Star Glints on top glass rim matching landing page */}
      <div className="absolute -top-1.5 left-[20%] w-3.5 h-3.5 pointer-events-none z-20 flex items-center justify-center filter drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-white shrink-0">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>
      <div className="absolute -top-1.5 left-[80%] w-3.5 h-3.5 pointer-events-none z-20 flex items-center justify-center filter drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-white shrink-0">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>

      {/* Left Area: Mobile Menu Button + Miniature Brand Chip */}
      <div className="flex items-center gap-2 z-10 shrink-0">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-zinc-300 hover:text-white rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 transition-all lg:hidden cursor-pointer shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shrink-0 select-none">
          <div className="w-5 h-5 rounded-md bg-white text-black font-extrabold text-[10px] flex items-center justify-center">
            Cx
          </div>
          <span className="text-[11px] font-bold text-white font-mono tracking-wider">CALLIX</span>
        </div>
      </div>

      {/* Center Area: Truecaller Number Lookup Search Bar (Spans full available width) */}
      <div className="flex-1 max-w-2xl lg:max-w-3xl mx-1 sm:mx-3 z-10 min-w-0">
        <HeaderNumberLookup />
      </div>

      {/* Right Area: Settings Icon, Launch Call Sim & Sign-Out */}
      <div className="flex items-center gap-1.5 sm:gap-2 z-10 shrink-0">
        {/* Settings Button */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          title="Project Settings & Preferences"
          className="p-2 text-zinc-300 hover:text-white rounded-full bg-white/[0.05] hover:bg-white/[0.14] border border-white/12 hover:border-white/25 transition-all cursor-pointer active:scale-95 shadow-sm"
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Quick Launch Simulation / Active Stream Indicator */}
        {!isCallActive ? (
          <button
            type="button"
            onClick={() => {
              startSimulation();
              navigate('/simulation');
            }}
            className="glass-pill relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer active:scale-95 transform-gpu hover:-translate-y-0.5"
          >
            <Play className="w-3 h-3 fill-current text-white" />
            <span className="whitespace-nowrap hidden sm:inline">Launch Call Sim</span>
            <span className="whitespace-nowrap sm:hidden">Sim</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/simulation')}
            className="relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all cursor-pointer animate-pulse whitespace-nowrap transform-gpu hover:-translate-y-0.5"
          >
            <Radio className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">Live Stream ({currentRiskScore}/100)</span>
            <span className="sm:hidden">{currentRiskScore}/100</span>
          </button>
        )}

        {/* Exit / Sign-Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign Out"
          className="p-2 text-zinc-400 hover:text-red-400 rounded-full bg-white/[0.04] hover:bg-white/[0.10] border border-white/10 hover:border-red-500/30 transition-all cursor-pointer active:scale-95"
          aria-label="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
