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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | string;
  birthDate?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  companyName?: string;
  jobTitle?: string;
  aboutMe?: string;
  websiteUrl?: string;
  photoURL?: string;
  profileCompletion?: number;
  isVerified?: boolean;
  plan: SubscriptionPlan;
  isSimulationUser?: boolean;
  isGuest?: boolean;
  authProvider?: 'google' | 'github' | 'password' | 'guest' | 'demo' | 'phone';
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

