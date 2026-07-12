import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';

const Dot = ({ delay }: { delay: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 }),
          withTiming(0, { duration: 400 }) // pause at bottom
        ),
        -1, // infinite repeat
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
};

export const AIThinkingAnimation: React.FC = () => {
  return (
    <View style={styles.container}>
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.light.surfaceVariant,
    borderRadius: spacing.lg,
    alignSelf: 'flex-start',
    maxWidth: 80,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.textSecondary,
    marginHorizontal: 2,
  },
});
