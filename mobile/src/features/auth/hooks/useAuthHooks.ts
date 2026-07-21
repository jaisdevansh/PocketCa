import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api';
import { PhoneFormData } from '../schemas';
import { useAuthStore } from '@/core/auth/authStore';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: PhoneFormData) => authApi.sendOtp(data),
  });
};

export const useVerifyOtp = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { setAuthenticated, setUser } = require('@/store/useAppStore').useAppStore.getState();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => authApi.verifyOtp(phone, otp),
    onSuccess: async (data) => {
      await setAuth(data.accessToken, data.refreshToken, data.user);
      setAuthenticated(true);
      setUser(data.user);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await logout();
    },
    onError: async () => {
      // Even if API fails, clear local state
      await logout();
    }
  });
};
