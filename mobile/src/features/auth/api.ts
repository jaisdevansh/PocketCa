import { PhoneFormData, OtpFormData, LoginFormData } from './schemas';
import { apiClient } from '@/core/api/client';
import * as Device from 'expo-device';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
  token?: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  username: string;
  profileImage?: string; // base64 string
}

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', {
      ...data,
      deviceName: Device.modelName || 'Unknown Device',
      platform: Device.osName || 'Unknown Platform',
    });
    return response.data.data;
  },

  sendOtp: async (data: PhoneFormData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/send-otp', data);
    return response.data.data;
  },

  verifyOtp: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', {
      phone,
      otp,
      deviceName: Device.modelName || 'Unknown Device',
      platform: Device.osName || 'Unknown Platform',
    });
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<any> => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
