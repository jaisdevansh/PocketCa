export interface AIProviderResponse {
  content: string;
  tokensUsed: number;
  latencyMs: number;
}

export interface ILLMProvider {
  /**
   * Identifies the provider (e.g., 'openai', 'gemini', 'claude')
   */
  readonly name: string;

  /**
   * Generates a text response from the LLM based on the structured prompt context
   * @param systemPrompt - The system instructions
   * @param userContext - The structured JSON or Markdown context for the user
   */
  generateResponse(systemPrompt: string, userContext: string): Promise<AIProviderResponse>;

  /**
   * Validates if the provider is properly configured
   */
  isConfigured(): boolean;
}
