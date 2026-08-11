import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/api-response';
import { logger } from '../../config/logger';

/**
 * Single place that turns any thrown error into the standard error
 * response shape. This is what lets every route handler just
 * `throw new AppError(...)` (or let a Zod parse failure bubble up)
 * without individually formatting a response.
 *
 * Must be registered LAST, after all routes — Express identifies
 * error-handling middleware by its 4-argument signature.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
   
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
    return;
  }

  // Anything unexpected: log the full error server-side, but never leak
  // internals (stack traces, DB error text) to the client.
  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
}
