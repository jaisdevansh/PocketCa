import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useGoals } from '@/features/goals/hooks/useGoals';
import { Goal } from '@/features/goals/schemas';
import { GoalCard } from '@/shared/components/GoalCard';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Icon } from '@/shared/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PocketText } from '@/shared/components/PocketText';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

export default function GoalsScreen() {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { data: goals, isLoading, isError, refetch } = useGoals();
  const insets = useSafeAreaInsets();

  const renderItem = React.useCallback(({ item }: { item: Goal }) => (
    <GoalCard
      title={item.title}
      currentAmount={item.currentAmount}
      targetAmount={item.targetAmount}
      iconName={item.iconName}
      onPress={() => console.log('View goal details', item.id)}
    />
  ), []);

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.screenHeader, { borderBottomColor: c.borderHairline }]}>
        <PocketText variant="sectionHeader" weight="semiBold" color={c.textPrimary}>Savings Goals</PocketText>
        <Pressable onPress={() => router.push('/goals/add')} style={styles.addBtn}>
          <Icon name="Plus" size={24} color={c.accent} />
        </Pressable>
      </View>

      <Animated.View entering={FadeInUp.delay(0).duration(200)} style={styles.listContainer}>
        {isLoading && (
          <View style={{ paddingHorizontal: spacing.xl }}>
            <SkeletonLoader type="card" count={3} />
          </View>
        )}

        {isError && !isLoading && <ErrorState onRetry={refetch} />}

        {!isLoading && !isError && goals?.length === 0 && (
          <EmptyState
            title="No Goals Yet"
            message="Create a savings goal to start tracking your progress."
          />
        )}

        {!isLoading && !isError && goals && goals.length > 0 && (
          <FlashList
            data={goals}
            renderItem={renderItem}
            // @ts-ignore
            estimatedItemSize={140}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
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
  addBtn: { padding: spacing.sm },
  listContainer: { flex: 1, marginTop: spacing.md },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
});
