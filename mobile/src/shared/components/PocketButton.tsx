import React from 'react';
import { Pressable, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../core/theme/colors';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { PocketText } from './PocketText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PocketButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const PocketButton: React.FC<PocketButtonProps> = React.memo(({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.light.disabled;
    switch (variant) {
      case 'primary': return colors.light.primary;
      case 'secondary': return colors.light.secondary;
      case 'danger': return colors.light.error;
      case 'outline':
      case 'ghost': return 'transparent';
      default: return colors.light.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.light.textSecondary;
    switch (variant) {
      case 'primary':
      case 'danger': return colors.light.surface;
      case 'secondary': return colors.light.textPrimary;
      case 'outline':
      case 'ghost': return colors.light.primary;
      default: return colors.light.surface;
    }
  };

  const getBorder = () => {
    if (variant === 'outline') {
      return { borderWidth: 1.5, borderColor: disabled ? colors.light.disabled : colors.light.primary };
    }
    return {};
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg };
      case 'lg': return { paddingVertical: spacing.xl, paddingHorizontal: spacing.xxxl };
      case 'md':
      default: return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl };
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={title}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        getPadding(),
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <PocketText
          variant="title"
          weight="semiBold"
          color={getTextColor()}
          align="center"
        >
          {title}
        </PocketText>
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
