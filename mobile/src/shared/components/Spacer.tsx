import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../core/theme/spacing';

interface SpacerProps {
  size?: keyof typeof spacing;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', horizontal = false }) => {
  return (
    <View
      style={{
        width: horizontal ? spacing[size] : undefined,
        height: horizontal ? undefined : spacing[size],
      }}
    />
  );
};
