import { PhoneFormData, OtpFormData } from './schemas';
import { apiClient } from '@/core/api/client';
import * as Device from 'expo-device';

export const authApi = {
  sendOtp: async (data: PhoneFormData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/send-otp', data);
    return response.data.data;
  },

  verifyOtp: async (phone: string, otp: string): Promise<{ accessToken: string; refreshToken: string; user: any }> => {
    const response = await apiClient.post('/auth/verify-otp', {
      phone,
      otp,
      deviceName: Device.modelName || 'Unknown Device',
      platform: Device.osName || 'Unknown Platform',
    });
    return response.data.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
