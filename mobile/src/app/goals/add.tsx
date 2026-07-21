import {} from 'react-native-safe-area-context';
import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddGoal } from '@/features/goals/hooks/useGoals';
import { goalSchema, GoalFormData } from '@/features/goals/schemas';
import { PocketInput } from '@/shared/components/PocketInput';
import { PocketButton } from '@/shared/components/PocketButton';
import { Spacer } from '@/shared/components/Spacer';
import { TopBar } from '@/shared/components/TopBar';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

export default function AddGoalScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const { mutate: addGoal, isPending } = useAddGoal();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      targetAmount: 0 as any,
      targetDate: '',
      iconName: 'Target',
    },
  });

  const onSubmit = (data: any) => {
    addGoal(data as GoalFormData, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <TopBar title="Create Goal" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="targetAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <PocketInput
                label="Target Amount"
                placeholder="$0.00"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                error={errors.targetAmount?.message}
                style={styles.amountInput}
                textAlign="center"
              />
            )}
          />

          <Spacer size="md" />

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <PocketInput
                label="Goal Name"
                placeholder="e.g. Emergency Fund, New Car"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="targetDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <PocketInput
                label="Target Date (Optional)"
                placeholder="YYYY-MM-DD"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.targetDate?.message}
              />
            )}
          />

          <Spacer size="xl" />

          <PocketButton
            title="Create Goal"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={!isValid || isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1, paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl },
  form: { flex: 1 },
  amountInput: { fontSize: 40, fontWeight: 'bold', paddingVertical: spacing.xl },
});
