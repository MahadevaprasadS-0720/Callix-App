import * as functions from 'firebase-functions';

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    functions.logger.info(`[AUDIO_GUARDIAN] ${message}`, meta || {});
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    functions.logger.warn(`[AUDIO_GUARDIAN_WARN] ${message}`, meta || {});
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    functions.logger.error(`[AUDIO_GUARDIAN_ERROR] ${message}`, {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      ...(meta || {}),
    });
  },
};
