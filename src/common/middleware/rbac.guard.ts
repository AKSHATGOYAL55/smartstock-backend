import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/api-response';

export type Role =
  | 'COMPANY_ADMIN'
  | 'WAREHOUSE_MANAGER'
  | 'SALES_STAFF'
  | 'PURCHASE_STAFF'
  | 'ACCOUNTANT';

/**
 * A middleware FACTORY — it returns a middleware function configured
 * for whichever roles you pass in. This is why usage looks like
 * requireRole('COMPANY_ADMIN') rather than just requireRole.
 *
 * Must run AFTER requireAuth — it reads req.user, which requireAuth sets.
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      // Defensive check: this middleware is useless without requireAuth
      // running first. If this ever fires, it's a route-wiring bug,
      // not a real user's fault — hence 500, not 401/403.
      throw new AppError('MIDDLEWARE_ORDER_ERROR', 'requireRole used without requireAuth', 500);
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      throw new AppError(
        'FORBIDDEN',
        `This action requires one of these roles: ${allowedRoles.join(', ')}`,
        403,
      );
    }

    next();
  };
}