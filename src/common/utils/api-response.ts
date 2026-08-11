import { Response } from 'express';

/**
 * Every successful response in the API uses this exact shape.
 * See 06-Coding-Standards-Git-Workflow.md, section 3.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
  status = 200,
): Response {
  return res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}

/**
 * Custom error class carrying an HTTP status and a stable machine-readable
 * code, so the centralized error handler can format it consistently and
 * the frontend can branch on `error.code` instead of parsing messages.
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
