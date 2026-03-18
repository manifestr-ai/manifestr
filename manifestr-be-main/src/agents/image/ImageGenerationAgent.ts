import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, RenderResponse } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import axios from "axios";

/**
 * ImageGenerationAgent
 * Generates AI images using Google's Gemini (Imagen 3)
 * Bypasses Layout/Content agents - goes straight from Intent to Render
 */
export class ImageGenerationAgent extends BaseAgent<IntentResponse, RenderResponse> {
    
    constructor() {
        super();
    }

    getProcessingStatus(): string {
        return 'generating_image';
    }

    extractInput(job: any): IntentResponse {
        return job.result || job.current_step_data;
    }

    async process(input: IntentResponse, job: any): Promise<RenderResponse> {
        console.log(`\n🎨 ImageGenerationAgent: Starting AI image generation for job ${input.jobId}`);

        // Extract the prompt
        const userPrompt = input.originalPrompt || job.input_data?.prompt || "A beautiful landscape";
        
        console.log(`📝 Image Prompt: ${userPrompt.substring(0, 100)}...`);

        try {
            // 2. Generate an optimized Imagen 3 prompt using Claude
            const promptRefiner = `
            You are a MASTER ART DIRECTOR and VISUAL CURATOR for a top-tier creative agency.
            Your task is to take the user's project request and rewrite it into a highly detailed, professional prompt for Google's Imagen 3 AI image generator.
            
            USER REQUEST:
            "${userPrompt}"
            
            ### 🎯 IMAGE GENERATION REQUIREMENTS:
            
            ⚠️ **CRITICAL REALISM REQUIREMENT**: 
            - The image MUST be REALISTIC, PROFESSIONAL, and PHOTOGRAPHIC in nature
            - NEVER generate cartoonish, illustrated, animated, or artificial-looking images
            - ALWAYS produce images that look like they were captured by a professional photographer
            - The result should be indistinguishable from real photography
            
            1. **INDUSTRIAL & PROFESSIONAL GRADE**: The image must be exceptionally high-quality, professional, and realistic photography. 
               - Specify camera angles, lighting (e.g., cinematic, studio lighting, volumetric)
               - Include phrases like: "professional photography", "real photograph", "shot on professional camera"
               
            2. **ACCURACY TO USER REQUEST**: The core subject MUST be exactly what the user asked for. Do not change the core subject, just enhance its presentation.
               
            3. **FORMAT constraints**:
               - Write a highly descriptive paragraph (50-80 words)
               - DO use powerful descriptors: "photorealistic", "realistic photography", "8k resolution", "highly detailed", "cinematic lighting", "editorial photography", "professional DSLR shot", "natural lighting"
               - MUST include anti-cartoon keywords: "not illustrated", "not cartoonish", "realistic", "photographic"
               
            4. **NEGATIVE SPACE**: If the prompt implies a need for wording or text overlays later, instruct the image generator to leave clean, negative space (e.g., "with empty negative space on the left side for text").
            
            Return JSON ONLY: { "optimizedPrompt": "[Your highly detailed image generation prompt here]" }
            `;

            const imgResult = await generateJSON<any>(null, "You are an expert AI image prompt engineer.", promptRefiner);
            const optimizedPrompt = imgResult?.optimizedPrompt || userPrompt;

            console.log(`🔍 Optimized Imagen 3 Prompt: "${optimizedPrompt}"`);

            // 3. Generate image using Gemini API (Imagen 3)
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("GEMINI_API_KEY is not set in environment variables");
            }

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
                {
                    instances: [
                        { prompt: optimizedPrompt }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "1:1"
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const base64Image = response.data?.predictions?.[0]?.bytesBase64Encoded;

            if (!base64Image) {
                throw new Error("No image data returned from Gemini API");
            }

            // Since this agent doesn't have access to express's req/res for writing files directly
            // We'll return the base64 URL format which works perfectly in browsers
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;

            console.log(`✅ Image generated successfully via Gemini (Imagen 3)!`);

            // Return the image URL in the response
            const renderResponse: RenderResponse = {
                jobId: input.jobId,
                outputFormat: "image",
                editorState: {
                    imageUrl: imageUrl,
                    prompt: optimizedPrompt,
                    generatedAt: new Date().toISOString(),
                    model: "imagen-4.0-generate-001",
                    size: "1024x1024"
                },
                tokensUsed: 0, // Gemini doesn't report token usage here
                status: "success"
            };

            return renderResponse;

        } catch (error: any) {
            console.error(`❌ Image generation failed:`, error?.response?.data || error);
            
            // Return error response with fallback
            const renderResponse: RenderResponse = {
                jobId: input.jobId,
                outputFormat: "image",
                editorState: {
                    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
                    prompt: userPrompt,
                    error: error.message,
                    fallback: true
                },
                tokensUsed: 0,
                status: "success" // Return success with fallback image
            };

            return renderResponse;
        }
    }
}
