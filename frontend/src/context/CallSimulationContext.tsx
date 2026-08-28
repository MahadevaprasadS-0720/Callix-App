import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CallRecord, TranscriptSegment, RiskEvent, CallStatus } from '../types/call.types';
import { ScamCategory } from '../types/fraud.types';
import { SIMULATION_PRESETS, SimulationPreset } from '../utils/constants';
import { apiService } from '../services/apiService';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from './AuthContext';

interface CallSimulationContextType {
  isCallActive: boolean;
  isPaused: boolean;
  selectedPreset: SimulationPreset;
  activeCallId: string | null;
  callerNumber: string;
  callerName: string;
  currentRiskScore: number;
  currentCategory: ScamCategory;
  currentExplanation: string;
  triggerPhrases: string[];
  transcripts: TranscriptSegment[];
  riskEvents: RiskEvent[];
  callDuration: number;
  audioLevels: number[];
  guardianAlertSent: boolean;
  callStatus: CallStatus;
  
  // Actions
  selectPreset: (presetId: string) => void;
  startSimulation: (customPreset?: SimulationPreset) => Promise<void>;
  stopSimulation: (status?: CallStatus) => Promise<void>;
  togglePause: () => void;
  simulateCustomUtterance: (text: string, speaker: 'caller' | 'user') => Promise<void>;
  resetSimulationState: () => void;
}

const CallSimulationContext = createContext<CallSimulationContextType | undefined>(undefined);

export const CallSimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [selectedPreset, setSelectedPreset] = useState<SimulationPreset>(SIMULATION_PRESETS[0]);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callerNumber, setCallerNumber] = useState<string>(SIMULATION_PRESETS[0].callerNumber);
  const [callerName, setCallerName] = useState<string>(SIMULATION_PRESETS[0].callerName);
  const [currentRiskScore, setCurrentRiskScore] = useState<number>(0);
  const [currentCategory, setCurrentCategory] = useState<ScamCategory>('SAFE');
  const [currentExplanation, setCurrentExplanation] = useState<string>('Standby. Initializing AI speech telemetry...');
  const [triggerPhrases, setTriggerPhrases] = useState<string[]>([]);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(24).fill(10));
  const [guardianAlertSent, setGuardianAlertSent] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('IN_PROGRESS');

  const timerRef = useRef<any>(null);
  const simulationStepRef = useRef<number>(0);
  const stepTimeoutRef = useRef<any>(null);
  const pausedRef = useRef<boolean>(false);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  // Audio visualizer waveform animation
  useEffect(() => {
    let animInterval: any = null;
    if (isCallActive && !isPaused) {
      animInterval = setInterval(() => {
        const isSpeaking = Math.random() > 0.25;
        setAudioLevels(() =>
          Array.from({ length: 24 }, () =>
            isSpeaking ? Math.floor(Math.random() * 85) + 15 : Math.floor(Math.random() * 15) + 5
          )
        );
      }, 100);
    } else {
      setAudioLevels(Array(24).fill(8));
    }
    return () => {
      if (animInterval) clearInterval(animInterval);
    };
  }, [isCallActive, isPaused]);

  // Call duration timer
  useEffect(() => {
    if (isCallActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setCallDuration((d: number) => d + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive, isPaused]);

  const selectPreset = (presetId: string) => {
    const preset = SIMULATION_PRESETS.find((p: SimulationPreset) => p.id === presetId) || SIMULATION_PRESETS[0];
    setSelectedPreset(preset);
    setCallerNumber(preset.callerNumber);
    setCallerName(preset.callerName);
  };

  const resetSimulationState = () => {
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCallActive(false);
    setIsPaused(false);
    setActiveCallId(null);
    setCurrentRiskScore(0);
    setCurrentCategory('SAFE');
    setCurrentExplanation('Call standby. Ready to simulate voice stream.');
    setTriggerPhrases([]);
    setTranscripts([]);
    setRiskEvents([]);
    setCallDuration(0);
    setGuardianAlertSent(false);
    setCallStatus('IN_PROGRESS');
    simulationStepRef.current = 0;
  };

  const processDialogueStep = async (stepIndex: number, preset: SimulationPreset, callId: string) => {
    if (stepIndex >= preset.dialogue.length) {
      // Completed all dialogue chunks
      return;
    }

    const item = preset.dialogue[stepIndex];
    stepTimeoutRef.current = setTimeout(async () => {
      if (pausedRef.current) {
        // Retry next check if paused
        processDialogueStep(stepIndex, preset, callId);
        return;
      }

      const segment: TranscriptSegment = {
        segmentId: `seg_${Date.now()}_${stepIndex}`,
        speaker: item.speaker,
        text: item.text,
        timestampOffset: (stepIndex + 1) * 3,
        confidence: 0.95 + Math.random() * 0.04,
        isFlagged: (item.triggerWords && item.triggerWords.length > 0) || false,
        triggerPhrases: item.triggerWords || [],
      };

      setTranscripts((prev: TranscriptSegment[]) => [...prev, segment]);

      // Call Backend AI Scoring Pipeline
      try {
        const fullHistory = transcripts
          .map((t: TranscriptSegment) => `${t.speaker.toUpperCase()}: ${t.text}`)
          .join('\n');

        const analysis = await apiService.analyzeLiveTranscript({
          callId,
          userId: user?.uid || 'user_sim',
          callerNumber: preset.callerNumber,
          textSegment: item.text,
          timestampOffset: segment.timestampOffset,
          fullTranscriptHistory: fullHistory,
        });

        const newScore = item.expectedInterimScore !== undefined 
          ? Math.max(item.expectedInterimScore, analysis.decision.finalScore)
          : analysis.decision.finalScore;

        setCurrentRiskScore(newScore);
        setCurrentCategory(analysis.decision.category);
        setCurrentExplanation(analysis.decision.explanation);

        if (analysis.decision.triggerPhrases.length > 0) {
          setTriggerPhrases((prev: string[]) => Array.from(new Set([...prev, ...analysis.decision.triggerPhrases])));
        }

        if (newScore >= 40 || analysis.decision.triggerPhrases.length > 0) {
          const newEvent: RiskEvent = {
            eventId: analysis.eventId || `evt_${Date.now()}`,
            callId,
            score: newScore,
            category: analysis.decision.category,
            triggerPhrase: analysis.decision.triggerPhrases[0] || item.text.substring(0, 40),
            modelExplanation: analysis.decision.explanation,
            timestampOffset: segment.timestampOffset,
            createdAt: Date.now(),
          };
          setRiskEvents((prev: RiskEvent[]) => [...prev, newEvent]);
          await firestoreService.saveRiskEvent(callId, newEvent);
        }

        if (newScore >= 75 && !guardianAlertSent) {
          setGuardianAlertSent(true);
        }

        // Auto disconnect if critical extortion score
        if (newScore >= 95 && user?.preferences?.autoBlockHighRisk) {
          setTimeout(() => {
            stopSimulation('TERMINATED_BY_SYSTEM');
          }, 2500);
          return;
        }
      } catch (err) {
        console.error('Error during live chunk scoring', err);
      }

      simulationStepRef.current = stepIndex + 1;
      processDialogueStep(stepIndex + 1, preset, callId);
    }, item.delayMs);
  };

  const startSimulation = async (customPreset?: SimulationPreset) => {
    resetSimulationState();
    const presetToRun = customPreset || selectedPreset;
    const callId = `call_${Date.now()}`;

    setActiveCallId(callId);
    setCallerNumber(presetToRun.callerNumber);
    setCallerName(presetToRun.callerName);
    setIsCallActive(true);
    setCallStatus('IN_PROGRESS');
    simulationStepRef.current = 0;

    // 1. Initialize session in backend & database
    await apiService.createCallSession({
      callId,
      userId: user?.uid || 'user_dev_9988',
      callerNumber: presetToRun.callerNumber,
      callerName: presetToRun.callerName,
    });

    // 2. Start streaming rolling dialogue chunks
    processDialogueStep(0, presetToRun, callId);
  };

  const stopSimulation = async (status: CallStatus = 'COMPLETED') => {
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setIsCallActive(false);
    setCallStatus(status);

    if (activeCallId) {
      const finalVerdict = currentRiskScore >= 75 ? 'Fraudulent' : currentRiskScore >= 40 ? 'Suspicious' : 'Legitimate';
      const callRecord: CallRecord = {
        callId: activeCallId,
        uid: user?.uid || 'user_dev_9988',
        callerNumber,
        callerName,
        startTime: Date.now() - callDuration * 1000,
        endTime: Date.now(),
        durationSeconds: callDuration || 12,
        status,
        finalScore: currentRiskScore,
        verdict: finalVerdict,
        primaryCategory: currentCategory,
        summaryExplanation: currentExplanation,
        guardianNotified: guardianAlertSent,
        transcript: transcripts,
        riskEvents,
        confidence: 0.96,
        createdAt: Date.now(),
      };

      await apiService.endCallSession({
        callId: activeCallId,
        durationSeconds: callDuration || 12,
        status: status === 'TERMINATED_BY_SYSTEM' ? 'TERMINATED_BY_SYSTEM' : 'COMPLETED',
      });

      await firestoreService.saveCall(callRecord);
    }
  };

  const togglePause = () => {
    setIsPaused((p: boolean) => !p);
  };

  const simulateCustomUtterance = async (text: string, speaker: 'caller' | 'user') => {
    if (!activeCallId) return;

    const segment: TranscriptSegment = {
      segmentId: `seg_custom_${Date.now()}`,
      speaker,
      text,
      timestampOffset: callDuration,
      confidence: 0.98,
    };

    setTranscripts((prev: TranscriptSegment[]) => [...prev, segment]);

    const fullHistory = transcripts
      .map((t: TranscriptSegment) => `${t.speaker.toUpperCase()}: ${t.text}`)
      .join('\n');

    const analysis = await apiService.analyzeLiveTranscript({
      callId: activeCallId,
      userId: user?.uid || 'user_sim',
      callerNumber,
      textSegment: text,
      timestampOffset: callDuration,
      fullTranscriptHistory: fullHistory,
    });

    setCurrentRiskScore(analysis.decision.finalScore);
    setCurrentCategory(analysis.decision.category);
    setCurrentExplanation(analysis.decision.explanation);

    if (analysis.decision.triggerPhrases.length > 0) {
      setTriggerPhrases((prev: string[]) => Array.from(new Set([...prev, ...analysis.decision.triggerPhrases])));
    }
  };

  return (
    <CallSimulationContext.Provider
      value={{
        isCallActive,
        isPaused,
        selectedPreset,
        activeCallId,
        callerNumber,
        callerName,
        currentRiskScore,
        currentCategory,
        currentExplanation,
        triggerPhrases,
        transcripts,
        riskEvents,
        callDuration,
        audioLevels,
        guardianAlertSent,
        callStatus,
        selectPreset,
        startSimulation,
        stopSimulation,
        togglePause,
        simulateCustomUtterance,
        resetSimulationState,
      }}
    >
      {children}
    </CallSimulationContext.Provider>
  );
};

export const useCallSimulation = (): CallSimulationContextType => {
  const context = useContext(CallSimulationContext);
  if (!context) {
    throw new Error('useCallSimulation must be used within a CallSimulationProvider');
  }
  return context as CallSimulationContextType;
};
