import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const { loginWithGoogle, loginWithGithub, loginWithEmail, registerWithEmail, sendPasswordReset, loginAsGuest } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email) throw new Error('Please enter your email address');
        await sendPasswordReset(email);
        setSuccessMessage('Password reset link sent to your inbox.');
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        if (!email || !password) throw new Error('Please enter email and password');
        await loginWithEmail(email, password);
      } else {
        if (!email || !password) throw new Error('Please enter email and password');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await registerWithEmail(email, password, displayName);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const code = err?.code || '';
      let message = err?.message || 'Authentication failed. Please verify credentials.';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        message = 'Invalid email or password. Please try again.';
      } else if (code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (code === 'auth/popup-closed-by-user') {
        message = 'Sign-in window was closed before completion.';
      } else if (code === 'auth/account-exists-with-different-credential') {
        message = 'An account already exists with this email via Google. Please sign in with Google or enable account linking in Firebase Console.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'Google sign-in encountered an issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGithub();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'GitHub sign-in encountered an issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    loginAsGuest();
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Ambient Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[440px] rounded-3xl border border-white/[0.12] bg-[#0A0A0B] shadow-[0_0_50px_rgba(0,0,0,0.9)] p-6 sm:p-8 z-10 overflow-hidden text-[#EDEDED] font-sans">
        
        {/* Subtle Ambient Radial Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/[0.08] blur-3xl rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-11 h-11 mx-auto rounded-2xl bg-white text-black font-serif-hero text-xl font-bold flex items-center justify-center shadow-lg">
            Cx
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'forgot' 
                ? 'Reset password' 
                : mode === 'login' 
                  ? 'Sign in to Callix' 
                  : 'Create account'}
            </h2>
            <p className="text-xs text-zinc-400">
              {mode === 'forgot'
                ? 'Enter your email to receive recovery instructions'
                : 'Enterprise-grade real-time voice fraud defense'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="relative p-1 mb-6 rounded-full bg-zinc-950 border border-white/[0.08] text-xs font-medium grid grid-cols-2">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white transition-all duration-300 ease-out shadow-sm ${
                mode === 'login' ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`relative z-10 py-2 rounded-full text-center transition-colors duration-200 ${
                mode === 'login' ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`relative z-10 py-2 rounded-full text-center transition-colors duration-200 ${
                mode === 'register' ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Social Auth Buttons (Google & GitHub) */}
        {mode !== 'forgot' && (
          <div className="space-y-3 mb-5">
            {/* Google Provider */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* GitHub Provider */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <span className="relative px-3 bg-[#0A0A0B] text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                Or with email
              </span>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-400">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Arjun Sharma"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-950 border border-white/10 focus:border-white/30 text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-950 border border-white/10 focus:border-white/30 text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-400">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-zinc-950 border border-white/10 focus:border-white/30 text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : mode === 'forgot' ? (
              <span>Send recovery link</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign in to Callix</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create developer account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login from Forgot Mode */}
        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className="w-full mt-4 text-xs text-center text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to sign in
          </button>
        )}

        {/* Quick Guest Simulation Access */}
        {mode !== 'forgot' && (
          <div className="pt-4 mt-4 border-t border-white/[0.08] text-center">
            <button
              type="button"
              onClick={handleGuestAccess}
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore live simulator as Guest</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
