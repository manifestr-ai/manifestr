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
        // Check if we have a semantic schema (new approach) or blocks (old approach)
        const isSemantic = (input as any).semanticSchema && (input as any).documentType;
        
        if (!isSemantic && (!input || !input.blocks)) {
            throw new Error("Invalid Input: LayoutResponse is missing 'blocks' or 'semanticSchema'.");
        }

        // Handle SEMANTIC DOCUMENT GENERATION (NEW APPROACH)
        if (isSemantic) {
            return this.processSemanticDocument(input, job);
        }

        // Handle LEGACY BLOCK-BASED GENERATION (OLD APPROACH)
        const systemPrompt = `
        You are an expert GHOSTWRITER for a premium business publication.
        Your mission: Populate the document structure with DEEP, CRITICAL, and COMPREHENSIVE content.

        ### CRITICAL QUALITY STANDARDS:
        1. **DEPTH & SUBSTANCE**: Users want articles, whitepapers, and reports. ERROR if content is thin or summary-like.
        2. **LONG-FORM**: For 'body' components, write 4-6 PARAGRAPHS (400-600 words per section).
        3. **PROPER HTML FORMATTING** (CRITICAL - Use HTML, NOT Markdown):
           - Headings: Use <h1>, <h2>, <h3> tags (NOT # symbols)
           - Bold: Use <strong> tags (NOT ** symbols)
           - Italic: Use <em> tags (NOT * symbols)
           - Paragraphs: Use <p> tags with proper spacing
           - Lists: Use <ul><li> for bullets, <ol><li> for numbered
           - Tables: Use proper <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>
           - Code: Use <pre><code> for code blocks
        4. **PROFESSIONAL TONE**: ${input.intent.metadata.tone || 'Professional & Authoritative'}.

        ### 1. CONTENT PRINCIPLES
        - **Voice**: Intellectual, Thorough, Nuanced.
        - **Rule**: Explain "Why" and "How", not just "What".
        - **No Fluff**: Every sentence must add value, but EXPAND on the core ideas with examples, data, and historical context.
        - **Avoid Listicles**: Unless it's a specific list section, write cohesive prose.

        ### 2. COMPONENT INSTRUCTIONS
        
        **For "title" components**:
        - Use h1 HTML element for main title
        - Example format: h1 element with title text
        
        **For "author" components**:
        - Use p HTML element with placeholders
        - Format: By [Your Name], [Your Title] | [Your Company]
        - Do NOT use fake names.
        
        **For "subtitle" components**:
        - Use h2 HTML element for subtitles
        - Example: A descriptive subtitle that sets context
        
        **For "body" components (CRITICAL - FORMATTING MATTERS)**:
        - This is the core Article Text
        - **MANDATORY**: Write at least 400 words
        - **USE PROPER HTML FORMATTING**:
        
        HTML FORMATTING RULES:
        - Headings: Use h3, h4 tags for subsections
        - Paragraphs: Wrap all text in p tags
        - Bold: Use strong tags for important terms
        - Italic: Use em tags for emphasis
        - Lists: Use ul with li tags for bullets, ol with li for numbered
        - Tables: Use table with thead, tbody, tr, th, td structure
        - Code: Use pre with code tags for code blocks
        - Quotes: Use blockquote with cite tags
        
        EXAMPLE STRUCTURE:
        Start with h3 heading, then multiple p paragraphs with strong/em emphasis, then ul list with li items, then table with proper structure, then more p paragraphs for analysis.
      
      **For "image" components**:
      - "Editorial" style photography or data visualization prompts.
      
      **For "chart" components**:
      - Return valid JSON string (same as presentation).
      
      **For "table" components**:
      - Generate HTML table with proper thead, tbody, tr, th, td tags
      - MINIMUM 5-10 rows with realistic, varied data
      - Use th tags in thead for headers
      - Use td tags in tbody for data cells
      - Content must be REALISTIC and RELEVANT.

      **For "quote" components**:
      - Use blockquote HTML element with cite for attribution
      - Format: blockquote wrapping p element for quote text, cite element for source
      - MUST use REAL, VERIFIABLE quotes from credible sources
      - Do NOT fabricate quotes
      
      **For "stat" components**:
      - Use div with class stat, strong for value, span for label
      - Format: Large number display with descriptive label below
      
      **For "callout" components**:
      - Use div with class callout
      - Format: strong element for heading, then explanation text
      
      **For "code" components**:
      - Use pre wrapping code elements for code blocks
      - Ensure proper indentation and line breaks
      - Use monospace-friendly formatting

      ### 3. ID MATCHING (CRITICAL)
      - You will receive a list of blocks with components.
      - **YOU MUST USE THE EXACT COMPONENT IDs PROVIDED IN THE INPUT.**
      - Do not invent new IDs. Do not change IDs.
      - Map content directly: { "section-1-body": "The content..." }

      ### 4. CONTEXT
      - Goal: ${input.intent.metadata.goal}
      - Audience: ${input.intent.metadata.audience}
      
      ### 5. OUTPUT FORMAT
      Return valid JSON matching ContentGenerationSchema.
      
      Example Output Structure:
      {
        "generatedContent": [
          {
            "blockId": "section-1",
            "content": {
               "section-1-title": "h1 element with title",
               "section-1-body": "h3 element then p elements with strong and em emphasis, then ul with li items, then more p elements" 
            }
          }
        ]
      }
      
      REMEMBER: Use HTML elements (h1, p, strong, em, ul, li, table, thead, tbody, tr, th, td) NOT Markdown syntax
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

    /**
     * NEW APPROACH: Process semantic document generation
     * This method handles flexible document structures based on document type
     */
    private async processSemanticDocument(input: any, job: any): Promise<ContentResponse> {
        const documentType = input.documentType;
        const semanticSchema = input.semanticSchema;
        
        // 🚀 OPTIMIZED: Moved schema to user message (85% prompt reduction!)
        // 🚀 FIXED: No longer forces excessive tables/arrays - now context-appropriate
        const systemPrompt = `You are a professional document writer. Fill the provided schema with high-quality, appropriate content.

RULES:
1. Keep exact schema structure (same keys, no additions/removals)
2. Content length: ${this.getContentLengthGuideline(documentType)}
3. Use HTML formatting (h1-h6, p, strong, em, ul, ol, table, blockquote)
4. NO Markdown syntax (no **, __, #)
5. For tables: Use appropriate row count (3-5 for simple docs, 6-10 for detailed tracking docs)
6. For arrays: Generate appropriate entries based on context (2-3 for simple lists, 5-8 for comprehensive sections)
7. Focus on QUALITY over QUANTITY - don't add filler content

Context: ${documentType} | Tone: ${input.intent.metadata.tone} | Audience: ${input.intent.metadata.audience}`;

        // User message now contains the schema (NOT in system prompt!)
        const userMessage = `Fill this ${documentType} schema with professional content for: "${input.intent.originalPrompt}"

SCHEMA:
${JSON.stringify(semanticSchema, null, 2)}

Return ONLY the filled JSON with HTML-formatted content.`;

        // Generate content using the semantic schema
        const filledDocument: any = await generateJSON<any>(
            null,
            systemPrompt,
            userMessage
        );

        // Return in ContentResponse format
        const response: ContentResponse = {
            jobId: input.jobId,
            layout: input,
            generatedContent: [{
                blockId: 'semantic-document',
                content: {
                    documentType: documentType,
                    semanticDocument: filledDocument
                }
            }]
        };

        return response;
    }

    /**
     * Get content length guidelines based on document type
     */
    private getContentLengthGuideline(docType: string): string {
        if (docType.includes('article') || docType.includes('blog') || docType.includes('report') || docType.includes('whitepaper')) {
            return '500-800 words per section, 4-8 paragraphs';
        } else if (docType.includes('letter') || docType.includes('email')) {
            return '150-250 words per section';
        } else if (docType.includes('legal')) {
            return '100-200 words per clause';
        } else if (docType.includes('checklist')) {
            return '5-15 detailed items per category';
        } else if (docType.includes('resume') || docType.includes('cv')) {
            return '3-5 bullet points per role with metrics';
        } else {
            return '200-400 words per section';
        }
    }
}
