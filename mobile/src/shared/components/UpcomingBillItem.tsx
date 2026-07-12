import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface UpcomingBillItemProps {
  title: string;
  amount: number;
  dueDate: string; // ISO string
  iconName?: any;
}

export const UpcomingBillItem: React.FC<UpcomingBillItemProps> = React.memo(({
  title,
  amount,
  dueDate,
  iconName = 'FileText',
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  // Calculate days remaining
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = Math.abs(due.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isUrgent = diffDays <= 3;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: c.surface, borderColor: c.borderHairline }]}
      accessibilityRole="button"
      accessibilityLabel={`Upcoming bill: ${title}, ${formatCurrency(amount)}, due in ${diffDays} days`}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: c.accentSoftBg }]}>
          <Icon name={iconName} size={20} color={c.accent} />
        </View>
        {isUrgent && (
          <View style={[styles.badge, { backgroundColor: 'rgba(248,113,113,0.12)' }]}>
            <PocketText variant="micro" weight="bold" color={c.negative}>
              {diffDays}d
            </PocketText>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <PocketText variant="body" color={c.textSecondary} numberOfLines={1}>
          {title}
        </PocketText>
        <PocketText variant="title" weight="semiBold" color={c.textPrimary}>
          {formatCurrency(amount)}
        </PocketText>
      </View>
    </Pressable>
  );
});

UpcomingBillItem.displayName = 'UpcomingBillItem';

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: 150,
    marginRight: spacing.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    gap: 4,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
});
