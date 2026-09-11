import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth.guard';
import { attachTenantContext } from '../../common/middleware/tenant-context.middleware';
import * as userController from './user.controller';

const router = Router();

router.get('/', requireAuth, attachTenantContext, userController.listUsers);

export default router;