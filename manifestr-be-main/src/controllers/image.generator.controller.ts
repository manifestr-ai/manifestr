import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import axios from 'axios';
import { generateJSON } from '../lib/claude';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { WinsService, WINS_COSTS } from '../services/wins.service';

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

    // 🔥 Middleware to increase timeout for AI-heavy routes
    private extendTimeout(req: Request, res: Response, next: any) {
        req.socket.setTimeout(300000); // 5 minutes
        res.socket?.setTimeout(300000);
        next();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/generate',
                handler: this.generateImage.bind(this),
                middlewares: [authenticateToken, this.extendTimeout.bind(this)],
            },
            {
                verb: 'POST',
                path: '/apply-style-guide',
                handler: this.applyStyleGuide.bind(this),
                middlewares: [authenticateToken, this.extendTimeout.bind(this)],
            },
        ];
    }

    private async generateImage(req: AuthRequest, res: Response) {
        try {
            const { prompt, meta } = req.body as GenerateImageRequest;

            if (!prompt) {
                return res.status(400).json({ error: 'Missing required field: prompt' });
            }

            // Get userId from authenticated user
            const jobUserId = req.user!.userId;

            console.log(`🎨 Generating image for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

            // 💎 CHECK WINS BEFORE STARTING IMAGE GENERATION
            const requiredWins = WINS_COSTS.image_generation;
            const hasSufficient = await WinsService.hasSufficientWins(jobUserId, requiredWins);
            
            if (!hasSufficient) {
                const currentBalance = await WinsService.getBalance(jobUserId);
                return res.status(402).json({ 
                    error: 'Insufficient wins',
                    message: `Image generation requires ${requiredWins} wins. You have ${currentBalance} wins.`,
                    required: requiredWins,
                    available: currentBalance
                });
            }

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

            // 4. Save image with Supabase Storage fallback to local
            const imageFileName = `${job.id}.png`;
            const imageBuffer = Buffer.from(base64Image, 'base64');
            let imageUrl: string;
            
            // Try Supabase Storage first
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

                // Get Supabase public URL
                const { data: urlData } = supabaseAdmin.storage
                    .from('generated-images')
                    .getPublicUrl(imagePath);
                
                imageUrl = urlData.publicUrl;
                console.log(`💾 Image saved to Supabase Storage!`);
                console.log(`📍 Supabase URL: ${imageUrl}`);
            } catch (supabaseError: any) {
                // Fallback to local storage
                console.log(`⚠️ Supabase Storage unavailable (${supabaseError.message}), using local storage...`);
                
                const fs = require('fs');
                const path = require('path');
                const localDir = path.join(process.cwd(), 'public/uploads/images');
                if (!fs.existsSync(localDir)) {
                    fs.mkdirSync(localDir, { recursive: true });
                }
                
                const localPath = path.join(localDir, imageFileName);
                fs.writeFileSync(localPath, imageBuffer);
                
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}/uploads`;
                imageUrl = `${baseUrl}/images/${imageFileName}`;
                console.log(`💾 Image saved to local storage (fallback)!`);
                console.log(`📍 Local URL: ${imageUrl}`);
            }

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

            // 7. Save JSON to Supabase Storage (with fallback)
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
                // Fallback: Use local storage
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

            // 💎 DEDUCT WINS FOR SUCCESSFUL IMAGE GENERATION
            const winsCost = WINS_COSTS.image_generation;
            const deductionResult = await WinsService.deduct(
                jobUserId,
                winsCost,
                'image_generation',
                `Generated image: ${prompt.substring(0, 60)}`,
                job.id
            );

            if (!deductionResult.success) {
                console.error(`⚠️ Failed to deduct ${winsCost} wins for image generation:`, deductionResult.error);
            } else {
                console.log(`💎 Deducted ${winsCost} wins for image generation. New balance: ${deductionResult.newBalance}`);
            }

            // 9. Create vault item with Supabase URL for thumbnail
            await SupabaseDB.createVaultItem(jobUserId, {
                title: prompt.substring(0, 100) || 'AI Generated Image',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: imageUrl, // Supabase URL!
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

    /**
     * Lightweight style guide application endpoint
     * Uses minimal tokens and simpler prompts
     */
    private async applyStyleGuide(req: AuthRequest, res: Response) {
        try {
            const { imageUrl, styleGuide, prompt, jobId } = req.body;

            if (!imageUrl || !styleGuide) {
                return res.status(400).json({ error: 'Missing required fields: imageUrl and styleGuide' });
            }

            const jobUserId = req.user!.userId;
            console.log(`🎨 Applying style guide for user ${jobUserId}...`);

            // Download image and convert to base64
            let originalImageBase64: string;
            if (imageUrl.startsWith('data:')) {
                const base64Match = imageUrl.match(/^data:image\/[a-z]+;base64,(.+)$/);
                if (base64Match && base64Match[1]) {
                    originalImageBase64 = base64Match[1];
                } else {
                    throw new Error('Invalid base64 data URL format');
                }
            } else {
                const imageResponse = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                originalImageBase64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
            }

            // Simple, minimal-token prompt for style guide
            const stylePrompt = `IMPORTANT: Apply these brand colors to the image: Primary ${styleGuide.colors?.primary}, Secondary ${styleGuide.colors?.secondary}. The returned image MUST have NEW color grading applied - adjust tones, shadows, highlights, and color temperature to match the brand palette. Keep the composition identical but ensure visible color changes are applied throughout the image.`;
            
            console.log(`🎯 Style prompt: ${stylePrompt}`);

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("GEMINI_API_KEY is not set");
            }

            // Quick Gemini API call with retry
            let response;
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    console.log(`🔄 Attempt ${attempt}/2: Calling Gemini API...`);
                    response = await axios.post(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
                        {
                            contents: [{
                                parts: [
                                    { text: stylePrompt },
                                    {
                                        inline_data: {
                                            mime_type: "image/png",
                                            data: originalImageBase64
                                        }
                                    }
                                ]
                            }],
                            generationConfig: {
                                responseModalities: ["IMAGE"]
                            }
                        },
                        {
                            headers: { 'Content-Type': 'application/json' },
                            timeout: 60000
                        }
                    );
                    console.log(`✅ Gemini API call succeeded on attempt ${attempt}`);
                    break;
                } catch (apiError: any) {
                    const errorMsg = apiError.response?.data?.error?.message || apiError.message;
                    const isRateLimitError = errorMsg.includes('high demand') || 
                                           errorMsg.includes('quota') || 
                                           errorMsg.includes('rate limit') ||
                                           apiError.response?.status === 429;
                    
                    console.error(`❌ Gemini API error (attempt ${attempt}/2):`, errorMsg);
                    
                    if (isRateLimitError && attempt < 2) {
                        console.log(`⏳ Rate limit detected. Waiting 2s before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    if (attempt === 2) throw apiError;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            // Extract image from response - try multiple locations
            console.log('🔍 Checking Gemini API response for image...');
            console.log('📋 Response status:', response?.status);
            console.log('📋 Response has data:', !!response?.data);
            console.log('📋 Response has candidates:', !!response?.data?.candidates);
            console.log('📋 Number of candidates:', response?.data?.candidates?.length);
            
            // Log the full structure (limited to avoid huge logs)
            if (response?.data?.candidates?.[0]) {
                console.log('📋 First candidate structure:', JSON.stringify({
                    finishReason: response.data.candidates[0].finishReason,
                    hasContent: !!response.data.candidates[0].content,
                    hasParts: !!response.data.candidates[0].content?.parts,
                    partsCount: response.data.candidates[0].content?.parts?.length,
                    partTypes: response.data.candidates[0].content?.parts?.map((p: any) => Object.keys(p))
                }, null, 2));
            }
            
            let base64ModifiedImage = null;
            
            // Try 1: candidates[0].content.parts[x].inline_data.data
            if (!base64ModifiedImage && response?.data?.candidates?.[0]?.content?.parts) {
                console.log('🔍 Try 1: Checking parts.inline_data.data...');
                const parts = response.data.candidates[0].content.parts;
                console.log('📋 Parts:', parts.map((p: any, i: number) => ({
                    index: i,
                    keys: Object.keys(p),
                    hasInlineData: !!p.inline_data,
                    hasMimeType: !!p.inline_data?.mime_type,
                    mimeType: p.inline_data?.mime_type,
                    hasData: !!p.inline_data?.data,
                    dataLength: p.inline_data?.data?.length
                })));
                
                const imagePart = parts.find(
                    (part: any) => part.inline_data?.mime_type?.startsWith('image/')
                );
                base64ModifiedImage = imagePart?.inline_data?.data;
                if (base64ModifiedImage) console.log('✅ Found image in parts.inline_data.data');
            }
            
            // Try 2: candidates[0].content.parts[x].inlineData.data (camelCase)
            if (!base64ModifiedImage && response?.data?.candidates?.[0]?.content?.parts) {
                console.log('🔍 Try 2: Checking parts.inlineData.data (camelCase)...');
                const imagePart = response.data.candidates[0].content.parts.find(
                    (part: any) => part.inlineData?.mimeType?.startsWith('image/')
                );
                base64ModifiedImage = imagePart?.inlineData?.data;
                if (base64ModifiedImage) console.log('✅ Found image in parts.inlineData.data');
            }
            
            // Try 3: predictions array (old format)
            if (!base64ModifiedImage && response?.data?.predictions?.[0]) {
                console.log('🔍 Try 3: Checking predictions array...');
                base64ModifiedImage = response.data.predictions[0].bytesBase64Encoded;
                if (base64ModifiedImage) console.log('✅ Found image in predictions array');
            }

            if (!base64ModifiedImage) {
                console.error('❌ No image found in response.');
                
                // Check if there's a text response instead (model rejection)
                const textResponse = response?.data?.candidates?.[0]?.content?.parts?.find(
                    (part: any) => part.text
                )?.text;
                
                if (textResponse) {
                    console.error('⚠️ Model returned text instead of image:', textResponse);
                    throw new Error(`AI rejected the request: ${textResponse.substring(0, 200)}`);
                }
                
                // Check for safety ratings or finish reason
                const finishReason = response?.data?.candidates?.[0]?.finishReason;
                if (finishReason && finishReason !== 'STOP') {
                    console.error('⚠️ Unexpected finish reason:', finishReason);
                    throw new Error(`AI stopped with reason: ${finishReason}`);
                }
                
                console.error('Full response data:', JSON.stringify(response?.data, null, 2));
                throw new Error('No image returned from AI. The model may have rejected the request or the response format changed.');
            }
            
            console.log(`✅ Extracted base64 image (${base64ModifiedImage.length} characters)`);

            // Upload to storage
            const imageBuffer = Buffer.from(base64ModifiedImage, 'base64');
            const fileName = `styled-${Date.now()}.png`;
            const filePath = `${jobUserId}/styled-images/${fileName}`;

            let modifiedImageUrl: string;
            try {
                await supabaseAdmin.storage
                    .from('generated-images')
                    .upload(filePath, imageBuffer, {
                        contentType: 'image/png',
                        upsert: true
                    });
                
                const { data: urlData } = supabaseAdmin.storage
                    .from('generated-images')
                    .getPublicUrl(filePath);
                modifiedImageUrl = urlData.publicUrl;
            } catch {
                const fs = require('fs');
                const path = require('path');
                const localDir = path.join(process.cwd(), 'public/uploads/styled-images');
                if (!fs.existsSync(localDir)) {
                    fs.mkdirSync(localDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localDir, fileName), imageBuffer);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                modifiedImageUrl = `${baseUrl}/uploads/styled-images/${fileName}`;
            }

            console.log(`✅ Style guide applied successfully!`);

            // Update the job and vault with the new image URL if jobId is provided
            if (jobId && jobUserId) {
                try {
                    console.log(`💾 Updating job ${jobId} with new styled image...`);
                    
                    // 1. Update the generation job's result with new imageUrl
                    const job = await SupabaseDB.getGenerationJobById(jobId, jobUserId);
                    if (job) {
                        const updatedResult = {
                            ...job.result,
                            imageUrl: modifiedImageUrl,
                            editorState: {
                                ...job.result?.editorState,
                                imageUrl: modifiedImageUrl
                            }
                        };
                        await SupabaseDB.updateGenerationJob(jobId, jobUserId, {
                            result: updatedResult
                        });
                        console.log(`✅ Job ${jobId} updated with new image URL`);
                    }

                    // 2. Find and update the vault item by job ID
                    const vaultItems = await SupabaseDB.getUserVaultItems(jobUserId);
                    const vaultItem = vaultItems.find(
                        (item: any) => item.meta?.generationJobId === jobId
                    );
                    
                    if (vaultItem) {
                        await SupabaseDB.updateVaultItem(vaultItem.id, jobUserId, {
                            thumbnail_url: modifiedImageUrl
                        });
                        console.log(`✅ Vault item ${vaultItem.id} updated with new thumbnail`);
                    } else {
                        console.warn(`⚠️ No vault item found for job ${jobId}`);
                    }
                } catch (updateError) {
                    console.error('❌ Failed to update job/vault:', updateError);
                    // Don't fail the whole request if DB update fails
                }
            }

            return res.json({
                status: 'success',
                data: {
                    imageUrl: modifiedImageUrl,
                    brandName: styleGuide.brandName || styleGuide.name
                }
            });

        } catch (error: any) {
            console.error('❌ Style guide application failed:', error);
            
            const errorMsg = error?.response?.data?.error?.message || error?.message || 'Unknown error';
            const isRateLimitError = errorMsg.includes('high demand') || 
                                    errorMsg.includes('quota') || 
                                    error?.response?.status === 429;
            
            return res.status(isRateLimitError ? 429 : 500).json({ 
                error: isRateLimitError ? 'AI service busy' : 'Style guide failed',
                details: errorMsg,
                suggestion: isRateLimitError 
                    ? 'Please wait 30 seconds and try again.'
                    : 'Failed to apply style guide.',
                retryAfter: isRateLimitError ? 30 : undefined
            });
        }
    }
}

export default ImageGeneratorController;
