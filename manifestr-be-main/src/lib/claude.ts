import Anthropic from '@anthropic-ai/sdk';
import { ZodError } from 'zod';

export const claude = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateJSON<T>(schema: any, systemPrompt: string, userPrompt: string, maxRetries: number = 10, maxTokens: number = 16000): Promise<T> {
    let attempt = 0;

    // Initialize conversation history
    const messages: Anthropic.MessageParam[] = [
        { role: "user", content: userPrompt }
    ];

    const fullSystemPrompt = systemPrompt + "\n\nCRITICAL: You MUST respond with ONLY valid JSON. No explanation, no markdown code blocks, just pure JSON.";

    while (attempt < maxRetries) {
        attempt++;
        let rawContent: string | null = null;

        try {
            const completion = await claude.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: maxTokens,
                system: fullSystemPrompt,
                messages: messages,
            });

            // Extract text content from Claude's response
            const textBlock: any = completion.content.find((block: any) => block.type === 'text');
            rawContent = textBlock?.text || null;

            if (!rawContent) {
                throw new Error("No content generated");
            }

            // 1. Parse JSON
            let json;
            try {
                json = JSON.parse(rawContent);
            } catch (jsonError) {
                throw new Error(`Invalid JSON format: ${(jsonError as Error).message}`);
            }

            // 2. Validate with Schema
            if (schema && typeof schema.parse === 'function') {
                const parsed = schema.parse(json);
                return parsed;
            }

            return json as T;

        } catch (e: any) {
            // Check for non-retryable API errors
            const errorMessage = e?.message || String(e);
            const statusCode = e?.status || e?.response?.status;
            
            // Non-retryable errors - fail immediately
            if (statusCode === 529 || errorMessage.includes('overloaded_error')) {
                throw new Error(`Claude API is overloaded (529). Please try again in a few moments. Request ID: ${e?.request_id || 'N/A'}`);
            }
            if (statusCode === 429 || errorMessage.includes('rate_limit')) {
                throw new Error(`Rate limit exceeded (429). Please wait before trying again.`);
            }
            if (statusCode === 401 || errorMessage.includes('authentication')) {
                throw new Error(`Authentication failed (401). Please check your Claude API key.`);
            }
            if (statusCode === 403) {
                throw new Error(`Access forbidden (403). Your API key may not have access to this model.`);
            }
            
            // Retryable errors (JSON/validation issues) - continue with retry logic
            let retryableErrorMessage = errorMessage;
            if (e instanceof ZodError) {
                // Format Zod errors to be more readable for Claude
                const issues = e.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                    expected: (err as any).expected,
                    received: (err as any).received
                }));
                
                retryableErrorMessage = `Schema Validation Failed: ${e.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')}`;
            }

            // If we've reached max retries, throw the final error
            if (attempt >= maxRetries) {
                throw new Error(`Failed to generate/validate JSON after ${maxRetries} attempts. Last error: ${retryableErrorMessage}`);
            }

            // Append the bad response and the error to the history
            if (rawContent) {
                messages.push({ role: "assistant", content: rawContent });
            }

            messages.push({
                role: "user",
                content: `The previous response was invalid. Please fix the following errors and return ONLY the valid JSON:\n\nError: ${retryableErrorMessage}`
            });
        }
    }

    throw new Error("Unexpected loop exit");
}
