import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  // Automatically redirect based on authentication state
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href={'/(tabs)' as any} />;
}
