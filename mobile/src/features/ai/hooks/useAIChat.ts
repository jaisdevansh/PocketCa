import { useState, useCallback } from 'react';
import { aiApi, ChatMessage, INITIAL_CHAT } from '../api';

export const useAIChat = () => {
  // For chat interfaces, local state is often better than TanStack Query 
  // because we need to instantly append optimistic messages and handle streaming updates.
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // 1. Optimistically append user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [userMsg, ...prev]);
    setIsTyping(true);

    try {
      // 2. Call API
      const aiResponse = await aiApi.sendMessage(content);
      
      // 3. Append AI response
      setMessages((prev) => [aiResponse, ...prev]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      // In a real app, we'd show an error state or remove the optimistic message
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
