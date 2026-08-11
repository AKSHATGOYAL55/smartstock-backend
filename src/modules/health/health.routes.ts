import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../../common/utils/api-response';

const router = Router();

/**
 * Liveness check: "is the process running at all?"
 * Used by uptime monitors / load balancers to know the app hasn't crashed.
 */
router.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', uptime: process.uptime() });
});

/**
 * Readiness check: "is the app actually able to serve real requests?"
 * Distinguishing this from /health matters once you have background
 * jobs or dependencies — a process can be "alive" but not "ready"
 * (e.g. still connecting to MongoDB).
 */
router.get('/health/ready', (_req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  const isReady = dbState === 1;

  sendSuccess(
    res,
    { status: isReady ? 'ready' : 'not_ready', db: dbState === 1 ? 'connected' : 'disconnected' },
    undefined,
    isReady ? 200 : 503,
  );
});

export default router;
