import * as fbLogger from 'firebase-functions/logger';

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    fbLogger.info(`[AUDIO_GUARDIAN] ${message}`, meta || {});
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    fbLogger.warn(`[AUDIO_GUARDIAN_WARN] ${message}`, meta || {});
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    fbLogger.error(`[AUDIO_GUARDIAN_ERROR] ${message}`, {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      ...(meta || {}),
    });
  },
};
