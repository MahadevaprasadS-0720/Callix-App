import React from 'react';
import { Menu, LogOut, ShieldCheck, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HeaderNumberLookup } from './HeaderNumberLookup';
import { UserAvatar } from '../common/UserAvatar';
import { isHrAdminUser } from '../../utils/adminPermissions';

interface HeaderProps {
  onMenuToggle: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onProfileClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = isHrAdminUser(user);

  const handleSignOut = async () => {
    await logout();
    navigate('/?auth=login');
  };

  return (
    <header className="dashboard-glass-capsule w-full h-14 px-3 sm:px-5 rounded-full flex items-center justify-between relative shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/12 backdrop-blur-2xl bg-neutral-950/35 gap-2 sm:gap-4">
      {/* Left Area: Mobile Menu Button + Circular User Avatar Profile Capsule */}
      <div className="flex items-center gap-2 z-10 shrink-0">
        <button
          onClick={onMenuToggle}
          className="glass-pill p-2 text-zinc-300 hover:text-white rounded-full bg-white/[0.06] hover:bg-white/[0.16] border border-white/20 transition-all lg:hidden cursor-pointer shrink-0 shadow-sm active:scale-95"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* User Profile Liquid-Glass Capsule Button */}
        <button
          type="button"
          onClick={onProfileClick}
          className="relative inline-flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer select-none group active:scale-95 focus:outline-none shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
          title="Open User Profile & Credentials"
          aria-label="User Profile"
        >
          <UserAvatar 
            user={user} 
            size="sm" 
            shape="circle" 
            className="rounded-full ring-2 ring-white/20 group-hover:ring-cyan-400 group-hover:shadow-[0_0_14px_rgba(34,211,238,0.45)] transition-all shrink-0" 
          />
          <div className="hidden sm:flex flex-col text-left leading-none max-w-[150px] truncate">
            <span className="text-xs font-semibold text-white tracking-tight truncate group-hover:text-cyan-200 transition-colors">
              {user?.displayName || 'Callix User'}
            </span>
            {user?.phoneNumber ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300 font-medium mt-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                <span className="truncate">{user.phoneNumber}</span>
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Protected User
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Center Area: Truecaller Number Lookup Search Bar (Fills the entire navigation bar width properly) */}
      <div className="flex-1 min-w-0 mx-1 sm:mx-3 z-10">
        <HeaderNumberLookup />
      </div>

      {/* Right Area: Admin HR Quick Jump (for HR Admin) + Exit / Sign-Out Button */}
      <div className="flex items-center z-10 shrink-0 gap-2">
        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => navigate('/hr-admin')}
            title="Open Executive Admin HR & Workforce Operations Portal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer active:scale-95 transform-gpu hover:-translate-y-0.5"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin HR</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          title="Sign Out"
          className="glass-pill p-2 text-zinc-400 hover:text-red-300 rounded-full bg-white/[0.06] hover:bg-red-500/20 border border-white/20 hover:border-red-500/40 shadow-[0_2px_10px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_16px_rgba(239,68,68,0.3)] transition-all cursor-pointer active:scale-95 transform-gpu hover:-translate-y-0.5"
          aria-label="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
