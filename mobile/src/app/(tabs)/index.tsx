import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PocketText } from '@/shared/components/PocketText';
import { BalanceCard } from '@/shared/components/BalanceCard';
import { TransactionItem } from '@/shared/components/TransactionItem';
import { AIRecommendationCard } from '@/shared/components/AIRecommendationCard';
import { UpcomingBillItem } from '@/shared/components/UpcomingBillItem';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { Avatar } from '@/shared/components/Avatar';
import { Spacer } from '@/shared/components/Spacer';
import { Icon } from '@/shared/components/Icon';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { radius } from '@/core/theme/radius';
import { useUpcomingBills } from '@/features/bills/hooks/useBills';
import { Bill } from '@/features/bills/schemas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const { data: bills, isLoading: billsLoading } = useUpcomingBills();
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);

  const renderBill = React.useCallback(({ item }: { item: Bill }) => (
    <UpcomingBillItem
      title={item.title}
      amount={item.amount}
      dueDate={item.dueDate}
      iconName={item.iconName}
    />
  ), []);

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <Animated.View entering={FadeInUp.delay(0).duration(200)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar size={44} url={user?.profileImage} />
            <View style={styles.greeting}>
              <PocketText variant="body" color={c.textSecondary}>Good morning,</PocketText>
              <PocketText variant="heading3" weight="semiBold" color={c.textPrimary}>{user?.name || 'User'}</PocketText>
            </View>
          </View>
          <View style={[styles.iconButton, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
            <Icon name="Bell" size={20} color={c.textPrimary} />
            <View style={[styles.unreadDot, { backgroundColor: c.accent }]} />
          </View>
        </Animated.View>

        <Spacer size="xxxl" />

        {/* Balance Card */}
        <Animated.View entering={FadeInUp.delay(40).duration(200)}>
          <BalanceCard balance={12450.75} income={4200.00} expense={1150.25} />
        </Animated.View>

        <Spacer size="xxxl" />

        {/* Upcoming Bills */}
        <Animated.View entering={FadeInUp.delay(80).duration(200)}>
          <View style={styles.sectionHeader}>
            <PocketText variant="sectionHeader" weight="semiBold" color={c.textPrimary}>Upcoming bills</PocketText>
            <Pressable>
              <PocketText variant="body" color={c.accent} weight="medium">See all</PocketText>
            </Pressable>
          </View>
          <Spacer size="lg" />
          <View style={styles.billsListContainer}>
            {billsLoading ? (
              <SkeletonLoader type="list" count={1} />
            ) : (
              <FlashList
                data={bills}
                renderItem={renderBill}
                // @ts-ignore
                estimatedItemSize={150}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </Animated.View>

        <Spacer size="xxxl" />

        {/* AI Insight */}
        <Animated.View entering={FadeInUp.delay(120).duration(200)}>
          <AIRecommendationCard
            title="AI Coach insight"
            message="You are spending 15% more on dining out this week. Would you like me to adjust your budget?"
            actionText="Review budget"
            icon={<Icon name="Sparkles" color={c.accent} size={16} />}
            onActionPress={() => {}}
          />
        </Animated.View>

        <Spacer size="xxxl" />

        {/* Recent Transactions */}
        <Animated.View entering={FadeInUp.delay(160).duration(200)}>
          <View style={styles.sectionHeader}>
            <PocketText variant="sectionHeader" weight="semiBold" color={c.textPrimary}>Recent Transactions</PocketText>
            <PocketText variant="body" color={c.accent} weight="medium">See All</PocketText>
          </View>
          <Spacer size="lg" />

          <View style={[styles.transactionList, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
            <TransactionItem title="Starbucks" subtitle="Food & Drink • Today" amount={5.40} type="expense" icon={<Icon name="Coffee" size={20} color={c.textPrimary} />} />
            <View style={[styles.divider, { backgroundColor: c.borderHairline }]} />
            <TransactionItem title="Salary Deposit" subtitle="Income • Yesterday" amount={4200.00} type="income" icon={<Icon name="Briefcase" size={20} color={c.textPrimary} />} />
            <View style={[styles.divider, { backgroundColor: c.borderHairline }]} />
            <TransactionItem title="Netflix Premium" subtitle="Entertainment • Jun 28" amount={22.99} type="expense" icon={<Icon name="Tv" size={20} color={c.textPrimary} />} />
          </View>
        </Animated.View>

        <Spacer size="colossal" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  greeting: { marginLeft: spacing.md },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, position: 'absolute', top: 10, right: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billsListContainer: { height: 100 },
  transactionList: { borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1 },
  divider: { height: 1, marginLeft: spacing.colossal + spacing.md },
});
