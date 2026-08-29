import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  UserCheck
} from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('arjun.sharma@callix.ai');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('Arjun Sharma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return to intended URL or default to /dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, displayName);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      
      {/* Resend Signature Background Light Beam */}
      <img 
        alt="Light ray background" 
        width="1920" 
        height="1080" 
        className="pointer-events-none absolute -top-40 left-0 right-0 mx-auto hidden h-screen w-full select-none md:block opacity-50 transition-all duration-500" 
        style={{ maskImage: 'linear-gradient(to top, transparent 15%, black 45%)' }} 
        src="/bg-light.png" 
      />

      {/* Top Header Navigation */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-zinc-400 group-hover:text-white" />
          <span>Back to Callix</span>
        </Link>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/80 text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Callix Cloud v2.4</span>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-8 relative z-10 space-y-6">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white text-black font-serif-hero text-xl font-bold flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
              Cx
            </div>
          </Link>

          <div className="space-y-1">
            <h1 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
              {mode === 'login' ? 'Sign in to Callix' : 'Create developer account'}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Voice security for developers
            </p>
          </div>
        </div>

        {/* Clean, Solid, Ultra-Premium Resend Card (Zero Glassmorphism Clutter) */}
        <div className="rounded-3xl border border-white/[0.12] bg-[#0A0A0B] shadow-2xl p-6 sm:p-8 space-y-5">

          {/* Complete Curve (Full Pill) Segmented Tabs with Silky Smooth Sliding Indicator */}
          <div className="relative p-1 rounded-full bg-zinc-950 border border-white/[0.08] text-xs font-medium grid grid-cols-2">
            {/* Smooth Sliding Pill Indicator */}
            <div 
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-zinc-800 border border-white/10 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                transform: mode === 'login' ? 'translateX(0%)' : 'translateX(100%)',
              }}
            />

            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`relative z-10 py-2 px-4 rounded-full text-center font-medium transition-colors duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`relative z-10 py-2 px-4 rounded-full text-center font-medium transition-colors duration-200 cursor-pointer ${
                mode === 'register'
                  ? 'text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-shake font-mono">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google OAuth Curved Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Clean Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/[0.08]"></div>
            <span className="flex-shrink mx-3 text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-white/[0.08]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Smooth expand/collapse container for Full Name */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mode === 'register' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="space-y-1.5 pb-1">
                <label className="block text-xs font-medium text-zinc-300">Full Name</label>
                <div className="relative flex items-center">
                  <UserCheck className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required={mode === 'register'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="w-full bg-black border border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 focus:bg-zinc-950 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">Work Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun.sharma@callix.ai"
                  className="w-full bg-black border border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 focus:bg-zinc-950 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 focus:bg-zinc-950 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono transition-all outline-none"
                />
              </div>
            </div>

            {/* Completely Curved Resend Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 active:scale-[0.99] rounded-full py-3 px-6 text-xs font-semibold transition-all duration-150 shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign in with Callix' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In footer */}
          <div className="pt-2 text-center border-t border-white/[0.06]">
            <p className="text-xs text-zinc-400">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className="text-white hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className="text-white hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

        </div>

      </div>

      {/* Clean Minimalist Footer */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-600 relative z-10">
        <span>© {new Date().getFullYear()} Callix Inc.</span>
        <span>Secure Telephony Infrastructure</span>
      </div>

    </div>
  );
};

export default Auth;
