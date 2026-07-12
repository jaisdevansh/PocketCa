export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Initial conversation to give the user context
export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg_0',
    role: 'assistant',
    content: "Hi Devan! I'm your AI Financial Coach. I can help you analyze your budget, plan for goals, or just answer questions about your money. What's on your mind today?",
    timestamp: new Date().toISOString(),
  }
];

export const aiApi = {
  /**
   * Simulates sending a message and getting an AI response.
   * In a real app, this would use a Server-Sent Events (SSE) or WebSocket connection for streaming.
   */
  sendMessage: async (message: string): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "Based on your recent transactions, you've spent 15% more on dining out this month. Would you like me to help you set a tighter budget for the next few weeks?",
          "That's a great question. Historically, keeping an emergency fund of 3-6 months of expenses is highly recommended. You currently have about 2 months saved.",
          "I can certainly help with that. Let's break down your monthly cash flow to find areas where we can optimize your savings.",
        ];
        
        // Pick a random smart-sounding response for the mock
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        resolve({
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date().toISOString(),
        });
      }, 2000); // 2 second "thinking" latency
    });
  }
};
