import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../core/theme/colors';
import { radius } from '../../core/theme/radius';

interface ProgressBarProps {
  current: number;
  target: number;
  fillColor?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  fillColor = colors.light.primary,
  backgroundColor = colors.light.surfaceVariant,
}) => {
  const safeTarget = Math.max(target, 1);
  const progressPercentage = Math.min((current / safeTarget) * 100, 100);

  return (
    <View style={[styles.background, { backgroundColor }]}>
      <View 
        style={[
          styles.fill, 
          { backgroundColor: fillColor, width: `${progressPercentage}%` }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: 8,
    borderRadius: radius.full,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
