import React from 'react';
import { Menu, Play, Radio, Home, LogOut } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useCallSimulation } from '../../context/CallSimulationContext';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onProfileClick }) => {
  const { user, logout } = useAuth();
  const { isCallActive, startSimulation, currentRiskScore } = useCallSimulation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/?auth=login');
  };

  return (
    <header className="dashboard-glass-capsule w-full h-14 px-3 sm:px-6 rounded-full flex items-center justify-between relative shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/12 backdrop-blur-2xl bg-neutral-950/35">
      {/* 4-Point Sparkle Star Glints on top glass rim matching landing page */}
      <div className="absolute -top-1.5 left-[28%] w-3.5 h-3.5 pointer-events-none z-20 flex items-center justify-center filter drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-white shrink-0">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>
      <div className="absolute -top-1.5 left-[72%] w-3.5 h-3.5 pointer-events-none z-20 flex items-center justify-center filter drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-white shrink-0">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>

      {/* Left Area: Mobile Menu + Status Badges */}
      <div className="flex items-center gap-2.5 z-10">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-zinc-300 hover:text-white rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 transition-all lg:hidden cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Micro-Glass "SYSTEM NORMAL" Badge */}
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-md text-[11px] font-mono text-zinc-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="font-semibold tracking-wider text-[10px] sm:text-[11px]">SYSTEM NORMAL</span>
          </span>

          {/* Model Chips inside subtle micro-glass badges */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
              Deepgram nova-2
            </span>
            <span className="text-zinc-600">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] hidden xl:inline">
              Claude 3.5 Sonnet XAI
            </span>
          </div>
        </div>
      </div>

      {/* Right Area: iOS Buttons, Profile Capsule & Sign-Out */}
      <div className="flex items-center gap-2 sm:gap-2.5 z-10">
        {/* Sleek iOS-style frosted Public Home link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 transform-gpu hover:-translate-y-0.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {/* Quick Launch Simulation / Active Stream Indicator */}
        {!isCallActive ? (
          <button
            type="button"
            onClick={() => {
              startSimulation();
              navigate('/simulation');
            }}
            className="glass-pill relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer active:scale-95 transform-gpu hover:-translate-y-0.5"
          >
            <Play className="w-3 h-3 fill-current text-white" />
            <span className="whitespace-nowrap">Launch Call Sim</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/simulation')}
            className="relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all cursor-pointer animate-pulse whitespace-nowrap transform-gpu hover:-translate-y-0.5"
          >
            <Radio className="w-3 h-3 text-red-400" />
            <span>Live Stream ({currentRiskScore}/100)</span>
          </button>
        )}

        {/* Profile Avatar & "Mahi S / Pro Shield" Capsule */}
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/25 transition-all cursor-pointer group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_2px_8px_rgba(0,0,0,0.3)] active:scale-95 transform-gpu hover:-translate-y-0.5"
          title="Open User Profile & Credentials"
        >
          <UserAvatar 
            user={user} 
            size="sm" 
            className="ring-1 ring-white/20 group-hover:ring-white/50 transition-all" 
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-white leading-tight transition-colors">
              {user?.displayName || 'Developer'}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono font-medium leading-none mt-0.5">
              {user?.plan === 'PRO_SHIELD' ? 'Pro Shield' : (user?.plan || 'Pro Shield')}
            </span>
          </div>
        </div>

        {/* Sign-Out Button */}
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

