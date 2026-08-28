import { 
  ClaudeScoringResult, 
  DecisionEngineResult, 
  NumberReputation, 
  ScamCategory, 
  ScamPhraseRule, 
  CallVerdict 
} from '../types/backend.types';
import { env } from '../config/envConfig';

export const DEFAULT_SCAM_RULES: ScamPhraseRule[] = [
  {
    id: 'rule-otp-share',
    phrase: 'share otp',
    regexPattern: '\\b(share|tell|give|send|enter)\\s+(the\\s+)?(otp|one\\s*time\\s*password|verification\\s*code|6\\s*digit\\s*code|4\\s*digit\\s*code)\\b',
    category: 'OTP_THEFT',
    severityWeight: 40,
    description: 'Direct demand for SMS OTP or security authentication code',
    isActive: true,
  },
  {
    id: 'rule-remote-app',
    phrase: 'install anydesk',
    regexPattern: '\\b(install|download|open)\\s+(anydesk|teamviewer|rustdesk|quicksupport|apk\\s*file|screen\\s*share)\\b',
    category: 'KYC_EXPIRY',
    severityWeight: 35,
    description: 'Coercion to install remote desktop mirroring tool or untrusted APK',
    isActive: true,
  },
  {
    id: 'rule-upi-pin-receive',
    phrase: 'enter upi pin to receive',
    regexPattern: '\\b(enter|type|put)\\s+(your\\s+)?(upi\\s*pin|mpin)\\s+(to\\s+receive|to\\s+credit|to\\s+claim|for\\s+cashback)\\b',
    category: 'UPI_FRAUD',
    severityWeight: 40,
    description: 'UPI PIN is strictly required for debits, never credits',
    isActive: true,
  },
  {
    id: 'rule-customs-parcel',
    phrase: 'customs parcel seized',
    regexPattern: '\\b(customs|dhl|fedex|parcel)\\s+(seized|intercepted|mdma|drugs|fake\\s*passports|illegal\\s*parcel)\\b',
    category: 'CUSTOMS_PARCEL_SCAM',
    severityWeight: 45,
    description: 'Impersonation of customs or courier claiming drug trafficking parcel',
    isActive: true,
  },
  {
    id: 'rule-account-suspend',
    phrase: 'account suspended',
    regexPattern: '\\b(kyc\\s*expired|account\\s*suspended|power\\s*disconnected|pan\\s*blocked|sim\\s*deactivation)\\b',
    category: 'KYC_EXPIRY',
    severityWeight: 35,
    description: 'Panic inducement claiming pending KYC suspension',
    isActive: true,
  },
];

export class DecisionEngine {
  private rules: ScamPhraseRule[];

  constructor(customRules: ScamPhraseRule[] = DEFAULT_SCAM_RULES) {
    this.rules = customRules.filter(r => r.isActive);
  }

  public evaluate(
    claudeResult: ClaudeScoringResult,
    textSegment: string,
    callerReputation?: NumberReputation | null
  ): DecisionEngineResult {
    let heuristicBoost = 0;
    const matchedRules: string[] = [];
    const detectedPhrases: string[] = [...claudeResult.triggerPhrases];
    let detectedCategory: ScamCategory = claudeResult.category;

    const lowerText = textSegment.toLowerCase();

    // 1. Evaluate heuristic rules
    for (const rule of this.rules) {
      let matched = false;
      if (rule.regexPattern) {
        const regex = new RegExp(rule.regexPattern, 'i');
        if (regex.test(lowerText)) {
          matched = true;
        }
      } else if (lowerText.includes(rule.phrase.toLowerCase())) {
        matched = true;
      }

      if (matched) {
        heuristicBoost += rule.severityWeight;
        matchedRules.push(rule.description);
        if (!detectedPhrases.includes(rule.phrase)) {
          detectedPhrases.push(rule.phrase);
        }
        if (detectedCategory === 'SAFE' || claudeResult.score < 50) {
          detectedCategory = rule.category;
        }
      }
    }

    // 2. Caller reputation and blocklist multiplier
    let blocklistTriggered = false;
    if (callerReputation) {
      if (callerReputation.isBlacklisted) {
        blocklistTriggered = true;
        heuristicBoost += 40;
        matchedRules.push(`Caller ${callerReputation.phoneNumber} is in the global fraud blacklist`);
      } else if (callerReputation.reputationScore >= 70) {
        heuristicBoost += 20;
        matchedRules.push(`Caller has elevated spam score (${callerReputation.reputationScore}/100)`);
      }
    }

    // 3. Compute final weighted score (65% Claude NLP + Heuristics + Multipliers)
    let rawScore = Math.round(claudeResult.score * 0.75 + heuristicBoost);
    if (blocklistTriggered && rawScore < 85) rawScore = 85;
    const finalScore = Math.min(100, Math.max(0, rawScore));

    // 4. Verdict determination
    let verdict: CallVerdict = 'Legitimate';
    if (finalScore >= env.HIGH_RISK_THRESHOLD || blocklistTriggered) {
      verdict = 'Fraudulent';
    } else if (finalScore >= 40) {
      verdict = 'Suspicious';
    }

    const requiresGuardianAlert = finalScore >= env.HIGH_RISK_THRESHOLD || blocklistTriggered;

    return {
      finalScore,
      verdict,
      claudeScore: claudeResult.score,
      heuristicBoost,
      blocklistTriggered,
      category: detectedCategory,
      triggerPhrases: Array.from(new Set(detectedPhrases)),
      explanation: claudeResult.modelExplanation,
      requiresGuardianAlert,
      matchedRules,
    };
  }
}

export const defaultDecisionEngine = new DecisionEngine();
