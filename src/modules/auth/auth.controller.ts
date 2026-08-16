import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.validators';
import * as authService from './auth.service';
import { sendSuccess } from '../../common/utils/api-response';
import { env } from '../../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true, // JavaScript on the frontend can never read this cookie — blocks XSS token theft
  secure: env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT_REFRESH_EXPIRY
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const { accessToken, refreshToken } = await authService.registerCompany(input);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken }, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const { accessToken, refreshToken } = await authService.login(input);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken });
  } catch (err) {
    next(err);
  }
}