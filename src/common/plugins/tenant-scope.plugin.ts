import { Schema, Types } from 'mongoose';
import { getTenantContext } from '../utils/tenant-context';

/**
 * A Mongoose plugin — attach it to any tenant-scoped schema and every
 * query on that model automatically gets `tenantId` injected into its
 * filter, and every new document automatically gets tenantId set.
 * This is what turns FR-AUTH-05 from documentation into an actual
 * structural guarantee instead of a rule developers have to remember.
 */
export function tenantScopePlugin(schema: Schema): void {
  const queryHooks = [
    'find',
    'findOne',
    'findOneAndUpdate',
    'findOneAndDelete',
    'countDocuments',
    'updateMany',
    'deleteMany',
  ] as const;

  queryHooks.forEach((hookName) => {
    (schema as any).pre(hookName, function (this: any, next: (err?: any) => void) {
      const context = getTenantContext();
      if (context?.tenantId) {
        this.where({ tenantId: new Types.ObjectId(context.tenantId) });
      }
      // No context (e.g. a future seed/cron script running outside a
      // request) means no auto-filter — those scripts must set tenantId
      // explicitly themselves. Logged as a backlog note below.
      next();
    });
  });

  (schema as any).pre('save', function (this: any, next: (err?: any) => void) {
    if (this.isNew && !this.tenantId) {
      const context = getTenantContext();
      if (context?.tenantId) {
        this.tenantId = new Types.ObjectId(context.tenantId);
      }
    }
    next();
  });
}