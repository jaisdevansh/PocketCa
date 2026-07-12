import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme, Pressable, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { TopBar } from '@/shared/components/TopBar';
import { PocketText } from '@/shared/components/PocketText';
import { PocketButton } from '@/shared/components/PocketButton';
import { PocketInput } from '@/shared/components/PocketInput';
import { Icon } from '@/shared/components/Icon';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useAppStore } from '@/store/useAppStore';

export default function SetupProfileScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const updateProfile = useAppStore((state) => state.updateProfile);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string>();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [showImagePickerMenu, setShowImagePickerMenu] = useState(false);

  // Mock username validation logic
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameError(undefined);
      setSuggestions([]);
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    const timeoutId = setTimeout(() => {
      // Mock logic: anything starting with 'devan' is taken
      if (username.toLowerCase().startsWith('devan')) {
        setUsernameError('This username is already taken.');
        setIsAvailable(false);
        // Generate Instagram-style suggestions
        const base = username.toLowerCase();
        setSuggestions([
          `${base}_official`,
          `${base}.finance`,
          `${base}123`,
        ]);
      } else {
        setUsernameError(undefined);
        setSuggestions([]);
        setIsAvailable(true);
      }
      setIsChecking(false);
    }, 600); // Mock network latency

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleImageSelection = async () => {
    setShowImagePickerMenu(true);
  };

  const captureImage = async () => {
    setShowImagePickerMenu(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permission to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    setShowImagePickerMenu(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleComplete = () => {
    if (!name || !username || !isAvailable) return;
    
    // Save to global store
    updateProfile({
      name,
      username,
      profileImage: profileImage || undefined
    });
    
    // The layout routing guard will automatically push to (tabs) once username is set
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <TopBar showBack={true} />
      
      {/* Premium Bottom Sheet Modal */}
      <Modal visible={showImagePickerMenu} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowImagePickerMenu(false)} 
          />
          <View style={[styles.bottomSheet, { backgroundColor: c.surface }]}>
            <View style={styles.sheetHandle} />
            <PocketText variant="heading3" weight="bold" style={styles.sheetTitle}>Profile Photo</PocketText>
            
            <TouchableOpacity style={styles.sheetOption} onPress={captureImage}>
              <View style={[styles.iconBox, { backgroundColor: c.surfaceVariant }]}>
                <Icon name="Camera" size={24} color={c.textPrimary} />
              </View>
              <PocketText variant="bodyLarge" weight="medium">Take a Photo</PocketText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sheetOption} onPress={pickImage}>
              <View style={[styles.iconBox, { backgroundColor: c.surfaceVariant }]}>
                <Icon name="Image" size={24} color={c.textPrimary} />
              </View>
              <PocketText variant="bodyLarge" weight="medium">Choose from Gallery</PocketText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <PocketText variant="heading3" weight="bold">Setup Profile</PocketText>
            <PocketText variant="bodyLarge" color={c.textSecondary} style={styles.subtitle}>
              Let's get to know you better.
            </PocketText>
          </View>

          <View style={styles.avatarContainer}>
            <Pressable onPress={handleImageSelection} style={[styles.avatarWrapper, { backgroundColor: c.surface, borderColor: c.border }]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} contentFit="cover" />
              ) : (
                <Icon name="Camera" size={32} color={c.textSecondary} />
              )}
              <View style={[styles.editBadge, { backgroundColor: c.primary, borderColor: c.background }]}>
                <Icon name="Plus" size={12} color="#fff" />
              </View>
            </Pressable>
            <PocketText variant="bodyMedium" color={c.textSecondary} style={{ marginTop: spacing.md }}>
              Add a profile photo
            </PocketText>
          </View>

          <View style={styles.form}>
            <PocketInput
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.usernameContainer}>
              <PocketInput
                label="Username"
                placeholder="e.g. johndoe"
                value={username}
                onChangeText={setUsername}
                error={usernameError}
                autoCapitalize="none"
              />
              
              {isChecking && (
                <PocketText variant="bodySmall" color={c.textSecondary} style={styles.checkingText}>
                  Checking availability...
                </PocketText>
              )}

              {isAvailable && (
                <PocketText variant="bodySmall" color={c.success} style={styles.checkingText}>
                  ✓ Username is available!
                </PocketText>
              )}

              {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <PocketText variant="bodySmall" color={c.textSecondary}>Available alternatives:</PocketText>
                  <View style={styles.suggestionChips}>
                    {suggestions.map((sug) => (
                      <Pressable 
                        key={sug} 
                        style={[styles.chip, { backgroundColor: c.surface, borderColor: c.border }]}
                        onPress={() => setUsername(sug)}
                      >
                        <PocketText variant="bodySmall" weight="medium">{sug}</PocketText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          <PocketButton
            title="Complete Setup"
            onPress={handleComplete}
            disabled={!name || !username || !isAvailable || isChecking}
            style={styles.submitBtn}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scroll: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxxl },
  header: { marginTop: spacing.lg, marginBottom: spacing.xxxl },
  subtitle: { marginTop: spacing.xs },
  avatarContainer: { alignItems: 'center', marginBottom: spacing.xxxl },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: { flex: 1, gap: spacing.xl },
  usernameContainer: { gap: spacing.xs },
  checkingText: { marginTop: spacing.xs },
  suggestionsContainer: { marginTop: spacing.sm, gap: spacing.sm },
  suggestionChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xl,
    borderWidth: 1,
  },
  submitBtn: { marginTop: spacing.xxxl },

  // Modal / Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xxl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  sheetTitle: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
});
