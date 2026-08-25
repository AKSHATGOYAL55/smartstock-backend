import { Request, Response, NextFunction } from 'express';
import { runWithTenantContext } from '../utils/tenant-context';

/**
 * MUST run after requireAuth (needs req.user.tenantId to already exist).
 * Wraps the rest of this request's execution in the tenant context,
 * so every Mongoose query made anywhere during this request can find it.
 */
export function attachTenantContext(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(); // defensive — requireAuth should have already blocked this
  }
  runWithTenantContext({ tenantId: req.user.tenantId }, () => next());
}