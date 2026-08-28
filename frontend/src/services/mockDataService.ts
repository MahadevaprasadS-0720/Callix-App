import { CallRecord } from '../types/call.types';
import { NumberReputation, ThreatMetric } from '../types/fraud.types';
import { User } from '../types/user.types';
import { DEFAULT_PHRASES_CATALOG } from '../utils/constants';

export const MOCK_USER: User = {
  uid: 'user_dev_9988',
  email: 'arjun.sharma@guardian.ai',
  displayName: 'Arjun Sharma',
  phoneNumber: '+91 98112 00412',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'PRO_SHIELD',
  isSimulationUser: true,
  guardianLinks: [
    {
      guardianId: 'guard_1',
      name: 'Pooja Sharma (Daughter)',
      phone: '+91 99201 55431',
      email: 'pooja.sharma@gmail.com',
      relationship: 'Child',
      notificationsEnabled: true,
      alertOnThreshold: 75,
      createdAt: Date.now() - 86400000 * 30,
    },
    {
      guardianId: 'guard_2',
      name: 'Ramesh Sharma (Brother)',
      phone: '+91 98200 12890',
      email: 'ramesh.s@yahoo.com',
      relationship: 'Other',
      notificationsEnabled: true,
      alertOnThreshold: 85,
      createdAt: Date.now() - 86400000 * 15,
    }
  ],
  preferences: {
    autoBlockHighRisk: true,
    smsAlerts: true,
    pushAlerts: true,
    audioRecordingOptIn: true,
    riskSensitivity: 'STANDARD',
  },
  createdAt: Date.now() - 86400000 * 90,
};

export const MOCK_CALLS: CallRecord[] = [
  {
    callId: 'call_scam_cbi_01',
    uid: 'user_dev_9988',
    callerNumber: '+91 98201 88472',
    callerName: 'Fake CBI Officer / Customs Desk',
    callerLocation: 'Mumbai, Maharashtra',
    startTime: Date.now() - 1000 * 60 * 32,
    endTime: Date.now() - 1000 * 60 * 27,
    durationSeconds: 300,
    status: 'TERMINATED_BY_SYSTEM',
    finalScore: 96,
    verdict: 'Fraudulent',
    primaryCategory: 'CUSTOMS_PARCEL_SCAM',
    summaryExplanation: 'High-severity customs parcel extortion attempt. Caller falsely claimed intercepted narcotics parcel with Aadhaar misuse and coerced victim to move funds to fake escrow.',
    guardianNotified: true,
    confidence: 0.98,
    createdAt: Date.now() - 1000 * 60 * 32,
    transcript: [
      {
        segmentId: 'seg_1',
        speaker: 'caller',
        text: 'This is Inspector Vijay Rathore from the Central Cyber Crime & Customs Investigation Cell.',
        timestampOffset: 2,
        confidence: 0.96,
        isFlagged: true,
        flaggedReason: 'Authority Impersonation',
      },
      {
        segmentId: 'seg_2',
        speaker: 'user',
        text: 'Why are you calling me? What happened?',
        timestampOffset: 7,
        confidence: 0.95,
      },
      {
        segmentId: 'seg_3',
        speaker: 'caller',
        text: 'A parcel linked to your Aadhaar containing illegal narcotics was seized at customs. You are under immediate Digital Arrest.',
        timestampOffset: 12,
        confidence: 0.97,
        isFlagged: true,
        flaggedReason: 'Digital Arrest Threat',
        triggerPhrases: ['Digital Arrest', 'narcotics seized', 'Aadhaar'],
      },
      {
        segmentId: 'seg_4',
        speaker: 'caller',
        text: 'Transfer your entire savings account to the RBI security escrow account within 15 minutes to clear your name.',
        timestampOffset: 24,
        confidence: 0.98,
        isFlagged: true,
        flaggedReason: 'Extortion Demand',
        triggerPhrases: ['Transfer your entire savings', 'escrow account', 'within 15 minutes'],
      }
    ],
    riskEvents: [
      {
        eventId: 'rev_1',
        callId: 'call_scam_cbi_01',
        score: 78,
        category: 'CUSTOMS_PARCEL_SCAM',
        triggerPhrase: 'Digital Arrest warrant issued under Aadhaar',
        modelExplanation: 'Law enforcement impersonation detected with extortion intent.',
        timestampOffset: 12,
        createdAt: Date.now() - 1000 * 60 * 31,
      },
      {
        eventId: 'rev_2',
        callId: 'call_scam_cbi_01',
        score: 96,
        category: 'CUSTOMS_PARCEL_SCAM',
        triggerPhrase: 'Transfer your savings to RBI security escrow',
        modelExplanation: 'Urgent demand for financial transfer under fake legal duress.',
        timestampOffset: 24,
        createdAt: Date.now() - 1000 * 60 * 30,
      }
    ],
  },
  {
    callId: 'call_scam_sbi_02',
    uid: 'user_dev_9988',
    callerNumber: '+91 88261 40918',
    callerName: 'SBI Card Verification Desk (Fake)',
    callerLocation: 'New Delhi',
    startTime: Date.now() - 1000 * 60 * 180,
    endTime: Date.now() - 1000 * 60 * 176,
    durationSeconds: 240,
    status: 'FLAGGED',
    finalScore: 94,
    verdict: 'Fraudulent',
    primaryCategory: 'OTP_THEFT',
    summaryExplanation: 'Bank executive impersonation claiming KYC expiry and demanding immediate 6-digit OTP verification code.',
    guardianNotified: true,
    confidence: 0.95,
    createdAt: Date.now() - 1000 * 60 * 180,
    transcript: [
      {
        segmentId: 'seg_e1',
        speaker: 'caller',
        text: 'Your banking KYC has expired. Your savings account will be permanently blocked within 1 hour.',
        timestampOffset: 4,
        confidence: 0.94,
        isFlagged: true,
        flaggedReason: 'Urgent account block threat',
      },
      {
        segmentId: 'seg_e2',
        speaker: 'caller',
        text: 'Please share the 6-digit verification code sent to your registered number right now.',
        timestampOffset: 18,
        confidence: 0.96,
        isFlagged: true,
        flaggedReason: 'OTP Theft Demand',
        triggerPhrases: ['6-digit verification code', 'share the code'],
      }
    ],
    riskEvents: [
      {
        eventId: 'rev_e1',
        callId: 'call_scam_sbi_02',
        score: 94,
        category: 'OTP_THEFT',
        triggerPhrase: 'Share 6-digit verification code sent to mobile',
        modelExplanation: 'Direct demand for SMS authentication OTP to compromise banking account.',
        timestampOffset: 18,
        createdAt: Date.now() - 1000 * 60 * 179,
      }
    ]
  },
  {
    callId: 'call_susp_upi_03',
    uid: 'user_dev_9988',
    callerNumber: '+91 93150 94821',
    callerName: 'Paytm Refund Desk (Fake)',
    callerLocation: 'Noida, UP',
    startTime: Date.now() - 1000 * 60 * 60 * 24,
    endTime: Date.now() - 1000 * 60 * 60 * 24 + 120000,
    durationSeconds: 120,
    status: 'COMPLETED',
    finalScore: 72,
    verdict: 'Suspicious',
    primaryCategory: 'UPI_FRAUD',
    summaryExplanation: 'Caller requested user to open SMS link and approve payment via UPI PIN to claim duplicate debit refund.',
    guardianNotified: false,
    confidence: 0.92,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    transcript: [
      {
        segmentId: 'seg_c1',
        speaker: 'caller',
        text: 'Sir we issued a 1,200 rupee refund voucher. Open the link and enter your 6-digit UPI PIN.',
        timestampOffset: 5,
        confidence: 0.91,
        isFlagged: true,
        flaggedReason: 'UPI PIN payment trap',
      }
    ],
    riskEvents: []
  },
  {
    callId: 'call_safe_zomato_04',
    uid: 'user_dev_9988',
    callerNumber: '+91 98112 34567',
    callerName: 'Zomato Delivery Driver',
    callerLocation: 'New Delhi',
    startTime: Date.now() - 1000 * 60 * 60 * 48,
    endTime: Date.now() - 1000 * 60 * 60 * 48 + 180000,
    durationSeconds: 180,
    status: 'COMPLETED',
    finalScore: 6,
    verdict: 'Legitimate',
    primaryCategory: 'SAFE',
    summaryExplanation: 'Routine food delivery interaction with apartment security check.',
    guardianNotified: false,
    confidence: 0.99,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    transcript: [
      {
        segmentId: 'seg_m1',
        speaker: 'caller',
        text: 'Hello sir, I have reached your building main gate with your dinner delivery.',
        timestampOffset: 2,
        confidence: 0.99,
      }
    ],
    riskEvents: []
  }
];

export const MOCK_METRICS: ThreatMetric[] = [
  {
    title: 'Protected Voice Calls',
    value: '1,428',
    change: '+18.4% this month',
    isPositive: true,
    subtitle: 'Real-time Deepgram speech streams',
  },
  {
    title: 'Scams Intercepted',
    value: '84',
    change: '100% blocked',
    isPositive: true,
    subtitle: 'Zero financial losses reported',
  },
  {
    title: 'Elder Guardian Alerts',
    value: '19',
    change: 'Dispatched in <1.2s',
    isPositive: true,
    subtitle: 'Automated SMS & Push notices',
  },
  {
    title: 'Average Detection Latency',
    value: '840ms',
    change: 'Claude 3.5 Sonnet XAI',
    isPositive: true,
    subtitle: 'Sub-second real-time scoring',
  },
];

export const MOCK_NUMBER_REPUTATION_DB: Record<string, NumberReputation> = {
  '+919820188472': {
    phoneNumber: '+91 98201 88472',
    reputationScore: 98,
    totalReports: 142,
    lastReportedCategory: 'CUSTOMS_PARCEL_SCAM',
    callerNameSuggestion: 'Impersonating CBI / Customs Officer',
    carrier: 'Airtel Mumbai Circle',
    location: 'Mumbai, Maharashtra',
    tags: ['Customs Scam', 'Digital Arrest', 'High Danger', 'Narcotics Parcel Hoax'],
    isBlacklisted: true,
    communityComments: [
      {
        id: 'c1',
        author: 'Suresh V.',
        comment: 'Called claiming drugs in FedEx parcel under my Aadhaar. Threatened digital arrest and asked for bank transfer.',
        category: 'CUSTOMS_PARCEL_SCAM',
        date: 'Yesterday',
      },
      {
        id: 'c2',
        author: 'Meera K.',
        comment: 'Frightening call pretending to be police inspector. Audio Guardian automatically flagged it!',
        category: 'CUSTOMS_PARCEL_SCAM',
        date: '3 days ago',
      }
    ]
  },
  '+918826140918': {
    phoneNumber: '+91 88261 40918',
    reputationScore: 94,
    totalReports: 110,
    lastReportedCategory: 'OTP_THEFT',
    callerNameSuggestion: 'Fake SBI Card Verification Desk',
    carrier: 'Jio Delhi Circle',
    location: 'New Delhi',
    tags: ['Bank KYC Scam', 'OTP Theft', 'Card Freeze Threat'],
    isBlacklisted: true,
    communityComments: [
      {
        id: 'c3',
        author: 'Ramesh T.',
        comment: 'Asked for OTP saying KYC expired. Audio Guardian flagged caller score at 94.',
        category: 'OTP_THEFT',
        date: '1 day ago',
      }
    ]
  },
  '+919811234567': {
    phoneNumber: '+91 98112 34567',
    reputationScore: 2,
    totalReports: 0,
    lastReportedCategory: 'SAFE',
    callerNameSuggestion: 'Verified Delivery Partner',
    carrier: 'Vodafone Idea Delhi Circle',
    location: 'New Delhi',
    tags: ['Safe Contact', 'Whitelisted'],
    isBlacklisted: false,
    communityComments: []
  }
};

export const MOCK_ANALYTICS_DATA = {
  weeklyThreats: [
    { day: 'Mon', legitimate: 42, suspicious: 4, fraud: 2 },
    { day: 'Tue', legitimate: 56, suspicious: 6, fraud: 3 },
    { day: 'Wed', legitimate: 68, suspicious: 9, fraud: 7 },
    { day: 'Thu', legitimate: 50, suspicious: 5, fraud: 4 },
    { day: 'Fri', legitimate: 75, suspicious: 12, fraud: 8 },
    { day: 'Sat', legitimate: 82, suspicious: 14, fraud: 11 },
    { day: 'Sun', legitimate: 64, suspicious: 8, fraud: 5 },
  ],
  categoryBreakdown: [
    { name: 'Customs / Police Scam', value: 34, color: '#DC2626' },
    { name: 'Bank KYC & OTP Theft', value: 28, color: '#EF4444' },
    { name: 'UPI Refund Trap', value: 18, color: '#F59E0B' },
    { name: 'KYC Expiry Threats', value: 12, color: '#F97316' },
    { name: 'Authority Impersonation', value: 8, color: '#6366F1' },
  ],
  hourlyDistribution: [
    { hour: '09:00', threats: 3 },
    { hour: '11:00', threats: 12 },
    { hour: '13:00', threats: 8 },
    { hour: '15:00', threats: 16 },
    { hour: '17:00', threats: 24 },
    { hour: '19:00', threats: 31 },
    { hour: '21:00', threats: 19 },
    { hour: '23:00', threats: 5 },
  ]
};

export { DEFAULT_PHRASES_CATALOG };
