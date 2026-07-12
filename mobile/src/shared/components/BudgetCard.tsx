import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { ProgressBar } from './ProgressBar';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface BudgetCardProps {
  category: string;
  spentAmount: number;
  limitAmount: number;
}

export const BudgetCard: React.FC<BudgetCardProps> = React.memo(({ category, spentAmount, limitAmount }) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const isOverBudget = spentAmount > limitAmount;
  const progressColor = isOverBudget ? c.error : c.accent;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <View 
      style={[styles.container, { backgroundColor: c.surface, borderColor: c.borderHairline }]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Budget for ${category}. Spent ${formatCurrency(spentAmount)} out of ${formatCurrency(limitAmount)}. ${isOverBudget ? 'Over Budget' : 'On Track'}`}
    >
      <View style={styles.header}>
        <PocketText variant="cardTitle" weight="semiBold" color={c.textPrimary}>
          {category}
        </PocketText>
        <PocketText variant="micro" color={isOverBudget ? c.error : c.textSecondary}>
          {isOverBudget ? 'Over Budget' : 'On Track'}
        </PocketText>
      </View>
      
      <View style={styles.amountsContainer}>
        <PocketText variant="heading4" weight="bold" color={c.textPrimary}>
          {formatCurrency(spentAmount)}
        </PocketText>
        <PocketText variant="body" color={c.textSecondary}>
           {' '}/ {formatCurrency(limitAmount)}
        </PocketText>
      </View>

      <View style={{ marginBottom: spacing.sm }}>
        <ProgressBar 
          current={spentAmount} 
          target={limitAmount} 
          fillColor={progressColor} 
        />
      </View>
    </View>
  );
});

BudgetCard.displayName = 'BudgetCard';

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
});
