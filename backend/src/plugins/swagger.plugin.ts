import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'PocketCA API',
        description: 'AI-powered personal financial operating system backend',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  const scalarPlugin = (await import('@scalar/fastify-api-reference')).default;
  await fastify.register(scalarPlugin, {
    routePrefix: '/docs',
    configuration: {
      spec: {
        content: () => fastify.swagger(),
      },
    },
  });
});
