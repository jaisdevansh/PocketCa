import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '../../core/theme/colors';
import { radius } from '../../core/theme/radius';
import { shadows } from '../../core/theme/shadows';
import { spacing } from '../../core/theme/spacing';

interface PocketCardProps extends ViewProps {
  padding?: keyof typeof spacing;
  elevated?: boolean;
}

export const PocketCard: React.FC<PocketCardProps> = ({
  padding = 'lg',
  elevated = true,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        { padding: spacing[padding] },
        elevated && shadows.card,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
});
