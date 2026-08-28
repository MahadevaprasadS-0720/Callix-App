import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GuardianLink } from '../types/user.types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginDemo: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addGuardian: (guardian: Omit<GuardianLink, 'guardianId' | 'createdAt'>) => void;
  removeGuardian: (guardianId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const loginDemo = () => {
    const u = authService.loginDemo();
    setUser(u);
  };

  const logout = () => {
    authService.logout();
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
    const updatedLinks = [...user.guardianLinks, newGuardian];
    updateProfile({ guardianLinks: updatedLinks });
  };

  const removeGuardian = (guardianId: string) => {
    if (!user) return;
    const updatedLinks = user.guardianLinks.filter((g: GuardianLink) => g.guardianId !== guardianId);
    updateProfile({ guardianLinks: updatedLinks });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
