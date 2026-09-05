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
import { User, SubscriptionPlan, GuardianLink } from '../types/user.types';
import { MOCK_USER } from './mockDataService';

const USER_STORAGE_KEY = 'audio_guardian_current_user';
const REGISTERED_ACCOUNTS_KEY = 'callix_registered_accounts_db';

export interface StoredAccount {
  uid: string;
  email: string;
  password?: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  plan: SubscriptionPlan;
  isSimulationUser?: boolean;
  isGuest?: boolean;
  authProvider?: 'password' | 'google' | 'github' | 'guest' | 'demo';
  guardianLinks: GuardianLink[];
  preferences: User['preferences'];
  createdAt: number;
}

const DEFAULT_DEV_ACCOUNTS: StoredAccount[] = [
  {
    uid: 'user_dev_9988',
    email: 'arjun.sharma@callix.ai',
    password: 'password123',
    displayName: 'Arjun Sharma',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'PRO_SHIELD',
    authProvider: 'password',
    guardianLinks: MOCK_USER.guardianLinks,
    preferences: MOCK_USER.preferences,
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    uid: 'user_dev_9989',
    email: 'arjun.sharma@guardian.ai',
    password: 'password123',
    displayName: 'Arjun Sharma',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'PRO_SHIELD',
    authProvider: 'password',
    guardianLinks: MOCK_USER.guardianLinks,
    preferences: MOCK_USER.preferences,
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    uid: 'user_dev_9990',
    email: 'developer@callix.ai',
    password: 'password123',
    displayName: 'Callix Developer',
    plan: 'PRO_SHIELD',
    authProvider: 'password',
    guardianLinks: MOCK_USER.guardianLinks,
    preferences: MOCK_USER.preferences,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    uid: 'user_dev_9991',
    email: 'testdev@callix.ai',
    password: 'password123',
    displayName: 'Test Developer',
    plan: 'PRO_SHIELD',
    authProvider: 'password',
    guardianLinks: MOCK_USER.guardianLinks,
    preferences: MOCK_USER.preferences,
    createdAt: Date.now() - 86400000 * 10,
  }
];

const getStoredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(DEFAULT_DEV_ACCOUNTS));
      return DEFAULT_DEV_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_DEV_ACCOUNTS;
  } catch {
    return DEFAULT_DEV_ACCOUNTS;
  }
};

const saveAccount = (account: StoredAccount) => {
  try {
    const accounts = getStoredAccounts();
    const cleanEmail = account.email.trim().toLowerCase();
    const idx = accounts.findIndex(a => a.email.trim().toLowerCase() === cleanEmail);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...account, email: cleanEmail };
    } else {
      accounts.push({ ...account, email: cleanEmail });
    }
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Could not persist account locally:', e);
  }
};

const findStoredAccount = (email: string): StoredAccount | undefined => {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();
  return accounts.find(a => a.email.trim().toLowerCase() === cleanEmail);
};

const isApiKeyInvalidError = (err: any): boolean => {
  const code = String(err?.code || '').toLowerCase();
  const msg = String(err?.message || '').toLowerCase();
  return (
    code.includes('api-key') || 
    msg.includes('api-key') || 
    msg.includes('api key') ||
    code.includes('operation-not-allowed') ||
    code.includes('configuration-not-found') ||
    code.includes('network-request-failed')
  );
};

export const authService = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.isGuest || parsed?.authProvider === 'guest') {
          localStorage.removeItem(USER_STORAGE_KEY);
          return null;
        }
        return parsed;
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
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      // Robust extraction of Google photo from user object, providerData, or tokenResponse
      let photo = fbUser.photoURL || undefined;
      if (!photo && fbUser.providerData) {
        for (const p of fbUser.providerData) {
          if (p?.photoURL) {
            photo = p.photoURL;
            break;
          }
        }
      }
      if (!photo && (result as any)?._tokenResponse?.photoUrl) {
        photo = (result as any)._tokenResponse.photoUrl;
      }
      // Upgrade Google 96px thumbnail to 256px crisp avatar
      if (photo && photo.includes('googleusercontent.com')) {
        photo = photo.replace(/=s\d+(-c)?$/, '=s256-c');
      }

      const googleName = fbUser.displayName || 
                         fbUser.providerData?.[0]?.displayName || 
                         fbUser.email?.split('@')[0] || 
                         'Authorized Callix Agent';

      const appUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || 'user@callix.ai',
        displayName: googleName,
        photoURL: photo,
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
          photoURL: existing?.photoURL || (err?.customData as any)?.photoURL || undefined,
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
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('Please enter both email and password.');
    }

    // 1. Try Firebase Authentication first if initialized
    if (auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        const fbUser = result.user;
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || cleanEmail,
          displayName: fbUser.displayName || cleanEmail.split('@')[0],
          photoURL: fbUser.photoURL || undefined,
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        saveAccount({
          ...appUser,
          password: cleanPass,
        });
        return appUser;
      } catch (err: any) {
        console.warn('Firebase signIn attempt note:', err?.code, err?.message);

        // Check local accounts store
        const localAcc = findStoredAccount(cleanEmail);
        if (localAcc) {
          if (!localAcc.password || localAcc.password === cleanPass) {
            const appUser: User = {
              uid: localAcc.uid,
              email: localAcc.email,
              displayName: localAcc.displayName,
              photoURL: localAcc.photoURL,
              plan: localAcc.plan,
              authProvider: 'password',
              guardianLinks: localAcc.guardianLinks || MOCK_USER.guardianLinks,
              preferences: localAcc.preferences || MOCK_USER.preferences,
              createdAt: localAcc.createdAt,
            };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
            return appUser;
          } else {
            throw new Error('Incorrect password for this email. Please try again.');
          }
        }

        // If not found in local DB and Firebase returned credential/user error, try onboarding
        if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
          try {
            const createResult = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
            const fbUser = createResult.user;
            const appUser: User = {
              uid: fbUser.uid,
              email: fbUser.email || cleanEmail,
              displayName: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
              photoURL: fbUser.photoURL || undefined,
              plan: 'PRO_SHIELD',
              authProvider: 'password',
              guardianLinks: [],
              preferences: MOCK_USER.preferences,
              createdAt: Date.now(),
            };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
            saveAccount({
              ...appUser,
              password: cleanPass,
            });
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

        // Resilient developer session for local testing / offline / API limits
        const devUser: StoredAccount = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: cleanEmail,
          password: cleanPass,
          displayName: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: MOCK_USER.guardianLinks,
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        saveAccount(devUser);
        const appUser: User = {
          uid: devUser.uid,
          email: devUser.email,
          displayName: devUser.displayName,
          plan: devUser.plan,
          authProvider: 'password',
          guardianLinks: devUser.guardianLinks,
          preferences: devUser.preferences,
          createdAt: devUser.createdAt,
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
    }

    // Fallback if auth is completely offline
    const localAcc = findStoredAccount(cleanEmail);
    if (localAcc) {
      if (!localAcc.password || localAcc.password === cleanPass) {
        const appUser: User = {
          uid: localAcc.uid,
          email: localAcc.email,
          displayName: localAcc.displayName,
          plan: localAcc.plan,
          authProvider: 'password',
          guardianLinks: localAcc.guardianLinks || MOCK_USER.guardianLinks,
          preferences: localAcc.preferences || MOCK_USER.preferences,
          createdAt: localAcc.createdAt,
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        return appUser;
      }
      throw new Error('Incorrect password for this email. Please try again.');
    }

    const fallbackUser: StoredAccount = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      password: cleanPass,
      displayName: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      plan: 'PRO_SHIELD',
      authProvider: 'password',
      guardianLinks: MOCK_USER.guardianLinks,
      preferences: MOCK_USER.preferences,
      createdAt: Date.now(),
    };
    saveAccount(fallbackUser);
    const appUser: User = {
      uid: fallbackUser.uid,
      email: fallbackUser.email,
      displayName: fallbackUser.displayName,
      plan: fallbackUser.plan,
      authProvider: 'password',
      guardianLinks: fallbackUser.guardianLinks,
      preferences: fallbackUser.preferences,
      createdAt: fallbackUser.createdAt,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
    return appUser;
  },

  registerWithEmail: async (email: string, pass: string, displayName: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

    if (!cleanEmail || !cleanPass) {
      throw new Error('Please enter email and password.');
    }
    if (cleanPass.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // 1. Try Firebase Authentication first if initialized
    if (auth) {
      try {
        const result = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        const fbUser = result.user;
        if (cleanName) {
          try {
            await updateFirebaseProfile(fbUser, { displayName: cleanName });
          } catch (e) {
            console.warn('Could not update Firebase profile displayName:', e);
          }
        }
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || cleanEmail,
          displayName: cleanName || fbUser.displayName || cleanEmail.split('@')[0],
          photoURL: fbUser.photoURL || undefined,
          plan: 'PRO_SHIELD',
          authProvider: 'password',
          guardianLinks: [],
          preferences: MOCK_USER.preferences,
          createdAt: Date.now(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        saveAccount({
          ...appUser,
          password: cleanPass,
        });
        return appUser;
      } catch (err: any) {
        if (err?.code === 'auth/email-already-in-use') {
          try {
            return await authService.loginWithEmail(cleanEmail, cleanPass);
          } catch (loginErr) {
            const localAcc = findStoredAccount(cleanEmail);
            if (localAcc && (!localAcc.password || localAcc.password === cleanPass)) {
              const appUser: User = {
                uid: localAcc.uid,
                email: localAcc.email,
                displayName: localAcc.displayName,
                photoURL: localAcc.photoURL,
                plan: localAcc.plan,
                authProvider: 'password',
                guardianLinks: localAcc.guardianLinks || [],
                preferences: localAcc.preferences || MOCK_USER.preferences,
                createdAt: localAcc.createdAt,
              };
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
              return appUser;
            }
            throw new Error('This email is already registered. Please sign in with your password.');
          }
        }
        console.warn('Firebase registration fallback for offline/development:', err);
      }
    }

    // Fallback: Create and save locally
    const localUser: StoredAccount = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      password: cleanPass,
      displayName: cleanName,
      plan: 'PRO_SHIELD',
      authProvider: 'password',
      guardianLinks: [],
      preferences: MOCK_USER.preferences,
      createdAt: Date.now(),
    };

    saveAccount(localUser);
    const appUser: User = {
      uid: localUser.uid,
      email: localUser.email,
      displayName: localUser.displayName,
      plan: localUser.plan,
      authProvider: localUser.authProvider,
      guardianLinks: localUser.guardianLinks,
      preferences: localUser.preferences,
      createdAt: localUser.createdAt,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
    return appUser;
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    await sendPasswordResetEmail(auth, email);
  },

  loginAsGuest: (): User => {
    throw new Error('Guest access is disabled. Please register or sign in with Google or GitHub.');
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
