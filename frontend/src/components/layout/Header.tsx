import React from 'react';
import { Menu, Shield, Bell, User as UserIcon, Play, Radio } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useCallSimulation } from '../../context/CallSimulationContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { isCallActive, startSimulation, currentRiskScore } = useCallSimulation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 h-16 bg-cyber-card/90 backdrop-blur-md border-b border-cyber-border px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-cyber-muted hover:text-cyber-text rounded-lg hover:bg-cyber-cardHover lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="cyan" size="sm" pulse>
            ACTIVE INTELLIGENCE
          </Badge>
          <span className="text-xs text-cyber-muted font-mono hidden md:inline">
            Deepgram nova-2 en-IN + Anthropic Claude XAI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Launch Simulation Button */}
        {!isCallActive ? (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
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
            leftIcon={<Radio className="w-3.5 h-3.5 animate-pulse" />}
            onClick={() => navigate('/simulation')}
          >
            Live Sim ({currentRiskScore}/100)
          </Button>
        )}

        {/* User Account / Status */}
        <div className="flex items-center gap-3 pl-3 border-l border-cyber-border">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-cyber-text leading-tight">
              {user?.displayName || 'Arjun Sharma'}
            </span>
            <span className="text-[10px] text-brand-cyan font-mono">
              {user?.plan === 'PRO_SHIELD' ? 'Pro Shield Protected' : 'Free Tier'}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full ring-2 ring-brand-primary/40 overflow-hidden bg-slate-800 flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-cyber-muted" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
