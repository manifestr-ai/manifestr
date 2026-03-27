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
        
        const systemPrompt = `
        You are a WORLD-CLASS PROFESSIONAL DOCUMENT WRITER with expertise across ALL industries and document types.
        Your mission: Fill in the provided semantic document schema with HIGH-QUALITY, PROFESSIONAL, BEAUTIFULLY FORMATTED content.
        
        ### 📋 DOCUMENT TYPE: ${documentType.toUpperCase().replace(/_/g, ' ')}
        
        ### 🎯 YOUR TASK:
        You've been given a document schema (structure). Your job is to populate it with REAL, PROFESSIONAL content that matches the document type.
        
        ### ⚠️ CRITICAL RULES:
        
        1. **MAINTAIN THE EXACT SCHEMA STRUCTURE**: 
           - Keep ALL keys exactly as provided
           - Do NOT add new fields
           - Do NOT remove fields
           - Do NOT change the nesting structure
        
        2. **CONTENT QUALITY & LENGTH**:
           ${documentType.includes('letter') || documentType.includes('email') ? '- Professional business correspondence tone\n           - 150-250 words per main section' : ''}
           ${documentType.includes('legal') ? '- Legal language with clear, unambiguous terms\n           - Detailed clauses with 100-200 words each' : ''}
           ${documentType.includes('checklist') ? '- Clear, specific, actionable task items\n           - 5-15 detailed items per category' : ''}
           ${documentType.includes('run_sheet') || documentType.includes('event') ? '- Precise timing and clear responsibilities\n           - Detailed activity descriptions (50-100 words each)' : ''}
           ${documentType.includes('financial') || documentType.includes('invoice') ? '- Accurate numbers and professional formatting\n           - Detailed line item descriptions' : ''}
           ${documentType.includes('resume') || documentType.includes('cv') ? '- Achievement-focused, quantified accomplishments\n           - 3-5 bullet points per role with metrics' : ''}
           ${documentType.includes('article') || documentType.includes('blog') || documentType.includes('report') || documentType.includes('whitepaper') ? '- LONG-FORM CONTENT: 500-800 words per section\n           - Multiple detailed paragraphs with examples\n           - Include subheadings within sections\n           - Rich, comprehensive analysis' : ''}
           - For text fields: Write REALISTIC, PROFESSIONAL content
           - For arrays: Generate 5-12 realistic, detailed entries
           - For tables: Ensure 6-10 rows minimum with varied, realistic data
           - For numbers: Use plausible, realistic values
           - For dates: Use appropriate date formats (e.g., "January 15, 2025")
        
        3. **FORMATTING EXCELLENCE - USE PROPER HTML** (CRITICAL):
           
           📊 **TABLE FORMATTING**:
           - Generate HTML tables with thead, tbody, tr, th, td elements
           - MINIMUM 6-10 rows per table (not just 3-4!)
           - Use VARIED, realistic data - no repetitive patterns
           - Column values should be diverse and meaningful
           - Header row in thead with th elements
           - Data rows in tbody with td elements
           
           📝 **TEXT FORMATTING** (Use HTML tags, NOT Markdown):
           - Headings: Use h1, h2, h3, h4 elements (NOT Markdown # symbols)
           - Paragraphs: Wrap all text in p elements
           - Bold: Use strong elements (NOT Markdown asterisks)
           - Italic: Use em elements (NOT Markdown underscores)
           - Bullet lists: Use ul with li elements
           - Numbered lists: Use ol with li elements
           - Code blocks: Use pre with code elements
           - Quotes: Use blockquote with cite elements for attribution
           
           📐 **STRUCTURE**:
           - Clear visual hierarchy using proper heading levels
           - Consistent HTML formatting patterns
           - Professional spacing with p elements
           - Logical grouping of related information
           
           ⚠️ **CRITICAL**: Use HTML tags ONLY. Do NOT use Markdown syntax like asterisks, hashtags, or underscores
           
        4. **CONTENT DEPTH**:
           ${documentType.includes('article') || documentType.includes('blog') || documentType.includes('report') ? '- This is LONG-FORM content - GO BIG!\n           - Each section should have 4-8 paragraphs\n           - Include examples, data points, analysis\n           - Add context and background\n           - Explain the "why" and "how", not just "what"' : '- Provide comprehensive, detailed information\n           - Include relevant context and examples'}
        
        5. **CONTEXT**:
           - Original Request: "${input.intent.originalPrompt}"
           - Goal: ${input.intent.metadata.goal}
           - Audience: ${input.intent.metadata.audience}
           - Tone: ${input.intent.metadata.tone}
        
        6. **OUTPUT FORMAT**:
           Return the COMPLETE filled schema as valid JSON. Replace all placeholder descriptions with actual content.
           
           **FORMATTING REQUIREMENTS**:
           - ALL text content MUST use HTML elements (h1, h2, p, strong, em, ul, li, table, etc.)
           - Do NOT use Markdown syntax (asterisks, hashtags, underscores)
           - Tables MUST have 6-10 rows minimum with varied, realistic data
           - Text sections MUST be comprehensive and well-formatted with HTML
           - Code blocks MUST use pre wrapping code elements
           - Quotes MUST use blockquote elements
        
        ### 📄 SCHEMA TO FILL:
        ${JSON.stringify(semanticSchema, null, 2)}
        
        Return ONLY the filled JSON with proper HTML formatting. NO Markdown syntax.
        `;

        // Generate content using the semantic schema
        const filledDocument: any = await generateJSON<any>(
            null,
            systemPrompt,
            `Fill this ${documentType} document with professional content based on the user's request: "${input.intent.originalPrompt}"`
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
}
