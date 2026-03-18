import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { s3Util } from '../utils/s3.util';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { generateJSON } from '../lib/claude';

interface GenerateImageRequest {
    prompt: string;
    userId?: string;
    meta?: any;
}

export class ImageGeneratorController extends BaseController {
    public basePath = '/image-generator';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/generate',
                handler: this.generateImage.bind(this),
            },
        ];
    }

    private async generateImage(req: Request, res: Response) {
        try {
            const { prompt, userId, meta } = req.body as GenerateImageRequest;

            if (!prompt) {
                return res.status(400).json({ error: 'Missing required field: prompt' });
            }

            // Extract userId from auth or body - use default UUID if not available
            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b'; // Default user for testing
            const jobUserId = userId || (req as any).user?.id || defaultUserId;

            console.log(`🎨 Generating image for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

            // 1. Create job in database FIRST
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'image',
                input_data: {
                    prompt: prompt,
                    output: 'image',
                    meta: meta || {},
                    title: prompt.substring(0, 60)
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            // 2. Generate an optimized Imagen 3 prompt using Claude
            const promptRefiner = `
            You are a MASTER ART DIRECTOR and VISUAL CURATOR for a top-tier creative agency.
            Your task is to take the user's project request and rewrite it into a highly detailed, professional prompt for Google's Imagen 3 AI image generator.
            
            USER REQUEST:
            "${prompt}"
            
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
            const optimizedPrompt = imgResult?.optimizedPrompt || prompt;

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

            // Using correct key for base64 encoded data from the response!
            const base64Image = response.data?.predictions?.[0]?.bytesBase64Encoded;

            if (!base64Image) {
                // Update job as failed
                await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                    status: 'failed',
                    error_message: 'No image data returned from Gemini API'
                });
                return res.status(500).json({ error: 'Failed to generate image' });
            }

            console.log(`✅ Image generated successfully via Gemini (Imagen 4)! Saving...`);

            // 4. Save image to AWS S3 for production accessibility
            const imageFileName = `${job.id}.png`;
            const imageBuffer = Buffer.from(base64Image, 'base64');
            
            // Upload to storage (S3 or local depending on environment)
            const imageKey = `vaults/generations/${jobUserId}/images/${imageFileName}`;
            await s3Util.uploadFile(imageKey, imageBuffer, 'image/png');
            
            // Get public URL
            const imageUrl = s3Util.getFileUrl(imageKey);
            console.log(`💾 Image saved to storage!`);
            console.log(`📍 Image URL: ${imageUrl}`);

            // 6. Save result to database
            const result = {
                jobId: job.id,
                outputFormat: 'image',
                editorState: {
                    imageUrl: imageUrl,  // Use S3 URL for production!
                    prompt: optimizedPrompt,
                    model: 'imagen-4.0-generate-001',
                    size: '1024x1024',
                    generatedAt: new Date().toISOString()
                },
                status: 'success',
                tokensUsed: 0
            };

            // 7. Save JSON to storage
            const jsonContent = JSON.stringify(result);
            const fileKey = `vaults/generations/${jobUserId}/${job.id}.json`;
            await s3Util.uploadFile(fileKey, jsonContent, 'application/json');

            // 8. Update job as completed
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: s3Util.getFileUrl(fileKey)
            });

            // 9. Create vault item with S3 URL for thumbnail
            await SupabaseDB.createVaultItem(jobUserId, {
                title: prompt.substring(0, 100) || 'AI Generated Image',
                type: 'file',
                status: 'Final',
                file_key: fileKey,
                thumbnail_url: imageUrl, // S3 URL for production!
                project: 'Generations',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'image',
                    imageUrl: imageUrl
                }
            });

            console.log(`💾 Job saved to database and vault!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    imageUrl: imageUrl,  // Return S3 URL for production!
                    prompt: prompt,
                    model: 'imagen-4.0-generate-001',
                    size: '1024x1024',
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Image generation failed:', error?.response?.data || error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error?.response?.data || (error instanceof Error ? error.message : String(error)) 
            });
        }
    }
}

export default ImageGeneratorController;
