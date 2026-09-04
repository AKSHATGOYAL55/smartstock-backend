import { User } from './user.model';

export async function listUsersInCurrentTenant() {
  // No tenantId filter written here on purpose — the plugin injects it.
  // If tenant scoping were broken, this would return EVERY tenant's users.
  return User.find({}).select('email firstName lastName role');
}