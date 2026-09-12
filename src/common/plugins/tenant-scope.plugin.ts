import { Schema, Types } from 'mongoose';
import { getTenantContext } from '../utils/tenant-context';

/**
 * A Mongoose plugin — attach it to any tenant-scoped schema and every
 * query on that model automatically gets `tenantId` injected into its
 * filter, and every new document automatically gets tenantId set.
 *
 * Note: these hooks take NO callback parameter. Our logic is fully
 * synchronous, so we use Mongoose's plain-function style — it simply
 * continues once the function returns. Mixing this with a `next`
 * parameter is what caused the earlier "next is not a function" bug.
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
    schema.pre(hookName, function (this: any) {
      const context = getTenantContext();
      if (context?.tenantId) {
        this.where({ tenantId: new Types.ObjectId(context.tenantId) });
      }
    });
  });

  schema.pre('save', function (this: any) {
    if (this.isNew && !this.tenantId) {
      const context = getTenantContext();
      if (context?.tenantId) {
        this.tenantId = new Types.ObjectId(context.tenantId);
      }
    }
  });
}