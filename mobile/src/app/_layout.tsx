import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { GlobalErrorBoundary } from '@/shared/components/GlobalErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !rootNavigationState?.key) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    const hasUsername = !!useAppStore.getState().user?.username;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/onboarding' as any);
    } else if (isAuthenticated) {
      if (!hasUsername && segments.join('/') !== '(auth)/setup-profile') {
        // Go to setup profile if no username
        router.replace('/(auth)/setup-profile' as any);
      } else if (hasUsername && inAuthGroup) {
        // Go to tabs if fully set up
        router.replace('/(tabs)' as any);
      }
    }
  }, [isAuthenticated, segments, isMounted, rootNavigationState?.key, useAppStore.getState().user?.username]);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Slot />
          <AnimatedSplashOverlay />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
