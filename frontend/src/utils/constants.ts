import { ScamCategory, ScamPhrase } from '../types/fraud.types';

export const SCAM_CATEGORIES: Record<ScamCategory, { label: string; color: string; description: string }> = {
  CUSTOMS_PARCEL_SCAM: {
    label: 'Customs / Police Parcel Scam',
    color: '#DC2626',
    description: 'Impersonating Customs, Police, or Courier claiming narcotics found in victim’s parcel with threats of arrest.',
  },
  OTP_THEFT: {
    label: 'Bank KYC & OTP Theft',
    color: '#EF4444',
    description: 'Direct demands for SMS verification OTPs, bank credentials, or MPINs to compromise accounts.',
  },
  UPI_FRAUD: {
    label: 'UPI Refund & Fake Link Trap',
    color: '#F59E0B',
    description: 'Deceiving victim into opening UPI apps or typing UPI PIN under the guise of receiving cashbacks/refunds.',
  },
  KYC_EXPIRY: {
    label: 'Urgent KYC / Service Expiry Threat',
    color: '#F97316',
    description: 'Threats of immediate power cutoff, SIM block, or bank freeze within hours.',
  },
  IMPERSONATION: {
    label: 'Authority Impersonation',
    color: '#6366F1',
    description: 'Posing as telecom officials, bank executives, or courier dispatchers.',
  },
  SAFE: {
    label: 'Legitimate / Safe',
    color: '#10B981',
    description: 'Normal conversational dialogue with zero threat indicators.',
  },
};

export interface SimulationPreset {
  id: string;
  title: string;
  scenarioCode: 'A' | 'B' | 'C' | 'D';
  category: ScamCategory;
  callerNumber: string;
  callerName: string;
  expectedRiskScore: number;
  expectedVerdict: 'Fraudulent' | 'Suspicious' | 'Legitimate';
  description: string;
  dialogue: Array<{
    speaker: 'caller' | 'user';
    text: string;
    delayMs: number;
    expectedInterimScore?: number;
    triggerWords?: string[];
  }>;
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'scenario-a',
    scenarioCode: 'A',
    title: 'Scenario A: Fake Bank KYC & Urgent OTP Request',
    category: 'OTP_THEFT',
    callerNumber: '+91 88261 40918',
    callerName: 'SBI Card Verification Desk (Fake)',
    expectedRiskScore: 94,
    expectedVerdict: 'Fraudulent',
    description: 'Scammer poses as a State Bank executive claiming your credit card / bank account KYC is suspended and demands an urgent 6-digit SMS OTP to prevent permanent deactivation.',
    dialogue: [
      {
        speaker: 'caller',
        text: 'Good afternoon, this is Rajesh Verma from State Bank of India Credit Security Division.',
        delayMs: 2200,
        expectedInterimScore: 40,
        triggerWords: ['State Bank of India', 'Credit Security Division'],
      },
      {
        speaker: 'user',
        text: 'Yes? What is this regarding?',
        delayMs: 1800,
        expectedInterimScore: 40,
      },
      {
        speaker: 'caller',
        text: 'Sir, your banking KYC verification has expired today. Your savings account and debit card will be frozen permanently in the next 1 hour.',
        delayMs: 3200,
        expectedInterimScore: 78,
        triggerWords: ['KYC verification has expired', 'frozen permanently', 'in the next 1 hour'],
      },
      {
        speaker: 'user',
        text: 'I completed my KYC at the branch last month. Why is it showing expired?',
        delayMs: 2000,
        expectedInterimScore: 78,
      },
      {
        speaker: 'caller',
        text: 'The server sync failed. I am generating a high-priority 6-digit verification code to your registered mobile right now. Please tell me the OTP immediately to prevent deactivation.',
        delayMs: 3800,
        expectedInterimScore: 94,
        triggerWords: ['6-digit verification code', 'tell me the OTP immediately', 'prevent deactivation'],
      }
    ],
  },
  {
    id: 'scenario-b',
    scenarioCode: 'B',
    title: 'Scenario B: Courier Parcel with Illegal Goods / Police Threat',
    category: 'CUSTOMS_PARCEL_SCAM',
    callerNumber: '+91 98201 88472',
    callerName: 'Inspector Vijay Rathore (Fake CBI / Customs)',
    expectedRiskScore: 96,
    expectedVerdict: 'Fraudulent',
    description: 'Caller falsely claims an international FedEx parcel under recipient’s Aadhaar was seized with illegal narcotics and threatens digital arrest unless funds are transferred.',
    dialogue: [
      {
        speaker: 'caller',
        text: 'Hello, this is Inspector Vijay Rathore calling from the Central Cyber Crime & Customs Cell, Mumbai.',
        delayMs: 2500,
        expectedInterimScore: 45,
        triggerWords: ['Inspector', 'Cyber Crime & Customs Cell'],
      },
      {
        speaker: 'user',
        text: 'Why are you calling me? Is something wrong?',
        delayMs: 1800,
        expectedInterimScore: 45,
      },
      {
        speaker: 'caller',
        text: 'A FedEx courier parcel registered under your Aadhaar number was intercepted at Customs containing 5 fake passports and 150 grams of contraband MDMA drugs.',
        delayMs: 3600,
        expectedInterimScore: 85,
        triggerWords: ['FedEx courier parcel', 'Aadhaar number', 'Customs', 'MDMA drugs'],
      },
      {
        speaker: 'user',
        text: 'What?! I never sent any parcel! This is a mistake!',
        delayMs: 2000,
        expectedInterimScore: 85,
      },
      {
        speaker: 'caller',
        text: 'An arrest warrant is issued in your name. You are placed under 24-hour Digital Arrest. Transfer your savings balance to the RBI guarantee escrow account to verify your innocence.',
        delayMs: 4200,
        expectedInterimScore: 96,
        triggerWords: ['arrest warrant', 'Digital Arrest', 'Transfer your savings balance', 'escrow account'],
      }
    ],
  },
  {
    id: 'scenario-c',
    scenarioCode: 'C',
    title: 'Scenario C: UPI Refund / Fake Payment Link Scam',
    category: 'UPI_FRAUD',
    callerNumber: '+91 93150 94821',
    callerName: 'Paytm / PhonePe Refund Team',
    expectedRiskScore: 68,
    expectedVerdict: 'Suspicious',
    description: 'Scammer claims an erroneous double charge happened on your recent transaction and instructs you to click a payment link and enter your UPI PIN to claim credit.',
    dialogue: [
      {
        speaker: 'caller',
        text: 'Hello sir, calling from the UPI payment support team regarding your recent transaction of 1,200 rupees.',
        delayMs: 2400,
        expectedInterimScore: 35,
        triggerWords: ['UPI payment support team'],
      },
      {
        speaker: 'user',
        text: 'Yes, what happened with that transaction?',
        delayMs: 1800,
        expectedInterimScore: 35,
      },
      {
        speaker: 'caller',
        text: 'A duplicate debit of 1,200 rupees occurred due to a server glitch. We have issued an instant refund voucher of 1,200 rupees to your UPI ID.',
        delayMs: 3200,
        expectedInterimScore: 55,
        triggerWords: ['duplicate debit', 'instant refund voucher'],
      },
      {
        speaker: 'caller',
        text: 'I sent a payment link on your SMS. Open the link, click on Approve and enter your 6-digit UPI PIN to credit the money into your bank.',
        delayMs: 3600,
        expectedInterimScore: 72,
        triggerWords: ['payment link on your SMS', 'click on Approve', 'enter your 6-digit UPI PIN'],
      }
    ],
  },
  {
    id: 'scenario-d',
    scenarioCode: 'D',
    title: 'Scenario D: Legitimate Food Delivery / Transaction Check',
    category: 'SAFE',
    callerNumber: '+91 98112 34567',
    callerName: 'Zomato Delivery Partner',
    expectedRiskScore: 6,
    expectedVerdict: 'Legitimate',
    description: 'A genuine delivery driver calling from the apartment security gate to confirm tower number and collect the delivery PIN upon arrival.',
    dialogue: [
      {
        speaker: 'caller',
        text: 'Hello sir, I am your Zomato delivery partner. I have reached outside your building main gate.',
        delayMs: 2200,
        expectedInterimScore: 5,
      },
      {
        speaker: 'user',
        text: 'Great, please tell the guard it is Tower B, Flat 402 on the 4th floor.',
        delayMs: 2000,
        expectedInterimScore: 5,
      },
      {
        speaker: 'caller',
        text: 'Okay sir, taking the elevator now. Please keep your 4-digit order delivery PIN ready.',
        delayMs: 2400,
        expectedInterimScore: 6,
      },
      {
        speaker: 'user',
        text: 'Sure, the PIN is ready. See you at the door.',
        delayMs: 1800,
        expectedInterimScore: 6,
      }
    ],
  }
];

export const DEFAULT_PHRASES_CATALOG: ScamPhrase[] = [
  {
    id: 'phr-1',
    phrase: 'customs parcel seized / narcotics found',
    category: 'CUSTOMS_PARCEL_SCAM',
    severityWeight: 45,
    description: 'Posing as customs or law enforcement claiming illicit drug parcel.',
    examplePattern: '"Your FedEx parcel with MDMA is seized at Customs"',
    targetVictimProfile: 'General public, working professionals',
    isActive: true,
  },
  {
    id: 'phr-2',
    phrase: 'share 6-digit verification code / OTP',
    category: 'OTP_THEFT',
    severityWeight: 40,
    description: 'Explicit demand for transaction authentication code.',
    examplePattern: '"Tell me the OTP sent to your registered mobile number"',
    targetVictimProfile: 'General banking customers',
    isActive: true,
  },
  {
    id: 'phr-3',
    phrase: 'enter UPI PIN to receive money / refund',
    category: 'UPI_FRAUD',
    severityWeight: 40,
    description: 'Misleading claim that PIN is needed to credit funds.',
    examplePattern: '"Click approve and enter your 6-digit UPI PIN to receive refund"',
    targetVictimProfile: 'Online marketplace users',
    isActive: true,
  },
  {
    id: 'phr-4',
    phrase: 'kyc expired account will be blocked',
    category: 'KYC_EXPIRY',
    severityWeight: 35,
    description: 'High-pressure panic inducing utility or bank freeze threat.',
    examplePattern: '"Your bank KYC expired, account will be frozen in 1 hour"',
    targetVictimProfile: 'Elderly citizens, housewives',
    isActive: true,
  }
];
