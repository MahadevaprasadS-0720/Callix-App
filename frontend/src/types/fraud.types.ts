export type ScamCategory = 
  | 'SAFE'
  | 'OTP_THEFT' 
  | 'UPI_FRAUD' 
  | 'KYC_EXPIRY' 
  | 'IMPERSONATION' 
  | 'CUSTOMS_PARCEL_SCAM';

export interface ClaudeScoringResult {
  score: number; // 0 to 100
  verdict: 'Legitimate' | 'Suspicious' | 'Fraudulent';
  category: ScamCategory;
  triggerPhrases: string[];
  modelExplanation: string;
  confidence: number;
}

export interface ScamPhrase {
  id: string;
  phrase: string;
  category: ScamCategory;
  severityWeight: number; // 5 - 50
  description: string;
  examplePattern: string;
  targetVictimProfile: string;
  isActive: boolean;
}

export interface NumberReputation {
  phoneNumber: string;
  reputationScore: number; // 0 - 100
  totalReports: number;
  lastReportedCategory: ScamCategory;
  callerNameSuggestion?: string;
  carrier?: string;
  location?: string;
  tags: string[];
  isBlacklisted: boolean;
  communityComments: Array<{
    id: string;
    author: string;
    comment: string;
    category: ScamCategory;
    date: string;
  }>;
}

export interface ThreatMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtitle: string;
}

export interface RealtimeAnalysisResponse {
  callId: string;
  eventId?: string;
  claudeResult?: ClaudeScoringResult;
  decision: {
    finalScore: number;
    verdict: 'Legitimate' | 'Suspicious' | 'Fraudulent';
    claudeScore: number;
    heuristicBoost: number;
    blocklistTriggered: boolean;
    category: ScamCategory;
    triggerPhrases: string[];
    explanation: string;
    requiresGuardianAlert: boolean;
    matchedRules: string[];
  };
}

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
  scamScore: number; // 0 to 100 (Scam Intent Probability)
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

export interface AudioScanPreset {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  type: 'AI_CLONE' | 'HUMAN_SCAM' | 'GENUINE_HUMAN';
  expectedScamScore: number;
  expectedDeepfakeScore: number;
}
