import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet, useColorScheme, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { colors } from '../../core/theme/colors';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { typography } from '../../core/theme/typography';
import { PocketText } from './PocketText';

interface PocketInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  success?: boolean;
  prefix?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>; // Applied to inputContainer
  inputStyle?: StyleProp<TextStyle>; // Applied to inner TextInput
}

export const PocketInput: React.FC<PocketInputProps> = React.memo(({
  label,
  error,
  success,
  style,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return c.error;
    if (success) return c.success;
    if (isFocused) return c.primary;
    return c.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <PocketText
          variant="bodySmall"
          weight="medium"
          color={c.textSecondary}
          style={styles.label}
        >
          {label}
        </PocketText>
      )}
      <View style={[
        styles.inputContainer,
        {
          borderColor: getBorderColor(),
          backgroundColor: isFocused ? c.surface : c.surfaceVariant,
        },
        style
      ]}>
        {props.prefix && (
          <View style={styles.prefixContainer}>
            {props.prefix}
          </View>
        )}
        <TextInput
          style={[styles.input, { color: c.textPrimary }, props.prefix ? { paddingLeft: 0 } : undefined, inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={c.mutedText}
          {...props}
        />
      </View>
      {error && (
        <PocketText variant="caption" color={c.error} style={styles.errorText}>
          {error}
        </PocketText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
  },
  prefixContainer: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.bodyLarge.fontSize,
    fontFamily: typography.fontFamily.regular,
  },
  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
