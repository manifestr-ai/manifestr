import Anthropic from '@anthropic-ai/sdk';
import { getDocumentTypes } from '../config/documentMappings';

/**
 * DocumentMatcher Service
 * Uses AI to intelligently match user prompt to the best document type
 */
export class DocumentMatcher {
  private claude: Anthropic;

  constructor() {
    this.claude = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  /**
   * Match user prompt to the best document type
   * @param toolId - The selected tool (e.g., "deck", "strategist")
   * @param category - The document category (e.g., "Proposals", "Plans")
   * @param userPrompt - The user's input describing what they want
   * @returns The matched document type name
   */
  async matchDocumentType(
    toolId: string,
    category: string,
    userPrompt: string
  ): Promise<string> {
    // Get available document types for this tool + category
    const availableTypes = getDocumentTypes(toolId, category);

    if (availableTypes.length === 0) {
      console.warn(`⚠️ No document types found for ${toolId} / ${category}`);
      return 'Custom Presentation';
    }

    if (availableTypes.length === 1) {
      return availableTypes[0];
    }

    // Use AI to match the best document type
    try {
      const systemPrompt = `You are a document type classifier. Given a user's description and a list of available document types, you must select the SINGLE BEST matching document type.

Rules:
1. Return ONLY the exact document type name from the list (no explanation)
2. Match based on the user's intent, industry, and use case
3. If multiple types could work, pick the most specific one
4. If nothing matches well, return the most generic option from the list

Available Document Types:
${availableTypes.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;

      const completion = await this.claude.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `User wants to create: ${userPrompt}

Select the best matching document type from the list above.`,
          },
        ],
      });

      const textBlock: any = completion.content.find(
        (block: any) => block.type === 'text'
      );
      const selectedType = textBlock?.text?.trim();

      // Validate the AI response
      if (selectedType && availableTypes.includes(selectedType)) {
        console.log(`✅ Matched document type: "${selectedType}" for category "${category}"`);
        return selectedType;
      }

      // Fallback: Try to find a partial match
      const partialMatch = availableTypes.find(t => 
        selectedType && t.toLowerCase().includes(selectedType.toLowerCase())
      );
      
      if (partialMatch) {
        console.log(`✅ Matched document type (partial): "${partialMatch}"`);
        return partialMatch;
      }

      // Final fallback: Return first option
      console.warn(`⚠️ AI returned invalid type: "${selectedType}", using fallback: "${availableTypes[0]}"`);
      return availableTypes[0];
    } catch (error) {
      console.error('❌ DocumentMatcher error:', error);
      // Return first available type as fallback
      return availableTypes[0];
    }
  }
}
