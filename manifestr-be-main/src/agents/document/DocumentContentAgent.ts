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
        
        3. **FORMATTING EXCELLENCE** (CRITICAL):
           
           📊 **TABLE FORMATTING**:
           - MINIMUM 6-10 rows per table (not just 3-4!)
           - Use VARIED, realistic data - no repetitive patterns
           - Column values should be diverse and meaningful
           - Proper alignment considerations (numbers right-aligned, text left-aligned)
           - Clean, consistent formatting across all rows
           
           📝 **TEXT FORMATTING**:
           - Use proper paragraph breaks (every 3-4 sentences)
           - Add spacing between logical sections
           - Use bullet points for lists (•)
           - Use numbered lists for sequences (1., 2., 3.)
           - Bold important terms using **bold syntax**
           - Italic for emphasis using *italic syntax*
           
           📐 **STRUCTURE**:
           - Clear visual hierarchy
           - Consistent formatting patterns
           - Professional spacing
           - Logical grouping of related information
           
        4. **CONTENT DEPTH**:
           ${documentType.includes('article') || documentType.includes('blog') || documentType.includes('report') ? '- This is LONG-FORM content - GO BIG!\n           - Each section should have 4-8 paragraphs\n           - Include examples, data points, analysis\n           - Add context and background\n           - Explain the "why" and "how", not just "what"' : '- Provide comprehensive, detailed information\n           - Include relevant context and examples'}
        
        5. **CONTEXT**:
           - Original Request: "${input.intent.originalPrompt}"
           - Goal: ${input.intent.metadata.goal}
           - Audience: ${input.intent.metadata.audience}
           - Tone: ${input.intent.metadata.tone}
        
        6. **OUTPUT FORMAT**:
           Return the COMPLETE filled schema as valid JSON. Replace all placeholder descriptions with actual content.
           Ensure tables have MINIMUM 6-10 rows with varied data.
           Ensure text sections are comprehensive and well-formatted.
        
        ### 📄 SCHEMA TO FILL:
        ${JSON.stringify(semanticSchema, null, 2)}
        
        Return ONLY the filled JSON with NO additional text.
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
