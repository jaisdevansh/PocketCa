import React from 'react';
import { View, StyleSheet, SafeAreaView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { Transaction } from '@/features/transactions/schemas';
import { TransactionItem } from '@/shared/components/TransactionItem';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Icon } from '@/shared/components/Icon';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

export default function TransactionsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const { data: transactions, isLoading, isError, refetch } = useTransactions();

  const renderItem = React.useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem
      title={item.title}
      subtitle={`${item.category} • ${new Date(item.date).toLocaleDateString()}`}
      amount={item.amount}
      type={item.type}
      icon={<Icon name={item.iconName as any} size={20} color={c.textPrimary} />}
      onPress={() => console.log('Transaction clicked', item.id)}
    />
  ), [c]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.screenHeader, { borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="ChevronLeft" size={24} color={c.textPrimary} />
        </Pressable>
        <Pressable onPress={() => router.push('/transactions/add' as any)}>
          <Icon name="Plus" size={24} color={c.primary} />
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        {isLoading && <SkeletonLoader type="list" count={10} />}
        {isError && !isLoading && <ErrorState onRetry={refetch} />}
        {!isLoading && !isError && transactions?.length === 0 && (
          <EmptyState title="No Transactions" message="You haven't added any expenses or income yet." />
        )}
        {!isLoading && !isError && transactions && transactions.length > 0 && (
          <FlashList
            data={transactions}
            renderItem={renderItem}
            // @ts-ignore
            estimatedItemSize={80}
            ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: c.border }]} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  backBtn: { padding: spacing.sm },
  listContainer: { flex: 1, marginTop: spacing.sm },
  divider: { height: 1, marginLeft: spacing.colossal + spacing.md },
});
