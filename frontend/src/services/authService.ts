import { User } from '../types/user.types';
import { MOCK_USER } from './mockDataService';

const USER_STORAGE_KEY = 'audio_guardian_current_user';

export const authService = {
  getCurrentUser: (): User => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USER));
    return MOCK_USER;
  },

  updateCurrentUser: (updates: Partial<User>): User => {
    const current = authService.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  logout: (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  loginDemo: (): User => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USER));
    return MOCK_USER;
  }
};
