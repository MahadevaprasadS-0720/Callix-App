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

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isCallActive, currentRiskScore } = useCallSimulation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
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
      badgeColor: 'bg-zinc-800 text-zinc-300 border border-zinc-700'
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 w-60 bg-[#050507] border-r border-white/[0.08] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-white/[0.08] bg-black">
          <LinkToHome onClose={onClose} />
        </div>

        {/* User Session Quick Strip */}
        <div className="px-3 pt-3">
          <div className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                {user?.isGuest ? <Fingerprint className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
              </div>
              <div className="truncate">
                <div className="font-medium text-zinc-200 truncate text-[11px]">
                  {user?.displayName || 'Developer'}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  {user?.isGuest ? 'Sandbox' : (user?.plan || 'PRO_SHIELD')}
                </div>
              </div>
            </div>
            <NavLink
              to="/"
              title="Return to Public Landing Page"
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>

        {/* Live Call Alert Strip */}
        {isCallActive && (
          <div className={cn(
            'mx-3 mt-2.5 p-2 rounded-xl border flex items-center gap-2 text-xs font-medium',
            currentRiskScore >= 75
              ? 'bg-red-950/40 border-red-500/30 text-red-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-200'
          )}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-current animate-pulse" />
            <div className="truncate text-[11px]">
              <span>Live Telephony Stream</span>
              <span className="ml-1 opacity-75 font-mono">({currentRiskScore}/100)</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-zinc-900 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn('text-[10px] px-1.5 py-0.2 rounded font-mono font-medium', item.badgeColor)}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Public Landing Link & Sign Out Strip */}
        <div className="p-3 border-t border-white/[0.08] space-y-1 bg-black/40">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Public Home</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Footer Engine Info */}
        <div className="px-3 pb-3 pt-1 bg-black">
          <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-mono">STT:</span>
              <span className="text-zinc-300 font-medium font-mono">nova-2 en-IN</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-mono">XAI:</span>
              <span className="text-zinc-300 font-medium font-mono">Claude 3.5</span>
            </div>
            <div className="pt-1 border-t border-zinc-900 flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const LinkToHome: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <NavLink to="/" onClick={onClose} className="flex items-center gap-2 group">
      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xs tracking-tighter">
        Cx
      </div>
      <div>
        <h1 className="font-semibold text-xs tracking-tight text-white group-hover:text-zinc-300 transition-colors">
          Callix
        </h1>
        <p className="text-[9px] text-zinc-500 font-mono">VOICE AI SECURITY</p>
      </div>
    </NavLink>
  );
};
