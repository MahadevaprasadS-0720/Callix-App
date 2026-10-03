/**
 * Callix User Directory Service
 * Handles syncing user profiles to the crowdsourced Caller ID SQLite database
 * and querying community verified identities.
 */

export interface DirectoryUserRecord {
  id: number;
  phone_number: string;
  full_name: string;
  email?: string | null;
  reputation_score: number;
  is_verified: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface SyncProfilePayload {
  phoneNumber: string;
  fullName: string;
  email?: string;
  reputationScore?: number;
  isVerified?: boolean;
  token?: string;
}

export interface SyncProfileResponse {
  success: boolean;
  message?: string;
  user?: DirectoryUserRecord;
  error?: string;
}

export const userDirectoryService = {
  /**
   * Syncs user details into Callix Community User Directory
   */
  syncUserProfile: async (payload: SyncProfilePayload): Promise<SyncProfileResponse> => {
    const cleanPhone = payload.phoneNumber?.trim();
    const cleanName = payload.fullName?.trim();

    if (!cleanPhone) {
      return { success: false, error: 'Phone number is required' };
    }

    const body = JSON.stringify({
      phone_number: cleanPhone,
      full_name: cleanName || 'Callix User',
      email: payload.email || undefined,
      reputation_score: payload.reputationScore ?? 100,
      is_verified: payload.isVerified ?? true,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (payload.token) {
      headers['Authorization'] = `Bearer ${payload.token}`;
    }

    // 1. Attempt proxy route /api/users/sync-profile
    try {
      const res = await fetch('/api/users/sync-profile', {
        method: 'POST',
        headers,
        body,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: data.message || 'Profile synced with Callix Community Directory',
          user: data.user || data.data,
        };
      }
    } catch (err) {
      console.info('Vite proxy /api/users/sync-profile attempt note, trying direct backend port:', err);
    }

    // 2. Attempt direct backend port 5001
    try {
      const directRes = await fetch('http://127.0.0.1:5001/api/users/sync-profile', {
        method: 'POST',
        headers,
        body,
      });

      if (directRes.ok) {
        const data = await directRes.json();
        return {
          success: true,
          message: data.message || 'Profile synced with Callix Community Directory',
          user: data.user || data.data,
        };
      }
    } catch (err) {
      console.warn('Direct backend sync attempt note:', err);
    }

    return {
      success: false,
      error: 'Could not connect to Callix backend service to sync directory profile',
    };
  },

  /**
   * Fetches community directory listing
   */
  getCommunityUsers: async (limit = 20): Promise<DirectoryUserRecord[]> => {
    try {
      const res = await fetch(`/api/users/directory?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
    } catch {
      try {
        const directRes = await fetch(`http://127.0.0.1:5001/api/users/directory?limit=${limit}`);
        if (directRes.ok) {
          const data = await directRes.json();
          return data.users || [];
        }
      } catch {}
    }
    return [];
  },
};
