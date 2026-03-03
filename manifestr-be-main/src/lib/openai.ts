import OpenAI from 'openai';
import { ZodError } from 'zod';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateJSON<T>(schema: any, systemPrompt: string, userPrompt: string, maxRetries: number = 10): Promise<T> {
    let attempt = 0;

    // Initialize conversation history
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt + "\n RESPONSE MUST BE VALID JSON." },
        { role: "user", content: userPrompt }
    ];


    while (attempt < maxRetries) {
        attempt++;
        let rawContent: string | null = null;

        try {

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-2024-08-06",
                response_format: { type: "json_object" },
                messages: messages,
            });

            rawContent = completion.choices[0].message.content;

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

        } catch (e) {
            // Prepare for retry: Feed back the error to the AI
            let errorMessage = (e as Error).message;
            if (e instanceof ZodError) {
                // Format Zod errors to be more readable for the AI
                const issues = e.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                    expected: (err as any).expected,
                    received: (err as any).received
                }));
                
                errorMessage = `Schema Validation Failed: ${e.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')}`;
            } else {
            }

            // If we've reached max retries, throw the final error
            if (attempt >= maxRetries) {
                throw new Error(`Failed to generate/validate JSON after ${maxRetries} attempts. Last error: ${errorMessage}`);
            }

            // Append the bad response and the error to the history
            if (rawContent) {
                messages.push({ role: "assistant", content: rawContent });
            }

            messages.push({
                role: "user",
                content: `The previous response was invalid. Please fix the following errors and return ONLY the valid JSON:\n\nError: ${errorMessage}`
            });

        }
    }

    throw new Error("Unexpected loop exit");
}
