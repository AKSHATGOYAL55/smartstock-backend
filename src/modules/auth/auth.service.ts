import bcrypt from 'bcrypt';
import { Tenant } from '../tenants/tenant.model';
import { User } from '../users/user.model';
import { AppError } from '../../common/utils/api-response';
import { signAccessToken, signRefreshToken } from '../../common/utils/jwt';
import { RegisterInput, LoginInput } from './auth.validators';

const SALT_ROUNDS = 10;

export async function registerCompany(input: RegisterInput) {
  const existingTenant = await Tenant.findOne({ subdomain: input.subdomain });
  if (existingTenant) {
    throw new AppError('SUBDOMAIN_TAKEN', 'This subdomain is already in use', 409);
  }

  const tenant = await Tenant.create({
    companyName: input.companyName,
    subdomain: input.subdomain,
  });

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    tenantId: tenant._id,
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'COMPANY_ADMIN', // whoever registers the company becomes its first admin
  });

  return issueTokens(user._id.toString(), tenant._id.toString(), user.role);
}

export async function login(input: LoginInput) {
  // .select('+passwordHash') is required here — remember, it's excluded by default
  const user = await User.findOne({ email: input.email, isDeleted: false }).select(
    '+passwordHash',
  );

  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('ACCOUNT_DISABLED', 'This account has been deactivated', 403);
  }

  return issueTokens(user._id.toString(), user.tenantId.toString(), user.role);
}

function issueTokens(userId: string, tenantId: string, role: string) {
  const accessToken = signAccessToken({ userId, tenantId, role });
  const refreshToken = signRefreshToken({ userId });
  return { accessToken, refreshToken };
}