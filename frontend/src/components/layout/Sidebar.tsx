import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  Radio, 
  PhoneCall, 
  BarChart3, 
  Search, 
  Users, 
  BookOpen, 
  Settings,
  AlertTriangle,
  LogOut,
  Home,
  Fingerprint,
  Mic,
  Cpu
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCallSimulation } from '../../context/CallSimulationContext';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onProfileClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onProfileClick }) => {
  const { isCallActive, currentRiskScore } = useCallSimulation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/?auth=login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { 
      to: '/simulation', 
      label: 'Live Simulation', 
      icon: <Radio className="w-4 h-4" />, 
      badge: isCallActive ? 'LIVE' : undefined,
      badgeColor: isCallActive ? (currentRiskScore >= 75 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30') : undefined
    },
    { 
      to: '/scanner', 
      label: 'Audio Scanner', 
      icon: <Mic className="w-4 h-4" />, 
      badge: 'AI CLONE',
      badgeColor: 'bg-white/10 text-zinc-300 border border-white/15'
    },
    { to: '/calls', label: 'Call Logs', icon: <PhoneCall className="w-4 h-4" /> },
    { to: '/analytics', label: 'Threat Metrics', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/lookup', label: 'Number Lookup', icon: <Search className="w-4 h-4" /> },
    { to: '/guardian', label: 'Elder Shield', icon: <Users className="w-4 h-4" /> },
    { to: '/phrases', label: 'Scam Heuristics', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/settings', label: 'API Keys & Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 w-64 macos-dock-panel flex flex-col transition-transform duration-200 ease-in-out select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          <LinkToHome onClose={onClose} />
        </div>

        {/* User Session Quick Strip */}
        <div className="px-3 pt-3">
          <div 
            onClick={onProfileClick}
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between text-xs cursor-pointer transition-all duration-200 group shadow-sm hover:border-white/20 active:scale-[0.98]"
            title="Open User Profile & Credentials"
          >
            <div className="flex items-center gap-2.5 truncate">
              <UserAvatar user={user} size="xs" shape="circle" className="ring-1 ring-white/20 group-hover:ring-white/40" />
              <div className="truncate">
                <div className="font-semibold text-zinc-200 group-hover:text-white truncate text-[11px] transition-colors">
                  {user?.displayName || 'Developer'}
                </div>
                <div className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono">
                  {user?.plan || 'PRO_SHIELD'}
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 group-hover:text-white font-mono border border-white/10 group-hover:border-white/20 transition-all">
              Profile
            </span>
          </div>
        </div>

        {/* Live Call Alert Strip */}
        {isCallActive && (
          <div className={cn(
            'mx-3 mt-2.5 p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-medium backdrop-blur-md shadow-sm',
            currentRiskScore >= 75
              ? 'bg-red-950/50 border-red-500/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          )}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-current animate-pulse" />
            <div className="truncate text-[11px]">
              <span className="font-semibold">Live Telephony Stream</span>
              <span className="ml-1 opacity-80 font-mono">({currentRiskScore}/100)</span>
            </div>
          </div>
        )}

        {/* Navigation Links with iOS-inspired glowing pills & micro-interactions */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group transform-gpu',
                  isActive
                    ? 'bg-gradient-to-r from-white/[0.15] to-white/[0.08] text-white shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.25)] border border-white/20 font-semibold backdrop-blur-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:translate-x-1 border border-transparent hover:border-white/10 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                )
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-mono font-medium', item.badgeColor)}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Public Landing Link & Sign Out Strip */}
        <div className="p-3 border-t border-white/10 space-y-1 bg-white/[0.02]">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all hover:translate-x-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Public Home</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-white/[0.05] transition-all hover:translate-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Footer Engine Info Widget */}
        <div className="px-3 pb-3 pt-1">
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-mono">STT:</span>
              <span className="text-zinc-300 font-medium font-mono">nova-2 en-IN</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-mono">XAI:</span>
              <span className="text-zinc-300 font-medium font-mono">Claude 3.5</span>
            </div>
            <div className="pt-1.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="tracking-wide">All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const LinkToHome: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-white to-zinc-300 flex items-center justify-center text-black font-extrabold text-xs tracking-tighter shadow-md group-hover:scale-105 transition-transform">
        Cx
      </div>
      <div>
        <h1 className="font-bold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
          Callix
        </h1>
        <p className="text-[9px] text-zinc-400 font-mono tracking-wider">VOICE AI SECURITY</p>
      </div>
    </NavLink>
  );
};
