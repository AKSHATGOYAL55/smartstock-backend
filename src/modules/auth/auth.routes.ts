import { Router } from 'express';
import * as authController from './auth.controller';
import { requireAuth } from '../../common/middleware/auth.guard';
import { requireRole} from '../../common/middleware/rbac.guard';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.me);

// Two middlewares stacked: requireAuth runs first (who are you?),
// then requireRole runs second (are you allowed?).
router.get(
  '/admin-only-check',
  requireAuth,
  requireRole('COMPANY_ADMIN'),
  authController.adminOnlyCheck,
);


export default router;