import React from 'react';
import { NavLink } from 'react-router-dom';
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
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCallSimulation } from '../../context/CallSimulationContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isCallActive, currentRiskScore } = useCallSimulation();

  const navItems = [
    { to: '/', label: 'Overview', icon: <Activity className="w-5 h-5" /> },
    { 
      to: '/simulation', 
      label: 'Live Simulation', 
      icon: <Radio className="w-5 h-5" />, 
      badge: isCallActive ? 'LIVE' : undefined,
      badgeColor: isCallActive ? (currentRiskScore >= 75 ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-cyan text-black') : undefined
    },
    { 
      to: '/scanner', 
      label: 'Audio Scanner', 
      icon: <Activity className="w-5 h-5 text-brand-cyan" />,
      badge: 'AI CLONE',
      badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
    },
    { to: '/calls', label: 'Call Records', icon: <PhoneCall className="w-5 h-5" /> },
    { to: '/analytics', label: 'Threat Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/lookup', label: 'Number Lookup', icon: <Search className="w-5 h-5" /> },
    { to: '/guardian', label: 'Elder Guardian', icon: <Users className="w-5 h-5" /> },
    { to: '/phrases', label: 'Scam Phrases', icon: <BookOpen className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings & Keys', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 w-64 bg-cyber-card border-r border-cyber-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-cyber-border bg-slate-900/40">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-cyan shadow-glow-primary">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
              Audio Guardian
            </h1>
            <p className="text-[10px] text-brand-cyan font-mono tracking-wider">AI VOICE SHIELD</p>
          </div>
        </div>

        {/* Live Call Alert Strip */}
        {isCallActive && (
          <div className={cn(
            'mx-3 mt-3 p-2.5 rounded-lg border flex items-center gap-2.5 text-xs font-semibold animate-pulse',
            currentRiskScore >= 75
              ? 'bg-red-950/60 border-red-500/50 text-red-300'
              : 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
          )}>
            <AlertTriangle className="w-4 h-4 shrink-0 text-current" />
            <div className="truncate">
              <span>Live Call Stream</span>
              <span className="ml-1 text-[10px] opacity-80">({currentRiskScore}/100)</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-gradient-to-r from-brand-primary/20 to-indigo-600/10 text-brand-cyan border-l-4 border-brand-cyan font-semibold'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-cardHover'
                )
              }
            >
              <div className="flex items-center gap-3">
                <span className="transition-transform duration-150 group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-mono font-bold', item.badgeColor)}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Engine Info */}
        <div className="p-4 border-t border-cyber-border bg-slate-950/50">
          <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cyber-muted font-mono">STT Engine:</span>
              <span className="text-brand-cyan font-medium font-mono">nova-2 en-IN</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cyber-muted font-mono">Fraud XAI:</span>
              <span className="text-indigo-400 font-medium font-mono">Claude 3.5</span>
            </div>
            <div className="pt-1 border-t border-cyber-border/40 flex items-center gap-1.5 text-[10px] text-threat-safe font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Guard Shield Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
