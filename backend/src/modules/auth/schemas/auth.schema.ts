import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  deviceName: z.string().optional(),
  platform: z.string().optional(),
  browser: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export type SendOtpDto = z.infer<typeof sendOtpSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
