import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PocketText } from '@/shared/components/PocketText';
import { PocketButton } from '@/shared/components/PocketButton';
import { PocketInput } from '@/shared/components/PocketInput';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/shared/components/TopBar';

export default function OtpScreen() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleVerify = () => {
    if (otp.length < 4) {
      setError('Please enter a valid 4-digit code.');
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthenticated(true);
      // Simulate backend setting user but without username to trigger setup
      useAppStore.getState().setUser({ id: '1', name: '', email: 'user@example.com' });
      // The _layout.tsx routing guard will automatically redirect to setup-profile
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <TopBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <PocketText variant="displaySmall" weight="bold">
            Verify it's you
          </PocketText>
          <PocketText variant="bodyLarge" color={c.textSecondary} style={styles.subtitle}>
            We've sent a 4-digit secure code to your device. 
            {"\n"}(Demo OTP: Just enter 1234)
          </PocketText>
        </View>

        <View style={styles.form}>
          <PocketInput
            label="Secure Code"
            placeholder="0000"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (error) setError(undefined);
            }}
            keyboardType="number-pad"
            maxLength={4}
            error={error}
            textAlign="center"
            inputStyle={styles.otpInput}
          />

          <PocketButton
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length < 4 || loading}
            style={styles.submitBtn}
          />

          <View style={styles.resendContainer}>
            <PocketText variant="bodyMedium" color={c.textSecondary}>
              Didn't receive the code?
            </PocketText>
            <PocketButton title="Resend Code" variant="ghost" size="sm" onPress={() => {}} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1, paddingHorizontal: spacing.xxl },
  header: { marginTop: spacing.md, marginBottom: spacing.xxxl },
  subtitle: { marginTop: spacing.sm },
  form: { flex: 1 },
  otpInput: { fontSize: 32, letterSpacing: 8, fontWeight: 'bold' },
  submitBtn: { marginTop: spacing.xl },
  resendContainer: { marginTop: spacing.xxxl, alignItems: 'center' },
});
