import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loader } from '../components/common/Loader';
import { RiskScoreGauge } from '../components/dashboard/RiskScoreGauge';
import { RealtimeAudioVisualizer } from '../components/audio/RealtimeAudioVisualizer';
import { apiService } from '../services/apiService';
import { audioProcessingService } from '../services/audioProcessingService';
import { useToast } from '../context/ToastContext';
import { AudioForensicsReport, AudioScanPreset, TranscriptTimelineItem } from '../types/fraud.types';
import { formatDuration } from '../utils/formatters';
import { 
  AudioWaveform, 
  UploadCloud, 
  FileAudio, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Download, 
  Clock, 
  Volume2, 
  AlertTriangle, 
  Activity, 
  CheckCircle, 
  Layers, 
  Radio,
  Share2,
  FileCode,
  Info,
  VolumeX
} from 'lucide-react';
import { cn } from '../utils/cn';

const SAMPLE_PRESETS: AudioScanPreset[] = [
  {
    id: 'preset-kyc-clone',
    title: 'Bank KYC OTP Scam',
    subtitle: 'AI Synthetic Voice Clone',
    duration: '00:24',
    type: 'AI_CLONE',
    expectedScamScore: 95,
    expectedDeepfakeScore: 89,
  },
  {
    id: 'preset-customs-human',
    title: 'Police/Customs Parcel Extortion',
    subtitle: 'Human Scammer (High Coercion)',
    duration: '00:32',
    type: 'HUMAN_SCAM',
    expectedScamScore: 97,
    expectedDeepfakeScore: 12,
  },
  {
    id: 'preset-doctor-safe',
    title: 'Doctor Appointment Check',
    subtitle: 'Genuine Clinic Human',
    duration: '00:18',
    type: 'GENUINE_HUMAN',
    expectedScamScore: 4,
    expectedDeepfakeScore: 6,
  }
];

export const AudioScanner: React.FC = () => {
  const { showHighRiskAlert, showToast } = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState<string>('Initializing audio engine...');
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentReport, setCurrentReport] = useState<AudioForensicsReport | null>(null);

  // Real HTML5 Audio Object & State
  const [audioSourceUrl, setAudioSourceUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (audioSourceUrl && audioSourceUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioSourceUrl);
      }
    };
  }, [audioSourceUrl]);

  // Initial load: start with sample benchmark
  useEffect(() => {
    handleLoadPreset('preset-kyc-clone');
  }, []);

  // Sync current playback time & active sentence highlight
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    if (currentReport && currentReport.transcriptTimeline.length > 0) {
      const activeIdx = currentReport.transcriptTimeline.findIndex(
        (t: TranscriptTimelineItem, i: number) => {
          const nextItem = currentReport.transcriptTimeline[i + 1];
          const nextOffset = nextItem ? nextItem.secondsOffset : (currentReport.durationSeconds || duration || 30);
          return cur >= t.secondsOffset && cur < nextOffset;
        }
      );
      if (activeIdx !== -1) {
        setActiveSentenceIndex(activeIdx);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(Math.round(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Resume Web Audio Context if suspended
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
        setIsPlaying(true);
      });
    }
  };

  const handleSeek = (newSeconds: number, sentenceIdx?: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newSeconds;
    }
    setCurrentTime(newSeconds);
    if (sentenceIdx !== undefined) {
      setActiveSentenceIndex(sentenceIdx);
    }
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Load sample preset demo
  const handleLoadPreset = async (presetId: string) => {
    if (audioSourceUrl && audioSourceUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioSourceUrl);
    }

    setIsScanning(true);
    setScanStage('Loading sample benchmark audio preset...');
    setScanProgress(30);
    setIsPlaying(false);
    setCurrentTime(0);
    setSelectedFile(null);
    setAudioSourceUrl(null);

    try {
      const preset = SAMPLE_PRESETS.find(p => p.id === presetId);
      const report = await apiService.analyzeAudioFile({
        fileName: preset ? `${preset.title}.mp3` : 'sample.mp3',
        presetId,
      });

      setScanProgress(100);
      setTimeout(() => {
        setCurrentReport(report);
        setDuration(report.durationSeconds || 24);
        setIsScanning(false);

        if (report.scamScore >= 75 || report.deepfakeScore >= 75) {
          showHighRiskAlert(
            'THREAT DETECTED IN AUDIO SCAN',
            `Scam Intent: ${report.scamScore}/100 • Deepfake Likelihood: ${report.deepfakeScore}/100 (${report.overallVerdict})`
          );
        } else {
          showToast({
            type: 'success',
            title: 'Audio Forensics Complete',
            message: `Scan finished: ${report.overallVerdict} with ${Math.round(report.confidence * 100)}% confidence.`,
          });
        }
      }, 300);
    } catch {
      setIsScanning(false);
    }
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: any) => {
    if (e.target?.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  /**
   * Process & play the REAL user-uploaded audio file
   */
  const processUploadedFile = async (file: File) => {
    // 1. Revoke previous blob URL
    if (audioSourceUrl && audioSourceUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioSourceUrl);
    }

    // 2. Create actual Object URL for user's uploaded voice file
    const fileUrl = URL.createObjectURL(file);
    setAudioSourceUrl(fileUrl);
    setSelectedFile(file);

    setIsScanning(true);
    setIsPlaying(false);
    setCurrentTime(0);

    // Step 1: Extract real audio duration and metadata
    setScanStage('Extracting audio metadata & channel spectrogram...');
    setScanProgress(25);
    const metadata = await audioProcessingService.extractAudioMetadata(file);
    setDuration(metadata.durationSeconds);

    // Step 2: Convert real binary data to Base64 for Deepgram STT
    setScanStage('Transcribing real audio with Deepgram nova-2...');
    setScanProgress(55);
    const base64Audio = await audioProcessingService.fileToBase64(file);

    // Step 3: Run client speech recognition fallback if offline
    setScanStage('Analyzing spoken transcript & acoustic markers with Claude AI...');
    setScanProgress(85);

    let clientTranscript = '';
    const tempAudio = new Audio(fileUrl);
    clientTranscript = await audioProcessingService.transcribeWithWebSpeech(tempAudio);

    // Step 4: Dispatch to backend
    try {
      const report = await apiService.analyzeAudioFile({
        fileName: file.name,
        audioBase64: base64Audio,
        clientTranscript,
        durationSeconds: metadata.durationSeconds,
        fileSizeFormatted: metadata.fileSizeFormatted,
      });

      setScanProgress(100);
      setTimeout(() => {
        setCurrentReport(report);
        setIsScanning(false);

        if (report.scamScore >= 75 || report.deepfakeScore >= 75) {
          showHighRiskAlert(
            'THREAT SIGNATURE DETECTED IN UPLOADED AUDIO',
            `Scam Intent: ${report.scamScore}/100 • Deepfake Score: ${report.deepfakeScore}/100 (${report.overallVerdict})`
          );
        } else {
          showToast({
            type: 'success',
            title: 'Real Audio Scan Complete',
            message: `Processed ${file.name} (${metadata.fileSizeFormatted}, ${metadata.durationSeconds}s duration).`,
          });
        }
      }, 400);
    } catch {
      setIsScanning(false);
    }
  };

  const handleExportJSON = () => {
    if (!currentReport) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `forensics_${currentReport.scanId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Native HTML5 Audio Element bound directly to the user's uploaded file */}
      {audioSourceUrl && (
        <audio
          ref={audioRef}
          src={audioSourceUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
      )}

      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyber-border">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm" pulse>
              REAL-TIME AUDIO TRANSCRIBER & AI SCANNER
            </Badge>
            <span className="text-xs font-mono text-cyber-muted">
              Deepgram nova-2 + Claude 3.5 Sonnet Dynamic Forensics
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Audio File Scam & Deepfake Voice Detector
          </h2>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Upload ANY real voice recording, call audio, or voicemail. Audio Guardian transcribes the actual speech and evaluates deception intent and synthetic voice clone artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentReport && (
            <Button
              variant="secondary"
              size="md"
              onClick={handleExportJSON}
              leftIcon={<Download className="w-4 h-4 text-brand-cyan" />}
            >
              Export Forensic Dossier (.JSON)
            </Button>
          )}
        </div>
      </div>

      {/* Upload Zone & Preset Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drag & Drop Zone for Real Files (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            onDragOver={(e: any) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={cn(
              'p-8 border-2 border-dashed rounded-2xl transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[230px]',
              isDragging
                ? 'border-brand-cyan bg-brand-cyan/10 shadow-glow-cyan'
                : 'border-cyber-border/80 bg-slate-900/40 hover:border-slate-600'
            )}
          >
            <div className="p-3.5 rounded-full bg-slate-800 text-brand-cyan mb-3 border border-cyber-border shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h4 className="font-bold text-sm text-white mb-1">
              Upload Any Real Audio File (.WAV, .MP3, .M4A, .OGG)
            </h4>
            <p className="text-xs text-cyber-muted mb-4">
              Direct HTML5 playback & dynamic speech-to-text transcription • Actual spoken content analyzed
            </p>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-indigo-600 text-white text-xs font-semibold shadow-glow-primary transition-all inline-flex items-center gap-2">
                <FileAudio className="w-4 h-4" /> Browse Your Audio File
              </span>
            </label>
          </Card>
        </div>

        {/* Right Column: Pre-loaded Benchmark Presets (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-5 space-y-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyber-muted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan" /> Load Sample Demo Audio
                </span>
                <span className="text-[10px] font-mono text-cyber-subtle">Reference Scenarios</span>
              </div>
              <p className="text-xs text-cyber-muted leading-relaxed">
                Want to test standard scam scenarios? Click a benchmark preset below:
              </p>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset.id)}
                  disabled={isScanning}
                  className="w-full p-3 rounded-xl bg-slate-900/70 border border-cyber-border hover:border-brand-primary hover:bg-cyber-cardHover text-left transition-all group flex items-center justify-between"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="font-bold text-xs text-white group-hover:text-brand-cyan flex items-center gap-1.5 truncate">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-cyber-subtle font-mono">
                      {preset.subtitle} • {preset.duration}
                    </div>
                  </div>

                  <Badge
                    variant={
                      preset.type === 'AI_CLONE'
                        ? 'fraud'
                        : preset.type === 'HUMAN_SCAM'
                        ? 'suspicious'
                        : 'safe'
                    }
                    size="sm"
                  >
                    {preset.type === 'AI_CLONE' ? 'AI Voice Clone' : preset.type === 'HUMAN_SCAM' ? 'Human Scam' : 'Safe Human'}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Dynamic Processing Loading Stage */}
      {isScanning && (
        <Card className="p-6 text-center space-y-4 bg-slate-900 border-brand-cyan/40">
          <Loader size="md" text={scanStage} />
          <div className="w-full max-w-md mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-cyan transition-all duration-300 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-cyber-subtle">
            Extracting acoustic tokens &rarr; Deepgram nova-2 Diarization &rarr; Claude 3.5 Sonnet NLP
          </span>
        </Card>
      )}

      {/* Forensic Report View on Actual Uploaded File */}
      {currentReport && !isScanning && (
        <div className="space-y-6">
          
          {/* Twin Gauges & Overall Verdict Dossier */}
          <Card className="p-6 bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border border-cyber-border space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-cyber-border/80">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      currentReport.scamScore >= 75 || currentReport.deepfakeScore >= 75
                        ? 'fraud'
                        : currentReport.scamScore >= 40
                        ? 'suspicious'
                        : 'safe'
                    }
                    size="md"
                    pulse={currentReport.scamScore >= 75}
                  >
                    {currentReport.overallVerdict}
                  </Badge>
                  <span className="text-xs font-mono text-cyber-muted">ID: {currentReport.scanId}</span>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight font-mono">
                  {currentReport.fileName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-cyber-muted">
                  <span>Duration: {formatDuration(currentReport.durationSeconds || duration)}</span>
                  <span>Speakers: {currentReport.speakerCount} Detected</span>
                  <span>Confidence: {Math.round(currentReport.confidence * 100)}%</span>
                  <span>File Size: {currentReport.fileSizeFormatted || '1.2 MB'}</span>
                </div>
              </div>

              {/* Twin Gauges: Scam Probability & Deepfake Probability */}
              <div className="flex flex-wrap items-center justify-center gap-6 shrink-0">
                {/* Gauge 1: Scam Intent */}
                <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-950/80 border border-cyber-border min-w-[150px]">
                  <span className="text-[11px] font-mono text-cyber-muted uppercase font-bold mb-1">
                    Scam Intent
                  </span>
                  <RiskScoreGauge score={currentReport.scamScore} size="sm" showVerdict={false} />
                  <span
                    className={cn(
                      'text-xs font-bold font-mono mt-1',
                      currentReport.scamScore >= 75 ? 'text-threat-fraud' : currentReport.scamScore >= 40 ? 'text-threat-suspicious' : 'text-threat-safe'
                    )}
                  >
                    {currentReport.scamScore >= 75 ? 'Critical Fraud' : currentReport.scamScore >= 40 ? 'Suspicious' : 'Safe Speech'}
                  </span>
                </div>

                {/* Gauge 2: Deepfake Voice Likelihood */}
                <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-950/80 border border-cyber-border min-w-[150px]">
                  <span className="text-[11px] font-mono text-cyber-muted uppercase font-bold mb-1 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-brand-cyan" /> AI Voice Clone
                  </span>
                  <RiskScoreGauge score={currentReport.deepfakeScore} size="sm" showVerdict={false} />
                  <span
                    className={cn(
                      'text-xs font-bold font-mono mt-1',
                      currentReport.deepfakeScore >= 75 ? 'text-purple-400' : currentReport.deepfakeScore >= 40 ? 'text-amber-400' : 'text-threat-safe'
                    )}
                  >
                    {currentReport.deepfakeScore >= 75 ? 'Synthetic Voice Clone' : currentReport.deepfakeScore >= 40 ? 'Unnatural Prosody' : 'Natural Human'}
                  </span>
                </div>
              </div>
            </div>

            {/* Synchronized Real Audio Player Bar */}
            <div className="p-5 bg-slate-950/90 rounded-2xl border border-cyber-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs font-bold text-white font-mono">
                    {selectedFile ? `Active Audio Track: ${selectedFile.name}` : 'Sample Preset Audio Track'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyber-muted">
                  <span className="text-brand-cyan font-bold">{formatDuration(Math.floor(currentTime))}</span>
                  <span>/</span>
                  <span>{formatDuration(currentReport.durationSeconds || duration || 24)}</span>
                </div>
              </div>

              {/* Real Audio Waveform Visualizer */}
              <div className="py-1 px-3 bg-slate-900/80 rounded-xl border border-cyber-border flex items-center justify-center overflow-hidden">
                <RealtimeAudioVisualizer audioElement={audioRef.current} isPlaying={isPlaying} className="h-12 w-full" />
              </div>

              {/* Scrubber Range Input */}
              <input
                type="range"
                min="0"
                max={currentReport.durationSeconds || duration || 30}
                step="0.1"
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
              />

              {/* Player Buttons Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-brand-primary hover:bg-indigo-500 text-white flex items-center justify-center shadow-glow-primary transition-all"
                    title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  <button
                    onClick={() => handleSeek(0)}
                    className="p-2 text-cyber-muted hover:text-white rounded-lg hover:bg-slate-800"
                    title="Reset to beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 text-cyber-muted hover:text-white rounded-lg hover:bg-slate-800"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-cyber-subtle">
                  Click any sentence in the transcript below to jump to that timestamp
                </div>
              </div>
            </div>
          </Card>

          {/* Main Grid: Actual Transcript Timeline & Acoustic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Actual Spoken Transcript Timeline */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <div className="flex items-center gap-2">
                    <AudioWaveform className="w-5 h-5 text-brand-cyan" />
                    <div>
                      <h4 className="font-bold text-base text-cyber-text">
                        Dynamic Speech Transcript Timeline
                      </h4>
                      <p className="text-xs text-cyber-muted">
                        Actual words spoken in uploaded audio file with word-level timestamps
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-cyber-subtle">
                    {currentReport.transcriptTimeline.length} Utterances
                  </span>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {currentReport.transcriptTimeline.length === 0 ? (
                    <div className="py-10 text-center text-cyber-muted text-xs">
                      No intelligible speech detected in uploaded audio file.
                    </div>
                  ) : (
                    currentReport.transcriptTimeline.map((item: TranscriptTimelineItem, idx: number) => {
                      const isActive = activeSentenceIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSeek(item.secondsOffset, idx)}
                          className={cn(
                            'p-3.5 rounded-xl border cursor-pointer transition-all duration-150',
                            isActive
                              ? 'bg-indigo-950/60 border-brand-cyan shadow-glow-cyan/20 scale-[1.01]'
                              : item.riskLevel === 'danger'
                              ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60'
                              : 'bg-slate-900/60 border-cyber-border hover:border-slate-600'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white uppercase font-mono">
                                {item.speaker}
                              </span>
                              <span className="text-[11px] font-mono text-brand-cyan px-1.5 py-0.5 rounded bg-slate-950 border border-cyber-border">
                                T+{item.time}s
                              </span>
                            </div>

                            {item.riskLevel === 'danger' && (
                              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/40">
                                Threat Trigger
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-200 leading-relaxed font-normal">
                            {item.text}
                          </p>

                          {item.detectedVectors && item.detectedVectors.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.detectedVectors.map((v: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-500/30"
                                >
                                  #{v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>

            {/* Right 5 Columns: Forensic Insights & AI Voice Clone Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Deepfake Acoustic Prosody Breakdown */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-base text-cyber-text">
                      Synthetic Audio Artifacts
                    </h4>
                  </div>
                  <Badge variant="primary" size="sm">
                    Acoustic Telemetry
                  </Badge>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyber-muted">Pitch Flatness (F0 Invariant)</span>
                      <span className="font-bold text-purple-300">{currentReport.deepfakeMarkers.prosodyUnnaturalness}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${currentReport.deepfakeMarkers.prosodyUnnaturalness}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyber-muted">Spectral Boundary Splicing</span>
                      <span className="font-bold text-brand-cyan">{currentReport.deepfakeMarkers.spectralContinuityArtifacts}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-cyan rounded-full"
                        style={{ width: `${currentReport.deepfakeMarkers.spectralContinuityArtifacts}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyber-muted">Cadence Repetition Index</span>
                      <span className="font-bold text-indigo-300">{currentReport.deepfakeMarkers.cadenceRepetition}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${currentReport.deepfakeMarkers.cadenceRepetition}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-cyber-border flex items-center justify-between text-xs font-mono">
                    <span className="text-cyber-muted">Biological Breath Artifacts:</span>
                    <span className={currentReport.deepfakeMarkers.breathingAbsence ? 'text-red-400 font-bold' : 'text-threat-safe font-bold'}>
                      {currentReport.deepfakeMarkers.breathingAbsence ? 'ABSENT (Synthetic TTS)' : 'DETECTED (Organic Human)'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Forensic Highlights Card */}
              <Card className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 border-b border-cyber-border pb-2">
                  <ShieldAlert className="w-4 h-4 text-threat-fraud" />
                  Forensic Findings & Deception Triggers
                </h4>

                <div className="space-y-2">
                  {currentReport.forensicHighlights.map((hl: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-cyber-border/60 text-xs text-slate-200 leading-relaxed">
                      • {hl}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Safety Recommendations Card */}
              <Card className="p-5 space-y-3 bg-emerald-950/20 border-emerald-500/30">
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2 border-b border-emerald-500/30 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Defensive Security Recommendations
                </h4>

                <div className="space-y-2">
                  {currentReport.safetyRecommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> {rec}
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};
