import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './common/middleware/error-handler';
import healthRoutes from './modules/health/health.routes';
import authRoutes from './modules/auth/auth.routes';

export function createApp(): Express {
  const app = express();

  // --- Security & parsing middleware (order matters here) ---
  app.use(helmet()); // sets security-related HTTP headers
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true, // required so the httpOnly refresh-token cookie is sent
    }),
  );
  app.use(express.json({ limit: '1mb' })); // reject absurdly large payloads early
  app.use(cookieParser());
  app.use(pinoHttp({ logger })); // structured request logging with correlation

  // General rate limiting — auth endpoints will get a stricter limiter
  // of their own once we build the auth module (NFR-SEC-04).
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // --- Routes ---
  // Health routes are unauthenticated and unversioned on purpose —
  // monitoring tools should never need to know about API versioning.
  app.use('/', healthRoutes);
  app.use('/api/v1/auth', authRoutes);

  // Future modules mount here, e.g.:
  // app.use('/api/v1/auth', authRoutes);
  // app.use('/api/v1/products', productRoutes);

  // --- Error handling (must be registered LAST) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
