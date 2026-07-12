import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  useColorScheme,
  FlatList
} from 'react-native';
import { useAIChat } from '@/features/ai/hooks/useAIChat';
import { ChatMessage } from '@/features/ai/api';
import { AIChatBubble } from '@/shared/components/AIChatBubble';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { AIThinkingAnimation } from '@/shared/components/AIThinkingAnimation';
import { Icon } from '@/shared/components/Icon';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { radius } from '@/core/theme/radius';

export default function AICoachScreen() {
  const { messages, isTyping, sendMessage } = useAIChat();
  const [inputText, setInputText] = useState('');
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  const renderItem = React.useCallback(({ item }: { item: ChatMessage }) => (
    <AIChatBubble message={item} />
  ), []);

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardView}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            renderItem={renderItem}
            inverted
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              isTyping ? (
                <View style={styles.typingContainer}>
                  <AIThinkingAnimation />
                </View>
              ) : null
            }
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: c.surface, borderTopColor: c.borderHairline }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: c.background, color: c.textPrimary }]}
            placeholder="Ask anything about your money..."
            placeholderTextColor={c.mutedText}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isTyping}
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: c.accent }, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            <Icon name="ArrowUp" size={20} color={c.surface} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  chatContainer: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  typingContainer: { marginBottom: spacing.lg, paddingLeft: 44 },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    marginBottom: 2,
  },
  sendButtonDisabled: { opacity: 0.4 },
});
