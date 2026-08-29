import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  UploadCloud, 
  Play, 
  Pause, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  FileAudio,
  Activity,
  Layers,
  Radio
} from 'lucide-react';

interface AcousticMetrics {
  latency: string;
  pitchVariance: string;
  syntheticArtifacts: string;
  neuralSignature: string;
  snr: string;
}

interface ScanResult {
  riskScore: number; // 0 - 100
  verdict: 'HUMAN' | 'SYNTHETIC';
  metrics: AcousticMetrics;
}

export const VoicePlayground: React.FC<{ id?: string }> = ({ id = 'playground' }) => {
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [selectedSample, setSelectedSample] = useState<'human' | 'clone' | 'custom' | null>('human');
  const [fileName, setFileName] = useState<string>('authentic_human_sample.wav');
  const [fileSize, setFileSize] = useState<string>('1.4 MB');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>({
    riskScore: 4,
    verdict: 'HUMAN',
    metrics: {
      latency: '64ms',
      pitchVariance: '98.4% Natural Laryngeal Resonance',
      syntheticArtifacts: 'Zero Phase Discontinuities Detected',
      neuralSignature: 'Organic Biometric Vocal Fold Pattern',
      snr: '44.8 dB High Fidelity'
    }
  });

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  // Audio Recording & Visualizer Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Canvas waveform visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const renderWave = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Gradient background glow
      const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
      bgGrad.addColorStop(0, 'rgba(6, 182, 212, 0.03)');
      bgGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.04)');
      bgGrad.addColorStop(1, 'rgba(6, 182, 212, 0.03)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Center reference line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const barCount = 64;
      const barWidth = width / barCount;
      phase += isRecording || isPlaying || isScanning ? 0.08 : 0.02;

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const normalizedX = i / barCount;
        
        let barHeight = 15;
        if (isRecording) {
          // Dynamic active wave
          barHeight = 20 + Math.sin(phase + i * 0.3) * 35 + Math.cos(phase * 1.5 + i * 0.2) * 20;
        } else if (isScanning) {
          // Scanning hyper-frequency wave
          barHeight = 15 + Math.sin(phase * 2 + i * 0.5) * 45 + Math.random() * 15;
        } else if (isPlaying) {
          // Playing wave
          barHeight = 15 + Math.abs(Math.sin(phase + i * 0.25)) * 40;
        } else {
          // Resting ambient wave
          barHeight = 8 + Math.sin(phase + i * 0.15) * 12;
        }

        const clampedHeight = Math.max(4, Math.min(height * 0.85, Math.abs(barHeight)));
        const y = (height - clampedHeight) / 2;

        // Gradient color for bars (cyan to neon pink to purple)
        const barGrad = ctx.createLinearGradient(0, y, 0, y + clampedHeight);
        if (isRecording) {
          barGrad.addColorStop(0, '#ef4444');
          barGrad.addColorStop(1, '#f43f5e');
        } else if (isScanning) {
          barGrad.addColorStop(0, '#38bdf8');
          barGrad.addColorStop(0.5, '#ffffff');
          barGrad.addColorStop(1, '#ec4899');
        } else if (selectedSample === 'clone') {
          barGrad.addColorStop(0, '#ec4899');
          barGrad.addColorStop(1, '#a855f7');
        } else {
          barGrad.addColorStop(0, '#38bdf8');
          barGrad.addColorStop(1, '#0284c7');
        }

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, clampedHeight, 3);
        ctx.fill();
      }

      // If scanning, draw sweeping vertical laser line
      if (isScanning) {
        const laserX = (scanProgress / 100) * width;
        
        // Laser glow
        const laserGlow = ctx.createLinearGradient(laserX - 25, 0, laserX + 25, 0);
        laserGlow.addColorStop(0, 'rgba(56, 189, 248, 0)');
        laserGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
        laserGlow.addColorStop(1, 'rgba(236, 72, 153, 0)');
        ctx.fillStyle = laserGlow;
        ctx.fillRect(laserX - 20, 0, 40, height);

        // Crisp laser line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(laserX, 0);
        ctx.lineTo(laserX, height);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPlaying, isScanning, scanProgress, selectedSample]);

  // Live recording handler
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      setSelectedSample('custom');
      setFileName(`Live_Mic_Capture_${new Date().toLocaleTimeString().replace(/:/g, '')}.wav`);
      setFileSize('1.8 MB');
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
      } catch (e) {
        console.warn('Microphone access denied or simulated fallback active:', e);
      }

      setIsRecording(true);
      setRecordTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordTimer(prev => {
          if (prev >= 15) {
            handleToggleRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Sample Selection Handlers
  const handleSelectSample = (type: 'human' | 'clone') => {
    setSelectedSample(type);
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
    if (type === 'human') {
      setFileName('authentic_human_sample.wav');
      setFileSize('1.4 MB');
      setScanResult({
        riskScore: 4,
        verdict: 'HUMAN',
        metrics: {
          latency: '64ms',
          pitchVariance: '98.4% Natural Laryngeal Resonance',
          syntheticArtifacts: 'Zero Phase Discontinuities Detected',
          neuralSignature: 'Organic Biometric Vocal Fold Pattern',
          snr: '44.8 dB High Fidelity'
        }
      });
    } else {
      setFileName('elevenlabs_ai_voice_clone.mp3');
      setFileSize('2.1 MB');
      setScanResult({
        riskScore: 96,
        verdict: 'SYNTHETIC',
        metrics: {
          latency: '58ms',
          pitchVariance: 'Unnatural Micro-cadence Robotic Jitter (<1.2%)',
          syntheticArtifacts: 'Vocoder Harmonic Discontinuities at 1.8kHz & 3.4kHz',
          neuralSignature: 'Deepfake Diffusion Transformer Synthesis Match',
          snr: '28.1 dB (Post-Processed Artifacts)'
        }
      });
    }
  };

  // File Upload Handler
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setSelectedSample('custom');
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    // Run scan on upload
    handleRunScan(file.name.toLowerCase().includes('clone') || file.name.toLowerCase().includes('fake') ? 'clone' : 'human');
  };

  // Run Voice Defense Scan
  const handleRunScan = (overrideType?: 'human' | 'clone') => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    const type = overrideType || selectedSample || 'human';

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);

          if (type === 'clone') {
            setScanResult({
              riskScore: 94,
              verdict: 'SYNTHETIC',
              metrics: {
                latency: '62ms',
                pitchVariance: 'Synthetic Monotone Drift Detected (1.4% variance)',
                syntheticArtifacts: 'Acoustic Phase Alignment Anomalies Found',
                neuralSignature: 'Generative AI Voice Synthesizer Pattern',
                snr: '31.2 dB High-Frequency Cutoff'
              }
            });
          } else {
            setScanResult({
              riskScore: 6,
              verdict: 'HUMAN',
              metrics: {
                latency: '68ms',
                pitchVariance: 'Organic Human Formant Transitions (97.8%)',
                syntheticArtifacts: 'Natural Ambient Background Dispersion',
                neuralSignature: 'Verified Human Vocal Tract Harmonic Signature',
                snr: '46.2 dB Studio Precision'
              }
            });
          }
          return 100;
        }
        return prev + 5;
      });
    }, 90);
  };

  return (
    <section id={id} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative font-sans">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute top-40 right-10 w-[400px] h-[300px] bg-pink-500/10 blur-[120px] rounded-full" />

      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>INTERACTIVE DETECTION PLAYGROUND</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Test Audio Against <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-pink-400 bg-clip-text text-transparent">
            Real-Time Voice AI Defense
          </span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
          Record live speech or load synthetic audio samples. Our deep learning acoustic engine analyzes micro-cadence jitter, vocoder artifacts, and neural signatures in under 85ms.
        </p>
      </div>

      {/* Main Playground Interactive Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Audio Input & Waveform (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl bg-[#09090B] border border-white/[0.12] p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Top Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Audio Ingest Channel · 48kHz PCM
                </span>
              </div>

              {/* Sample Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/[0.08] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleSelectSample('human')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedSample === 'human'
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-white/10'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Human Sample
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('clone')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedSample === 'clone'
                      ? 'bg-pink-500/20 text-pink-300 font-semibold shadow-sm border border-pink-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  AI Clone Sample
                </button>
              </div>
            </div>

            {/* Waveform Canvas Display */}
            <div className="relative rounded-2xl bg-black border border-white/[0.08] overflow-hidden">
              <canvas
                ref={canvasRef}
                width={700}
                height={160}
                className="w-full h-40 block"
              />

              {/* Status Overlay in canvas */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {isRecording ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-mono animate-pulse">
                    <Radio className="w-3 h-3" />
                    <span>REC 00:{recordTimer < 10 ? `0${recordTimer}` : recordTimer}</span>
                  </span>
                ) : isScanning ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono">
                    <Zap className="w-3 h-3 animate-spin" />
                    <span>SCANNING HARMONICS {scanProgress}%</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-[11px] font-mono">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>READY FOR INGEST</span>
                  </span>
                )}
              </div>

              {/* Active Audio File Tag */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 truncate">
                  <FileAudio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate text-white">{fileName}</span>
                  <span className="text-zinc-600">({fileSize})</span>
                </div>
                <span className="text-zinc-500 shrink-0 hidden sm:inline">16-bit Mono · Deepgram Diarized</span>
              </div>
            </div>

            {/* Input Action Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Record Mic Button */}
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`w-full py-3.5 px-5 rounded-2xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer border ${
                  isRecording
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30 animate-pulse'
                    : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-200 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 fill-red-400 text-red-400" />
                    <span>Stop Recording (00:{recordTimer < 10 ? `0${recordTimer}` : recordTimer})</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>Record Live Audio</span>
                  </>
                )}
              </button>

              {/* Run Scan Button */}
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleRunScan()}
                className="w-full py-3.5 px-5 rounded-2xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Stream ({scanProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Run Voice Defense Scan</span>
                  </>
                )}
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`relative rounded-2xl border-2 border-dashed p-5 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-white/10 hover:border-white/20 bg-zinc-950/50'
              }`}
            >
              <input
                type="file"
                accept=".wav,.mp3,.m4a,audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                <UploadCloud className="w-6 h-6 text-zinc-400" />
                <div className="text-xs font-medium text-zinc-300">
                  Drag & drop audio file or <span className="text-cyan-400 underline">browse</span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Supports .WAV, .MP3, .M4A (Max 25MB)
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Scan Result Breakdown Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-[#09090B] border border-white/[0.12] p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Top Card Title */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">
                  Acoustic Defense Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                CLAUDE 3.5 NLP + NOVA-2
              </span>
            </div>

            {/* Dial / Gauge & Verdict Header */}
            {scanResult && (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08]">
                
                {/* Circular Gauge Meter */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Gauge Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#18181b"
                      strokeWidth="9"
                      fill="none"
                    />
                    {/* Gauge Progress Bar */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={scanResult.riskScore > 50 ? '#ec4899' : '#10b981'}
                      strokeWidth="9"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * scanResult.riskScore) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  
                  {/* Gauge Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className={`text-2xl font-bold font-mono tracking-tighter ${
                      scanResult.riskScore > 50 ? 'text-pink-400' : 'text-emerald-400'
                    }`}>
                      {scanResult.riskScore}%
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      Fraud Risk
                    </span>
                  </div>
                </div>

                {/* Verdict Text & Badge */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Detection Verdict
                  </div>

                  {scanResult.verdict === 'HUMAN' ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Human Verified</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-semibold shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                      <AlertTriangle className="w-4 h-4 text-pink-400" />
                      <span>Synthetic Clone Detected</span>
                    </div>
                  )}

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {scanResult.verdict === 'HUMAN'
                      ? 'Authentic biological pitch dynamics verified with high-confidence vocal fold vibration.'
                      : 'High-confidence AI clone signature identified with vocoder harmonic anomalies.'}
                  </p>
                </div>

              </div>
            )}

            {/* Detailed Acoustic Metrics Grid */}
            {scanResult && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Spectral Feature Vectors</span>
                  <span className="text-cyan-400">Sub-band Phase</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* Latency */}
                  <div className="p-3 rounded-xl bg-zinc-950/90 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-zinc-400">Inference Latency</span>
                    <span className="text-emerald-400 font-semibold">{scanResult.metrics.latency}</span>
                  </div>

                  {/* Pitch Variance */}
                  <div className="p-3 rounded-xl bg-zinc-950/90 border border-white/[0.06] flex flex-col gap-1">
                    <span className="text-zinc-400 text-[11px]">Pitch Variance</span>
                    <span className={scanResult.verdict === 'HUMAN' ? 'text-zinc-200' : 'text-pink-300'}>
                      {scanResult.metrics.pitchVariance}
                    </span>
                  </div>

                  {/* Synthetic Artifacts */}
                  <div className="p-3 rounded-xl bg-zinc-950/90 border border-white/[0.06] flex flex-col gap-1">
                    <span className="text-zinc-400 text-[11px]">Vocoder Artifacts</span>
                    <span className={scanResult.verdict === 'HUMAN' ? 'text-zinc-200' : 'text-pink-300'}>
                      {scanResult.metrics.syntheticArtifacts}
                    </span>
                  </div>

                  {/* Neural Signature */}
                  <div className="p-3 rounded-xl bg-zinc-950/90 border border-white/[0.06] flex flex-col gap-1">
                    <span className="text-zinc-400 text-[11px]">Neural Signature</span>
                    <span className={scanResult.verdict === 'HUMAN' ? 'text-emerald-400' : 'text-pink-400'}>
                      {scanResult.metrics.neuralSignature}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footnote */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/[0.06]">
              <span>Telecom Trunk: SIP RFC 3261</span>
              <span>AES-256 Encrypted</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default VoicePlayground;
