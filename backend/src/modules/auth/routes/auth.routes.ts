import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { sendOtpSchema, verifyOtpSchema, refreshTokenSchema, updateProfileSchema } from '../schemas/auth.schema';

export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);
  const authController = new AuthController(authService);

  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  typedFastify.post(
    '/send-otp',
    {
      schema: {
        body: sendOtpSchema,
        tags: ['Authentication'],
        summary: 'Send an OTP to the user phone number',
      },
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 hour'
        }
      }
    },
    authController.sendOtp
  );

  typedFastify.post(
    '/verify-otp',
    {
      schema: {
        body: verifyOtpSchema,
        tags: ['Authentication'],
        summary: 'Verify the OTP and return access token',
      },
    },
    authController.verifyOtp
  );

  typedFastify.post(
    '/refresh',
    {
      schema: {
        body: refreshTokenSchema,
        tags: ['Authentication'],
        summary: 'Refresh access token using refresh token from cookies',
      },
    },
    authController.refresh
  );

  typedFastify.post(
    '/logout',
    {
      preValidation: [fastify.authenticate], // Needs JWT to logout
      schema: {
        tags: ['Authentication'],
        summary: 'Logout current session and revoke refresh token',
        security: [{ bearerAuth: [] }],
      },
    },
    authController.logout
  );

  typedFastify.get(
    '/me',
    {
      preValidation: [fastify.authenticate],
      schema: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
      },
    },
    authController.me
  );

  typedFastify.patch(
    '/profile',
    {
      preValidation: [fastify.authenticate],
      schema: {
        body: updateProfileSchema,
        tags: ['Authentication'],
        summary: 'Update current user profile (first name, last name, username, profile image)',
        security: [{ bearerAuth: [] }],
      },
    },
    authController.updateProfile
  );
}
