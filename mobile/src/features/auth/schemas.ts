import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
