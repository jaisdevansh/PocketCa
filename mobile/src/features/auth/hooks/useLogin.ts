import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authApi } from '../api';
import { LoginFormData } from '../schemas';

import { useAppStore } from '@/store/useAppStore';
import * as SecureStore from 'expo-secure-store';

export const useLogin = () => {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const setUser = useAppStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: async (response) => {
      // Normal flow: Save token and navigate to main app or setup profile
      if (response.token) {
        await SecureStore.setItemAsync('pocketca_token', response.token);
      }
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim(),
        username: response.user.username,
        profileImage: response.user.profileImage,
      });
      
      setAuthenticated(true);
      // The router in _layout.tsx will automatically pick up authentication state changes
      // and redirect to /(tabs) or setup-profile.
    },
    onError: (error: Error) => {
      console.error('Login Error:', error.message);
      // Here we would typically show a Toast or Snackbar notification
    },
  });
};
