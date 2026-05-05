import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, LayoutResponse, LayoutGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class DocumentLayoutAgent extends BaseAgent<IntentResponse, LayoutResponse> {

    getProcessingStatus(): string {
        return 'processing_layout';
    }

    extractInput(job: any): IntentResponse {
        // Get output from previous agent (Intent)
        return job.result || job.current_step_data || job.input_data;
    }

    async process(input: IntentResponse, job: any): Promise<LayoutResponse> {
        if (!input || !input.metadata) {
            throw new Error("Invalid input: missing intent metadata");
        }


        // 🚀 FIXED: Schema generation now defaults to SIMPLE, TEXT-FIRST structures
        const systemPrompt = `You are a document structure architect. Analyze the user's request and create a MINIMAL semantic JSON schema.

CRITICAL RULES:
1. DEFAULT TO SIMPLE, TEXT-FIRST DOCUMENTS (articles, letters, reports, essays)
2. Use flat structures with: title, introduction, body sections, conclusion
3. ONLY use tables/complex structures if the user EXPLICITLY requests them (e.g., "create a table", "tracking sheet", "operations doc")
4. Keep schemas MINIMAL - focus on the SPECIFIC request, not comprehensive templates
5. Use semantic keys matching the user's actual request (not generic "operations" templates)
6. Return schema with placeholder values only

BAD (what NOT to do): Creating detailed "HR Operations" docs with 9 sections, tables, KPIs when user just asks for "a document"
GOOD (what to do): Creating simple text documents with title + 3-5 content sections

OUTPUT FORMAT:
{
  "documentType": "identified_type",
  "schema": { ... MINIMAL structure ... }
}

User's Goal: ${input.metadata.goal} | Audience: ${input.metadata.audience} | Tone: ${input.metadata.tone}`;

        // BYPASS SCHEMA - allow flexible semantic structures
        // 🚀 OPTIMIZED: Reduced max_tokens from 16000 to 4000 (schema generation only needs ~500-2000 tokens)
        // 🚀 FIXED: User message now clearly states the ACTUAL request instead of JSON dump
        const userMessage = `Create a SIMPLE schema for: "${input.originalPrompt}"

Document Type Hints:
- Goal: ${input.metadata.goal}
- Audience: ${input.metadata.audience}
- Tone: ${input.metadata.tone}

Remember: Keep it MINIMAL and TEXT-FIRST unless the user explicitly requests tables/complex structures.`;

        const generatedData: any = await generateJSON<any>(
            null,
            systemPrompt,
            userMessage,
            10, // maxRetries
            4000 // maxTokens - schema generation doesn't need 16k!
        );

        // Store the semantic schema in a flexible format
        // Build response with proper typing
        const response: any = {
            jobId: input.jobId,
            intent: input,
            blocks: [], // Keep for backward compatibility
        };
        
        // Add semantic fields dynamically to avoid type checking
        response.documentType = generatedData.documentType || 'generic';
        response.semanticSchema = generatedData.schema || generatedData;

        return response as LayoutResponse;
    }
}
