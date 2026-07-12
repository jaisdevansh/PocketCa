import { ILLMProvider, AIProviderResponse } from './llm.provider.interface';
import { appConfig } from '../../config/app.config';

export class GeminiProvider implements ILLMProvider {
  readonly name = 'gemini';
  private client: any | null = null;
  private model: string;

  constructor() {
    this.model = 'gemini-2.5-flash';
  }

  isConfigured(): boolean {
    return !!appConfig.GEMINI_API_KEY;
  }

  private async getClient() {
    if (this.client) return this.client;
    
    if (this.isConfigured()) {
      const { GoogleGenAI } = await import('@google/genai');
      this.client = new GoogleGenAI({
        apiKey: appConfig.GEMINI_API_KEY,
      });
    }
    return this.client;
  }

  async generateResponse(systemPrompt: string, userContext: string): Promise<AIProviderResponse> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('Gemini provider is not properly configured (missing API key).');
    }

    const startTime = Date.now();

    try {
      const response = await client.models.generateContent({
        model: this.model,
        contents: [
          { role: 'user', parts: [{ text: userContext }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const latencyMs = Date.now() - startTime;
      const content = response.text || '';
      
      // Token usage might not always be accurately reported in the same way, but we pull it if available
      const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

      return {
        content,
        tokensUsed,
        latencyMs,
      };
    } catch (error: any) {
      console.error('[GeminiProvider] Error generating response:', error.message);
      throw error;
    }
  }
}
