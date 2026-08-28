import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Lock, Mail, ArrowRight, Radio, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();
  const [email, setEmail] = useState('arjun.sharma@guardian.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginDemo();
      setLoading(false);
      navigate('/');
    }, 600);
  };

  const handleDemoClick = () => {
    loginDemo();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-cyan shadow-glow-primary mb-2">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Audio Guardian</h1>
          <p className="text-xs text-brand-cyan font-mono tracking-widest uppercase">
            AI-Powered Voice Scam & Fraud Shield
          </p>
        </div>

        {/* Login Box */}
        <Card className="p-6 bg-cyber-card/90 border border-cyber-border backdrop-blur-xl shadow-card-cyber space-y-5">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <h2 className="font-bold text-sm text-cyber-text">Security Console Access</h2>
            <Badge variant="cyan" size="sm">
              v1.0.0 PRO
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate Shield
            </Button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-cyber-border"></div>
            <span className="flex-shrink mx-3 text-[11px] text-cyber-subtle font-mono uppercase">
              Or instant evaluation
            </span>
            <div className="flex-grow border-t border-cyber-border"></div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleDemoClick}
            leftIcon={<Sparkles className="w-4 h-4 text-brand-cyan" />}
          >
            Enter Demo Mode (One-Click)
          </Button>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-cyber-border/80 text-[11px] text-cyber-muted space-y-1 font-mono">
            <div className="flex items-center gap-1.5 text-threat-safe font-bold">
              <Radio className="w-3 h-3 animate-pulse" /> Live Features Enabled:
            </div>
            <div>• Deepgram Speech Diarization (`en-IN`)</div>
            <div>• Claude 3.5 Sonnet XAI Fraud Scorer</div>
            <div>• Heuristic Decision Engine + Elder Intercept</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
