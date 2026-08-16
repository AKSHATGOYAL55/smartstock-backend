import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface AccessTokenPayload {
  userId: string;
  tenantId: string;
  role: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as any });
}

export function signRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as any });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
}