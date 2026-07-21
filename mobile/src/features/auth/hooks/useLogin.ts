import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authApi } from '../api';
import { LoginFormData } from '../schemas';

import { useAuthStore } from '@/core/auth/authStore';

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: async (response) => {
      // Normal flow: Save token and user state
      if (response.accessToken && response.refreshToken) {
        await setAuth(response.accessToken, response.refreshToken, {
          id: response.user?.id,
          email: response.user?.email,
          name: `${response.user?.firstName || ''} ${response.user?.lastName || ''}`.trim(),
          username: response.user?.username,
          profileImage: response.user?.profileImage,
        });
      }
      
      // The router in _layout.tsx will automatically pick up authentication state changes
      // and redirect to /(tabs) or setup-profile.
    },
    onError: (error: Error) => {
      console.error('Login Error:', error.message);
      // Here we would typically show a Toast or Snackbar notification
    },
  });
};
