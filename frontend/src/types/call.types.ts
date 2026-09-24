import { ScamCategory } from './fraud.types';

export type CallVerdict = 'Legitimate' | 'Suspicious' | 'Fraudulent';

export type SpeakerType = 'caller' | 'user' | 'unknown';

export type CallStatus = 'IN_PROGRESS' | 'COMPLETED' | 'TERMINATED_BY_SYSTEM' | 'FLAGGED';

export interface TranscriptSegment {
  segmentId: string;
  speaker: SpeakerType;
  text: string;
  timestampOffset: number; // in seconds
  confidence: number;
  isFlagged?: boolean;
  flaggedReason?: string;
  triggerPhrases?: string[];
}

export interface RiskEvent {
  eventId: string;
  callId: string;
  score: number;
  category: ScamCategory;
  triggerPhrase: string;
  modelExplanation: string;
  timestampOffset: number;
  createdAt: number;
}

export interface CallRecord {
  callId: string;
  uid: string;
  callerNumber: string;
  callerName?: string;
  callerLocation?: string;
  startTime: number;
  endTime?: number;
  durationSeconds: number;
  status: CallStatus;
  finalScore: number; // 0 - 100
  verdict: CallVerdict;
  primaryCategory: ScamCategory;
  summaryExplanation: string;
  audioStorageUrl?: string;
  guardianNotified: boolean;
  carrier?: string;
  latencyMs?: number;
  transcript: TranscriptSegment[];
  riskEvents: RiskEvent[];
  confidence: number;
  createdAt: number;
}
