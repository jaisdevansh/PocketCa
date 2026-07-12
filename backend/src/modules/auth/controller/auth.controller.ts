import { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/cookie';
import { AuthService } from '../service/auth.service';
import { sendSuccess } from '../../../utils/response.util';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  sendOtp = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as any;
    const result = await this.authService.sendOtp(data, request);
    return sendSuccess(request, reply, result, 'OTP sent successfully', {}, 200);
  };

  verifyOtp = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as any;
    const result = await this.authService.verifyOtp(data, request);
    
    // Set HttpOnly secure cookie for the refresh token
    reply.setCookie('refreshToken', result.tokens.refreshToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 90 * 24 * 60 * 60, // 90 days
    });

    return sendSuccess(request, reply, {
      user: result.user,
      accessToken: result.tokens.accessToken,
      // For React Native clients, we also return the refresh token in the body
      // since React Native doesn't handle HttpOnly cookies automatically.
      refreshToken: result.tokens.refreshToken, 
    }, 'Login successful', {}, 200);
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as any;
    // Fallback to cookie if not in body
    const refreshToken = data.refreshToken || request.cookies.refreshToken;
    
    const result = await this.authService.refresh({ refreshToken }, request);
    
    // Rotate cookie
    reply.setCookie('refreshToken', result.refreshToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 90 * 24 * 60 * 60, // 90 days
    });

    return sendSuccess(request, reply, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }, 'Token refreshed successfully', {}, 200);
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;
    if (user?.sessionId) {
      await this.authService.logout(user.sessionId, request);
    }
    
    // Clear cookie
    reply.clearCookie('refreshToken', { path: '/' });
    
    return sendSuccess(request, reply, null, 'Logged out successfully', {}, 200);
  };

  me = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    return sendSuccess(request, reply, user, 'Current user profile', {}, 200);
  };
}
