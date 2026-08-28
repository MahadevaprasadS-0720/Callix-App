export type SubscriptionPlan = 'FREE_GUARDIAN' | 'PRO_SHIELD' | 'ENTERPRISE_FAMILY';

export interface GuardianLink {
  guardianId: string;
  name: string;
  phone: string;
  email?: string;
  relationship: 'Parent' | 'Child' | 'Spouse' | 'Caregiver' | 'Other';
  notificationsEnabled: boolean;
  alertOnThreshold: number; // e.g. 75
  createdAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  plan: SubscriptionPlan;
  isSimulationUser?: boolean;
  guardianLinks: GuardianLink[];
  preferences: {
    autoBlockHighRisk: boolean;
    smsAlerts: boolean;
    pushAlerts: boolean;
    audioRecordingOptIn: boolean;
    riskSensitivity: 'STANDARD' | 'AGGRESSIVE' | 'RELAXED';
  };
  createdAt: number;
}
