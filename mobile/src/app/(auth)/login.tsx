import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import { PocketText } from '@/shared/components/PocketText';
import { PocketButton } from '@/shared/components/PocketButton';
import { PocketInput } from '@/shared/components/PocketInput';
import { TopBar } from '@/shared/components/TopBar';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { radius } from '@/core/theme/radius';
import { phoneSchema, PhoneFormData } from '@/features/auth/schemas';
import { useSendOtp } from '@/features/auth/hooks/useAuthHooks';
import { useAppStore } from '@/store/useAppStore';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '5734668613-e7cdsi0hm1e9mf1pbpmuitl9qqt04e7s.apps.googleusercontent.com',
    androidClientId: '5734668613-e7cdsi0hm1e9mf1pbpmuitl9qqt04e7s.apps.googleusercontent.com',
    iosClientId: '5734668613-e7cdsi0hm1e9mf1pbpmuitl9qqt04e7s.apps.googleusercontent.com',
  });

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === 'error' || response?.type === 'dismiss') {
      setIsGoogleLoading(false);
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await userInfoResponse.json();
      
      const { useAuthStore } = require('@/core/auth/authStore');
      await useAuthStore.getState().setAuth(
        token, // accessToken
        'mock_google_refresh_token', // refreshToken
        {
          id: userInfo.id || 'google_user',
          name: userInfo.name || 'Google User',
          firstName: userInfo.given_name || '',
          lastName: userInfo.family_name || '',
          email: userInfo.email || 'user@gmail.com',
          username: `google_${userInfo.id || Math.random()}`,
          profileImage: userInfo.picture || 'https://randomuser.me/api/portraits/lego/1.jpg',
        }
      );
    } catch (error) {
      console.error('Failed to fetch user info', error);
      setIsGoogleLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    mode: 'onChange',
    defaultValues: { phone: '' },
  });

  const onSubmit = (data: PhoneFormData) => {
    sendOtp(data, {
      onSuccess: () => {
        router.push({ pathname: '/otp', params: { phone: data.phone } });
      },
      onError: (err) => {
        console.error('Failed to send OTP:', err);
      }
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
            Welcome back
          </PocketText>
          <PocketText variant="bodyLarge" color={c.textSecondary} style={styles.subtitle}>
            Enter your phone number to securely log in.
          </PocketText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ marginBottom: spacing.lg }}>
                <PocketText
                  variant="bodySmall"
                  weight="medium"
                  color={c.textSecondary}
                  style={{ marginBottom: spacing.xs, marginLeft: spacing.xs }}
                >
                  Phone Number
                </PocketText>
                
                <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                  {/* Flag Box */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: c.border,
                    backgroundColor: c.surfaceVariant,
                    borderRadius: radius.md,
                    paddingHorizontal: spacing.md,
                    marginRight: spacing.sm,
                  }}>
                    <PocketText style={{ fontSize: 18, marginRight: 6 }}>🇮🇳</PocketText>
                    <PocketText variant="bodyLarge" weight="medium" color={c.textPrimary}>+91</PocketText>
                  </View>
                  
                  {/* Input Box */}
                  <PocketInput
                    label={undefined}
                    placeholder="e.g. 9876543210"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    containerStyle={{ marginBottom: 0, flex: 1 }}
                  />
                </View>
                
                {errors.phone?.message && (
                  <PocketText variant="caption" color={colors.light.error} style={{ marginTop: spacing.xs, marginLeft: spacing.xs }}>
                    {errors.phone.message}
                  </PocketText>
                )}
              </View>
            )}
          />

          <PocketButton
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            loading={isSendingOtp}
            disabled={!isValid || isSendingOtp}
            style={styles.submitBtn}
          />

          <View style={styles.separatorContainer}>
            <View style={[styles.separator, { backgroundColor: c.border }]} />
            <PocketText variant="bodySmall" color={c.mutedText} style={styles.separatorText}>
              or continue with
            </PocketText>
            <View style={[styles.separator, { backgroundColor: c.border }]} />
          </View>

          <Pressable 
            style={[styles.googleBtn, { borderColor: c.border, backgroundColor: c.surface, opacity: (!request || isGoogleLoading) ? 0.7 : 1 }]} 
            disabled={!request || isGoogleLoading}
            onPress={() => {
              setIsGoogleLoading(true);
              promptAsync();
            }}
          >
            {/* A simple placeholder for Google's G logo for a clean modern look */}
            <View style={styles.googleIconPlaceholder}>
              <PocketText variant="title" weight="bold" color="#4285F4">G</PocketText>
            </View>
            <PocketText variant="title" weight="semiBold" color={c.textPrimary}>
              {isGoogleLoading ? 'Signing in...' : 'Google'}
            </PocketText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  header: {
    marginTop: spacing.colossal,
    marginBottom: spacing.xxxl,
  },
  subtitle: { marginTop: spacing.sm },
  form: { flex: 1 },
  submitBtn: { marginTop: spacing.xl },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxxl,
  },
  separator: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    paddingHorizontal: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  googleIconPlaceholder: {
    marginRight: spacing.md,
  },
});
