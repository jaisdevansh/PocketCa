import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface TransactionItemProps {
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense';
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = React.memo(({
  title,
  subtitle,
  amount,
  type,
  icon,
  onPress,
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const isIncome = type === 'income';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}, ${isIncome ? 'Income of' : 'Expense of'} ${Math.abs(amount).toFixed(2)} rupees`}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: c.surface },
        pressed && { backgroundColor: c.hover },
      ]}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: c.surfaceElevated }]}>
          {icon}
        </View>
        <View style={styles.textContent}>
          <PocketText variant="cardTitle" weight="medium" color={c.textPrimary}>
            {title}
          </PocketText>
          <PocketText variant="micro" color={c.textSecondary}>
            {subtitle}
          </PocketText>
        </View>
      </View>

      <PocketText
        variant="cardTitle"
        weight="semiBold"
        color={isIncome ? c.positive : c.textPrimary}
      >
        {isIncome ? '+' : ''}₹{Math.abs(amount).toFixed(2)}
      </PocketText>
    </Pressable>
  );
});

TransactionItem.displayName = 'TransactionItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    gap: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
});
