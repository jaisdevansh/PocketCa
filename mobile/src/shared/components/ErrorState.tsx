import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PocketText } from './PocketText';
import { PocketButton } from './PocketButton';
import { Spacer } from './Spacer';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not load your data at this time. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="AlertCircle" size={48} color={colors.light.error} />
      </View>
      <Spacer size="lg" />
      <PocketText variant="heading4" weight="bold" color={colors.light.textPrimary} align="center">
        {title}
      </PocketText>
      <Spacer size="sm" />
      <PocketText variant="bodyMedium" color={colors.light.textSecondary} align="center">
        {message}
      </PocketText>
      
      {onRetry && (
        <>
          <Spacer size="xl" />
          <PocketButton title="Try Again" onPress={onRetry} variant="outline" />
        </>
      )}
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
    backgroundColor: '#FEE2E2', // Light red for error bg
    justifyContent: 'center',
    alignItems: 'center',
  },
});
