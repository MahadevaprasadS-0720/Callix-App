import { useState, useEffect, useRef, useCallback } from 'react';

export interface LiveTranscriptChunk {
  id: string;
  speaker: 'user' | 'caller';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface UseLiveMicrophoneReturn {
  isRecording: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  interimTranscript: string;
  finalTranscriptList: LiveTranscriptChunk[];
  audioStream: MediaStream | null;
  audioVolume: number; // 0 to 100 volume meter
  startRecording: () => Promise<boolean>;
  stopRecording: () => void;
  clearTranscript: () => void;
  injectUtterance: (text: string, speaker?: 'user' | 'caller') => void;
  error: string | null;
}

export function useLiveMicrophone(): UseLiveMicrophoneReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscriptList, setFinalTranscriptList] = useState<LiveTranscriptChunk[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioVolume, setAudioVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const volumeAnimRef = useRef<number | null>(null);
  const isManuallyStoppedRef = useRef(false);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPermissionStatus('unsupported');
    }
  }, []);

  // Monitor audio volume meter
  const startVolumeMeter = useCallback((stream: MediaStream) => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i];
        }
        const avg = sum / data.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioVolume(normalized);

        volumeAnimRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch {
      // AudioContext failure
    }
  }, []);

  const stopVolumeMeter = useCallback(() => {
    if (volumeAnimRef.current) {
      cancelAnimationFrame(volumeAnimRef.current);
      volumeAnimRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioVolume(0);
  }, []);

  const startRecording = useCallback(async (): Promise<boolean> => {
    setError(null);
    isManuallyStoppedRef.current = false;

    // 1. Request microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      streamRef.current = stream;
      setAudioStream(stream);
      setPermissionStatus('granted');
      startVolumeMeter(stream);
    } catch (err: any) {
      setPermissionStatus('denied');
      setError('Microphone permission denied. Please allow microphone access in your browser settings.');
      return false;
    }

    // 2. Initialize SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsRecording(true);
      return true; // Still allow mic volume & audio capture
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / localized

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            const trimmed = transcriptChunk.trim();
            if (trimmed) {
              const newSegment: LiveTranscriptChunk = {
                id: `chunk_${Date.now()}_${Math.random()}`,
                speaker: 'caller',
                text: trimmed,
                timestamp: Date.now(),
                isFinal: true,
              };
              setFinalTranscriptList((prev) => [...prev, newSegment]);
              setInterimTranscript('');
            }
          } else {
            currentInterim += transcriptChunk;
          }
        }

        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition event warning:', event.error);
        }
      };

      recognition.onend = () => {
        // Auto-restart recognition if still recording (handles browser timeout on brief pauses)
        if (!isManuallyStoppedRef.current && recognitionRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      return true;
    } catch (err: any) {
      console.warn('Could not start speech recognition:', err);
      setIsRecording(true);
      return true;
    }
  }, [startVolumeMeter]);

  const stopRecording = useCallback(() => {
    isManuallyStoppedRef.current = true;
    setIsRecording(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setAudioStream(null);
    stopVolumeMeter();
  }, [stopVolumeMeter]);

  const clearTranscript = useCallback(() => {
    setFinalTranscriptList([]);
    setInterimTranscript('');
  }, []);

  const injectUtterance = useCallback((text: string, speaker: 'user' | 'caller' = 'caller') => {
    if (!text.trim()) return;
    const newSegment: LiveTranscriptChunk = {
      id: `chunk_${Date.now()}_${Math.random()}`,
      speaker,
      text: text.trim(),
      timestamp: Date.now(),
      isFinal: true,
    };
    setFinalTranscriptList((prev) => [...prev, newSegment]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      stopVolumeMeter();
    };
  }, [stopVolumeMeter]);

  return {
    isRecording,
    permissionStatus,
    interimTranscript,
    finalTranscriptList,
    audioStream,
    audioVolume,
    startRecording,
    stopRecording,
    clearTranscript,
    injectUtterance,
    error,
  };
}
