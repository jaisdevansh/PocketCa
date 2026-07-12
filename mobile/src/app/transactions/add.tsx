import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddTransaction } from '@/features/transactions/hooks/useTransactions';
import { transactionSchema, TransactionFormData } from '@/features/transactions/schemas';
import { PocketInput } from '@/shared/components/PocketInput';
import { PocketButton } from '@/shared/components/PocketButton';
import { Spacer } from '@/shared/components/Spacer';
import { TopBar } from '@/shared/components/TopBar';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

export default function AddTransactionScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as any,
    mode: 'onChange',
    defaultValues: {
      amount: 0 as any,
      title: '',
      category: '',
      type: 'expense',
    },
  });

  const onSubmit = (data: any) => {
    addTransaction(data as TransactionFormData, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <TopBar title="Add Transaction" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <PocketInput
                label="Amount"
                placeholder="$0.00"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                error={errors.amount?.message}
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
                label="Title / Merchant"
                placeholder="e.g. Uber, Starbucks"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <PocketInput
                label="Category"
                placeholder="e.g. Transport, Food"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.category?.message}
              />
            )}
          />

          <Spacer size="xl" />

          <PocketButton
            title="Save Transaction"
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
