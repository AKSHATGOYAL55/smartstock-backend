import { AsyncLocalStorage } from 'node:async_hooks';

interface TenantContext {
  tenantId: string;
}

const tenantStorage = new AsyncLocalStorage<TenantContext>();

/** Runs `callback` with tenantId attached to this async execution context. */
export function runWithTenantContext<T>(context: TenantContext, callback: () => T): T {
  return tenantStorage.run(context, callback);
}

/** Reads the current tenantId, if any — used by the Mongoose plugin below. */
export function getTenantContext(): TenantContext | undefined {
  return tenantStorage.getStore();
}