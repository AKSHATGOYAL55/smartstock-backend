import pino from 'pino';
import { env } from './env';

/**
 * Structured JSON logging instead of console.log. In production this
 * plugs straight into any log aggregator (Render's log stream, Sentry,
 * etc). In development, pino-pretty (dev dependency) makes it readable.
 */
export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
      : undefined,
});
