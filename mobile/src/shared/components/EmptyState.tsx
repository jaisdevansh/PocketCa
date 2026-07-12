import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PocketText } from './PocketText';
import { Spacer } from './Spacer';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'Inbox' | 'Search' | 'FileText';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'Inbox',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={48} color={colors.light.mutedText} />
      </View>
      <Spacer size="lg" />
      <PocketText variant="heading4" weight="bold" color={colors.light.textPrimary} align="center">
        {title}
      </PocketText>
      <Spacer size="sm" />
      <PocketText variant="bodyMedium" color={colors.light.textSecondary} align="center">
        {message}
      </PocketText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.colossal,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.light.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
