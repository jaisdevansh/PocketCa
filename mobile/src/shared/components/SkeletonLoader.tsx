import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface SkeletonLoaderProps {
  type?: 'list' | 'card' | 'avatar';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'list', count = 3 }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const renderListItem = (key: number) => (
    <Animated.View key={key} style={[styles.listItem, animatedStyle]}>
      <View style={styles.avatar} />
      <View style={styles.contentContainer}>
        <View style={styles.titleLine} />
        <View style={styles.subtitleLine} />
      </View>
      <View style={styles.amountLine} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => {
        if (type === 'list') return renderListItem(i);
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.light.surface,
    marginBottom: 1, // acts as divider
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.light.border,
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleLine: {
    width: '60%',
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.light.border,
    marginBottom: spacing.xs,
  },
  subtitleLine: {
    width: '40%',
    height: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.light.border,
  },
  amountLine: {
    width: 60,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colors.light.border,
  },
});
