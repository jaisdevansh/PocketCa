import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { PocketText } from './PocketText';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { radius } from '../../core/theme/radius';
import { ChatMessage } from '../../features/ai/api';

interface AIChatBubbleProps {
  message: ChatMessage;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={[styles.userBubble, { backgroundColor: c.primary }]}>
          <PocketText variant="bodyLarge" color="#FFFFFF">
            {message.content}
          </PocketText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiContainer}>
      <View style={[styles.aiIconWrapper, { backgroundColor: c.accentSoftBg }]}>
        <Icon name="Sparkles" size={16} color={c.accent} />
      </View>
      <View style={[styles.aiBubble, { backgroundColor: c.surface }]}>
        <PocketText variant="bodyLarge" color={c.textPrimary} style={{ lineHeight: 24 }}>
          {message.content}
        </PocketText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
    paddingLeft: spacing.colossal,
  },
  userBubble: {
    padding: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: 4,
  },
  aiContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.lg,
    paddingRight: spacing.colossal,
  },
  aiIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  aiBubble: {
    flex: 1,
    padding: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: 4,
  },
});
