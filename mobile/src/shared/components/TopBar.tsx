import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from './Icon';
import { PocketText } from './PocketText';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export function TopBar({ title, showBack = true }: TopBarProps) {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBack ? (
          <Pressable 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }} 
            style={styles.backButton}
          >
            <Icon name="ArrowLeft" size={24} color={c.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        
        {title && (
          <PocketText variant="heading5" weight="bold" style={styles.title} numberOfLines={1}>
            {title}
          </PocketText>
        )}
        
        <View style={styles.rightPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    height: 56,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  backButtonPlaceholder: {
    width: 24,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  rightPlaceholder: {
    width: 24,
  },
});
