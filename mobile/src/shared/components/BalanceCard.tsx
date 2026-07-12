import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PocketText } from './PocketText';
import { Spacer } from './Spacer';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  currencySymbol?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  income,
  expense,
  currencySymbol = '₹',
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  
  const formatMoney = (val: number) => 
    `${currencySymbol}${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <LinearGradient
      colors={scheme === 'dark' ? ['#201C2E', '#1A1626'] : [c.surfaceElevated, c.surfaceElevated]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { borderColor: c.borderHairline }]}
    >
      <PocketText variant="bodyMedium" color={c.textSecondary} style={{ letterSpacing: 0.26 }}>
        Total balance
      </PocketText>
      <Spacer size="xs" />
      <PocketText variant="heroBalance" weight="bold" color={c.textPrimary}>
        {formatMoney(balance)}
      </PocketText>

      <Spacer size="xl" />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <PocketText variant="caption" color={c.textSecondary}>
            Income
          </PocketText>
          <Spacer size="xs" />
          <View style={styles.statValueRow}>
            <Icon name="ArrowUpRight" size={14} color={c.positive} />
            <Spacer size="xs" horizontal />
            <PocketText variant="title" weight="semiBold" color={c.positive}>
              {formatMoney(income)}
            </PocketText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: c.borderHairline }]} />

        <View style={styles.statBox}>
          <PocketText variant="caption" color={c.textSecondary}>
            Expenses
          </PocketText>
          <Spacer size="xs" />
          <View style={styles.statValueRow}>
            <Icon name="ArrowDownRight" size={14} color={c.textPrimary} />
            <Spacer size="xs" horizontal />
            <PocketText variant="title" weight="semiBold" color={c.textPrimary}>
              {formatMoney(expense)}
            </PocketText>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: spacing.xl,
  },
});
