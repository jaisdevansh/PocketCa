import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { colors } from '../../core/theme/colors';

export type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: string; // fallback to string to satisfy consumers
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.light.textPrimary,
}) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} />;
};
