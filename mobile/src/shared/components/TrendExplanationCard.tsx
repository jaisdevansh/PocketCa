import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';

interface TrendExplanationCardProps {
  title: string;
  explanation: string;
  suggestion: string;
  trend: 'up' | 'down' | 'neutral';
}

export const TrendExplanationCard: React.FC<TrendExplanationCardProps> = ({
  title,
  explanation,
  suggestion,
  trend,
}) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  let iconName: string = 'TrendingUp';
  let trendColor = c.accent;
  let trendBg = c.accentSoftBg;

  if (trend === 'down') {
    iconName = 'TrendingDown';
    trendColor = c.positive; // Going down is usually good for expenses
    trendBg = 'rgba(52,211,153,0.12)';
  } else if (trend === 'neutral') {
    iconName = 'Minus';
    trendColor = c.textSecondary;
    trendBg = c.surfaceVariant;
  }

  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: trendBg }]}>
          <Icon name={iconName} size={20} color={trendColor} />
        </View>
        <PocketText variant="cardTitle" weight="semiBold" style={styles.title} color={c.textPrimary}>
          {title}
        </PocketText>
      </View>
      
      <PocketText variant="body" color={c.textPrimary} style={styles.explanation}>
        {explanation}
      </PocketText>
      
      <View style={[styles.suggestionContainer, { backgroundColor: c.accentSoftBg }]}>
        <Icon name="Lightbulb" size={16} color={c.accent} />
        <PocketText variant="micro" color={c.accent} style={styles.suggestionText}>
          {suggestion}
        </PocketText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    flex: 1,
  },
  explanation: {
    lineHeight: 22.5,
    marginBottom: spacing.md,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  suggestionText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
});
