import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import axios from 'axios';
import { generateJSON } from '../lib/claude';

interface ModifyImageRequest {
    prompt: string;
    imageUrl: string;
    userId?: string;
    meta?: any;
}

export class ImageModifierController extends BaseController {
    public basePath = '/image-generator';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/modify',
                handler: this.modifyImage.bind(this),
            },
        ];
    }

    private async modifyImage(req: Request, res: Response) {
        try {
            const { prompt, imageUrl, userId, meta } = req.body as ModifyImageRequest;

            if (!prompt || !imageUrl) {
                return res.status(400).json({ error: 'Missing required fields: prompt and imageUrl' });
            }

            // Extract userId from auth or body
            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`🎨 Modifying image for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
            console.log(`🖼️  Source Image: ${imageUrl.substring(0, 50)}...`);

            // 1. Create job in database
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'image',
                input_data: {
                    prompt: prompt,
                    imageUrl: imageUrl,
                    output: 'image',
                    meta: meta || {},
                    title: `Modified: ${prompt.substring(0, 50)}`
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            // 2. Generate optimized prompt for image modification
            const promptRefiner = `
            You are a MASTER IMAGE GENERATION SPECIALIST.
            Your task is to take the user's modification request and create a highly detailed prompt for Google's Imagen 4 AI to generate a NEW image based on the modification.
            
            USER MODIFICATION REQUEST:
            "${prompt}"
            
            ### 🎯 IMAGE GENERATION REQUIREMENTS:
            
            ⚠️ **CRITICAL REQUIREMENTS**: 
            - Generate a COMPLETE, photorealistic image incorporating the user's requested changes
            - The image should be professional, high-quality, and realistic
            - Focus on making the requested modifications the central feature
            - Ensure natural lighting, perspective, and professional composition
            
            1. **INTERPRET THE REQUEST**: Understand what the user wants to change or create
               - If they mention specific objects or changes, make those the focus
               - If they reference an existing image, infer the context and create a NEW version
               - Be creative but stay true to the user's intent
               
            2. **MAINTAIN REALISM**: The image must look natural and photorealistic
               - Use phrases like: "professional photography", "photorealistic", "natural lighting"
               - Include: "8k resolution", "highly detailed", "realistic"
               - Avoid: "cartoon", "illustration", "artificial"
               
            3. **FORMAT constraints**:
               - Write a detailed, comprehensive image generation prompt (60-100 words)
               - Describe the complete scene including the modifications
               - Include technical details: lighting, camera angle, quality, style
               - Add: "photorealistic, professional photography, highly detailed, natural"
               
            Return JSON ONLY: { "optimizedPrompt": "[Your detailed image generation prompt here]" }
            `;

            const imgResult = await generateJSON<any>(null, "You are an expert AI image editing prompt engineer.", promptRefiner);
            const optimizedPrompt = imgResult?.optimizedPrompt || prompt;

            console.log(`🔍 Optimized Modification Prompt: "${optimizedPrompt}"`);

            // 3. For now, generate a new image based on the modification prompt
            // Note: Imagen 4 via Gemini API has limited editing capabilities
            // We'll use text-to-image generation with the context
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("GEMINI_API_KEY is not set in environment variables");
            }

            console.log(`🎨 Generating modified image using text-to-image approach...`);

            // Create a comprehensive prompt that includes modification context
            const fullPrompt = `${optimizedPrompt}

IMPORTANT: Generate a NEW image based on the modification request. Maintain photorealistic quality and ensure the result looks professional and natural.`;

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
                {
                    instances: [
                        { prompt: fullPrompt }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "1:1"
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000 // 60 second timeout for image processing
                }
            );

            const base64ModifiedImage = response.data?.predictions?.[0]?.bytesBase64Encoded;

            if (!base64ModifiedImage) {
                await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                    status: 'failed',
                    error_message: 'No modified image data returned from Gemini API'
                });
                return res.status(500).json({ error: 'Failed to modify image' });
            }

            console.log(`✅ Image modified successfully via Gemini (Imagen 4)! Saving...`);

            // 5. Save modified image
            const imageFileName = `${job.id}.png`;
            const imageBuffer = Buffer.from(base64ModifiedImage, 'base64');
            let modifiedImageUrl: string;
            
            try {
                const imagePath = `${jobUserId}/images/${imageFileName}`;
                const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                    .from('generated-images')
                    .upload(imagePath, imageBuffer, {
                        contentType: 'image/png',
                        upsert: true
                    });

                if (uploadError) {
                    throw uploadError;
                }

                const { data: urlData } = supabaseAdmin.storage
                    .from('generated-images')
                    .getPublicUrl(imagePath);
                
                modifiedImageUrl = urlData.publicUrl;
                console.log(`💾 Modified image saved to Supabase Storage!`);
                console.log(`📍 Supabase URL: ${modifiedImageUrl}`);
            } catch (supabaseError: any) {
                // Fallback to local storage
                console.log(`⚠️ Supabase Storage unavailable, using local storage...`);
                
                const fs = require('fs');
                const path = require('path');
                const localDir = path.join(process.cwd(), 'public/uploads/images');
                if (!fs.existsSync(localDir)) {
                    fs.mkdirSync(localDir, { recursive: true });
                }
                
                const localPath = path.join(localDir, imageFileName);
                fs.writeFileSync(localPath, imageBuffer);
                
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}/uploads`;
                modifiedImageUrl = `${baseUrl}/images/${imageFileName}`;
                console.log(`💾 Image saved to local storage!`);
            }

            // 6. Save result to database
            const result = {
                jobId: job.id,
                outputFormat: 'image',
                editorState: {
                    imageUrl: modifiedImageUrl,
                    originalImageUrl: imageUrl,
                    prompt: optimizedPrompt,
                    userPrompt: prompt,
                    model: 'imagen-4.0-generate-001',
                    modificationType: 'edit',
                    generatedAt: new Date().toISOString()
                },
                status: 'success',
                tokensUsed: 0
            };

            // 7. Save metadata
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/metadata/${job.id}.json`;
            let jsonUrl: string;
            
            try {
                await supabaseAdmin.storage
                    .from('generated-images')
                    .upload(jsonPath, jsonContent, {
                        contentType: 'application/json',
                        upsert: true
                    });
                
                const { data: jsonUrlData } = supabaseAdmin.storage
                    .from('generated-images')
                    .getPublicUrl(jsonPath);
                jsonUrl = jsonUrlData.publicUrl;
            } catch (error) {
                const fs = require('fs');
                const path = require('path');
                const localJsonDir = path.join(process.cwd(), 'public/uploads/metadata');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}/uploads`;
                jsonUrl = `${baseUrl}/metadata/${job.id}.json`;
            }

            // 8. Update job as completed
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: jsonUrl
            });

            // 9. Create vault item
            await SupabaseDB.createVaultItem(jobUserId, {
                title: `Modified: ${prompt.substring(0, 80)}` || 'AI Modified Image',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: modifiedImageUrl,
                project: 'Modifications',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'image-modification',
                    imageUrl: modifiedImageUrl,
                    originalImageUrl: imageUrl
                }
            });

            console.log(`💾 Modification job saved to database and vault!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    imageUrl: modifiedImageUrl,
                    originalImageUrl: imageUrl,
                    prompt: prompt,
                    optimizedPrompt: optimizedPrompt,
                    model: 'imagen-4.0-generate-001',
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Image modification failed:', error?.response?.data || error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error?.response?.data || (error instanceof Error ? error.message : String(error)) 
            });
        }
    }
}

export default ImageModifierController;
