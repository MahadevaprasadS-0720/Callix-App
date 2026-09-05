import React from 'react';
import { Menu, User as UserIcon, Play, Radio, Home, LogOut, Fingerprint, ShieldCheck, Terminal } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
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
    <header className="sticky top-0 z-20 h-14 glass-navbar border-b border-white/20 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>SYSTEM NORMAL</span>
          </span>
          <span className="text-xs text-zinc-500 font-mono hidden md:inline">
            Deepgram nova-2 · Claude 3.5 Sonnet XAI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Public Landing Link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {/* Quick Launch Simulation Button */}
        {!isCallActive ? (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3 h-3 fill-current" />}
            onClick={() => {
              startSimulation();
              navigate('/simulation');
            }}
          >
            Launch Call Sim
          </Button>
        ) : (
          <Button
            size="sm"
            variant="danger"
            leftIcon={<Radio className="w-3 h-3 animate-pulse" />}
            onClick={() => navigate('/simulation')}
          >
            Live Stream ({currentRiskScore}/100)
          </Button>
        )}

        {/* User Account / Clickable Profile Trigger */}
        <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
          <div 
            onClick={onProfileClick}
            className="flex items-center gap-3 cursor-pointer group"
            title="Open User Profile & Credentials"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-zinc-200 group-hover:text-white leading-tight flex items-center justify-end gap-1.5 transition-colors">
                {user?.displayName || 'Developer'}
              </span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono transition-colors">
                {user?.plan === 'PRO_SHIELD' ? 'Pro Shield' : 'Active'}
              </span>
            </div>

            <UserAvatar 
              user={user} 
              size="sm" 
              className="ring-1 ring-zinc-700 group-hover:ring-white/50 transition-all" 
            />
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
