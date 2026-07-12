import Groq from 'groq-sdk';
import { ILLMProvider, AIProviderResponse } from './llm.provider.interface';
import { appConfig } from '../../config/app.config';

export class GroqProvider implements ILLMProvider {
  readonly name = 'groq';
  private client: Groq | null = null;
  private model: string;

  constructor() {
    this.model = appConfig.DEFAULT_AI_MODEL || 'llama3-8b-8192';
    
    if (this.isConfigured()) {
      this.client = new Groq({
        apiKey: appConfig.GROQ_API_KEY,
      });
    }
  }

  isConfigured(): boolean {
    return !!appConfig.GROQ_API_KEY;
  }

  async generateResponse(systemPrompt: string, userContext: string): Promise<AIProviderResponse> {
    if (!this.client) {
      throw new Error('Groq provider is not properly configured (missing API key).');
    }

    const startTime = Date.now();

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContext }
        ],
        temperature: 0.7,
      });

      const latencyMs = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;

      return {
        content,
        tokensUsed,
        latencyMs,
      };
    } catch (error: any) {
      console.error('[GroqProvider] Error generating response:', error.message);
      throw error;
    }
  }
}
