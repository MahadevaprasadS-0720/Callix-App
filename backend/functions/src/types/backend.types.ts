export type CallVerdict = 'Legitimate' | 'Suspicious' | 'Fraudulent';

export type SpeakerRole = 'caller' | 'user' | 'unknown';

export type ScamCategory = 
  | 'SAFE'
  | 'OTP_THEFT' 
  | 'UPI_FRAUD' 
  | 'KYC_EXPIRY' 
  | 'IMPERSONATION' 
  | 'CUSTOMS_PARCEL_SCAM';

export interface TranscriptSegment {
  segmentId: string;
  speaker: SpeakerRole;
  text: string;
  timestampOffset: number; // in seconds
  confidence: number;
  isFlagged?: boolean;
  triggerPhrases?: string[];
}

export interface ClaudeScoringResult {
  score: number; // 0 to 100
  verdict: CallVerdict;
  category: ScamCategory;
  triggerPhrases: string[];
  modelExplanation: string;
  confidence: number; // 0.0 - 1.0
}

export interface DecisionEngineResult {
  finalScore: number;
  verdict: CallVerdict;
  claudeScore: number;
  heuristicBoost: number;
  blocklistTriggered: boolean;
  category: ScamCategory;
  triggerPhrases: string[];
  explanation: string;
  requiresGuardianAlert: boolean;
  matchedRules: string[];
}

export interface CallRecord {
  callId: string;
  uid: string;
  callerNumber: string;
  callerName?: string;
  startTime: number;
  endTime?: number;
  durationSeconds?: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TERMINATED_BY_SYSTEM' | 'FLAGGED';
  finalScore: number;
  verdict: CallVerdict;
  primaryCategory: ScamCategory;
  audioStorageUrl?: string;
  riskEventsCount: number;
  guardianNotified: boolean;
  summaryExplanation?: string;
  createdAt: number;
  updatedAt: number;
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

export interface ScamPhraseRule {
  id: string;
  phrase: string;
  regexPattern?: string;
  category: ScamCategory;
  severityWeight: number; // 5 to 45
  description: string;
  isActive: boolean;
}

export interface NumberReputation {
  phoneNumber: string;
  reputationScore: number; // 0 (Safe) to 100 (Known Scam)
  reportsCount: number;
  lastReportedCategory: ScamCategory;
  tags: string[];
  isBlacklisted: boolean;
  carrier?: string;
  location?: string;
}

export interface CreateCallSessionRequest {
  callId: string;
  userId: string;
  callerNumber: string;
  callerName?: string;
}

export interface AnalyzeTranscriptRequest {
  callId: string;
  userId: string;
  callerNumber: string;
  textSegment: string;
  speaker?: SpeakerRole;
  timestampOffset?: number;
  fullTranscriptHistory?: string;
}

export interface EndCallSessionRequest {
  callId: string;
  durationSeconds: number;
  status?: 'COMPLETED' | 'TERMINATED_BY_SYSTEM';
}

// Audio File Forensics & Deepfake Scan Types
export interface TranscriptTimelineItem {
  speaker: string;
  time: string;
  secondsOffset: number;
  text: string;
  riskLevel: 'safe' | 'warning' | 'danger';
  detectedVectors?: string[];
}

export interface AudioForensicsReport {
  scanId: string;
  fileName: string;
  fileSizeFormatted?: string;
  scamScore: number; // 0 to 100
  deepfakeScore: number; // 0 to 100 (Synthetic AI Voice Likelihood)
  overallVerdict: 'Legitimate / Human' | 'Suspicious' | 'High Risk Scam / AI Voice Clone';
  confidence: number;
  speakerCount: number;
  durationSeconds: number;
  scamCategory: string;
  flaggedKeywords: string[];
  transcriptTimeline: TranscriptTimelineItem[];
  forensicHighlights: string[];
  safetyRecommendations: string[];
  deepfakeMarkers: {
    prosodyUnnaturalness: number; // 0 - 100
    spectralContinuityArtifacts: number; // 0 - 100
    cadenceRepetition: number; // 0 - 100
    breathingAbsence: boolean;
  };
  createdAt: number;
}
