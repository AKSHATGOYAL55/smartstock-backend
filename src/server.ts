import { env } from './config/env';
import { logger } from './config/logger';
import { connectDB } from './config/db';
import { createApp } from './app';

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`SmartStock API listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown: stop accepting new connections, let in-flight
  // requests finish, then exit. Matters on platforms like Render that
  // send SIGTERM before restarting/redeploying a service.
  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
