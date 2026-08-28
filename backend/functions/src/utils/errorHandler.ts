import { Response } from 'firebase-functions';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof AppError) {
    logger.warn(`Handled AppError: ${error.message}`, { details: error.details, statusCode: error.statusCode });
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      details: error.details,
    });
    return;
  }

  logger.error('Unhandled server error', error);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  });
};
