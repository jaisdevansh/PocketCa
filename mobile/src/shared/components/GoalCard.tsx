import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface GoalCardProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  iconName?: any;
  onPress?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = React.memo(({
  title,
  currentAmount,
  targetAmount,
  iconName = 'Target',
  onPress,
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  // Defensive math to avoid division by zero
  const safeTarget = Math.max(targetAmount, 1);
  const progressPercentage = Math.min((currentAmount / safeTarget) * 100, 100);
  
  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Pressable 
      accessibilityRole="button"
      accessibilityLabel={`Goal: ${title}. ${progressPercentage.toFixed(1)} percent completed. Current amount ${formatCurrency(currentAmount)} of ${formatCurrency(targetAmount)}`}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: c.surface, borderColor: c.borderHairline },
        pressed && { backgroundColor: c.hover }
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: c.accentSoftBg }]}>
          <Icon name={iconName} size={20} color={c.accent} />
        </View>
        <PocketText variant="cardTitle" weight="semiBold" style={styles.title} color={c.textPrimary}>
          {title}
        </PocketText>
      </View>
      
      <View style={styles.amountsContainer}>
        <PocketText variant="heading4" weight="bold" color={c.textPrimary}>
          {formatCurrency(currentAmount)}
        </PocketText>
        <PocketText variant="body" color={c.textSecondary}>
           {' '}of {formatCurrency(targetAmount)}
        </PocketText>
      </View>

      <View style={{ marginBottom: spacing.sm }}>
        <ProgressBar current={currentAmount} target={targetAmount} />
      </View>
      
      <PocketText variant="micro" color={c.accent} style={styles.percentageText}>
        {progressPercentage.toFixed(1)}% Completed
      </PocketText>
    </Pressable>
  );
});

GoalCard.displayName = 'GoalCard';

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  title: {
    flex: 1,
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  percentageText: {
    textAlign: 'right',
  },
});
