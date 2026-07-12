import { db } from '../../database/connection/database';
import { aiPrompts, aiTemplates } from '../../database/schema/ai';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger';

export class PromptEngine {
  /**
   * Builds a prompt by fetching the template from the database and injecting context.
   * Never hardcode prompts, fetch them dynamically.
   */
  async buildPrompt(promptName: string, context: Record<string, any>): Promise<string> {
    try {
      const records = await db.select().from(aiPrompts).where(eq(aiPrompts.name, promptName)).limit(1);
      
      if (!records.length || !records[0].isActive) {
        // Fallback to basic if not found in DB yet (for testing or bootstrapping)
        return this.getFallbackPrompt(promptName, context);
      }

      const promptData = records[0];
      let content = promptData.content;

      // Fetch templates/variables if any
      const templates = await db.select().from(aiTemplates).where(eq(aiTemplates.promptId, promptData.id));

      // Replace variables in the content (e.g., {{income}}, {{expenses}})
      for (const tmpl of templates) {
        const key = tmpl.key;
        const val = context[key] !== undefined ? context[key] : tmpl.defaultValue;
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
      }

      // Also replace any direct context variables
      for (const [key, val] of Object.entries(context)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), typeof val === 'object' ? JSON.stringify(val) : String(val));
      }

      return content;
    } catch (error) {
      logger.error(`Error building prompt ${promptName}`, error);
      throw error;
    }
  }

  private getFallbackPrompt(promptName: string, context: Record<string, any>): string {
    switch(promptName) {
      case 'WEEKLY_REPORT':
        return `Analyze the following financial data and provide a concise weekly report: ${JSON.stringify(context)}`;
      case 'BUDGET_ADVICE':
        return `The user has exceeded their budget. Context: ${JSON.stringify(context)}. Provide friendly, actionable advice.`;
      default:
        return `Context: ${JSON.stringify(context)}. Provide financial insights.`;
    }
  }
}

export const promptEngine = new PromptEngine();
