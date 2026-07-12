import React from 'react';
import { Text, TextProps, StyleSheet, useColorScheme } from 'react-native';
import { typography } from '../../core/theme/typography';
import { colors } from '../../core/theme/colors';

interface PocketTextProps extends TextProps {
  variant?: keyof typeof typography.sizes | string;
  color?: string;
  weight?: keyof typeof typography.fontFamily;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const PocketText: React.FC<PocketTextProps> = ({
  variant = 'bodyMedium',
  color,
  weight = 'regular',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const scheme = useColorScheme();
  const defaultColor = colors[scheme === 'dark' ? 'dark' : 'light'].textPrimary;
  const finalColor = color || defaultColor;

  const sizeConfig = typography.sizes[variant as keyof typeof typography.sizes] || typography.sizes.bodyMedium;
  const { fontSize, lineHeight, letterSpacing } = sizeConfig;
  const fontFamily = typography.fontFamily[weight];

  return (
    <Text
      style={[
        {
          fontSize,
          lineHeight,
          letterSpacing,
          fontFamily,
          color: finalColor,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
