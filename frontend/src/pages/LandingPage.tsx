import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield,
  Activity, 
  Radio, 
  Cpu, 
  Sparkles, 
  PhoneCall, 
  Search, 
  Lock, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Fingerprint, 
  Layers, 
  Users, 
  Server, 
  ChevronRight, 
  ChevronDown,
  Play, 
  Pause, 
  RefreshCw,
  Copy,
  Check,
  Code2,
  Terminal,
  Globe,
  Sliders,
  FileCode,
  FileText,
  BookOpen,
  Headphones,
  Share2, 
  Mic, 
  ArrowUpRight,
  X
} from 'lucide-react';
import { ResendCube3D } from '../components/common/ResendCube3D';
import { AuthModal } from '../components/auth/AuthModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const authQuery = searchParams.get('auth');
    if (authQuery) {
      if (authQuery === 'register' || authQuery === 'signup') {
        setAuthModalMode('register');
      } else {
        setAuthModalMode('login');
      }
      setAuthModalOpen(true);
    }
  }, [searchParams]);

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    if (searchParams.has('auth')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('auth');
      setSearchParams(nextParams, { replace: true });
    }
  };

  // Navigation handlers
  const handleLaunchApp = (destination = '/dashboard') => {
    if (user) {
      navigate(destination);
    } else {
      setAuthModalMode('register');
      setAuthModalOpen(true);
    }
  };

  // -------------------------------------------------------------
  // VISIONOS HOLOGRAPHIC MODAL STATE (FIXED & STABLE)
  // -------------------------------------------------------------
  type DropdownKey = 'features' | 'company' | 'enterprise' | 'help' | 'docs' | 'ai';
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
  const [activeHoloTab, setActiveHoloTab] = useState<number>(0);
  const navbarRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (name: DropdownKey) => {
    setActiveDropdown(prev => {
      if (prev === name) return null;
      setActiveHoloTab(0);
      return name;
    });
  };

  // -------------------------------------------------------------
  // CODE SECTION: Language tab selector & Code snippets
  // -------------------------------------------------------------
  const [selectedLang, setSelectedLang] = useState<'nodejs' | 'python' | 'go' | 'twilio' | 'react' | 'curl'>('nodejs');
  const [copiedCode, setCopiedCode] = useState(false);

  const codeSnippets: Record<string, string> = {
    nodejs: `import { Callix } from '@callix/sdk';

const callix = new Callix({
  apiKey: process.env.CALLIX_API_KEY
});

// Intercept telecommunication audio stream in real time
const stream = await callix.voice.intercept({
  callId: 'call_live_9921',
  callerNumber: '+919820012345',
  model: 'nova-2-en-in'
});

stream.on('threat_detected', (verdict) => {
  console.log(\`[ALERT] \${verdict.category}: Score \${verdict.riskScore}/100\`);
  if (verdict.isDeepfakeClone || verdict.riskScore > 75) {
    stream.severCall({ reason: 'SYNTHETIC_VOICE_IMPERSONATION' });
    callix.guardian.notifyFamily({ recipient: '+919820099999' });
  }
});`,
    python: `from callix import CallixClient

client = CallixClient(api_key="cx_live_sec_token")

# Analyze audio stream or evidence file for deepfake artifacts
analysis = client.voice.scan(
    audio_source="telecom_stream_4410.wav",
    detect_vocoder_glitches=True,
    stt_engine="nova-2-in",
    xai_reasoning=True
)

print(f"Deepfake Probability: {analysis.clone_probability * 100}%")
print(f"Claude XAI Verdict: {analysis.explanation}")
if analysis.risk_score >= 80:
    client.guardian.dispatch_alert(priority="CRITICAL")`,
    go: `package main

import (
    "context"
    "fmt"
    "github.com/callix/callix-go"
)

func main() {
    client := callix.NewClient("cx_live_sec_token")
    
    verdict, err := client.Voice.AnalyzeStream(context.Background(), &callix.StreamParams{
        CallerID:   "+919820012345",
        SampleRate: 16000,
        Accents:    []string{"en-IN", "hi-IN"},
    })
    
    if verdict.RiskScore > 75 {
        fmt.Printf("Severe scam pattern detected: %s\\n", verdict.Category)
    }
}`,
    twilio: `// Twilio Voice Media Stream Integration
app.post('/voice/stream', async (req, res) => {
  const twiml = new VoiceResponse();
  const connect = twiml.connect();
  
  // Fork bidirectional audio to Callix Realtime Shield
  connect.stream({
    url: 'wss://api.callix.ai/v1/telecom/stream',
    name: 'CallixRealtimeShield',
    track: 'both_tracks'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});`,
    react: `import { useCallixLiveHUD } from '@callix/react';

export function CallSecurityHUD({ activeCall }) {
  const { riskScore, threatCategory, isClone, xaiReason } = useCallixLiveHUD({
    callId: activeCall.id
  });

  return (
    <div className="callix-hud-banner">
      <span>Threat Level: {riskScore}/100</span>
      {isClone && <span className="badge-clone">AI Clone Detected</span>}
      <p>{xaiReason}</p>
    </div>
  );
}`,
    curl: `curl -X POST https://api.callix.ai/v1/voice/scan \\
  -H "Authorization: Bearer cx_live_sec_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "caller_number": "+919820012345",
    "stt_engine": "nova-2-in",
    "xai_model": "claude-3-5-sonnet",
    "audio_url": "https://streams.callix.ai/sample.wav"
  }'`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // -------------------------------------------------------------
  // HERO INTERACTIVE TERMINAL: Preset Scenario Switcher
  // -------------------------------------------------------------
  const heroScenarios = [
    {
      id: 'arrest',
      title: 'Digital Arrest Threat',
      speaker: 'Impersonator (CBI/Police)',
      dialog: 'Your Aadhaar is flagged in 14 money laundering cases. Stay on video call under digital arrest.',
      risk: 96,
      category: 'DIGITAL_ARREST',
      tag: 'Critical Threat',
      tagColor: 'text-red-400 border-red-500/30 bg-red-500/10'
    },
    {
      id: 'kyc',
      title: 'Fake Bank KYC Expiry',
      speaker: 'Caller (SBI Fake Desk)',
      dialog: 'Your bank account will be blocked within 2 hours. Click link and download AnyDesk APK.',
      risk: 88,
      category: 'KYC_EXPIRY_TRAP',
      tag: 'High Fraud',
      tagColor: 'text-red-400 border-red-500/30 bg-red-500/10'
    },
    {
      id: 'clone',
      title: 'AI Deepfake Family Clone',
      speaker: 'Synthetic Voice Clone',
      dialog: 'Dad, I was in a car accident in Bangalore! Please send 40,000 rupees to this hospital UPI now!',
      risk: 94,
      category: 'DEEPFAKE_CLONE',
      tag: 'AI Clone',
      tagColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    },
    {
      id: 'safe',
      title: 'Verified Doctor Call',
      speaker: 'Apollo Hospitals',
      dialog: 'Hello Mr. Sharma, confirming your follow-up appointment with Dr. Rao tomorrow at 11:30 AM.',
      risk: 6,
      category: 'VERIFIED_LEGITIMATE',
      tag: 'Verified Safe',
      tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    }
  ];

  const [activeHeroScenario, setActiveHeroScenario] = useState(heroScenarios[0]);

  // -------------------------------------------------------------
  // INTERACTIVE DEMO 1: Real-Time Live Mic Interceptor Simulation
  // -------------------------------------------------------------
  const [micActive, setMicActive] = useState<boolean>(true);
  const [micDb, setMicDb] = useState<number>(68);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number>(1);

  const sampleTranscripts = [
    { speaker: 'CALLER', text: 'Hello, this is Senior Inspector Verma from Cyber Crime Cell, New Delhi.', threat: false },
    { speaker: 'CALLER', text: 'Your biometric Aadhaar is linked to 14 illegal bank accounts. Digital arrest is in effect.', threat: true, keyword: 'Digital arrest' },
    { speaker: 'CALLER', text: 'Transfer 50,000 security deposit immediately via UPI to clear your Supreme Court clearance file.', threat: true, keyword: 'Transfer 50,000 immediately' },
  ];

  useEffect(() => {
    if (!micActive) return;
    const interval = setInterval(() => {
      setMicDb(Math.floor(55 + Math.random() * 32));
      setActiveSpeechIndex((prev) => (prev + 1) % sampleTranscripts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [micActive, sampleTranscripts.length]);

  // -------------------------------------------------------------
  // INTERACTIVE DEMO 2: Biometric Deepfake Forensic Comparison
  // -------------------------------------------------------------
  const [biometricMode, setBiometricMode] = useState<'HUMAN' | 'AI_CLONE'>('AI_CLONE');

  // -------------------------------------------------------------
  // INTERACTIVE DEMO 3: Telecom Carrier Number Resolver
  // -------------------------------------------------------------
  const [lookupPhone, setLookupPhone] = useState<string>('9820012345');
  const [carrierData, setCarrierData] = useState({
    phone: '+91 98200 12345',
    operator: 'Vodafone Idea (Vi)',
    circle: 'Mumbai (MH)',
    lineType: 'Cellular Postpaid',
    riskLevel: 'FRAUD_SUSPECT',
    spamScore: 88,
    simAge: '2 Days (Fresh SIM Swap)',
    gateway: 'VoIP SIP Trunk Masquerade'
  });

  const handleTestNumber = (number: string, op: string, circle: string, type: string, risk: string, score: number, sim: string, gw: string) => {
    setLookupPhone(number);
    setCarrierData({
      phone: `+91 ${number.substring(0, 5)} ${number.substring(5)}`,
      operator: op,
      circle,
      lineType: type,
      riskLevel: risk,
      spamScore: score,
      simAge: sim,
      gateway: gw
    });
  };

  // -------------------------------------------------------------
  // INTERACTIVE DEMO 4: Explainable AI Threat Gauge Dial (0-100)
  // -------------------------------------------------------------
  const [threatSlider, setThreatSlider] = useState<number>(86);

  const getThreatEvaluation = (score: number) => {
    if (score < 30) {
      return {
        level: 'SAFE',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        verdict: 'Authentic Caller Verified',
        action: 'Normal Call Passing • Zero Intercept Needed',
        heuristicScore: 12,
        xaiScore: 15,
        hlrScore: 8,
      };
    } else if (score < 70) {
      return {
        level: 'SUSPICIOUS',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        verdict: 'Urgency & Pressure Tactics Detected',
        action: 'Real-Time HUD Warning Displayed to User',
        heuristicScore: 58,
        xaiScore: 62,
        hlrScore: 45,
      };
    } else if (score < 90) {
      return {
        level: 'HIGH FRAUD RISK',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        verdict: 'Coercive Extortion & OTP Harvesting Match',
        action: 'Elder Guardian Alert SMS Dispatched in 140ms',
        heuristicScore: 88,
        xaiScore: 89,
        hlrScore: 82,
      };
    } else {
      return {
        level: 'CRITICAL THREAT',
        color: 'text-red-500 font-bold',
        bg: 'bg-red-950/40 border-red-500/40',
        verdict: 'Active Synthetic Voice Clone & Banking Impersonation',
        action: 'Recommended Immediate Call Severance',
        heuristicScore: 98,
        xaiScore: 99,
        hlrScore: 95,
      };
    }
  };

  // -------------------------------------------------------------
  // VISIONOS HOLOGRAPHIC MODAL DATA SPECIFICATIONS
  // -------------------------------------------------------------
  const holoModalData: Record<DropdownKey, {
    categoryTitle: string;
    visionBadge: string;
    subFeatures: Array<{
      id: string;
      title: string;
      tagline: string;
      description: string;
      icon: any;
      telemetry: {
        scoreLabel: string;
        scoreValue: string;
        scoreColor: string;
        status: string;
        spectrumSpeed: string;
        channel: string;
      };
      link: string;
      ctaText: string;
    }>;
  }> = {
    features: {
      categoryTitle: 'Callix Voice Security Suite',
      visionBadge: 'VisionOS Forensic Core',
      subFeatures: [
        {
          id: 'voice-shield',
          title: 'Real-Time Voice Shield',
          tagline: 'Under 45ms Bidirectional Stream Interception',
          description: 'Autonomous neural watchdog that listens to carrier audio streams, comparing vocal biometrics against known deepfake models and instant voice cloning vectors in real-time.',
          icon: ShieldCheck,
          telemetry: {
            scoreLabel: 'AUTHENTICITY CONFIDENCE',
            scoreValue: '99.8%',
            scoreColor: 'text-emerald-400',
            status: 'ZERO NEURAL ARTIFACTS',
            spectrumSpeed: 'fast',
            channel: 'STREAM 01 • STEREO 48kHz'
          },
          link: '#features',
          ctaText: 'Deploy Voice Shield'
        },
        {
          id: 'deepfake-scanner',
          title: 'Deepfake Forensics Scanner',
          tagline: 'Multi-Band Acoustic Spectral Decomposition',
          description: 'Evaluates phase anomalies, vocoder synthesis glitches, and unnatural respiratory cadences that reveal AI synthetic speech generators like ElevenLabs and PlayHT.',
          icon: Activity,
          telemetry: {
            scoreLabel: 'SYNTHETIC PROBABILITY',
            scoreValue: '0.04%',
            scoreColor: 'text-cyan-400',
            status: 'NATURAL VOCAL RESONANCE',
            spectrumSpeed: 'medium',
            channel: '512 FFT SPECTROGRAM BANDS'
          },
          link: '#deepfake',
          ctaText: 'Inspect Spectrogram'
        },
        {
          id: 'hlr-carrier',
          title: 'HLR Carrier Resolver',
          tagline: 'Instant SIM Swap & BTS Triangulation',
          description: 'Direct telecom SS7 / Diameter protocol lookup confirming whether caller-ID matches physical BTS radio towers or originates from rogue VoIP proxies.',
          icon: Radio,
          telemetry: {
            scoreLabel: 'CARRIER REPUTATION',
            scoreValue: '100 / 100',
            scoreColor: 'text-purple-400',
            status: 'PHYSICAL BTS TOWER: AIRTEL-BLR',
            spectrumSpeed: 'slow',
            channel: 'HLR LATENCY: 12ms'
          },
          link: '#carrier',
          ctaText: 'Carrier Integrations'
        },
        {
          id: 'guardian-alerts',
          title: 'Elder Guardian Dispatch',
          tagline: 'Autonomous Emergency Family Intervention',
          description: 'When elder abuse or financial coercion phrases are detected, Callix triggers instant WhatsApp emergency calls and SMS broadcasts to designated next-of-kin.',
          icon: AlertTriangle,
          telemetry: {
            scoreLabel: 'INTERVENTION READINESS',
            scoreValue: 'ARMED',
            scoreColor: 'text-amber-400',
            status: 'NEXT-OF-KIN CHANNELS STANDBY',
            spectrumSpeed: 'fast',
            channel: 'DISPATCH LATENCY: <140ms'
          },
          link: '#guardian',
          ctaText: 'Guardian Relays'
        }
      ]
    },
    company: {
      categoryTitle: 'Callix Security Research',
      visionBadge: 'Bengaluru · Global Lab',
      subFeatures: [
        {
          id: 'about',
          title: 'About Callix',
          tagline: 'Voice Cybersecurity for the Generative Era',
          description: 'Founded by telecom and acoustic security researchers to protect digital telephony against adversarial synthetic voice attacks and social engineering fraud.',
          icon: Shield,
          telemetry: {
            scoreLabel: 'TELECOM COVERAGE',
            scoreValue: '98.4%',
            scoreColor: 'text-blue-400',
            status: 'INDIAN & GLOBAL CARRIERS ACTIVE',
            spectrumSpeed: 'medium',
            channel: 'TRAI & RBI COMPLIANT'
          },
          link: '#company',
          ctaText: 'Read Research Papers'
        },
        {
          id: 'whitepapers',
          title: 'Acoustic Whitepapers',
          tagline: 'Peer-Reviewed Forensic Benchmarks',
          description: 'Benchmark datasets analyzing acoustic jitter, pitch perturbations, and neural vocoder spectral leakage on over 100,000 synthetic audio samples.',
          icon: FileText,
          telemetry: {
            scoreLabel: 'DATASET RIGOR',
            scoreValue: '100K+ SAMPLES',
            scoreColor: 'text-indigo-400',
            status: 'PEER-REVIEWED FORENSIC PAPERS',
            spectrumSpeed: 'slow',
            channel: 'OPEN ACCESS ARXIV'
          },
          link: '#whitepaper',
          ctaText: 'Download Security PDF'
        }
      ]
    },
    enterprise: {
      categoryTitle: 'Carrier-Grade Telephony Infra',
      visionBadge: '99.999% SLA Enterprise',
      subFeatures: [
        {
          id: 'sip-trunks',
          title: 'Direct SIP Trunk Ingestion',
          tagline: 'Sub-30ms Regional Carrier Hooks',
          description: 'Plug-and-play zero-jitter connectors for Twilio Voice, AWS Chime SDK, FreeSWITCH, Asterisk, and custom carrier PBX hardware.',
          icon: Cpu,
          telemetry: {
            scoreLabel: 'INGESTION LATENCY',
            scoreValue: '28ms',
            scoreColor: 'text-amber-400',
            status: 'REGIONAL EDGE ROUTING: ACTIVE',
            spectrumSpeed: 'fast',
            channel: 'TLS 1.3 + SRTP ENCRYPTED'
          },
          link: '#sip',
          ctaText: 'Enterprise Integration'
        },
        {
          id: 'compliance-audits',
          title: 'TRAI & SOC2 Type II Audit',
          tagline: 'Cryptographic Audit Trail & Data Residency',
          description: 'Complete data residency within Indian telecom boundaries. Forensic logs are signed with cryptographic HMAC-SHA256 nonces for legal courtroom evidentiary compliance.',
          icon: CheckCircle2,
          telemetry: {
            scoreLabel: 'AUDIT STATUS',
            scoreValue: 'CERTIFIED',
            scoreColor: 'text-cyan-400',
            status: 'TAMPER-PROOF AUDIT TRAIL',
            spectrumSpeed: 'medium',
            channel: 'SOC2 TYPE II • ISO 27001'
          },
          link: '#compliance',
          ctaText: 'Request Security Audit'
        }
      ]
    },
    help: {
      categoryTitle: 'Developer & Security Support',
      visionBadge: '24/7 Security Desk',
      subFeatures: [
        {
          id: 'support-desk',
          title: 'Live Security Incident Desk',
          tagline: 'Direct Escalation to Voice Forensic Analysts',
          description: 'Round-the-clock incident response hotline for organizations facing active impersonation or executive vishing attempts.',
          icon: Headphones,
          telemetry: {
            scoreLabel: 'DESK RESPONSE TIME',
            scoreValue: '< 4 MINS',
            scoreColor: 'text-emerald-400',
            status: 'LIVE ACOUSTIC ENGINEERS ON-CALL',
            spectrumSpeed: 'medium',
            channel: 'P1 ESCALATION RELAYS READY'
          },
          link: '#support',
          ctaText: 'Contact Incident Desk'
        }
      ]
    },
    docs: {
      categoryTitle: 'Developer SDKs & Documentation',
      visionBadge: 'v2.4 Hub',
      subFeatures: [
        {
          id: 'sdk-quickstart',
          title: 'SDK Quickstart Guide',
          tagline: 'Intercept Calls in Under 5 Lines of Code',
          description: 'Native SDK packages for Node.js, Python, Go, and React. Plug straight into your existing Twilio or WebRTC media stream pipelines.',
          icon: Terminal,
          telemetry: {
            scoreLabel: 'SDK READINESS',
            scoreValue: 'v2.4.0',
            scoreColor: 'text-cyan-400',
            status: 'TYPESCRIPT • PYTHON • GO',
            spectrumSpeed: 'fast',
            channel: 'NPM & PIP VERIFIED'
          },
          link: '#code',
          ctaText: 'Open Quickstart Docs'
        },
        {
          id: 'threat-simulator',
          title: 'Interactive Threat Sandbox',
          tagline: 'Live Audio Cloning Testing Environment',
          description: 'Simulate synthetic speech attacks with pre-recorded deepfake test vectors and observe real-time telemetry risk calculations.',
          icon: Play,
          telemetry: {
            scoreLabel: 'SIMULATOR STATUS',
            scoreValue: 'ONLINE',
            scoreColor: 'text-emerald-400',
            status: 'REAL-TIME WEBSOCKET READY',
            spectrumSpeed: 'fast',
            channel: '12 SYNTHETIC TEST CASES'
          },
          link: '/simulation',
          ctaText: 'Launch Simulation Sandbox'
        }
      ]
    },
    ai: {
      categoryTitle: 'Explainable Acoustic AI Models',
      visionBadge: 'Claude 3.5 Sonnet XAI',
      subFeatures: [
        {
          id: 'xai-reasoning',
          title: 'Claude 3.5 Sonnet XAI',
          tagline: 'Plain-English Threat Citations',
          description: 'Every severed or flagged call generates transparent, natural language reasoning detailing why the audio was classified as synthetic or coercive.',
          icon: Sparkles,
          telemetry: {
            scoreLabel: 'EXPLAINABILITY INDEX',
            scoreValue: '100% CITED',
            scoreColor: 'text-amber-400',
            status: 'TRANSPARENT REASONING TRACE',
            spectrumSpeed: 'fast',
            channel: 'ANTHROPIC CLAUDE 3.5 SONNET'
          },
          link: '#ai',
          ctaText: 'Explore XAI Reasoning'
        },
        {
          id: 'spectrogram-fft',
          title: 'Acoustic Phase Spectrogram',
          tagline: 'Real-Time 512-Band FFT Decomposition',
          description: 'Visualizes micro-cadence jitter, robotic phase alignment, and unnatural frequency drop-offs typical of deepfake vocoders.',
          icon: Layers,
          telemetry: {
            scoreLabel: 'FFT RESOLUTION',
            scoreValue: '512 BANDS',
            scoreColor: 'text-cyan-400',
            status: 'SUB-BAND PHASE CORRELATION',
            spectrumSpeed: 'medium',
            channel: '48kHz SAMPLE RATE'
          },
          link: '#spectrogram',
          ctaText: 'Inspect Spectrogram'
        }
      ]
    }
  };

  const threatEval = getThreatEvaluation(threatSlider);

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] font-sans antialiased selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. CRYSTAL CLEAR FIXED GLASS CAPSULE NAVBAR (ROCK-SOLID)  */}
      {/* ========================================================= */}
      <header className="sticky top-3 sm:top-5 z-40 px-4 sm:px-6 w-full max-w-5xl md:max-w-7xl mx-auto transition-all duration-300" ref={navbarRef}>
        <div className="crystal-glass-capsule w-full px-5 sm:px-8 py-2.5 rounded-full flex items-center justify-between relative overflow-visible">
          
          {/* 4-Point Sparkle Star Glints on top glass rim matching photo */}
          <div className="sparkle-star left-[34%]">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-white">
              <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
            </svg>
          </div>
          <div className="sparkle-star left-[66%]" style={{ animationDelay: '1.5s' }}>
            <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-white">
              <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
            </svg>
          </div>

          {/* Static Brand Name (Pure Identity - Non-Clickable, No Button Effect) */}
          <div className="flex items-center gap-8 z-10">
            <div className="py-1 flex items-center gap-2 select-none cursor-default">
              <span className="font-bold text-xl tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                Callix
              </span>
            </div>

            {/* Desktop Navigation Links with 3D Press & Active Glass Indicator */}
            <ul className="hidden md:flex items-center gap-1">
              {/* Features */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('features')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none ${
                    activeDropdown === 'features' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'features' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">Features</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'features' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
              </li>

              {/* Company */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('company')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none ${
                    activeDropdown === 'company' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'company' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">Company</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'company' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
              </li>

              {/* Enterprise */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('enterprise')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none ${
                    activeDropdown === 'enterprise' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'enterprise' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">Enterprise</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'enterprise' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
              </li>

              {/* Help */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('help')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none ${
                    activeDropdown === 'help' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'help' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">Help</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'help' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
              </li>

              {/* Docs */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('docs')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none ${
                    activeDropdown === 'docs' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'docs' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">Docs</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'docs' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
              </li>

              {/* AI */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('ai')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none ${
                    activeDropdown === 'ai' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'ai' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">AI</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'ai' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
              </li>

              {/* Pricing Direct Link */}
              <li>
                <a 
                  href="#pricing" 
                  onClick={() => setActiveDropdown(null)}
                  className="nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium text-zinc-200 hover:text-white rounded-full outline-none"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Action CTAs with 3D Glass Pill Physics */}
          <div className="flex items-center gap-3 z-10">
            {user ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="glass-pill nav-3d-btn relative inline-flex items-center justify-center select-none text-white text-sm h-9 px-4 font-semibold shadow-md"
              >
                <span>Console</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="nav-3d-btn text-zinc-200 hover:text-white text-sm font-semibold hidden md:block transition-colors px-3 py-1.5 rounded-full"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/dashboard')}
                  className="glass-pill nav-3d-btn relative inline-flex items-center justify-center select-none text-white text-sm h-9 px-5 font-semibold shadow-lg"
                >
                  <span>Get started</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISIONOS FUTURISTIC HOLOGRAPHIC GLASS MODAL               */}
        {/* ========================================================= */}
        {activeDropdown && (
          <>
            {/* Backdrop Blur Dimmer */}
            <div 
              className="visionos-backdrop" 
              onClick={() => setActiveDropdown(null)} 
            />

            {/* Floating VisionOS Glass Modal */}
            <div className="visionos-glass-modal p-6 sm:p-8 text-left relative">
              {/* Dual Top-Rim Sparkle Stars */}
              <div className="sparkle-star left-[20%] -top-[6px]">
                <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-white">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </div>
              <div className="sparkle-star right-[20%] -top-[6px]" style={{ animationDelay: '1.5s' }}>
                <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-white">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/15 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center text-white shadow-inner">
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white tracking-wide">
                      {holoModalData[activeDropdown]?.categoryTitle}
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {holoModalData[activeDropdown]?.visionBadge} • Holographic Diagnostics
                    </span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow-inner"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2-Column VisionOS Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                
                {/* Left Column: Holographic 3D Viewport Chamber */}
                <div className="lg:col-span-5 flex flex-col space-y-3">
                  <div className="holographic-chamber h-64 sm:h-72 holo-grid flex flex-col justify-between p-4 relative">
                    {/* Scanning Laser Beam */}
                    <div className="holo-scanner-beam" />

                    {/* Rotating Radar Rings */}
                    <div className="holo-radar-ring w-44 h-44 pointer-events-none" />
                    <div className="holo-radar-ring w-28 h-28 pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />

                    {/* Top Chamber Header Status */}
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        LIVE FORENSIC HUD
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.telemetry.channel}
                      </span>
                    </div>

                    {/* Center Hologram Visual: Animated Waveform Spectrum */}
                    <div className="my-auto z-10 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-[220px]">
                        {[40, 75, 55, 95, 30, 85, 65, 100, 45, 90, 70, 35, 80, 60, 90, 50].map((h, i) => (
                          <div 
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-500 via-sky-400 to-white shadow-[0_0_10px_rgba(56,189,248,0.85)]"
                            style={{ 
                              height: `${h}%`,
                              animation: 'pulse 1.4s ease-in-out infinite',
                              animationDelay: `${i * 0.08}s` 
                            }}
                          />
                        ))}
                      </div>

                      <div>
                        <div className={`text-2xl font-bold font-mono tracking-tight ${holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.telemetry.scoreColor} drop-shadow-[0_0_12px_currentColor]`}>
                          {holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.telemetry.scoreValue}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 tracking-wider mt-0.5">
                          {holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.telemetry.scoreLabel}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status readout */}
                    <div className="z-10 bg-black/60 backdrop-blur-md rounded-xl p-2 border border-white/10 text-center">
                      <span className="text-[10px] font-mono text-emerald-400 tracking-wide flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        {holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.telemetry.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between px-1">
                    <span>Optical Telemetry Engine</span>
                    <span className="text-zinc-500">24-Bit Linear PCM</span>
                  </div>
                </div>

                {/* Right Column: Feature Navigation Tabs & Deep Specs */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  {/* Selectable Feature Tabs */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                      Select Forensic Module:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {holoModalData[activeDropdown]?.subFeatures.map((feat, index) => {
                        const IconComponent = feat.icon;
                        const isSelected = activeHoloTab === index;
                        return (
                          <button
                            key={feat.id}
                            type="button"
                            onClick={() => setActiveHoloTab(index)}
                            className={`visionos-tab-btn p-3 flex items-start gap-3 text-left ${isSelected ? 'active' : ''}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                              isSelected ? 'bg-white/20 border-white/60 text-white shadow-inner' : 'bg-white/5 border-white/15 text-zinc-400'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className={`text-xs font-medium truncate ${isSelected ? 'text-white font-semibold' : 'text-zinc-300'}`}>
                                {feat.title}
                              </h4>
                              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                                {feat.tagline}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Subfeature Detail Card */}
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-md space-y-2">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.title}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.description}
                    </p>
                  </div>

                  {/* Footer CTAs */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Carrier Hook Active
                    </span>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <a
                        href={holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.link}
                        onClick={() => setActiveDropdown(null)}
                        className="visionos-tab-btn px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white rounded-xl flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          handleLaunchApp('/dashboard');
                        }}
                        className="glass-pill px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-lg flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                      >
                        <span>{holoModalData[activeDropdown]?.subFeatures[activeHoloTab]?.ctaText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION (FULL-WIDTH IMMERSIVE ENTERPRISE HERO)   */}
      {/* ========================================================= */}
      <div className="relative z-20 w-full min-h-[calc(100vh-80px)] flex items-center pt-[60px] md:pt-0 overflow-hidden">
        
        {/* Floor background */}
        <img 
          alt="Floor background" 
          width="1920" 
          height="1080" 
          className="pointer-events-none absolute top-0 left-0 right-0 mx-auto hidden h-screen w-full select-none md:block opacity-80 transition-opacity duration-500" 
          style={{ maskImage: 'linear-gradient(to top, transparent 15%, black 25%)' }} 
          src="/bg-hero-1.jpg" 
        />

        {/* Light ray background */}
        <img 
          alt="Light ray background" 
          width="1920" 
          height="1080" 
          className="pointer-events-none absolute -top-20 left-0 right-0 mx-auto hidden h-screen w-full select-none md:block transition-all duration-500" 
          style={{ maskImage: 'linear-gradient(to top, transparent 15%, black 25%)' }} 
          src="/bg-light.png" 
        />

        <section className="mx-auto w-full max-w-[1700px] px-8 md:px-12 lg:px-16 min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between w-full gap-12 lg:gap-16 py-10 lg:py-0">
            
            {/* Left text column */}
            <div className="order-2 lg:order-1 w-full animate-hero-text-slide-up-fade flex flex-col items-start text-left max-w-2xl z-10">
              
              {/* Rainbow badge */}
              <div className="flex items-center justify-start mb-6">
                <a className="rainbow-border inline-flex items-center justify-center rounded-full relative text-sm leading-none" href="#code">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap px-3.5 py-1.5 m-[1px] rounded-full text-zinc-300 font-mono text-xs bg-black">
                    Join us at Callix Forward
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </span>
                </a>
              </div>
              
              {/* Headline: Exact 3-line structure with single sharp diagonal laser beam */}
              <h1 className="headline-shimmer inline-block font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.08] relative pb-2 select-none">
                Next-Gen<br />
                Voice<br />
                <span className="whitespace-nowrap">Fraud Defense</span>
              </h1>
              
              {/* Subtitle */}
              <p className="font-sans text-base md:text-lg text-zinc-400 font-normal tracking-tight leading-snug md:leading-[1.5] max-w-lg md:max-w-xl mt-5 mb-8 antialiased">
                Stop synthetic voice clones, deepfake audio, and telecom fraud in real time. Protect every conversation with enterprise-grade voice intelligence.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={() => handleLaunchApp('/dashboard')}
                  className="resend-frosted-btn relative inline-flex items-center justify-center select-none rounded-2xl text-white text-base h-auto px-7 py-3.5 font-medium hover:bg-white hover:text-black transition-all duration-200 shadow-lg"
                >
                  Get started
                </button>
                <a 
                  href="#code" 
                  className="relative inline-flex items-center justify-center select-none rounded-2xl bg-transparent border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-base h-auto px-7 py-3.5 font-medium transition-colors"
                >
                  Documentation
                </a>
              </div>
            </div>
            
            {/* Right: 1:1 Resend 3D Cube with 100% True Alpha Transparency (Zero Black Box) */}
            <div className="duration-300 relative order-1 lg:order-2 flex items-center justify-end w-full h-[550px] lg:h-[700px] overflow-visible pointer-events-auto">
              <ResendCube3D className="w-full h-full max-w-[650px] lg:max-w-[850px] xl:max-w-[900px]" />
            </div>

          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* 3. RESEND SOCIAL PROOF & PARTNER LOGOS (SEAMLESS STRIP)   */}
      {/* ========================================================= */}
      <section className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl relative rounded-3xl border-t border-white/[0.08] mt-16 flex flex-col items-center">
        
        {/* Conic light beam divider in Resend style */}
        <div aria-hidden="true" className="left-1/2 top-0 w-[300px] center pointer-events-none absolute h-px max-w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        <p className="text-base md:text-[1.125rem] md:leading-[1.5] text-zinc-400 font-normal mb-10 max-w-lg text-center">
          Companies of all sizes trust Callix to deliver their most important voice streams.
        </p>

        <div className="w-5/6 gap-x-6 gap-y-4 grid grid-cols-2 items-center sm:grid-cols-3 lg:grid-cols-6 text-zinc-400 font-mono text-sm tracking-wider opacity-80 text-center">
          <span className="hover:text-white transition-colors font-bold tracking-tight">Bharti Airtel</span>
          <span className="hover:text-white transition-colors font-bold tracking-tight">Reliance Jio</span>
          <span className="hover:text-white transition-colors font-bold tracking-tight">Deepgram</span>
          <span className="hover:text-white transition-colors font-bold tracking-tight">Anthropic</span>
          <span className="hover:text-white transition-colors font-bold tracking-tight">Twilio Voice</span>
          <span className="hover:text-white transition-colors font-bold tracking-tight">AWS Telephony</span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. RESEND SIGNATURE CODE BOX (DEVELOPER EXPERIENCE)       */}
      {/* ========================================================= */}
      <section id="code" className="py-24 px-6 max-w-5xl mx-auto text-center space-y-10">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">DEVELOPER FIRST API</span>
          <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
            Integrate in minutes, <br />
            <span className="italic font-light text-zinc-300">protect forever</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-normal">
            Single unified SDK for telecommunication trunks, mobile dialers, and custom VoIP gateways. Simple webhooks, rich typed streams.
          </p>
        </div>

        {/* Language Tabs Selector */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {[
            { id: 'nodejs', label: 'Node.js' },
            { id: 'python', label: 'Python' },
            { id: 'go', label: 'Go' },
            { id: 'twilio', label: 'Twilio Stream' },
            { id: 'react', label: 'React HUD' },
            { id: 'curl', label: 'cURL' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedLang(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedLang === tab.id
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resend Dark Code Block */}
        <div className="text-left rounded-2xl bg-[#09090B] border border-white/[0.08] shadow-2xl overflow-hidden font-mono text-xs max-w-4xl mx-auto">
          
          {/* Header Bar */}
          <div className="h-10 px-4 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{selectedLang}.ts</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-[11px] px-2 py-1 rounded-md hover:bg-zinc-900"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="p-6 overflow-x-auto text-zinc-300 leading-relaxed font-mono">
            <pre>{codeSnippets[selectedLang]}</pre>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. RESEND BENTO GRID (INTERACTIVE FEATURES)               */}
      {/* ========================================================= */}
      <section className="py-20 border-t border-white/[0.08] bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">INTELLIGENCE PLATFORM</span>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              A complete shield against <br />
              <span className="italic font-light text-zinc-300">multilingual voice fraud</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Designed specifically for high-velocity fraud vectors including Digital Arrest, Bank KYC Phishing, OTP Intercept, and AI Voice Impersonation.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Deepgram nova-2 en-IN */}
            <div className="resend-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Speech-to-Text en-IN</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real-time diarization optimized for Indian English accents, Hinglish phrasing, and multi-dialect telecom speech.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                <span>Model: nova-2-en-in</span>
                <span className="text-emerald-400">18ms Latency</span>
              </div>
            </div>

            {/* Feature 2: Claude 3.5 Sonnet XAI */}
            <div className="resend-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Explainable AI (XAI)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Multimodal linguistic reasoning evaluating psychological coercion, fake law-enforcement claims, and urgent fund transfers.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                <span>Engine: Claude 3.5</span>
                <span className="text-indigo-400">Full XAI Trace</span>
              </div>
            </div>

            {/* Feature 3: Elder Guardian Alert */}
            <div className="resend-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Elder Guardian Intercept</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Instant SMS and push notifications to designated family guardians when high-risk fraud (Score &gt; 75) is detected live.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                <span>SMS Dispatch</span>
                <span className="text-emerald-400">&lt; 140ms Alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. INTERACTIVE MIC DECIBEL WAVEFORM DEMO                  */}
      {/* ========================================================= */}
      <section id="waveform" className="py-20 border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">01 • ACOUSTIC STREAMING</span>
              <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Live Mic Call Interceptor &amp; Decibel Waveform
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Continuous acoustic FFT engine converts raw audio into sub-second lexical tokens with diarized speaker turns.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMicActive(!micActive)}
              className="resend-frosted-btn rounded-xl px-4 py-2 text-xs font-mono text-zinc-300 flex items-center gap-2 self-start md:self-auto"
            >
              {micActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{micActive ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>
          </div>

          {/* Clean Dark Interceptor Card */}
          <div className="resend-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-3">
              <span className="text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                /dev/mic0 • en-IN 16kHz Web Audio
              </span>
              <span className="text-zinc-300">Level: <strong className="text-white font-bold">{micActive ? micDb : 0} dBFS</strong></span>
            </div>

            {/* 32-Bar Decibel Spectrum */}
            <div className="h-28 bg-black rounded-xl border border-zinc-900 p-4 flex items-end justify-between gap-1.5 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => {
                const barHeight = micActive
                  ? Math.max(8, Math.min(100, (Math.sin(i * 0.4 + Date.now() * 0.002) + 1.2) * (micDb * 0.5) + (Math.random() * 20)))
                  : 6;
                const isHigh = barHeight > 65;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-150 ${
                      isHigh ? 'bg-gradient-to-t from-red-600 to-amber-400' : 'bg-gradient-to-t from-zinc-700 to-zinc-300'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                );
              })}
            </div>

            {/* Diarized Transcripts */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>SPEECH-TO-TEXT DIARIZATION FEED</span>
                <span className="text-emerald-400">nova-2 Latency: 18ms</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black border border-zinc-900 space-y-2 font-mono text-xs">
                {sampleTranscripts.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg transition-all ${
                      idx === activeSpeechIndex
                        ? 'bg-zinc-900 text-white border-l-2 border-white'
                        : 'text-zinc-500 opacity-60'
                    }`}
                  >
                    <span className="font-bold text-zinc-300 mr-2">{t.speaker}:</span>
                    <span>{t.text}</span>
                    {t.threat && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px]">
                        FLAG: {t.keyword}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. INTERACTIVE DEEPFAKE FORENSICS DEMO                    */}
      {/* ========================================================= */}
      <section id="deepfake" className="py-20 border-t border-white/[0.08] bg-zinc-950/40">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">02 • FORENSIC BIOMETRICS</span>
            <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Deepfake &amp; Synthetic Voice Biometric Analyzer
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Inspect spectral dispersion, phase jitter, and neural vocoder artifacts generated by ElevenLabs, Bark, and RVC.
            </p>
          </div>

          {/* Interactive Biometrics Box */}
          <div className="resend-card rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Target Sample Profile:</span>
                <div className="text-sm font-semibold text-white">
                  {biometricMode === 'AI_CLONE' ? 'Synthetic Clone (ElevenLabs v2 Synthesizer)' : 'Authentic Human Voice (Natural Vocal Cords)'}
                </div>
              </div>

              <div className="inline-flex p-1 rounded-full bg-black border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setBiometricMode('HUMAN')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    biometricMode === 'HUMAN' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Authentic Human Voice
                </button>
                <button
                  type="button"
                  onClick={() => setBiometricMode('AI_CLONE')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    biometricMode === 'AI_CLONE' ? 'bg-red-500 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Synthetic AI Clone
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">SPECTRAL DISPERSION</div>
                <div className={`text-xl font-bold font-mono ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? '0.94 / 1.00' : '0.14 / 1.00'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'Extreme high-frequency cutoff.' : 'Natural human harmonic curve.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">VOCODER GLITCH</div>
                <div className={`text-xl font-bold font-mono ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? 'HiFi-GAN (98%)' : 'None Detected'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'Diffusion vocoder mismatch.' : 'Natural micro-tremors.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">VERDICT</div>
                <div className={`text-xl font-bold font-mono ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? 'SYNTHETIC CLONE' : 'VERIFIED HUMAN'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'High coercion impersonation.' : 'Zero AI signatures.'}
                </p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1.5 p-4 rounded-xl bg-black border border-zinc-900">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-500">Synthesizer Confidence Score:</span>
                <span className={biometricMode === 'AI_CLONE' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {biometricMode === 'AI_CLONE' ? '89.4% (Deepfake High)' : '4.2% (Natural Human)'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    biometricMode === 'AI_CLONE' ? 'w-[89.4%] bg-red-500' : 'w-[4.2%] bg-emerald-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. INTERACTIVE TELECOM CARRIER INTEL                      */}
      {/* ========================================================= */}
      <section id="carrier" className="py-20 border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">03 • TELECOM INTELLIGENCE</span>
            <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Telecom HLR Carrier &amp; Multi-Tier Spam Engine
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Home Location Register queries and VoIP spoofed CLI gateway detection across Indian telecom networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Number presets (5 cols) */}
            <div className="md:col-span-5 resend-card rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Test Carrier Signatures:</span>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleTestNumber('9820012345', 'Vodafone Idea (Vi)', 'Mumbai (MH)', 'Cellular Postpaid', 'FRAUD_SUSPECT', 88, '2 Days (Fresh SIM Swap)', 'VoIP SIP Trunk Masquerade')}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                    lookupPhone === '9820012345'
                      ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                      : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">+91 98200 12345</div>
                    <div className="text-[10px] text-red-400">Fresh SIM Swap Alert</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 font-bold">FRAUD</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTestNumber('7019844321', 'Reliance Jio', 'Karnataka (KA)', 'Cellular 5G', 'SAFE', 12, '4.2 Years', 'Direct Jio IMS')}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                    lookupPhone === '7019844321'
                      ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                      : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">+91 70198 44321</div>
                    <div className="text-[10px] text-emerald-400">Verified Consumer Line</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">SAFE</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTestNumber('9448123999', 'BSNL', 'Tamil Nadu (TN)', 'Landline / WLL', 'SPAM', 64, '3.8 Years', 'International Gateway Routing')}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                    lookupPhone === '9448123999'
                      ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                      : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">+91 94481 23999</div>
                    <div className="text-[10px] text-amber-400">Robocall Call Center</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold">SPAM</span>
                </button>
              </div>
            </div>

            {/* Dossier Result (7 cols) */}
            <div className="md:col-span-7 resend-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono">
                <span className="text-zinc-400">CARRIER DOSSIER: {carrierData.phone}</span>
                <span className="text-white font-bold">{carrierData.riskLevel}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-mono">OPERATOR</div>
                  <div className="font-semibold text-white">{carrierData.operator}</div>
                </div>

                <div className="p-3 rounded-xl bg-black border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-mono">CIRCLE (LSA)</div>
                  <div className="font-semibold text-white">{carrierData.circle}</div>
                </div>

                <div className="p-3 rounded-xl bg-black border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-mono">SIM AGE</div>
                  <div className="font-semibold text-white">{carrierData.simAge}</div>
                </div>

                <div className="p-3 rounded-xl bg-black border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-mono">GATEWAY</div>
                  <div className="font-semibold text-zinc-300 truncate">{carrierData.gateway}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-900 flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">Threat Score:</span>
                <span className={`font-bold ${carrierData.spamScore > 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {carrierData.spamScore} / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. PRICING TIERS (RESEND MINIMALIST STYLE)                */}
      {/* ========================================================= */}
      <section id="pricing" className="py-24 border-t border-white/[0.08] bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">TRANSPARENT PRICING</span>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Start free, <br />
              <span className="italic font-light text-zinc-300">scale without limits</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Predictable pricing for developers, telecom networks, and high-security fintech applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Free Tier */}
            <div className="resend-card rounded-2xl p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-white">Free Sandbox</h4>
                  <p className="text-xs text-zinc-400">For developers and small tests.</p>
                </div>
                <div className="text-3xl font-bold text-white font-mono">$0 <span className="text-xs font-normal text-zinc-500">/ month</span></div>
                
                <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1,000 Free Call Minutes / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deepgram nova-2 en-IN STT</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Basic Heuristic Detection</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchApp('/dashboard')}
                className="w-full resend-frosted-btn rounded-xl py-2.5 text-xs font-medium text-white"
              >
                Start Free
              </button>
            </div>

            {/* Pro Shield Tier */}
            <div className="resend-card rounded-2xl p-6 space-y-6 flex flex-col justify-between border-zinc-600 shadow-resend-glow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-black text-[10px] font-bold font-mono">
                POPULAR
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-white">Pro Shield</h4>
                  <p className="text-xs text-zinc-400">For startups, apps &amp; families.</p>
                </div>
                <div className="text-3xl font-bold text-white font-mono">$49 <span className="text-xs font-normal text-zinc-500">/ month</span></div>
                
                <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>50,000 Live Call Minutes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Claude 3.5 Sonnet XAI Explanations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Elder Guardian Instant SMS Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deepfake Biometric Vocoder Scan</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchApp('/dashboard')}
                className="w-full resend-primary-btn rounded-xl py-2.5 text-xs font-semibold"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="resend-card rounded-2xl p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-white">Enterprise Telecom</h4>
                  <p className="text-xs text-zinc-400">For telecom carriers &amp; banks.</p>
                </div>
                <div className="text-3xl font-bold text-white font-mono">Custom</div>
                
                <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unlimited SIP Trunk Streams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dedicated On-Premise GPU Nodes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>99.99% SLA &amp; 24/7 Security Hotline</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchApp('/dashboard')}
                className="w-full resend-frosted-btn rounded-xl py-2.5 text-xs font-medium text-white"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. BOTTOM CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <section className="py-24 border-t border-white/[0.08] text-center px-6 max-w-4xl mx-auto space-y-6">
        <h3 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
          Ready to secure your voice streams?
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Start detecting synthetic voice clones and fraudulent callers in minutes with Callix.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleLaunchApp('/dashboard')}
            className="resend-primary-btn rounded-2xl px-6 py-3 text-sm flex items-center gap-2"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleLaunchApp('/dashboard')}
            className="resend-frosted-btn rounded-2xl px-5 py-3 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Sign In ➔
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. RESEND 4-COLUMN FOOTER WITH SYSTEM STATUS             */}
      {/* ========================================================= */}
      <footer className="border-t border-white/[0.08] bg-black py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
            {/* Column 1: Product */}
            <div className="space-y-3">
              <div className="font-medium text-white">Product</div>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#waveform" className="hover:text-white transition-colors">Acoustic Shield</a></li>
                <li><a href="#deepfake" className="hover:text-white transition-colors">Voice Biometrics</a></li>
                <li><a href="#carrier" className="hover:text-white transition-colors">Telecom Carrier HLR</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-3">
              <div className="font-medium text-white">Resources</div>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#code" className="hover:text-white transition-colors">SDK Documentation</a></li>
                <li><Link to="/phrases" className="hover:text-white transition-colors">Scam Phrases Library</Link></li>
                <li><Link to="/lookup" className="hover:text-white transition-colors">Number Reputation</Link></li>
                <li><Link to="/simulation" className="hover:text-white transition-colors">Call Simulator</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <div className="font-medium text-white">Company</div>
              <ul className="space-y-2 text-zinc-400">
                <li><Link to="/guardian" className="hover:text-white transition-colors">Elder Guardian</Link></li>
                <li><Link to="/settings" className="hover:text-white transition-colors">API Keys</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Threat Intel</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal & Security */}
            <div className="space-y-3">
              <div className="font-medium text-white">Legal &amp; Security</div>
              <ul className="space-y-2 text-zinc-400">
                <li><span className="text-zinc-500">Privacy Policy</span></li>
                <li><span className="text-zinc-500">Terms of Service</span></li>
                <li><span className="text-zinc-500">Security &amp; Compliance</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Status Indicator */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black font-bold text-[10px]">
                Cx
              </div>
              <span>Callix &copy; {new Date().getFullYear()}</span>
            </div>

            {/* Resend Green Status Light */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-900 text-[11px] font-mono text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sleek Dark-Themed Firebase Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authModalMode}
        onSuccess={() => {
          setAuthModalOpen(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default LandingPage;
