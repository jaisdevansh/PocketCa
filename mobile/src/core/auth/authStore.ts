import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: any | null;
  setAuth: (accessToken: string, refreshToken: string, user: any) => Promise<void>;
  updateAccessToken: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  user: null,

  setAuth: async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    set({ accessToken, isAuthenticated: true, user });
  },

  updateAccessToken: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    set({ accessToken, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('refresh_token');
    set({ accessToken: null, isAuthenticated: false, user: null });
  },
}));
