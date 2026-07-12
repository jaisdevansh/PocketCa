import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { Spacer } from './Spacer';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface AIRecommendationCardProps {
  title: string;
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: React.ReactNode;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  title,
  message,
  actionText,
  onActionPress,
  icon,
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c.accentSoftBg, borderRadius: radius.xl }]} />
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <PocketText variant="body" weight="semiBold" color={c.accent}>
          {title}
        </PocketText>
      </View>

      <Spacer size="md" />

      <PocketText 
        variant="cardTitle" 
        color={c.textPrimary} 
        style={styles.message}
        numberOfLines={3}
      >
        {message}
      </PocketText>

      {actionText && onActionPress && (
        <>
          <Spacer size="lg" />
          <Pressable 
            style={[styles.button, { backgroundColor: c.accent }]} 
            onPress={onActionPress}
          >
            <PocketText variant="body" weight="semiBold" color={c.surface}>
              {actionText}
            </PocketText>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  message: {
    lineHeight: 22.5, // 1.5 * 15px
  },
  button: {
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});
