import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isHrAdminUser } from '../../utils/adminPermissions';
import { Loader } from '../common/Loader';
import { ShieldAlert, Lock, ArrowLeft, LogOut } from 'lucide-react';

interface AdminHrRouteProps {
  children: React.ReactNode;
}

export const AdminHrRoute: React.FC<AdminHrRouteProps> = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader size="lg" text="Verifying Security Clearance..." />
        </div>
      </div>
    );
  }

  // Not authenticated at all -> redirect to login
  if (!user) {
    return <Navigate to="/?auth=login" state={{ from: location }} replace />;
  }

  // Authenticated, but not authorized
  if (!isHrAdminUser(user)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 relative selection:bg-red-500/30 selection:text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full [background:radial-gradient(circle,rgba(239,68,68,0.12)_0%,transparent_70%)] blur-2xl" />
        </div>

        <div className="relative z-10 max-w-md w-full rounded-3xl border border-red-500/25 bg-neutral-950/85 backdrop-blur-2xl p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(239,68,68,0.15)] space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-b from-red-500/20 to-red-950/40 border border-red-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
              <Lock className="w-3 h-3" />
              <span>Access Restricted</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Security Clearance Required
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This administrative portal is restricted to authorized personnel. Your current credentials do not have permission to access this module.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Console</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/?auth=login');
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
