import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { User } from '../types/user.types';
import { MOCK_USER } from './mockDataService';

const USER_STORAGE_KEY = 'audio_guardian_current_user';

export const authService = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },

  updateCurrentUser: (updates: Partial<User>): User => {
    const current = authService.getCurrentUser() || MOCK_USER;
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  loginWithGoogle: async (): Promise<User> => {
    try {
      if (auth && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key') {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || 'user@audioguardian.ai',
          displayName: fbUser.displayName || 'Authorized Guardian Agent',
          photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          plan: 'PRO_SHIELD',
          authProvider: 'google',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
    } catch (err) {
      console.warn('Firebase Google Auth fallback triggered:', err);
    }

    // Graceful offline / demo environment fallback
    const fallbackGoogleUser: User = {
      uid: 'goog_' + Math.random().toString(36).substring(2, 9),
      email: 'investigator.cloud@audioguardian.ai',
      displayName: 'Google Cloud Investigator',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      plan: 'PRO_SHIELD',
      authProvider: 'google',
      guardianLinks: MOCK_USER.guardianLinks,
      preferences: MOCK_USER.preferences,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackGoogleUser));
    return fallbackGoogleUser;
  },

  loginWithEmail: async (email: string, pass: string): Promise<User> => {
    try {
      if (auth && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key') {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = result.user;
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || email,
          displayName: fbUser.displayName || email.split('@')[0],
          photoURL: fbUser.photoURL || undefined,
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
    } catch (err) {
      console.warn('Firebase Email login fallback:', err);
    }

    // Fallback simulation
    const simulatedUser: User = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email,
      displayName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      plan: 'PRO_SHIELD',
      authProvider: 'password',
      guardianLinks: MOCK_USER.guardianLinks,
      preferences: MOCK_USER.preferences,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(simulatedUser));
    return simulatedUser;
  },

  registerWithEmail: async (email: string, pass: string, displayName: string): Promise<User> => {
    try {
      if (auth && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key') {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const fbUser = result.user;
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || email,
          displayName: displayName || email.split('@')[0],
          photoURL: fbUser.photoURL || undefined,
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: [],
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
    } catch (err) {
      console.warn('Firebase Email register fallback:', err);
    }

    const newUser: User = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: displayName || email.split('@')[0],
      plan: 'PRO_SHIELD',
      authProvider: 'password',
      guardianLinks: [],
      preferences: MOCK_USER.preferences,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  loginAsGuest: (): User => {
    const guestUser: User = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: 'guest@audioguardian.local',
      displayName: 'Guest Investigator',
      plan: 'FREE_GUARDIAN',
      isGuest: true,
      isSimulationUser: true,
      authProvider: 'guest',
      guardianLinks: [
        {
          guardianId: 'guard_demo_1',
          name: 'Priya Sharma (Daughter)',
          phone: '+91 98765 43210',
          relationship: 'Child',
          notificationsEnabled: true,
          alertOnThreshold: 75,
          createdAt: Date.now() - 86400000 * 10
        }
      ],
      preferences: {
        autoBlockHighRisk: true,
        smsAlerts: true,
        pushAlerts: true,
        audioRecordingOptIn: true,
        riskSensitivity: 'STANDARD'
      },
      createdAt: Date.now()
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  loginDemo: (): User => {
    const demoUser = {
      ...MOCK_USER,
      authProvider: 'demo' as const
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    return demoUser;
  },

  logout: async (): Promise<void> => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};
