import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { PocketText } from '@/shared/components/PocketText';
import { PocketButton } from '@/shared/components/PocketButton';
import { PocketInput } from '@/shared/components/PocketInput';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useVerifyOtp } from '@/features/auth/hooks/useAuthHooks';
import { TopBar } from '@/shared/components/TopBar';

export default function OtpScreen() {
  const params = useLocalSearchParams();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone || '';
  
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>();

  const handleVerify = () => {
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    setError(undefined);
    
    verifyOtp({ phone, otp }, {
      onError: (err) => {
        setError(err.message || 'Verification failed. Please try again.');
      }
      // On success, useVerifyOtp sets the auth state, which will automatically redirect via _layout.tsx
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <TopBar showBack={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <PocketText variant="displaySmall" weight="bold">
            Verify it's you
          </PocketText>
          <PocketText variant="bodyLarge" color={c.textSecondary} style={styles.subtitle}>
            We've sent a 6-digit secure code to {phone ? phone : 'your device'}. 
          </PocketText>
        </View>

        <View style={styles.form}>
          <PocketInput
            label="Secure Code"
            placeholder="000000"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (error) setError(undefined);
            }}
            keyboardType="number-pad"
            maxLength={6}
            error={error}
            textAlign="center"
            inputStyle={styles.otpInput}
          />

          <PocketButton
            title="Verify & Continue"
            onPress={handleVerify}
            loading={isPending}
            disabled={otp.length < 6 || isPending}
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
