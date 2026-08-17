import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/api-response';

/**
 * Verifies the JWT access token and attaches { userId, tenantId, role }
 * to req.user. Every downstream handler reads tenantId/role from HERE —
 * never from the request body or query params, which the client could
 * freely fake. This is what makes tenant isolation (FR-AUTH-05) actually
 * enforceable rather than just a rule we hope developers follow.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('UNAUTHORIZED', 'Missing or malformed Authorization header', 401);
  }

  const token = authHeader.slice(7); // strip "Bearer " prefix

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    // Covers both an invalid signature (tampered token) and an
    // expired token — the client's response to both is the same:
    // send them to get a new access token via /auth/refresh.
    throw new AppError('TOKEN_INVALID', 'Invalid or expired access token', 401);
  }
}