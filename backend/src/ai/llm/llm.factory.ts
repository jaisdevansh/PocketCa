import { ILLMProvider, AIProviderResponse } from './llm.provider.interface';
import { GroqProvider } from './groq.provider';
import { GeminiProvider } from './gemini.provider';
import { appConfig } from '../../config/app.config';

export class LLMFactory {
  private primaryProvider: ILLMProvider;
  private fallbackProvider: ILLMProvider;

  constructor() {
    // Instantiate providers
    const groq = new GroqProvider();
    const gemini = new GeminiProvider();

    // Determine primary based on config, but heavily favor Groq as primary if configured
    if (appConfig.DEFAULT_AI_PROVIDER === 'gemini' && gemini.isConfigured()) {
      this.primaryProvider = gemini;
      this.fallbackProvider = groq;
    } else {
      this.primaryProvider = groq;
      this.fallbackProvider = gemini;
    }

    // If primary isn't configured, swap them
    if (!this.primaryProvider.isConfigured() && this.fallbackProvider.isConfigured()) {
      const temp = this.primaryProvider;
      this.primaryProvider = this.fallbackProvider;
      this.fallbackProvider = temp;
    }
  }

  /**
   * Generates a response using the primary provider, with automatic failover to the fallback provider.
   */
  async generateWithFallback(systemPrompt: string, userContext: string): Promise<AIProviderResponse> {
    if (!this.primaryProvider.isConfigured() && !this.fallbackProvider.isConfigured()) {
      throw new Error('No AI providers are configured. Please check your environment variables.');
    }

    try {
      if (this.primaryProvider.isConfigured()) {
        console.log(`[LLMFactory] Attempting generation with primary provider: ${this.primaryProvider.name}`);
        return await this.primaryProvider.generateResponse(systemPrompt, userContext);
      }
    } catch (error: any) {
      console.warn(`[LLMFactory] Primary provider (${this.primaryProvider.name}) failed: ${error.message}`);
      console.warn(`[LLMFactory] Initiating fallback sequence...`);
    }

    // Fallback path
    if (this.fallbackProvider.isConfigured()) {
      console.log(`[LLMFactory] Attempting generation with fallback provider: ${this.fallbackProvider.name}`);
      return await this.fallbackProvider.generateResponse(systemPrompt, userContext);
    }

    throw new Error('All configured AI providers failed to generate a response.');
  }
}

// Export a singleton instance for easy use across the app
export const llmFactory = new LLMFactory();
