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
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Compass,
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
  BarChart3,
  PhoneOff,
  X,
  Calculator,
  TrendingUp,
  HelpCircle,
  Server,
  Network
} from 'lucide-react';
import { ResendCube3D } from '../components/common/ResendCube3D';
import { AuthModal } from '../components/auth/AuthModal';

// Zero-re-render high-performance reading progress bar with requestAnimationFrame
const ScrollProgressBar: React.FC = () => {
  const barRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (barRef.current) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        barRef.current.style.width = `${progress}%`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={barRef}
      className="scroll-progress-bar" 
      aria-hidden="true"
      style={{ width: '0%' }}
    />
  );
};

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

  // Smooth programmatic scrolling helper for buttery-smooth navigation
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveDropdown(null);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // -------------------------------------------------------------
  // ULTRA-SMOOTH SCROLL PROGRESS & SCROLL REVEAL OBSERVER
  // -------------------------------------------------------------
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  // Interactive ROI Calculator State
  const [roiMonthlyCalls, setRoiMonthlyCalls] = useState<number>(2500);
  const [roiScamRate, setRoiScamRate] = useState<number>(6); // %
  const [roiAvgLoss, setRoiAvgLoss] = useState<number>(75000); // INR

  // FAQ Accordion active item
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  // IntersectionObserver to trigger smooth reveal animations when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // -------------------------------------------------------------
  // 4-STEP DEFENSIVE PIPELINE DATA SPECIFICATIONS
  // -------------------------------------------------------------
  const pipelineSteps = [
    {
      step: '01',
      badge: 'SUB-18MS INGESTION',
      title: 'Real-Time Audio Ingestion & Diarization',
      tagline: 'Zero-Jitter Dual Stream Separation',
      description: 'As soon as a voice call initiates via carrier SIP trunk or WebRTC media stream, Callix captures the raw 24-bit PCM audio stream with zero added jitter. The stream is split into distinct caller and callee channels in sub-18ms.',
      metrics: [
        { label: 'Ingestion Latency', value: '18ms' },
        { label: 'Sample Rate', value: '48 kHz' },
        { label: 'Channels', value: 'Binaural Diarized' }
      ],
      icon: Radio,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30'
    },
    {
      step: '02',
      badge: 'NEURAL VOCODER SCAN',
      title: 'Biometric Deepfake & Vocoder Artifact Detection',
      tagline: '512-Band FFT Acoustic Decomposition',
      description: 'The incoming caller audio is analyzed for synthetic vocoder fingerprints (HiFi-GAN, ElevenLabs, RVC), acoustic phase mismatches, robotic jitter, and the biological absence of natural human breathing cadences.',
      metrics: [
        { label: 'FFT Bands', value: '512 Resolution' },
        { label: 'Vocoder Accuracy', value: '99.4%' },
        { label: 'Respiration Scan', value: 'Continuous' }
      ],
      icon: Activity,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/30'
    },
    {
      step: '03',
      badge: 'NLP INTENT ENGINE',
      title: 'Semantic Coercion & Extortion Spotting',
      tagline: 'Digital Arrest & KYC Script Matching',
      description: 'Deepgram Nova-2 transcribes speech streams in real time with Indian English & regional dialects. Our NLP threat engine continuously scans for coercion tactics, fake CBI/Police extortion, and urgent fund transfer traps.',
      metrics: [
        { label: 'Script Catalog', value: '500+ Scenarios' },
        { label: 'Coercion Scoring', value: '5 - 50 Dynamic' },
        { label: 'Dialects', value: 'en-IN / hi-IN' }
      ],
      icon: ShieldAlert,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/30'
    },
    {
      step: '04',
      badge: 'AUTONOMOUS DEFENSE',
      title: 'Immediate Multi-Channel Intervention',
      tagline: 'Sub-140ms Elder Guardian Dispatch',
      description: 'When the composite threat score exceeds threshold (>75), Callix flashes an instant HUD warning on the user screen, triggers an emergency SMS/WhatsApp alert to designated family guardians within 140ms, and severs the call.',
      metrics: [
        { label: 'SMS Latency', value: '< 140ms' },
        { label: 'Auto-Sever Risk', value: '> 90 / 100' },
        { label: 'Audit Signature', value: 'HMAC-SHA256' }
      ],
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30'
    }
  ];

  // -------------------------------------------------------------
  // LIVE INDIAN CYBERCRIME ATTACK FEED DATA
  // -------------------------------------------------------------
  const liveThreatEvents = [
    {
      time: 'Just now',
      city: 'Bengaluru (KA)',
      carrier: 'Jio 5G',
      threatType: 'Digital Arrest CBI Extortion',
      risk: 97,
      action: 'Call Auto-Severed (18ms)',
      statusColor: 'text-red-400 bg-red-950/60 border-red-800/60'
    },
    {
      time: '42s ago',
      city: 'Mumbai (MH)',
      carrier: 'Vi Postpaid',
      threatType: 'AI Synthetic Voice Clone (Family)',
      risk: 94,
      action: 'Elder Guardian SMS Dispatched',
      statusColor: 'text-purple-400 bg-purple-950/60 border-purple-800/60'
    },
    {
      time: '1m 18s ago',
      city: 'Delhi NCR',
      carrier: 'Airtel Fiber SIP',
      threatType: 'SBI Fake KYC APK Phishing',
      risk: 89,
      action: 'HUD Coercion Warning Flashed',
      statusColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
    },
    {
      time: '2m 04s ago',
      city: 'Hyderabad (TS)',
      carrier: 'VoIP SIP Proxy',
      threatType: 'International Gateway Spoofed CLI',
      risk: 91,
      action: 'HLR Gateway Rejected',
      statusColor: 'text-red-400 bg-red-950/60 border-red-800/60'
    },
    {
      time: '3m 15s ago',
      city: 'Pune (MH)',
      carrier: 'BSNL WLL',
      threatType: 'Credit Card Reward Urgency Trap',
      risk: 76,
      action: 'Flagged in Audit Dossier',
      statusColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
    }
  ];

  // -------------------------------------------------------------
  // FAQ DATA SPECIFICATIONS
  // -------------------------------------------------------------
  const faqs = [
    {
      q: 'How does Callix detect synthetic voice clones in real time without creating call delay?',
      a: 'Callix utilizes a lightweight edge pipeline. While audio passes through your phone or enterprise SIP trunk, our sub-18ms stream processor extracts 512-band Fast Fourier Transform (FFT) spectrograms and analyzes phase jitter and vocoder neural footprints (such as HiFi-GAN and ElevenLabs) concurrently without interrupting conversation audio.'
    },
    {
      q: 'Will Callix record or store my private personal conversations?',
      a: 'Zero audio retention by default. Callix performs ephemeral on-the-fly streaming analysis. Only when a critical extortion threat or synthetic deepfake is detected (Threat Score > 75) is a cryptographic, HMAC-SHA256 signed forensic audit trail generated for courtroom evidentiary use, strictly adhering to Indian DPDP Act and SOC2 standards.'
    },
    {
      q: 'What is a "Digital Arrest" scam and how does Callix neutralize it?',
      a: 'In Digital Arrest scams, fraudsters pose as CBI, ED, or Mumbai Police officers and demand victims remain on continuous video/audio calls while coercing fund transfers to "clear their Aadhaar". Callix detects specific coercion language ("Supreme Court clearance", "stay on call", "Aadhaar money laundering") and alerts users and next-of-kin within seconds.'
    },
    {
      q: 'How does the Elder Guardian system protect elderly parents?',
      a: 'Elderly citizens are the prime target for AI voice cloning scams where fraudsters replicate a son or daughter’s voice pleading for urgent medical money. Callix allows families to designate next-of-kin guardian contacts. When a high-confidence scam or clone targets their phone, guardians receive immediate automated SMS and WhatsApp alerts in <140ms.'
    },
    {
      q: 'Does Callix integrate with all Indian telecom carriers and enterprise PBXs?',
      a: 'Yes. Callix supports direct SIP trunking for Twilio Voice, FreeSWITCH, Asterisk, and carrier-grade IMS networks across Reliance Jio, Bharti Airtel, Vodafone Idea (Vi), and BSNL.'
    }
  ];

  // ROI calculations
  const estimatedScamCalls = Math.round((roiMonthlyCalls * roiScamRate) / 100);
  const estimatedLossAvoided = Math.round(estimatedScamCalls * roiAvgLoss);
  const formattedLossAvoided = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(estimatedLossAvoided);

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
      visionBadge: 'Real-Time Console Modules',
      subFeatures: [
        {
          id: 'voice-simulator',
          title: 'Live Call Simulator',
          tagline: 'Real-Time Diarization & Scam Interception',
          description: 'Interactive simulation of Indian cybercrime calls (Digital Arrest, Bank KYC, Voice Clone). Monitors live audio streams, calculates a dynamic 0-100 risk score, and auto-severs calls.',
          icon: Play,
          telemetry: {
            scoreLabel: 'SIMULATION ENGINE',
            scoreValue: 'ONLINE',
            scoreColor: 'text-emerald-400',
            status: 'CBI & BANK KYC SCENARIOS',
            spectrumSpeed: 'fast',
            channel: 'WEBSPEECH + NOVA-2'
          },
          link: '/simulation',
          ctaText: 'Launch Call Simulator'
        },
        {
          id: 'deepfake-scanner',
          title: 'Deepfake Audio Scanner',
          tagline: 'Dual Scam & AI Voice Biometrics',
          description: 'Upload audio or record live mic to analyze acoustic jitter, vocoder artifacts (HiFi-GAN, ElevenLabs), and biological respiration/breathing absence.',
          icon: Activity,
          telemetry: {
            scoreLabel: 'DEEPFAKE CERTAINTY',
            scoreValue: '99.4%',
            scoreColor: 'text-cyan-400',
            status: 'RESPIRATION & VOCODER SCAN',
            spectrumSpeed: 'medium',
            channel: '512 FFT SPECTROGRAM BANDS'
          },
          link: '/scanner',
          ctaText: 'Open Audio Scanner'
        },
        {
          id: 'guardian-hub',
          title: 'Elder Guardian Hub',
          tagline: 'Autonomous Family Protection Network',
          description: 'Designated next-of-kin emergency dispatch. Automatically sends SMS and WhatsApp alerts within <140ms when high-risk fraud (Score > 75) targets vulnerable family members.',
          icon: AlertTriangle,
          telemetry: {
            scoreLabel: 'INTERVENTION READINESS',
            scoreValue: 'ARMED',
            scoreColor: 'text-amber-400',
            status: 'NEXT-OF-KIN CHANNELS STANDBY',
            spectrumSpeed: 'fast',
            channel: 'DISPATCH LATENCY: <140ms'
          },
          link: '/guardian',
          ctaText: 'Open Guardian Hub'
        },
        {
          id: 'number-lookup',
          title: 'Carrier Number Intelligence',
          tagline: 'HLR Lookup & VoIP Masquerade Detection',
          description: 'Query caller numbers against Indian telecom databases, checking for fresh SIM swaps, VoIP SIP proxies, and community fraud history.',
          icon: Radio,
          telemetry: {
            scoreLabel: 'CARRIER REPUTATION',
            scoreValue: '100 / 100',
            scoreColor: 'text-purple-400',
            status: 'BTS TOWER & HLR VERIFIED',
            spectrumSpeed: 'slow',
            channel: 'HLR LATENCY: 12ms'
          },
          link: '/lookup',
          ctaText: 'Search Number Dossier'
        }
      ]
    },
    company: {
      categoryTitle: 'Platform Telemetry & Audit',
      visionBadge: 'Forensic Intelligence',
      subFeatures: [
        {
          id: 'call-history',
          title: 'Forensic Call History',
          tagline: 'Tamper-Proof Audio & Diarization Dossiers',
          description: 'Full historical audit trail of all intercepted calls with interactive waveform playback, timestamped speaker turns, and XAI evidence notes.',
          icon: FileText,
          telemetry: {
            scoreLabel: 'FORENSIC INTEGRITY',
            scoreValue: 'AUDITED',
            scoreColor: 'text-blue-400',
            status: 'TAMPER-PROOF AUDIT TRAIL',
            spectrumSpeed: 'medium',
            channel: 'HMAC-SHA256 SIGNED'
          },
          link: '/calls',
          ctaText: 'View Call Logs'
        },
        {
          id: 'threat-analytics',
          title: 'Threat Analytics & Telemetry',
          tagline: 'Attack Vector Trends & Response Latency',
          description: 'Comprehensive dashboard tracking scam attempt patterns, attack vector distributions (AI Voice Clone vs Human Coercion), and system response times.',
          icon: BarChart3,
          telemetry: {
            scoreLabel: 'ATTACK VECTORS',
            scoreValue: '4 VECTORS',
            scoreColor: 'text-indigo-400',
            status: 'SUB-500MS RESPONSE LATENCY',
            spectrumSpeed: 'slow',
            channel: 'REAL-TIME TELEMETRY'
          },
          link: '/analytics',
          ctaText: 'Explore Analytics'
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
          link: '/settings',
          ctaText: 'Carrier Integrations'
        },
        {
          id: 'compliance-audits',
          title: 'TRAI & SOC2 Type II Compliance',
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
          link: '/settings',
          ctaText: 'View Compliance Settings'
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
          description: 'Round-the-clock incident response hotline for organizations and families facing active impersonation or executive vishing attempts.',
          icon: Headphones,
          telemetry: {
            scoreLabel: 'DESK RESPONSE TIME',
            scoreValue: '< 4 MINS',
            scoreColor: 'text-emerald-400',
            status: 'LIVE ACOUSTIC ENGINEERS ON-CALL',
            spectrumSpeed: 'medium',
            channel: 'P1 ESCALATION RELAYS READY'
          },
          link: '/settings',
          ctaText: 'Support & Settings'
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
          link: '#features',
          ctaText: 'Open Console Features'
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
          link: '#waveform',
          ctaText: 'Explore XAI Reasoning'
        },
        {
          id: 'spectrogram-fft',
          title: 'Acoustic Phase Spectrogram',
          tagline: 'Real-Time 512-Band FFT Decomposition',
          description: 'Visualizes micro-cadence jitter, robotic phase alignment, and biological breathing absence typical of deepfake vocoders.',
          icon: Layers,
          telemetry: {
            scoreLabel: 'FFT RESOLUTION',
            scoreValue: '512 BANDS',
            scoreColor: 'text-cyan-400',
            status: 'BIOLOGICAL BREATHING SCAN',
            spectrumSpeed: 'medium',
            channel: '48kHz SAMPLE RATE'
          },
          link: '/scanner',
          ctaText: 'Inspect Spectrogram'
        },
        {
          id: 'phrase-library',
          title: 'Scam Phrase Library',
          tagline: 'Real-Time Social Engineering Detection',
          description: 'Indexed database of real-world scam scripts (Digital Arrest, KYC Expiry, OTP theft) with weighted severity scores (5-50).',
          icon: ShieldCheck,
          telemetry: {
            scoreLabel: 'PHRASE PATTERNS',
            scoreValue: '500+ SCRIPTS',
            scoreColor: 'text-red-400',
            status: 'REAL-TIME KEYWORD SPOTTING',
            spectrumSpeed: 'fast',
            channel: 'SEVERITY WEIGHTS: 5-50'
          },
          link: '/phrases',
          ctaText: 'Explore Phrase Library'
        }
      ]
    }
  };

  const threatEval = getThreatEvaluation(threatSlider);

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] font-sans antialiased selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      
      {/* Top Luminous Reading Progress Indicator (Butter-smooth, zero re-renders) */}
      <ScrollProgressBar />

      {/* ========================================================= */}
      {/* 1. CRYSTAL CLEAR FIXED GLASS CAPSULE NAVBAR (ROCK-SOLID)  */}
      {/* ========================================================= */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 w-full max-w-5xl md:max-w-7xl mx-auto transition-all duration-300" ref={navbarRef}>
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
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none cursor-pointer ${
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

              {/* Simulator */}
              <li className="relative">
                <a 
                  href="#waveform" 
                  onClick={(e) => handleSmoothScroll(e, 'waveform')}
                  className="nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full outline-none select-none transition-colors text-zinc-200 hover:text-white"
                >
                  <span className="relative z-10">Simulator</span>
                </a>
              </li>

              {/* Scanner */}
              <li className="relative">
                <a 
                  href="#deepfake" 
                  onClick={(e) => handleSmoothScroll(e, 'deepfake')}
                  className="nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full outline-none select-none transition-colors text-zinc-200 hover:text-white"
                >
                  <span className="relative z-10">Scanner</span>
                </a>
              </li>

              {/* Intelligence */}
              <li className="relative">
                <a 
                  href="#carrier" 
                  onClick={(e) => handleSmoothScroll(e, 'carrier')}
                  className="nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full outline-none select-none transition-colors text-zinc-200 hover:text-white"
                >
                  <span className="relative z-10">Intelligence</span>
                </a>
              </li>

              {/* AI & XAI */}
              <li className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleDropdown('ai')}
                  className={`nav-3d-btn h-9 flex items-center px-3.5 text-sm font-medium rounded-full group select-none gap-1 outline-none cursor-pointer ${
                    activeDropdown === 'ai' ? 'text-white' : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  {activeDropdown === 'ai' && <span className="nav-3d-active-pill" />}
                  <span className="relative z-10">AI &amp; XAI</span>
                  <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                    activeDropdown === 'ai' ? 'rotate-180 text-white' : 'opacity-70'
                  }`} />
                </button>
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
      
      {/* Spacer to preserve initial hero spacing with fixed navbar */}
      <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />

      {/* ========================================================= */}
      {/* 2. HERO SECTION (FULL-WIDTH IMMERSIVE ENTERPRISE HERO)   */}
      {/* ========================================================= */}
      <div id="hero" className="relative z-20 w-full min-h-[calc(100vh-80px)] flex items-center pt-[60px] md:pt-0 overflow-hidden">
        
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
              
              {/* Rainbow badge with subtle voice frequency micro-animation */}
              <div className="flex items-center justify-start mb-6">
                <a 
                  className="rainbow-border inline-flex items-center justify-center rounded-full relative text-sm leading-none cursor-pointer group" 
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                >
                  <span className="inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 m-[1px] rounded-full text-zinc-300 font-mono text-xs bg-black">
                    {/* Subtle 3-bar voice frequency equalizer */}
                    <span className="flex items-end gap-0.5 h-3 w-3" aria-hidden="true">
                      <span className="w-0.5 h-full bg-cyan-400 rounded-full butter-wave-bar" style={{ animationDelay: '0ms' }} />
                      <span className="w-0.5 h-full bg-emerald-400 rounded-full butter-wave-bar" style={{ animationDelay: '200ms' }} />
                      <span className="w-0.5 h-full bg-purple-400 rounded-full butter-wave-bar" style={{ animationDelay: '400ms' }} />
                    </span>
                    <span>Join us at Callix Forward</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
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
                  href="#features" 
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="relative inline-flex items-center justify-center select-none rounded-2xl bg-transparent border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-base h-auto px-7 py-3.5 font-medium transition-colors"
                >
                  Explore Features
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
      <section className="scroll-reveal mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl relative rounded-3xl border-t border-white/[0.08] mt-16 flex flex-col items-center">
        
        {/* Conic light beam divider in Resend style */}
        <div aria-hidden="true" className="left-1/2 top-0 w-[300px] center pointer-events-none absolute h-px max-w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        <p className="text-base md:text-[1.125rem] md:leading-[1.5] text-zinc-400 font-normal mb-10 max-w-lg text-center">
          Enterprise-grade protection against high-velocity Indian &amp; global telecom cybercrime.
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
      {/* 3.5. 4-STEP ZERO-TRUST DEFENSE PIPELINE (STEP-BY-STEP)    */}
      {/* ========================================================= */}
      <section id="pipeline" className="py-24 border-t border-white/[0.08] relative scroll-mt-24 sm:scroll-mt-28 overflow-hidden">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              HOW CALLIX WORKS • ZERO-TRUST PIPELINE
            </div>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Defending conversations, <br />
              <span className="italic font-light text-zinc-300">step by autonomous step</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Every incoming call is analyzed concurrently across 4 synchronized AI defense layers in under 140ms — before fraudsters can execute social engineering or extortion.
            </p>
          </div>

          {/* Interactive Step Switcher Navigation Bar */}
          <div className="relative scroll-reveal reveal-delay-100">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 bg-zinc-800/80 rounded-full z-0 overflow-hidden">
              <div 
                className="h-full pipeline-connector-line transition-all duration-500" 
                style={{ width: `${((activePipelineStep + 1) / pipelineSteps.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {pipelineSteps.map((stepItem, idx) => {
                const isActive = activePipelineStep === idx;
                return (
                  <button
                    key={stepItem.step}
                    type="button"
                    onClick={() => setActivePipelineStep(idx)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-900/90 border-cyan-400/80 shadow-[0_0_30px_rgba(56,189,248,0.25)] step-active-glow' 
                        : 'bg-black/80 border-white/[0.08] hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm border transition-colors ${
                        isActive 
                          ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.6)]' 
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        {stepItem.step}
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${stepItem.color}`}>
                        {stepItem.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className={`text-sm font-semibold mb-1 transition-colors ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                        {stepItem.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">
                        {stepItem.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                      <span className={isActive ? 'text-cyan-400 font-medium' : 'text-zinc-500'}>
                        {isActive ? 'Active Pipeline Stage' : 'Click to inspect'}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-cyan-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Deep-Dive Showcase Card */}
          <div className="scroll-reveal reveal-delay-200 resend-card rounded-3xl p-6 sm:p-10 border border-white/15 relative overflow-hidden">
            {/* Background sheen */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left description column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono text-cyan-400">
                      STEP {pipelineSteps[activePipelineStep].step}
                    </span>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${pipelineSteps[activePipelineStep].color}`}>
                      {pipelineSteps[activePipelineStep].badge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                    {pipelineSteps[activePipelineStep].title}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-zinc-400">
                    {pipelineSteps[activePipelineStep].tagline}
                  </p>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {pipelineSteps[activePipelineStep].description}
                </p>

                {/* Real-time Telemetry Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {pipelineSteps[activePipelineStep].metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">{metric.label}</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Pipeline Progression Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePipelineStep((prev) => (prev > 0 ? prev - 1 : pipelineSteps.length - 1))}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    &larr; Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePipelineStep((prev) => (prev + 1) % pipelineSteps.length)}
                    className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-xs font-mono text-cyan-300 border border-cyan-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Step 0{((activePipelineStep + 1) % pipelineSteps.length) + 1}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right Visual Simulation Chamber */}
              <div className="lg:col-span-5 holographic-chamber h-72 sm:h-80 holo-grid flex flex-col justify-between p-5 relative">
                <div className="holo-scanner-beam" />
                <div className="holo-radar-ring w-48 h-48 pointer-events-none" />

                <div className="flex items-center justify-between z-10 text-[10px] font-mono">
                  <span className="text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    STAGE {pipelineSteps[activePipelineStep].step} EXECUTION
                  </span>
                  <span className="text-zinc-400">TELEMETRY HUD</span>
                </div>

                {/* Stage-specific dynamic visualization */}
                <div className="my-auto z-10 flex flex-col items-center justify-center text-center space-y-4">
                  {activePipelineStep === 0 && (
                    <div className="space-y-3 w-full max-w-[260px]">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Channel A (Caller)</span>
                        <span className="text-cyan-400">Active (48kHz)</span>
                      </div>
                      <div className="flex items-end justify-center gap-1 h-12">
                        {[40, 65, 85, 30, 95, 70, 50, 80, 60, 90, 45, 75].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-500 to-white" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Channel B (Receiver)</span>
                        <span className="text-emerald-400">Normal</span>
                      </div>
                    </div>
                  )}

                  {activePipelineStep === 1 && (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Activity className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="text-lg font-bold font-mono text-purple-300">VOCODER SCAN: 99.4%</div>
                      <div className="text-[11px] font-mono text-zinc-400">HiFi-GAN &amp; Respiration Checked</div>
                    </div>
                  )}

                  {activePipelineStep === 2 && (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        <ShieldAlert className="w-8 h-8 animate-bounce" />
                      </div>
                      <div className="text-lg font-bold font-mono text-amber-300">500+ EXTORTION PATTERNS</div>
                      <div className="text-[11px] font-mono text-zinc-400">Digital Arrest &amp; Fake KYC Match</div>
                    </div>
                  )}

                  {activePipelineStep === 3 && (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div className="text-lg font-bold font-mono text-emerald-300">&lt; 140ms DISPATCH READY</div>
                      <div className="text-[11px] font-mono text-zinc-400">Elder Guardian WhatsApp / SMS Armed</div>
                    </div>
                  )}
                </div>

                <div className="z-10 bg-black/70 backdrop-blur-md rounded-xl p-2 border border-white/10 text-center text-[10px] font-mono text-zinc-400">
                  <span>Zero Data Retention &bull; Edge Stream Inspection</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 6 CORE POST-LOGIN MODULES BENTO GRID                   */}
      {/* ========================================================= */}
      <section id="features" className="py-20 border-t border-white/[0.08] bg-zinc-950/40 scroll-mt-24 sm:scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto scroll-reveal">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">AUTHENTICATED CONSOLE CAPABILITIES</span>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Every tool in your security arsenal, <br />
              <span className="italic font-light text-zinc-300">ready upon sign in</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Explore the exact 6 forensic intelligence modules available inside the Callix Console to combat voice cloning, extortion, and carrier fraud.
            </p>
          </div>

          {/* Bento Grid: 6 Real Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Module 1: Live Call Simulator */}
            <div className="scroll-reveal reveal-delay-100 resend-card butter-card butter-shimmer-container rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shadow-sm">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-lg font-semibold text-white">Live Call Interceptor &amp; Simulator</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real-time speech stream diarization with dynamic 0-100 risk scoring. Simulate or intercept CBI/Police "Digital Arrests", Bank KYC traps, and urgent voice clones.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                  <span>Diarization Engine</span>
                  <span className="text-emerald-400 font-semibold">18ms Latency</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/simulation')}
                  className="butter-btn w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Launch Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Module 2: Deepfake Audio Forensics Scanner */}
            <div className="scroll-reveal reveal-delay-150 resend-card butter-card butter-shimmer-container rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Deepfake Audio Scanner</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upload audio recordings or record live microphone to perform 512-band FFT spectral decomposition, vocoder artifact detection (HiFi-GAN), and breathing absence analysis.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                  <span>Acoustic FFT</span>
                  <span className="text-cyan-400 font-semibold">Dual Scam/Clone Score</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/scanner')}
                  className="butter-btn w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Open Audio Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Module 3: Elder Guardian Protection Hub */}
            <div className="scroll-reveal reveal-delay-200 resend-card butter-card butter-shimmer-container rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Elder Guardian Protection Hub</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Autonomous family safety network. Dispatches instant SMS and WhatsApp emergency alerts within &lt;140ms when predatory fraud (Score &gt; 75) targets elderly relatives.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                  <span>SMS Relay</span>
                  <span className="text-amber-400 font-semibold">&lt; 140ms Dispatch</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/guardian')}
                  className="butter-btn w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Open Guardian Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Module 4: Carrier Number Threat Intelligence */}
            <div className="scroll-reveal reveal-delay-250 resend-card butter-card butter-shimmer-container rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 shadow-sm">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Carrier Number Threat Lookup</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Direct HLR / BTS radio tower verification across Indian telecom networks (Vi, Jio, Airtel, BSNL). Detects fresh SIM swaps, VoIP SIP masquerades, and spam report history.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                  <span>HLR Query</span>
                  <span className="text-purple-400 font-semibold">12ms SS7/Diameter</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/lookup')}
                  className="butter-btn w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Search Number Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Module 5: Scam Phrase & Coercion Library */}
            <div className="scroll-reveal reveal-delay-300 resend-card butter-card butter-shimmer-container rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-red-500/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Scam Phrase &amp; Coercion Library</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Indexed database of real-world Indian cybercrime scripts: Digital Arrest notices, Supreme Court clearance fees, urgent UPI traps, and OTP harvesting patterns.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                  <span>Pattern Index</span>
                  <span className="text-red-400 font-semibold">Severity 5-50 Weights</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/phrases')}
                  className="butter-btn w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Explore Phrase Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Module 6: Forensic Call History & Analytics */}
            <div className="scroll-reveal reveal-delay-350 resend-card butter-card butter-shimmer-container rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 shadow-sm">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Call Forensics &amp; Threat Analytics</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cryptographically signed call event logs with synchronized audio waveforms, speaker diarization timestamps, and macroeconomic threat vector distribution metrics.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black border border-zinc-900 font-mono text-[11px] text-zinc-400 flex justify-between">
                  <span>Audit Logs</span>
                  <span className="text-blue-400 font-semibold">HMAC-SHA256 Signed</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchApp('/calls')}
                  className="butter-btn w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>View Call Logs &amp; Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. INTERACTIVE LIVE CALL SIMULATOR DEMO                   */}
      {/* ========================================================= */}
      <section id="waveform" className="py-20 border-t border-white/[0.08] scroll-mt-24 sm:scroll-mt-28">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">01 • LIVE CALL SIMULATOR</span>
              <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Live Call Interceptor &amp; Diarization Simulator
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Test real-time Indian cybercrime call scenarios. Experience how Callix monitors speech-to-text streams, spots extortion keywords, and dynamically calculates threat scores.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMicActive(!micActive)}
                className="resend-frosted-btn rounded-xl px-4 py-2 text-xs font-mono text-zinc-300 flex items-center gap-2 self-start md:self-auto"
              >
                {micActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{micActive ? 'Pause Audio' : 'Resume Audio'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleLaunchApp('/simulation')}
                className="resend-primary-btn rounded-xl px-4 py-2 text-xs font-mono text-white flex items-center gap-1.5"
              >
                <span>Launch Full Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Scenario Presets Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Select Attack Scenario to Simulate:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {heroScenarios.map((scen) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setActiveHeroScenario(scen)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeHeroScenario.id === scen.id
                      ? 'bg-zinc-800 border-zinc-500 text-white shadow-md'
                      : 'bg-black/60 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{scen.title}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                    <span className="text-zinc-500 truncate">{scen.category}</span>
                    <span className={`px-1.5 py-0.2 rounded border ${scen.tagColor}`}>
                      {scen.risk}/100
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Clean Dark Interceptor Card */}
          <div className="scroll-reveal reveal-delay-150 resend-card butter-card rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-zinc-400">Caller:</span>
                <span className="text-white font-semibold">{activeHeroScenario.speaker}</span>
                <span className="text-zinc-500">({activeHeroScenario.category})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-400">Threat Score:</span>
                <span className={`px-2 py-0.5 rounded font-bold transition-all duration-300 ${
                  activeHeroScenario.risk > 75 
                    ? 'bg-red-950 text-red-400 border border-red-800 butter-glow-pulse-danger' 
                    : activeHeroScenario.risk > 30 
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {activeHeroScenario.risk} / 100 • {activeHeroScenario.tag}
                </span>
              </div>
            </div>

            {/* 32-Bar Decibel Spectrum (Butter-smooth fluid equalizer) */}
            <div className="h-24 bg-black rounded-xl border border-zinc-900 p-4 flex items-end justify-between gap-1.5 overflow-hidden relative">
              {micActive && <div className="butter-laser-beam opacity-40" />}
              {Array.from({ length: 32 }).map((_, i) => {
                const barHeight = micActive
                  ? Math.max(12, Math.min(100, (Math.sin(i * 0.45 + (Date.now() % 10000) * 0.003) + 1.2) * (micDb * 0.48) + 10))
                  : 6;
                const isHigh = activeHeroScenario.risk > 70 && barHeight > 55;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      micActive ? 'butter-wave-bar' : ''
                    } ${
                      isHigh ? 'bg-gradient-to-t from-red-600 via-rose-500 to-amber-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-t from-cyan-950 via-cyan-500 to-sky-200 shadow-[0_0_6px_rgba(56,189,248,0.3)]'
                    }`}
                    style={{ 
                      height: `${barHeight}%`,
                      animationDelay: `${(i % 10) * 0.12}s`,
                      animationDuration: `${0.8 + (i % 5) * 0.15}s`
                    }}
                  />
                );
              })}
            </div>

            {/* Live Diarized Transcript Stream */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>SPEECH-TO-TEXT DIARIZATION FEED (DEEPGRAM NOVA-2 en-IN)</span>
                <span className="text-emerald-400">Sub-500ms Latency</span>
              </div>
              <div className="p-4 rounded-xl bg-black border border-zinc-900 space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-lg bg-zinc-900/90 text-white border-l-2 border-red-500 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-bold text-zinc-200">{activeHeroScenario.speaker}</span>
                    <span className="text-zinc-500">LIVE AUDIO STREAM</span>
                  </div>
                  <p className="text-zinc-200 text-sm leading-relaxed">
                    &ldquo;{activeHeroScenario.dialog}&rdquo;
                  </p>
                  {activeHeroScenario.risk > 70 && (
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        FLAGGED COERCION KEYWORD
                      </span>
                      <span className="text-zinc-400">Guardian Alert Trigger Armed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08] text-xs font-mono">
              <span className="text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Callix Active Watchdog: Auto-sever active when risk &gt; 90</span>
              </span>
              <button
                type="button"
                onClick={() => handleLaunchApp('/simulation')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>Open Full Call Simulation Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. INTERACTIVE DEEPFAKE FORENSICS DEMO                    */}
      {/* ========================================================= */}
      <section id="deepfake" className="py-20 border-t border-white/[0.08] bg-zinc-950/40 scroll-mt-24 sm:scroll-mt-28">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">02 • FORENSIC BIOMETRICS</span>
              <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Deepfake &amp; Synthetic Voice Biometric Analyzer
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Inspect spectral dispersion, phase jitter, and neural vocoder artifacts generated by ElevenLabs, PlayHT, and RVC models.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchApp('/scanner')}
              className="resend-primary-btn rounded-xl px-4 py-2 text-xs font-mono text-white flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Open Audio Scanner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Biometrics Box */}
          <div className="scroll-reveal reveal-delay-150 resend-card butter-card rounded-2xl p-6 space-y-6 relative overflow-hidden">
            {/* Butter-Smooth Laser Scanning Beam */}
            <div className="butter-laser-beam" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 relative z-10">
              <div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Target Sample Profile:</span>
                <div className="text-sm font-semibold text-white">
                  {biometricMode === 'AI_CLONE' ? 'Synthetic Clone (ElevenLabs v2 Synthesizer)' : 'Authentic Human Voice (Natural Vocal Cords)'}
                </div>
              </div>

              <div className="inline-flex p-1 rounded-full bg-black border border-zinc-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => setBiometricMode('HUMAN')}
                  className={`butter-btn px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    biometricMode === 'HUMAN' ? 'bg-white text-black font-semibold shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Authentic Human Voice
                </button>
                <button
                  type="button"
                  onClick={() => setBiometricMode('AI_CLONE')}
                  className={`butter-btn px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    biometricMode === 'AI_CLONE' ? 'bg-red-500 text-white font-semibold shadow-md butter-glow-pulse-danger' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Synthetic AI Clone
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
              <div className="butter-card p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">SPECTRAL DISPERSION</div>
                <div className={`text-xl font-bold font-mono transition-colors duration-300 ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? '0.94 / 1.00' : '0.14 / 1.00'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'Extreme high-frequency cutoff.' : 'Natural human harmonic curve.'}
                </p>
              </div>

              <div className="butter-card p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">VOCODER GLITCH</div>
                <div className={`text-xl font-bold font-mono transition-colors duration-300 ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? 'HiFi-GAN (98%)' : 'None Detected'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'Diffusion vocoder mismatch.' : 'Natural micro-tremors.'}
                </p>
              </div>

              <div className="butter-card p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">BIOLOGICAL RESPIRATION</div>
                <div className={`text-xl font-bold font-mono transition-colors duration-300 ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? 'Breathing Absent' : 'Natural Inhalation'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'AI synthesizer artifact.' : 'Human pulmonary cadences.'}
                </p>
              </div>

              <div className="butter-card p-4 rounded-xl bg-black border border-zinc-900 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500">OVERALL VERDICT</div>
                <div className={`text-xl font-bold font-mono transition-colors duration-300 ${biometricMode === 'AI_CLONE' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {biometricMode === 'AI_CLONE' ? 'SYNTHETIC CLONE' : 'VERIFIED HUMAN'}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {biometricMode === 'AI_CLONE' ? 'High coercion impersonation.' : 'Zero AI signatures.'}
                </p>
              </div>
            </div>

            {/* Dual Score Confidence Bars (Matching AudioScanner.tsx) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 relative z-10">
              <div className="butter-card space-y-1.5 p-4 rounded-xl bg-black border border-zinc-900">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Scam Intent Probability:</span>
                  <span className={`transition-colors duration-300 ${biometricMode === 'AI_CLONE' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}`}>
                    {biometricMode === 'AI_CLONE' ? '95.0% (High Scam Risk)' : '4.2% (Safe)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      biometricMode === 'AI_CLONE' ? 'w-[95%] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'w-[4.2%] bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div className="butter-card space-y-1.5 p-4 rounded-xl bg-black border border-zinc-900">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Deepfake Voice Likelihood:</span>
                  <span className={`transition-colors duration-300 ${biometricMode === 'AI_CLONE' ? 'text-purple-400 font-bold' : 'text-emerald-400 font-bold'}`}>
                    {biometricMode === 'AI_CLONE' ? '89.4% (Synthetic Model)' : '6.0% (Natural)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      biometricMode === 'AI_CLONE' ? 'w-[89.4%] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]' : 'w-[6%] bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. INTERACTIVE TELECOM CARRIER INTEL                      */}
      {/* ========================================================= */}
      <section id="carrier" className="py-20 border-t border-white/[0.08] scroll-mt-24 sm:scroll-mt-28">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">03 • TELECOM INTELLIGENCE</span>
              <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Telecom HLR Carrier &amp; Number Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Home Location Register queries and VoIP spoofed CLI gateway detection across Indian telecom networks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchApp('/lookup')}
              className="resend-primary-btn rounded-xl px-4 py-2 text-xs font-mono text-white flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Search Number in Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="scroll-reveal reveal-delay-150 grid grid-cols-1 md:grid-cols-12 gap-6">
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
      {/* 9. INTERACTIVE EXPLAINABLE AI (XAI) THREAT EVALUATION DIAL */}
      {/* ========================================================= */}
      <section id="xai" className="py-20 border-t border-white/[0.08] bg-zinc-950/40 scroll-mt-24 sm:scroll-mt-28">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">04 • EXPLAINABLE AI (XAI) ENGINE</span>
              <h3 className="font-serif-hero text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Explainable Threat Classification &amp; Actions
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Drag the threat slider to simulate how Callix evaluates live incoming calls, triggers guardian alerts, and takes defensive actions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchApp('/simulation')}
              className="resend-primary-btn rounded-xl px-4 py-2 text-xs font-mono text-white flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Test Live XAI in Simulator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="scroll-reveal reveal-delay-150 resend-card rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Simulated Call Threat Score:</span>
                <span className="text-sm font-bold text-white">{threatSlider} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={threatSlider}
                onChange={(e) => setThreatSlider(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>0 (Safe)</span>
                <span>30 (Suspicious)</span>
                <span>70 (High Risk)</span>
                <span>100 (Critical)</span>
              </div>
            </div>

            {/* Dynamic Evaluation Card */}
            <div className={`p-5 rounded-xl border space-y-4 transition-all duration-300 ${threatEval.bg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400">CLASSIFICATION:</span>
                  <span className={`text-sm font-bold font-mono ${threatEval.color}`}>
                    {threatEval.level}
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-300">
                  Action: <strong className="text-white">{threatEval.action}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Claude 3.5 Sonnet XAI Verdict:</span>
                <p className="text-sm font-medium text-white">
                  {threatEval.verdict}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/10">
                  <div className="text-[10px] text-zinc-500">HEURISTIC SCORE</div>
                  <div className="text-base font-bold text-white">{threatEval.heuristicScore} / 100</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/10">
                  <div className="text-[10px] text-zinc-500">XAI REASONING</div>
                  <div className="text-base font-bold text-white">{threatEval.xaiScore} / 100</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/10">
                  <div className="text-[10px] text-zinc-500">HLR REPUTATION</div>
                  <div className="text-base font-bold text-white">{threatEval.hlrScore} / 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ========================================================= */}
      {/* 9.1. COMPARISON MATRIX: CALLIX VS LEGACY SOLUTIONS         */}
      {/* ========================================================= */}
      <section id="matrix" className="py-24 border-t border-white/[0.08] scroll-mt-24 sm:scroll-mt-28 relative">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto scroll-reveal">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">ENTERPRISE VOICE SECURITY BENCHMARK</span>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Why Callix stands alone in <br />
              <span className="italic font-light text-zinc-300">zero-trust voice defense</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Legacy caller ID apps and telecom filters only check stale databases. Callix inspects the live acoustic waveform and speech semantics in real time.
            </p>
          </div>

          <div className="scroll-reveal reveal-delay-100 resend-card rounded-3xl p-4 sm:p-8 overflow-x-auto border border-white/10">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono">
                  <th className="py-4 px-4 text-zinc-400 font-medium">DEFENSE CAPABILITY</th>
                  <th className="py-4 px-4 text-cyan-400 font-bold bg-cyan-950/30 rounded-t-xl">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>CALLIX GUARDIAN</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-zinc-400 font-medium">TRADITIONAL CALLER ID</th>
                  <th className="py-4 px-4 text-zinc-400 font-medium">TELECOM FILTERS</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/[0.06]">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div>Real-Time AI Voice Deepfake Detection</div>
                    <div className="text-[11px] text-zinc-500 font-normal">512-band FFT &amp; vocoder neural footprint scanning</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 bg-cyan-950/20">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Sub-18ms Active Scan</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">None (Zero audio inspect)</td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">None</td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div>Indian Cybercrime Coercion NLP</div>
                    <div className="text-[11px] text-zinc-500 font-normal">500+ Digital Arrest, Fake CBI, and KYC extortion scripts</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 bg-cyan-950/20">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Deepgram Nova-2 en-IN</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">User feedback flags only</td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">SMS keyword filter only</td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div>Elder Guardian &lt;140ms Emergency Alert</div>
                    <div className="text-[11px] text-zinc-500 font-normal">Autonomous SMS &amp; WhatsApp dispatch to family contacts</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 bg-cyan-950/20">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Automated (&lt;140ms)</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">None</td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">None</td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div>Fresh SIM-Swap &amp; VoIP Proxy Detection</div>
                    <div className="text-[11px] text-zinc-500 font-normal">Direct HLR / BTS radio tower age verification</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 bg-cyan-950/20">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>12ms SS7 / Diameter</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">Stale crowdsourced tags</td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">Delayed 24-48 hours</td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div>Autonomous Threat Call Severance</div>
                    <div className="text-[11px] text-zinc-500 font-normal">Immediate hangup when risk score exceeds 90 / 100</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 bg-cyan-950/20">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Zero-Touch Auto-Sever</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">Manual reject by user</td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">None</td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div>Zero Audio Retention &amp; Cryptographic Audit</div>
                    <div className="text-[11px] text-zinc-500 font-normal">Ephemeral memory processing + HMAC-SHA256 signed evidence</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 bg-cyan-950/20 rounded-b-xl">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>DPDP &amp; SOC2 Compliant</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">Uploads user contact book</td>
                  <td className="py-4 px-4 text-zinc-500 font-mono">Telco CDR logs only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9.2. INTERACTIVE FRAUD LOSS & ROI CALCULATOR               */}
      {/* ========================================================= */}
      <section id="calculator" className="py-24 border-t border-white/[0.08] bg-zinc-950/40 scroll-mt-24 sm:scroll-mt-28 relative">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto scroll-reveal">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">QUANTIFIABLE FINANCIAL IMPACT</span>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Calculate your fraud prevention <br />
              <span className="italic font-light text-zinc-300">return on investment</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Simulate the direct financial damages averted across your enterprise or family network by stopping voice cloning and extortion calls in real time.
            </p>
          </div>

          <div className="scroll-reveal reveal-delay-100 resend-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Slider 1: Monthly Calls */}
              <div className="butter-card space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-900">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">Monthly Inbound Calls:</span>
                  <span className="text-sm font-bold text-white font-mono">{roiMonthlyCalls.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={roiMonthlyCalls}
                  onChange={(e) => setRoiMonthlyCalls(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>500 (Personal)</span>
                  <span>25,000</span>
                  <span>50,000 (Org)</span>
                </div>
              </div>

              {/* Slider 2: Scam Attempt Rate */}
              <div className="butter-card space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-900">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">Scam/Vishing Rate:</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{roiScamRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={roiScamRate}
                  onChange={(e) => setRoiScamRate(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>1% Low</span>
                  <span>6% Average</span>
                  <span>15% Critical</span>
                </div>
              </div>

              {/* Slider 3: Average Loss Per Scam */}
              <div className="butter-card space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-900">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">Avg Loss Per Scam:</span>
                  <span className="text-sm font-bold text-red-400 font-mono">&#8377;{(roiAvgLoss / 1000).toFixed(0)}k</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="300000"
                  step="5000"
                  value={roiAvgLoss}
                  onChange={(e) => setRoiAvgLoss(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>&#8377;15k (UPI trap)</span>
                  <span>&#8377;1.5L</span>
                  <span>&#8377;3L+ (Digital arrest)</span>
                </div>
              </div>

            </div>

            {/* Calculated Results Showcase Banner (Butter-Smooth Glowing Impact) */}
            <div className="butter-card butter-glow-pulse-cyan p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-black border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wide">
                  ESTIMATED MONTHLY SAVINGS
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white text-glow-primary">
                  {formattedLossAvoided}
                </div>
                <p className="text-[11px] text-zinc-400">Direct financial extortion damages prevented.</p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wide">
                  THREAT CALLS NEUTRALIZED
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white">
                  {estimatedScamCalls.toLocaleString()} <span className="text-sm font-normal text-zinc-400">/ mo</span>
                </div>
                <p className="text-[11px] text-zinc-400">AI voice clones &amp; coercive traps intercepted.</p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wide">
                  PROTECTION LATENCY
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-white">
                  &lt; 140ms
                </div>
                <p className="text-[11px] text-zinc-400">Sub-second autonomous guardian alert time.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Calculations benchmarked against RBI 2024 Telecom Fraud Whitepaper telemetry.</span>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchApp('/dashboard')}
                className="resend-primary-btn px-5 py-2 rounded-xl text-xs text-black font-semibold"
              >
                Deploy Protection Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9.3. LIVE CYBERCRIME ATTACK RADAR & INDIAN CARRIER FEED    */}
      {/* ========================================================= */}
      <section id="radar" className="py-24 border-t border-white/[0.08] scroll-mt-24 sm:scroll-mt-28 relative overflow-hidden">
        
        {/* Subtle Radar Waveform Accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 space-y-12 relative z-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE INCIDENT RADAR • INDIAN CARRIER FEEDS
            </div>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Real-time threat interception <br />
              <span className="italic font-light text-zinc-300">across Indian telecom circles</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Live telemetry feed of voice impersonation, fake law enforcement threats, and synthetic AI clones neutralized across telecom circles.
            </p>
          </div>

          <div className="scroll-reveal reveal-delay-100 resend-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>INTERCEPTED CALL TELEMETRY (LSA CIRCLES: MH, KA, DL, TS, TN)</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE RADAR FEED
              </span>
            </div>

            <div className="space-y-2.5">
              {liveThreatEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-black/60 border border-zinc-900 hover:border-zinc-800 transition-colors font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-[11px] shrink-0 w-16">{evt.time}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold border border-zinc-800 shrink-0">
                      {evt.city}
                    </span>
                    <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-[280px]">
                      {evt.threatType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-[11px] text-zinc-500 hidden md:inline">{evt.carrier}</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${evt.statusColor}`}>
                      Risk: {evt.risk}/100 • {evt.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Encrypted Carrier Relay: TLS 1.3 &bull; SHA-256 Verified</span>
              <Link to="/analytics" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                <span>View Full Forensic Stream &rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 9.4. INTERACTIVE FAQ ACCORDION                            */}
      {/* ========================================================= */}
      <section id="faq" className="py-24 border-t border-white/[0.08] bg-zinc-950/40 scroll-mt-24 sm:scroll-mt-28 relative">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto scroll-reveal">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">KNOWLEDGE BASE &amp; ARCHITECTURE</span>
            <h2 className="font-serif-hero text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Everything you need to know about Callix voice intelligence, deepfake biometrics, and zero-retention privacy.
            </p>
          </div>

          <div className="scroll-reveal reveal-delay-100 space-y-3">
            {faqs.map((faq, fIdx) => {
              const isOpen = activeFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="resend-card rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpen ? null : fIdx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-medium text-white tracking-tight">
                      {faq.q}
                    </span>
                    <div className={`w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white bg-white/10' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.06] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="scroll-reveal text-center pt-4">
            <p className="text-xs text-zinc-400">
              Have specific carrier or enterprise requirements?{' '}
              <a href="#hero" onClick={(e) => handleSmoothScroll(e, 'hero')} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
                Talk to our voice security architects
              </a>
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. BOTTOM CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <section className="scroll-reveal py-24 border-t border-white/[0.08] text-center px-6 max-w-4xl mx-auto space-y-6">
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
            className="resend-primary-btn rounded-2xl px-6 py-3 text-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleLaunchApp('/dashboard')}
            className="resend-frosted-btn rounded-2xl px-5 py-3 text-sm font-medium text-zinc-300 hover:text-white cursor-pointer"
          >
            Sign In &rarr;
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. RESEND 4-COLUMN FOOTER WITH SYSTEM STATUS             */}
      {/* ========================================================= */}
      <footer className="scroll-reveal border-t border-white/[0.08] bg-black py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
            {/* Column 1: Product */}
            <div className="space-y-3">
              <div className="font-medium text-white">Product</div>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Core Modules</a></li>
                <li><a href="#waveform" className="hover:text-white transition-colors">Call Simulator</a></li>
                <li><a href="#deepfake" className="hover:text-white transition-colors">Audio Scanner</a></li>
                <li><a href="#carrier" className="hover:text-white transition-colors">Telecom Carrier HLR</a></li>
                <li><a href="#xai" className="hover:text-white transition-colors">Explainable XAI</a></li>
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
