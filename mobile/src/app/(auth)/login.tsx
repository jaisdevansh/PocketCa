import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PocketText } from '@/shared/components/PocketText';
import { PocketButton } from '@/shared/components/PocketButton';
import { PocketInput } from '@/shared/components/PocketInput';
import { TopBar } from '@/shared/components/TopBar';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { loginSchema, LoginFormData } from '@/features/auth/schemas';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useAppStore } from '@/store/useAppStore';

export default function LoginScreen() {
  const { mutate: login, isPending } = useLogin();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
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
            Enter your email and password to securely log in.
          </PocketText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ marginBottom: spacing.lg }}>
                <PocketText
                  variant="bodySmall"
                  weight="medium"
                  color={c.textSecondary}
                  style={{ marginBottom: spacing.xs, marginLeft: spacing.xs }}
                >
                  Email Address
                </PocketText>
                
                <PocketInput
                  label={undefined}
                  placeholder="e.g. dev@pocketca.com"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerStyle={{ marginBottom: 0 }}
                />
                
                {errors.email?.message && (
                  <PocketText variant="caption" color={colors.light.error} style={{ marginTop: spacing.xs, marginLeft: spacing.xs }}>
                    {errors.email.message}
                  </PocketText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ marginBottom: spacing.lg }}>
                <PocketText
                  variant="bodySmall"
                  weight="medium"
                  color={c.textSecondary}
                  style={{ marginBottom: spacing.xs, marginLeft: spacing.xs }}
                >
                  Password
                </PocketText>
                
                <PocketInput
                  label={undefined}
                  placeholder="••••••••"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoCapitalize="none"
                  containerStyle={{ marginBottom: 0 }}
                />
                
                {errors.password?.message && (
                  <PocketText variant="caption" color={colors.light.error} style={{ marginTop: spacing.xs, marginLeft: spacing.xs }}>
                    {errors.password.message}
                  </PocketText>
                )}
              </View>
            )}
          />

          <PocketButton
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={!isValid || isPending}
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
            style={[styles.googleBtn, { borderColor: c.border, backgroundColor: c.surface }]} 
            onPress={() => {
              // Simulate Google Login fetching data
              useAppStore.getState().setUser({
                id: 'google_123',
                name: 'Devan (Google)',
                email: 'devan@gmail.com',
                username: 'devan_google', // Auto-generated unique username
                profileImage: 'https://randomuser.me/api/portraits/men/44.jpg'
              });
              useAppStore.getState().setAuthenticated(true);
              // _layout.tsx will automatically route to /(tabs) since username exists
            }}
          >
            {/* A simple placeholder for Google's G logo for a clean modern look */}
            <View style={styles.googleIconPlaceholder}>
              <PocketText variant="title" weight="bold" color="#4285F4">G</PocketText>
            </View>
            <PocketText variant="title" weight="semiBold" color={c.textPrimary}>
              Google
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
