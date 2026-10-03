import { User } from '../types/user.types';

/**
 * Callix Enterprise Security Policy:
 * The authorized Admin email is strictly loaded from the private .env file (VITE_ADMIN_HR_EMAIL).
 * It is NEVER hardcoded in code and never committed to Git.
 */
export const getAdminHrEmail = (): string => {
  const envEmail = (import.meta.env.VITE_ADMIN_HR_EMAIL as string | undefined) || '';
  return envEmail.trim().toLowerCase();
};

/**
 * Validates whether the given user has Super Admin HR Clearance.
 * Matches against the private environment variable.
 */
export const isHrAdminUser = (user: User | { email?: string | null } | null | undefined): boolean => {
  if (!user || !user.email) return false;
  const configuredAdminEmail = getAdminHrEmail();
  if (!configuredAdminEmail) return false;

  const normalizedUserEmail = user.email.trim().toLowerCase();
  return normalizedUserEmail === configuredAdminEmail;
};

export const getAdminTitle = (user: User | null | undefined): string => {
  if (isHrAdminUser(user)) {
    return 'Chief HR Officer & Telephony SecOps Director';
  }
  return user?.jobTitle || 'Standard Operator';
};

export const getAdminClearanceBadge = (user: User | null | undefined): {
  code: string;
  name: string;
  badgeClass: string;
} => {
  if (isHrAdminUser(user)) {
    return {
      code: 'LEVEL_5',
      name: 'Executive Level 5 (HR SuperAdmin)',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    };
  }
  return {
    code: 'LEVEL_1',
    name: 'Standard Operator',
    badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  };
};
