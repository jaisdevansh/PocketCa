import React from 'react';
import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PocketText } from '@/shared/components/PocketText';
import { TrendExplanationCard } from '@/shared/components/TrendExplanationCard';
import { MiniBarChart } from '@/shared/components/MiniBarChart';
import { BudgetCard } from '@/shared/components/BudgetCard';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { Spacer } from '@/shared/components/Spacer';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius } from '@/core/theme/radius';
import { useBudgets } from '@/features/budgets/hooks/useBudgets';

export default function InsightsScreen() {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();

  const weeklySpending = [120, 210, 80, 320, 150, 400, 200];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInUp.delay(0).duration(200)}>
          <PocketText variant="sectionHeader" weight="semiBold" color={c.textPrimary} style={{ marginBottom: spacing.lg }}>
            Spending Insights
          </PocketText>
          <TrendExplanationCard
            title="Weekly Spending Spike"
            explanation="Your spending on Thursday and Saturday spiked primarily due to dining out and entertainment."
            suggestion="Try packing lunch twice next week to keep your food budget on track."
            trend="up"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(40).duration(200)} style={[styles.chartCard, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
          <PocketText variant="cardTitle" weight="semiBold" color={c.textPrimary} style={{ marginBottom: spacing.md }}>
            This Week
          </PocketText>
          <MiniBarChart data={weeklySpending} labels={days} />
        </Animated.View>

        <Spacer size="colossal" />

        <Animated.View entering={FadeInUp.delay(80).duration(200)}>
          <PocketText variant="sectionHeader" weight="semiBold" color={c.textPrimary}>Active Budgets</PocketText>
          <Spacer size="md" />

          {budgetsLoading ? (
            <SkeletonLoader type="card" count={3} />
          ) : (
            <View>
              {budgets?.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  category={budget.category}
                  spentAmount={budget.spentAmount}
                  limitAmount={budget.limitAmount}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  chartCard: { borderRadius: radius.xl, padding: spacing.xl, borderWidth: 1, marginTop: spacing.lg },
});
