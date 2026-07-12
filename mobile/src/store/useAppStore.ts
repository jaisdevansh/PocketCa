import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  profileImage?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: null | UserProfile;
  setAuthenticated: (status: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setUser: (user) => set({ user }),
  updateProfile: (data) => set((state) => ({ 
    user: state.user ? { ...state.user, ...data } : null 
  })),
}));
