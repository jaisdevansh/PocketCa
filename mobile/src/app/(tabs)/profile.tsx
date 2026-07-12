import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, useColorScheme, Alert, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { PocketText } from '@/shared/components/PocketText';
import { Avatar } from '@/shared/components/Avatar';
import { Icon } from '@/shared/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { radius } from '@/core/theme/radius';
import { useAppStore } from '@/store/useAppStore';

const MENU_ITEMS = [
  { icon: 'User', label: 'Personal Information', colorKey: 'accent' },
  { icon: 'Bell', label: 'Notifications', colorKey: 'warning' },
  { icon: 'Shield', label: 'Security & Privacy', colorKey: 'success' },
  { icon: 'CreditCard', label: 'Payment Methods', colorKey: 'info' },
  { icon: 'HelpCircle', label: 'Help & Support', colorKey: 'premiumGold' },
  { icon: 'Info', label: 'About PocketCA', colorKey: 'textSecondary' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const user = useAppStore((state) => state.user);
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const handleMenuPress = (label: string) => {
    Alert.alert(label, 'This feature is currently under development and will be available soon.');
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <Animated.View entering={FadeInUp.delay(0).duration(200)} style={styles.profileSection}>
          <Pressable onPress={() => setIsImageExpanded(true)}>
            <Avatar size={80} url={user?.profileImage} />
          </Pressable>
          <View style={styles.profileInfo}>
            <PocketText variant="heading3" weight="semiBold" color={c.textPrimary}>{user?.name || 'User'}</PocketText>
            <PocketText variant="body" color={c.textSecondary}>@{user?.username || 'username'}</PocketText>
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInUp.delay(40).duration(200)} style={[styles.menuCard, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
          {MENU_ITEMS.map((item, index) => {
            // @ts-ignore
            const itemColor = c[item.colorKey] || c.primary;
            return (
              <React.Fragment key={item.label}>
                <Pressable 
                  style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: c.surfaceVariant }]}
                  onPress={() => handleMenuPress(item.label)}
                >
                  <View style={[styles.menuIcon, { backgroundColor: itemColor + '15' }]}>
                    <Icon name={item.icon as any} size={20} color={itemColor} />
                  </View>
                  <PocketText variant="body" weight="medium" style={styles.menuLabel} color={c.textPrimary}>
                    {item.label}
                  </PocketText>
                  <Icon name="ChevronRight" size={18} color={c.mutedText} />
                </Pressable>
                {index < MENU_ITEMS.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: c.borderHairline }]} />
                )}
              </React.Fragment>
            );
          })}
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInUp.delay(80).duration(200)}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutBtn, 
              { backgroundColor: c.surface, borderColor: c.borderHairline },
              pressed && { backgroundColor: c.surfaceVariant }
            ]}
            onPress={() => {
              setAuthenticated(false);
              router.replace('/(auth)/onboarding');
            }}
          >
            <Icon name="LogOut" size={20} color={c.negative} />
            <PocketText variant="body" weight="semiBold" color={c.negative} style={{ marginLeft: spacing.sm }}>
              Sign Out
            </PocketText>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Expanded Profile Image Modal */}
      <Modal visible={isImageExpanded} transparent={true} animationType="fade" onRequestClose={() => setIsImageExpanded(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setIsImageExpanded(false)} />
          <Animated.View entering={FadeIn.duration(300)} style={styles.modalContent}>
            <SafeAreaView style={{ alignItems: 'flex-end', width: '100%' }}>
              <Pressable style={styles.closeButton} onPress={() => setIsImageExpanded(false)}>
                <Icon name="X" size={24} color="#FFF" />
              </Pressable>
            </SafeAreaView>
            <View style={styles.expandedAvatarContainer}>
              <Avatar size={300} url={user?.profileImage} />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  profileSection: { alignItems: 'center', marginBottom: spacing.xxxl },
  profileInfo: { alignItems: 'center', marginTop: spacing.lg, gap: spacing.xs },
  menuCard: { borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.xxl },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  menuIcon: { width: 40, height: 40, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  menuLabel: { flex: 1 },
  divider: { height: 1, marginLeft: spacing.lg + 40 + spacing.md },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center' },
  modalDismiss: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  closeButton: { padding: spacing.xl, marginTop: spacing.xl },
  expandedAvatarContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
});
