import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../common/utils/api-response';
import * as userService from './user.service';

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.listUsersInCurrentTenant();
    sendSuccess(res, { users });
  } catch (err) {
    next(err);
  }
}