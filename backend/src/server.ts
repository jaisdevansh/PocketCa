import { buildApp } from './app';
import { appConfig } from './config/app.config';

async function startServer() {
  const app = await buildApp();

  try {
    await app.listen({ port: appConfig.PORT, host: appConfig.HOST });
    app.log.info(`🚀 [${appConfig.APP_NAME}] Server listening on http://${appConfig.HOST}:${appConfig.PORT}`);
    app.log.info(`📖 API Documentation available at http://${appConfig.HOST}:${appConfig.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown
  const signals = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, starting graceful shutdown...`);
      try {
        await app.close();
        app.log.info('Server successfully closed');
        process.exit(0);
      } catch (err) {
        app.log.error({ err }, 'Error during graceful shutdown');
        process.exit(1);
      }
    });
  }
}

startServer();
