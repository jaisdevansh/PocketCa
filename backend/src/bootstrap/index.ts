import { FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { securityPlugin } from '../plugins/security.plugin';
import { rateLimitPlugin } from '../plugins/rate-limit.plugin';
import { jwtPlugin } from '../plugins/jwt.plugin';
import { redisPlugin } from '../plugins/redis.plugin';
import { cloudinaryPlugin } from '../plugins/cloudinary.plugin';
import { swaggerPlugin } from '../plugins/swagger.plugin';
import { multipartPlugin } from '../plugins/multipart.plugin';
import { cookiePlugin } from '../plugins/cookie.plugin';

import { onRequestHook } from '../hooks/onRequest';
import { onResponseHook } from '../hooks/onResponse';
import { onErrorHook } from '../hooks/onError';

import { globalErrorHandler } from '../utils/global-error-handler';
import { appConfig } from '../config/app.config';

// Temporary route imports until dynamic registration is set up
import { healthRoutes } from '../modules/health/health.routes';
import authRoutes from '../modules/auth/routes/auth.routes';
import smsRoutes from '../modules/sms/routes/sms.routes';
import gmailRoutes from '../modules/gmail/routes/gmail.routes';
import transactionRoutes from '../modules/transactions/routes/transaction.routes';
import systemRoutes from '../modules/system/routes/system.routes';
import { nightlyScheduler } from '../scheduler/nightly.scheduler';

export async function bootstrap(app: FastifyInstance) {
  // 1. Set up Validation Compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // 2. Register Hooks
  app.addHook('onRequest', onRequestHook);
  app.addHook('onResponse', onResponseHook);
  app.addHook('onError', onErrorHook);

  // 3. Register Plugins (Order is important)
  await app.register(securityPlugin);
  await app.register(rateLimitPlugin);
  await app.register(jwtPlugin);
  await app.register(redisPlugin);
  await app.register(cloudinaryPlugin);
  await app.register(swaggerPlugin);
  await app.register(multipartPlugin);
  await app.register(cookiePlugin);

  // 4. Register Routes
  await app.register(healthRoutes, { prefix: `${appConfig.API_PREFIX}/health` });
  await app.register(authRoutes, { prefix: `${appConfig.API_PREFIX}/auth` });
  await app.register(smsRoutes, { prefix: `${appConfig.API_PREFIX}/sms` });
  await app.register(gmailRoutes, { prefix: `${appConfig.API_PREFIX}/gmail` });
  await app.register(transactionRoutes, { prefix: `${appConfig.API_PREFIX}/transactions` });
  await app.register(systemRoutes, { prefix: `${appConfig.API_PREFIX}/system` });

  // Init Schedulers
  await nightlyScheduler.init();

  // 5. Error Handler
  app.setErrorHandler(globalErrorHandler);
}
