import { FastifyInstance, FastifyRequest } from 'fastify';
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto, UpdateProfileDto } from '../schemas/auth.schema';
import { userRepository } from '../repository/user.repository';
import { sessionRepository } from '../repository/session.repository';
import { tokenRepository } from '../repository/token.repository';
import { TokenUtil } from '../../../utils/security/token.util';
import { JwtUtil } from '../../../utils/security/jwt.util';
import { DeviceUtil } from '../../../utils/security/device.util';
import { AuditService } from '../../system/service/audit.service';
import { withTransaction } from '../../../database/connection/transaction';
import { AppError } from '../../../utils/custom-exceptions';
import { cacheService } from '../../../cache/cache.service';
import { appConfig } from '../../../config/app.config';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

interface OtpData {
  hash: string;
  attempts: number;
}

export class AuthService {
  constructor(private readonly fastify: FastifyInstance) {}

  async sendOtp(data: SendOtpDto, request: FastifyRequest) {
    const { phone } = data;
    
    // DEMO BYPASS
    if (appConfig.DEMO_PHONES && appConfig.DEMO_PHONES.includes(phone)) {
      console.log(`[SMS MOCK] Bypass send for DEMO_PHONE ${phone}`);
      return { message: 'OTP sent successfully' };
    }
    
    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
    const otpHash = TokenUtil.hashToken(otp);
    
    const cacheKey = `otp:${phone}`;
    const existingData = await cacheService.get<OtpData>(cacheKey);

    if (existingData && existingData.attempts >= 5) {
      throw new AppError('Too many attempts. Please try again later.', 429, 'TOO_MANY_ATTEMPTS');
    }

    const attempts = existingData ? existingData.attempts : 0;

    await cacheService.set(cacheKey, { hash: otpHash, attempts }, 5 * 60); // 5 minutes TTL

    // In a real application, send this via SMS provider (Twilio, SNS, etc.)
    // We mock this by printing to console
    console.log(`[SMS MOCK] Sending OTP ${otp} to phone ${phone}`);

    // Log the request
    await AuditService.logSecurityEvent(null as any, {
      userId: undefined,
      eventType: 'OTP_REQUESTED',
      metadata: { phone, ipAddress: request.ip },
      request,
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(data: VerifyOtpDto, request: FastifyRequest) {
    const { phone, otp } = data;
    
    // DEMO BYPASS
    const isDemoBypass = appConfig.DEMO_PHONES && appConfig.DEMO_PHONES.includes(phone) && otp === appConfig.DEMO_OTP;
    
    if (!isDemoBypass) {
      const cacheKey = `otp:${phone}`;
      
      const otpData = await cacheService.get<OtpData>(cacheKey);

      if (!otpData) {
        throw new AppError('OTP expired or invalid', 400, 'INVALID_OTP');
      }

      if (otpData.attempts >= 5) {
        throw new AppError('Too many attempts. Please try again later.', 429, 'TOO_MANY_ATTEMPTS');
      }

      const inputHash = TokenUtil.hashToken(otp);

      if (inputHash !== otpData.hash) {
        // Increment attempts
        await cacheService.set(cacheKey, { ...otpData, attempts: otpData.attempts + 1 }, 5 * 60);
        throw new AppError('Invalid OTP', 400, 'INVALID_OTP');
      }

      // OTP is valid. Delete it.
      await cacheService.del(cacheKey);
    }

    // Create or find user
    return await withTransaction(async (tx) => {
      let user = await userRepository.findByPhone(phone, tx);

      if (!user) {
        user = await userRepository.create({
          phone,
          status: 'ACTIVE',
          phoneVerified: true,
        }, tx);

        await AuditService.logAction(tx, {
          userId: user.id,
          action: 'USER_REGISTERED_PHONE',
          entityType: 'USER',
          entityId: user.id,
          request,
        });
      }

      if (user.status !== 'ACTIVE' && user.status !== 'PENDING') {
        throw new AppError('Account is locked or suspended', 403, 'ACCOUNT_LOCKED');
      }

      // Manage device tracking
      const fingerprint = DeviceUtil.generateFingerprint(request);
      let device = await sessionRepository.findDeviceByFingerprint(fingerprint, tx);
      
      if (!device) {
        device = await sessionRepository.createDevice({
          userId: user.id,
          deviceFingerprint: fingerprint,
          platform: data.platform || request.headers['sec-ch-ua-platform'] as string || 'unknown',
          manufacturer: request.headers['user-agent'] as string || 'unknown',
          deviceName: data.deviceName,
          lastLogin: new Date(),
        }, tx);
      }

      const sessionId = crypto.randomUUID();
      const accessTokenId = crypto.randomUUID();
      const rawRefreshToken = TokenUtil.generateRandomToken(64);
      const refreshTokenHash = TokenUtil.hashToken(rawRefreshToken);

      const payload = {
        userId: user.id,
        sessionId,
        deviceId: device.id,
        role: 'USER',
        permissions: [],
        tokenVersion: 1,
      };

      const accessToken = JwtUtil.generateAccessToken(this.fastify, payload);

      const refreshExpiry = new Date();
      refreshExpiry.setDate(refreshExpiry.getDate() + 90); // 90 days as per prompt

      // Store refresh token
      await tokenRepository.storeRefreshToken({
        userId: user.id,
        tokenHash: refreshTokenHash,
        deviceId: device.id,
        deviceName: data.deviceName,
        browser: data.browser || request.headers['user-agent'] as string,
        platform: data.platform,
        ipAddress: request.ip,
        expiresAt: refreshExpiry,
      }, tx);

      // Store session
      await sessionRepository.createSession({
        id: sessionId,
        userId: user.id,
        deviceId: device.id,
        accessTokenId,
        refreshTokenId: refreshTokenHash,
        expiresAt: refreshExpiry,
        ipAddress: request.ip,
        browser: data.browser || request.headers['user-agent'] as string,
      }, tx);

      await userRepository.updateLastLogin(user.id, tx);

      return {
        user: { id: user.id, phone: user.phone },
        tokens: {
          accessToken,
          refreshToken: rawRefreshToken,
        }
      };
    });
  }

  async logout(sessionId: string, request: FastifyRequest) {
    await sessionRepository.revokeSession(sessionId);
    // In a real app we might also fetch session and revoke its specific refresh token
  }

  async refresh(data: RefreshTokenDto, request: FastifyRequest) {
    const rawToken = data.refreshToken;
    if (!rawToken) {
        throw new AppError('Refresh token is required', 400, 'MISSING_TOKEN');
    }
    
    const tokenHash = TokenUtil.hashToken(rawToken);

    return await withTransaction(async (tx) => {
      const storedToken = await tokenRepository.findRefreshToken(tokenHash, tx);
      
      if (!storedToken) {
        throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
      }

      if (storedToken.revoked) {
        // TOKEN REUSE DETECTED! Revoke all sessions for security
        await tokenRepository.revokeAllUserRefreshTokens(storedToken.userId, tx);
        await sessionRepository.revokeAllUserSessions(storedToken.userId, tx);
        await AuditService.logSecurityEvent(tx, {
          userId: storedToken.userId,
          eventType: 'TOKEN_REUSE_DETECTED',
          metadata: { ipAddress: request.ip },
        });
        throw new AppError('Security violation. All sessions revoked.', 401, 'SECURITY_VIOLATION');
      }

      if (new Date() > storedToken.expiresAt!) {
        throw new AppError('Refresh token expired', 401, 'TOKEN_EXPIRED');
      }

      // Invalidate the old token
      await tokenRepository.revokeRefreshToken(tokenHash, tx);

      // Generate new token pair
      const fingerprint = DeviceUtil.generateFingerprint(request);
      let device = await sessionRepository.findDeviceByFingerprint(fingerprint, tx);
      
      if (!device) {
        device = await sessionRepository.createDevice({
          userId: storedToken.userId,
          deviceFingerprint: fingerprint,
          platform: request.headers['sec-ch-ua-platform'] as string || 'unknown',
          manufacturer: request.headers['user-agent'] as string || 'unknown',
        }, tx);
      }

      const sessionId = crypto.randomUUID();
      const accessTokenId = crypto.randomUUID();
      const newRawRefreshToken = TokenUtil.generateRandomToken(64);
      const newRefreshTokenHash = TokenUtil.hashToken(newRawRefreshToken);

      const payload = {
        userId: storedToken.userId,
        sessionId,
        deviceId: device.id,
        role: 'USER',
        permissions: [],
        tokenVersion: 1,
      };

      const accessToken = JwtUtil.generateAccessToken(this.fastify, payload);

      const refreshExpiry = new Date();
      refreshExpiry.setDate(refreshExpiry.getDate() + 90);

      await tokenRepository.storeRefreshToken({
        userId: storedToken.userId,
        tokenHash: newRefreshTokenHash,
        deviceId: device.id,
        deviceName: storedToken.deviceName,
        browser: request.headers['user-agent'] as string,
        platform: storedToken.platform,
        ipAddress: request.ip,
        expiresAt: refreshExpiry,
      }, tx);

      await sessionRepository.createSession({
        id: sessionId,
        userId: storedToken.userId,
        deviceId: device.id,
        accessTokenId,
        refreshTokenId: newRefreshTokenHash,
        expiresAt: refreshExpiry,
        ipAddress: request.ip,
        browser: request.headers['user-agent'] as string,
      }, tx);

      return {
        accessToken,
        refreshToken: newRawRefreshToken,
      };
    });
  }

  async updateProfile(data: UpdateProfileDto, request: FastifyRequest) {
    const user = request.user as any;
    if (!user || !user.userId) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    let profileImageUrl = data.profileImage;

    // If profileImage is a base64 string, upload to Cloudinary
    if (profileImageUrl && profileImageUrl.startsWith('data:image')) {
      try {
        const result = await cloudinary.uploader.upload(profileImageUrl, {
          folder: 'pocketca/profiles',
          transformation: [{ width: 500, height: 500, crop: 'fill' }]
        });
        profileImageUrl = result.secure_url;
      } catch (err) {
        request.log.error(err, 'Failed to upload profile image to Cloudinary');
        throw new AppError('Failed to upload image', 500, 'UPLOAD_FAILED');
      }
    }

    const updatedUser = await userRepository.updateUser(user.userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      profileImage: profileImageUrl,
    });

    return updatedUser;
  }
}
