import Fastify from 'fastify';
import { loggerConfig } from './config/logger.config';
import { bootstrap } from './bootstrap';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: loggerConfig.LOG_LEVEL,
      // Pino configurations can be added here (e.g. redaction)
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    },
  });

  await bootstrap(app);

  return app;
}
