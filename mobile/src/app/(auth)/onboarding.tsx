import {} from 'react-native-safe-area-context';
import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { PocketText } from '@/shared/components/PocketText';
import { PocketButton } from '@/shared/components/PocketButton';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.content}>
        {/* Hero illustration placeholder */}
        <View style={[styles.illustrationPlaceholder, { backgroundColor: c.surfaceVariant }]}>
          <PocketText variant="heading3" color={c.primary}>
            💰
          </PocketText>
          <PocketText variant="bodyLarge" color={c.primary} align="center">
            PocketCA
          </PocketText>
        </View>

        <View style={styles.textContainer}>
          <PocketText variant="displaySmall" weight="bold" align="center" style={styles.title}>
            Your AI Financial Partner
          </PocketText>
          <PocketText variant="bodyLarge" color={c.textSecondary} align="center">
            Make financial management effortless. We guide you through every decision, reducing anxiety and building confidence.
          </PocketText>
        </View>
      </View>

      <View style={styles.footer}>
        <PocketButton
          title="Get Started"
          onPress={() => router.push('/(auth)/login')}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.massive,
    gap: spacing.sm,
  },
  textContainer: { alignItems: 'center', gap: spacing.md },
  title: { marginBottom: spacing.sm },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.lg,
  },
});
