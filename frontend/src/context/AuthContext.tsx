import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { User, GuardianLink } from '../types/user.types';
import { authService } from '../services/authService';
import { MOCK_USER } from '../services/mockDataService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  loginAsGuest: () => void;
  loginDemo: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  addGuardian: (guardian: Omit<GuardianLink, 'guardianId' | 'createdAt'>) => void;
  removeGuardian: (guardianId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
    } finally {
      setLoading(false);
    }

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const existing = authService.getCurrentUser();

          // Extract photoURL from fbUser or providerData
          let photo = fbUser.photoURL || undefined;
          if (!photo && fbUser.providerData) {
            for (const p of fbUser.providerData) {
              if (p?.photoURL) {
                photo = p.photoURL;
                break;
              }
            }
          }
          if (!photo && existing?.photoURL) {
            photo = existing.photoURL;
          }
          if (photo && photo.includes('googleusercontent.com')) {
            photo = photo.replace(/=s\d+(-c)?$/, '=s256-c');
          }

          const googleName = fbUser.displayName || 
                             fbUser.providerData?.[0]?.displayName || 
                             existing?.displayName || 
                             fbUser.email?.split('@')[0] || 
                             'Callix User';

          const syncedUser: User = {
            uid: fbUser.uid,
            email: fbUser.email || existing?.email || 'user@callix.ai',
            displayName: googleName,
            photoURL: photo,
            plan: existing?.plan || 'PRO_SHIELD',
            authProvider: (fbUser.providerData[0]?.providerId.includes('github') ? 'github' : fbUser.providerData[0]?.providerId.includes('google') ? 'google' : 'password'),
            guardianLinks: existing?.guardianLinks || MOCK_USER.guardianLinks,
            preferences: existing?.preferences || MOCK_USER.preferences,
            createdAt: existing?.createdAt || Date.now(),
          };
          setUser(syncedUser);
          localStorage.setItem('audio_guardian_current_user', JSON.stringify(syncedUser));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const u = await authService.loginWithGoogle();
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setLoading(true);
    try {
      const u = await authService.loginWithGithub();
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await authService.loginWithEmail(email, pass);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    try {
      const u = await authService.registerWithEmail(email, pass, displayName);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    // Guest access disabled - users must register or sign in via Google/GitHub/Email
  };

  const loginDemo = () => {
    const u = authService.loginDemo();
    setUser(u);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = authService.updateCurrentUser(updates);
    setUser(updated);
  };

  const addGuardian = (guardianData: Omit<GuardianLink, 'guardianId' | 'createdAt'>) => {
    if (!user) return;
    const newGuardian: GuardianLink = {
      ...guardianData,
      guardianId: `guard_${Date.now()}`,
      createdAt: Date.now(),
    };
    const updatedLinks = [...(user.guardianLinks || []), newGuardian];
    updateProfile({ guardianLinks: updatedLinks });
  };

  const removeGuardian = (guardianId: string) => {
    if (!user) return;
    const updatedLinks = (user.guardianLinks || []).filter((g: GuardianLink) => g.guardianId !== guardianId);
    updateProfile({ guardianLinks: updatedLinks });
  };

  const sendPasswordReset = async (email: string) => {
    await authService.sendPasswordReset(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithGithub,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        loginAsGuest,
        loginDemo,
        logout,
        updateProfile,
        addGuardian,
        removeGuardian,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType;
};
