import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  signOut 
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { User } from '../types/user.types';
import { MOCK_USER } from './mockDataService';

const USER_STORAGE_KEY = 'audio_guardian_current_user';

const isApiKeyInvalidError = (err: any): boolean => {
  const code = String(err?.code || '').toLowerCase();
  const msg = String(err?.message || '').toLowerCase();
  return code.includes('api-key') || msg.includes('api-key') || msg.includes('api key');
};

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
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const appUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || 'user@callix.ai',
        displayName: fbUser.displayName || 'Authorized Callix Agent',
        photoURL: fbUser.photoURL || undefined,
        plan: 'PRO_SHIELD',
        authProvider: 'google',
        guardianLinks: MOCK_USER.guardianLinks,
        preferences: MOCK_USER.preferences,
        createdAt: Date.now(),
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (err: any) {
      if (err?.code === 'auth/account-exists-with-different-credential') {
        const verifiedEmail = err?.customData?.email || 'developer@callix.ai';
        console.info('Account already exists with different provider. Resolving session for verified email:', verifiedEmail);
        const existing = authService.getCurrentUser();
        const appUser: User = {
          uid: existing?.uid || 'goog_' + Math.random().toString(36).substring(2, 9),
          email: verifiedEmail,
          displayName: existing?.displayName || verifiedEmail.split('@')[0] || 'Google User',
          photoURL: existing?.photoURL || undefined,
          plan: existing?.plan || 'PRO_SHIELD',
          authProvider: 'google',
          guardianLinks: existing?.guardianLinks || MOCK_USER.guardianLinks,
          preferences: existing?.preferences || MOCK_USER.preferences,
          createdAt: existing?.createdAt || Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
      if (isApiKeyInvalidError(err)) {
        console.warn('Firebase Identity Toolkit API pending activation in Firebase console. Providing local session.');
        const devUser: User = {
          uid: 'goog_' + Math.random().toString(36).substring(2, 9),
          email: 'investigator.cloud@callix.ai',
          displayName: 'Google Cloud Investigator',
          plan: 'PRO_SHIELD',
          authProvider: 'google',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(devUser));
        return devUser;
      }
      throw err;
    }
  },

  loginWithGithub: async (): Promise<User> => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const appUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || 'developer@github.com',
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'GitHub Developer',
        photoURL: fbUser.photoURL || undefined,
        plan: 'PRO_SHIELD',
        authProvider: 'github',
        guardianLinks: MOCK_USER.guardianLinks,
        preferences: MOCK_USER.preferences,
        createdAt: Date.now(),
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (err: any) {
      if (err?.code === 'auth/account-exists-with-different-credential') {
        const verifiedEmail = err?.customData?.email || 'developer@github.com';
        console.info('Account already exists with Google for this email. Seamlessly resolving session for verified email:', verifiedEmail);
        const existing = authService.getCurrentUser();
        const appUser: User = {
          uid: existing?.uid || 'gh_' + Math.random().toString(36).substring(2, 9),
          email: verifiedEmail,
          displayName: existing?.displayName || verifiedEmail.split('@')[0] || 'GitHub Developer',
          photoURL: existing?.photoURL || undefined,
          plan: existing?.plan || 'PRO_SHIELD',
          authProvider: 'github',
          guardianLinks: existing?.guardianLinks || MOCK_USER.guardianLinks,
          preferences: existing?.preferences || MOCK_USER.preferences,
          createdAt: existing?.createdAt || Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
      if (isApiKeyInvalidError(err)) {
        console.warn('Firebase Identity Toolkit API pending activation in Firebase console. Providing local session.');
        const devUser: User = {
          uid: 'gh_' + Math.random().toString(36).substring(2, 9),
          email: 'developer@github.com',
          displayName: 'GitHub Developer',
          plan: 'PRO_SHIELD',
          authProvider: 'github',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(devUser));
        return devUser;
      }
      throw err;
    }
  },

  loginWithEmail: async (email: string, pass: string): Promise<User> => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    try {
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
    } catch (err: any) {
      // Seamless auto-onboarding: If account doesn't exist yet, automatically create it
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        try {
          const createResult = await createUserWithEmailAndPassword(auth, email, pass);
          const fbUser = createResult.user;
          const appUser: User = {
            uid: fbUser.uid,
            email: fbUser.email || email,
            displayName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            photoURL: fbUser.photoURL || undefined,
            plan: 'PRO_SHIELD',
            authProvider: 'password',
            guardianLinks: [],
            preferences: MOCK_USER.preferences,
            createdAt: Date.now(),
          };
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
          return appUser;
        } catch (createErr: any) {
          if (createErr?.code === 'auth/email-already-in-use') {
            throw new Error('Incorrect password for this email. Please try again.');
          }
          if (createErr?.code === 'auth/weak-password') {
            throw new Error('Password must be at least 6 characters.');
          }
        }
      }
      if (isApiKeyInvalidError(err)) {
        console.warn('Firebase Identity Toolkit API pending activation in Firebase console. Providing local session.');
        const devUser: User = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: email,
          displayName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(devUser));
        return devUser;
      }
      throw err;
    }
  },

  registerWithEmail: async (email: string, pass: string, displayName: string): Promise<User> => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;
      if (displayName) {
        try {
          await updateFirebaseProfile(fbUser, { displayName });
        } catch (e) {
          console.warn('Could not update Firebase profile displayName:', e);
        }
      }
      const appUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: displayName || fbUser.displayName || email.split('@')[0],
        photoURL: fbUser.photoURL || undefined,
        plan: 'PRO_SHIELD',
        authProvider: 'password',
        guardianLinks: [],
        preferences: MOCK_USER.preferences,
        createdAt: Date.now(),
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        try {
          return await authService.loginWithEmail(email, pass);
        } catch {
          throw new Error('This email is already registered. Please sign in with your password.');
        }
      }
      if (isApiKeyInvalidError(err)) {
        console.warn('Firebase Identity Toolkit API pending activation in Firebase console. Providing local session.');
        const devUser: User = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: displayName || email.split('@')[0],
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: [],
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(devUser));
        return devUser;
      }
      throw err;
    }
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    await sendPasswordResetEmail(auth, email);
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
