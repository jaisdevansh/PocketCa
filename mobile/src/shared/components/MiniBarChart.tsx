import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PocketText } from './PocketText';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface MiniBarChartProps {
  data: number[]; // e.g., [100, 200, 150, 400, 300, 100, 250]
  labels?: string[]; // e.g., ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  color?: string;
  height?: number;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  labels,
  color = colors.light.primary,
  height = 120,
}) => {
  const maxValue = Math.max(...data, 1); // Avoid division by zero

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * 100;
          return (
            <View key={index} style={styles.barContainer}>
              <View 
                style={[
                  styles.barFill, 
                  { height: `${barHeight}%`, backgroundColor: color }
                ]} 
              />
            </View>
          );
        })}
      </View>
      
      {labels && (
        <View style={styles.labelsArea}>
          {labels.map((label, index) => (
            <View key={index} style={styles.labelContainer}>
              <PocketText variant="labelSmall" color={colors.light.textSecondary}>
                {label}
              </PocketText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    maxWidth: 24,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  labelsArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  labelContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
