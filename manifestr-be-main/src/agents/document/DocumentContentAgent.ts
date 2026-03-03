import { BaseAgent } from "../core/BaseAgent";
import { LayoutResponse, ContentResponse, ContentGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class DocumentContentAgent extends BaseAgent<LayoutResponse, ContentResponse> {

    getProcessingStatus(): string {
        return 'processing_content';
    }

    extractInput(job: any): LayoutResponse {
        // Get output from previous agent (Layout)
        return job.result || job.current_step_data;
    }

    async process(input: LayoutResponse, job: any): Promise<ContentResponse> {
        if (!input || !input.blocks) {
            throw new Error("Invalid Input: LayoutResponse is missing 'blocks'. Ensure LayoutAgent completed successfully.");
        }

        const systemPrompt = `
      You are an expert GHOSTWRITER for a premium business publication.
      Your mission: Populate the document structure with DEEP, CRITICAL, and COMPREHENSIVE content.

      ### CRITICAL QUALITY STANDARDS:
      1. **DEPTH & SUBSTANCE**: Users want articles, whitepapers, and reports. ERROR if content is thin or summary-like.
      2. **LONG-FORM**: For 'body' components, write 4-6 PARAGRAPHS (400-600 words per section).
      3. **STRUCTURED**: Use **Markdown** formatting (bolding, lists, subheaders) within the body text to create readability.
      4. **PROFESSIONAL TONE**: ${input.intent.metadata.tone || 'Professional & Authoritative'}.

      ### 1. CONTENT PRINCIPLES
      - **Voice**: Intellectual, Thorough, Nuanced.
      - **Rule**: Explain "Why" and "How", not just "What".
      - **No Fluff**: Every sentence must add value, but EXPAND on the core ideas with examples, data, and historical context.
      - **Avoid Listicles**: Unless it's a specific list section, write cohesive prose.

      ### 2. COMPONENT INSTRUCTIONS
      
      **For "title" components**:
      - Clear, Descriptive Article Headlines. 
      - Example: "The Strategic Implications of AI in Enterprise Healthcare"
      
      **For "author" components**:
      - Use placeholders: "By [Your Name], [Your Title] | [Your Company]".
      - Do NOT use fake names.
      
      **For "subtitle" components**:
      - Detailed Lead/Abstract. 3-4 sentences setting the rich context.
      
      **For "body" components (CRITICAL)**:
      - This is the core Article Text. 
      - **MANDATORY**: Write at least 400 words.
      - Include analysis, context, data points, and future outlook.
      - Use **Markdown** for emphasis (e.g. **key terms**) and structure.
      - *Do not* just write a single paragraph. Break it down.
      
      **For "image" components**:
      - "Editorial" style photography or data visualization prompts.
      
      **For "chart" components**:
      - Return valid JSON string (same as presentation).
      
      **For "table" components**:
      - Return a JSON string representing the table data.
      - Structure: { "headers": ["Col1", "Col2"], "rows": [["Val1", "Val2"], ["Val3", "Val4"]] }
      - Content must be REALISTIC and RELEVANT.

      **For "quote" components**:
      - MUST use a REAL, VERIFIABLE quote from a credible industry expert, historical figure, or thought leader (e.g. Steve Jobs, Peter Drucker).
      - Do NOT fabricate quotes.
      
      **For "stat" components**:
      - Generate a BIG NUMBER + Label.
      - Example: "94% | Growth Year over Year" or "$50M | Total Revenue".
      
      **For "callout" components**:
      - Summarize the key takeaway of the section. 1-2 sentences. "Insight: ...".

      ### 3. ID MATCHING (CRITICAL)
      - You will receive a list of blocks with components.
      - **YOU MUST USE THE EXACT COMPONENT IDs PROVIDED IN THE INPUT.**
      - Do not invent new IDs. Do not change IDs.
      - Map content directly: { "section-1-body": "The content..." }

      ### 4. CONTEXT
      - Goal: ${input.intent.metadata.goal}
      - Audience: ${input.intent.metadata.audience}
      
      ### 5. OUTPUT FORMAT
      Return valid JSON matching \`ContentGenerationSchema\`.
      
      Example Output:
      {
        "generatedContent": [
          {
            "blockId": "section-1",
            "content": {
               "section-1-title": "The Title",
               "section-1-body": "## Subheader\\n\\nParagraph 1 text...\\n\\nParagraph 2 text..." 
            }
          }
        ]
      }
            `;

        // BYPASS VALIDATION - accept anything from OpenAI
        const generatedData: any = await generateJSON<any>(
            null,
            systemPrompt,
            JSON.stringify(input.blocks)
        );

        let contentArray = generatedData.generatedContent || generatedData.content ||
            generatedData.blocks || Object.values(generatedData)[0];

        if (!Array.isArray(contentArray)) contentArray = [];

        generatedData.generatedContent = input.blocks.map((block: any, index: number) => {
            const aiContent = contentArray[index] || {};
            return {
                blockId: block.id,
                content: typeof aiContent.content === 'string'
                    ? { text: aiContent.content }
                    : (aiContent.content || aiContent || {})
            };
        });

        const response: ContentResponse = {
            jobId: input.jobId,
            layout: input,
            ...generatedData
        };

        return response;
    }
}
