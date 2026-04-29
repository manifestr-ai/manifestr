import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import axios from 'axios';
import { generateJSON } from '../lib/claude';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { trackEvent, MixpanelEvents } from '../lib/mixpanel';

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
                middlewares: [authenticateToken],
            },
        ];
    }

    private async modifyImage(req: AuthRequest, res: Response) {
        try {
            const { prompt, imageUrl, meta } = req.body as ModifyImageRequest;

            if (!prompt || !imageUrl) {
                return res.status(400).json({ error: 'Missing required fields: prompt and imageUrl' });
            }

            // Get userId from authenticated user
            const jobUserId = req.user!.userId;

            console.log(`🎨 Editing image for user ${jobUserId}...`);
            console.log(`📝 Edit Request: ${prompt.substring(0, 100)}...`);
            console.log(`🖼️  Source Image: ${imageUrl.substring(0, 50)}...`);

            // Track edit started
            const startTime = Date.now();
            trackEvent(MixpanelEvents.AI_GENERATION_STARTED, jobUserId, {
                content_type: 'image',
                action: 'edit',
                edit_mode: 'gemini-image-edit',
                ai_model: 'gemini-2.5-flash-image',
                prompt_length: prompt.length,
                has_reference_image: true
            });

            // 1. Create job in database
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'image',
                input_data: {
                    prompt: prompt,
                    imageUrl: imageUrl,
                    output: 'image',
                    editMode: 'gemini-image-edit',
                    model: 'gemini-2.5-flash-image',
                    meta: meta || {},
                    title: `Edit: ${prompt.substring(0, 50)}`
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            // 2. Download the original image and convert to base64
            console.log(`📥 Downloading original image...`);
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            const originalImageBase64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
            console.log(`✅ Original image downloaded and converted to base64`);

            // 3. Generate an intelligent editing prompt
            const promptRefiner = `
            You are an EXPERT IMAGE EDITING SPECIALIST.
            The user has an existing image and wants to make a specific modification to it.
            Your task is to create a clear, focused editing instruction for Google's Imagen 4 AI.
            
            USER'S EDITING REQUEST:
            "${prompt}"
            
            ### 🎯 IMAGE EDITING REQUIREMENTS:
            
            ⚠️ **CRITICAL**: This is an EDITING task, NOT generation from scratch!
            - The AI must PRESERVE the existing image context
            - ONLY modify what the user specifically requests
            - Keep the same composition, lighting, style, and perspective
            - The edit should blend seamlessly with the original
            
            1. **FOCUS ON THE CHANGE**: Be specific about what to add/modify/remove
               - If adding objects: Specify where and how they should fit naturally
               - If changing colors/style: Describe the exact modification
               - If removing objects: Be clear about what should replace them
               
            2. **PRESERVE CONTEXT**: Instruct the AI to maintain the original
               - "In the existing image, [describe the change]"
               - "Keep everything else the same"
               - "Blend naturally with the existing scene"
               
            3. **FORMAT**:
               - Write a concise, focused editing instruction (30-50 words)
               - Start with "In the existing image, " or "Edit this image to "
               - Be specific but not overly prescriptive
               - Focus on the change, not recreating the entire scene
               
            Return JSON ONLY: { "editPrompt": "[Your focused editing instruction here]" }
            `;

            const editResult = await generateJSON<any>(null, "You are an expert AI image editing specialist.", promptRefiner);
            const editPrompt = editResult?.editPrompt || `In the existing image, ${prompt}`;

            console.log(`🔍 Generated Edit Instruction: "${editPrompt}"`);

            // 4. Use Google Gemini API for image editing (the current recommended approach)
            // NOTE: Imagen 3 is deprecated as of 2026, Gemini 2.5 Flash Image is the replacement
            // This uses generateContent with reference images to preserve original context
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("GEMINI_API_KEY is not set in environment variables");
            }

            console.log(`✏️ Using Gemini 2.5 Flash Image API (current 2026 image editing API)...`);
            console.log(`🎯 This will PRESERVE the original context and only apply the requested changes`);
            console.log(`📸 Original image size (base64): ${originalImageBase64.length} chars`);

            // Use Gemini 2.5 Flash Image with generateContent - this is the current API for image editing
            // The model takes a reference image and text prompt, and outputs an edited image
            let response;
            try {
                response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `${editPrompt}. Important: Keep the original scene, composition, and all existing objects exactly as they are. Only modify what is specifically requested.`
                                    },
                                    {
                                        inline_data: {
                                            mime_type: "image/png",
                                            data: originalImageBase64
                                        }
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            responseModalities: ["IMAGE"] // Request image output
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 90000 // Image editing can take longer
                    }
                );
            } catch (apiError: any) {
                console.error('❌ Gemini API call failed:', apiError.response?.data || apiError.message);
                throw new Error(`Gemini API error: ${apiError.response?.data?.error?.message || apiError.message}`);
            }

            // Log the full response for debugging
            console.log('🔍 Full Gemini API Response:', JSON.stringify(response.data, null, 2));
            console.log('🔍 Candidates:', response.data?.candidates);
            console.log('🔍 First candidate:', response.data?.candidates?.[0]);
            console.log('🔍 Content:', response.data?.candidates?.[0]?.content);
            console.log('🔍 Parts:', response.data?.candidates?.[0]?.content?.parts);
            
            // Extract the edited image from Gemini response
            // Try multiple possible locations where the image might be
            let base64ModifiedImage = null;
            
            // Try 1: candidates[0].content.parts[x].inline_data.data
            if (!base64ModifiedImage && response.data?.candidates?.[0]?.content?.parts) {
                const imagePart = response.data.candidates[0].content.parts.find(
                    (part: any) => part.inline_data?.mime_type?.startsWith('image/')
                );
                base64ModifiedImage = imagePart?.inline_data?.data;
                console.log('📍 Try 1 (parts.inline_data.data):', base64ModifiedImage ? 'FOUND' : 'not found');
            }
            
            // Try 2: candidates[0].content.parts[x].inlineData.data (camelCase)
            if (!base64ModifiedImage && response.data?.candidates?.[0]?.content?.parts) {
                const imagePart = response.data.candidates[0].content.parts.find(
                    (part: any) => part.inlineData?.mimeType?.startsWith('image/')
                );
                base64ModifiedImage = imagePart?.inlineData?.data;
                console.log('📍 Try 2 (parts.inlineData.data):', base64ModifiedImage ? 'FOUND' : 'not found');
            }
            
            // Try 3: predictions array (old Imagen format)
            if (!base64ModifiedImage && response.data?.predictions?.[0]) {
                base64ModifiedImage = response.data.predictions[0].bytesBase64Encoded;
                console.log('📍 Try 3 (predictions):', base64ModifiedImage ? 'FOUND' : 'not found');
            }
            
            // Try 4: images array
            if (!base64ModifiedImage && response.data?.images?.[0]) {
                base64ModifiedImage = response.data.images[0].data || response.data.images[0].bytesBase64Encoded;
                console.log('📍 Try 4 (images):', base64ModifiedImage ? 'FOUND' : 'not found');
            }

            if (!base64ModifiedImage) {
                console.error('❌ Failed to extract image from response');
                console.error('Response structure:', JSON.stringify(response.data, null, 2));
                
                // Check for safety filters or errors
                const safetyRatings = response.data?.candidates?.[0]?.safetyRatings;
                const finishReason = response.data?.candidates?.[0]?.finishReason;
                
                await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                    status: 'failed',
                    error_message: `No edited image data returned. Finish reason: ${finishReason || 'unknown'}`
                });
                
                return res.status(500).json({ 
                    error: 'Failed to edit image - API returned no data',
                    details: `Gemini 2.5 Flash Image did not return image data. Finish reason: ${finishReason || 'unknown'}. This may be due to safety filters or an unsupported image format.`,
                    finishReason,
                    safetyRatings
                });
            }

            console.log(`✅ Image EDITED successfully via Gemini 2.5 Flash Image! Saving...`);

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
                    editPrompt: editPrompt,
                    userPrompt: prompt,
                    model: 'gemini-2.5-flash-image',
                    modificationType: 'intelligent-edit',
                    editMode: 'gemini-image-edit',
                    preservedContext: true,
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
                title: `Edited: ${prompt.substring(0, 80)}` || 'AI Edited Image',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: modifiedImageUrl,
                project: 'AI Edits',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'image-edit',
                    editMode: 'gemini-image-edit',
                    model: 'gemini-2.5-flash-image',
                    imageUrl: modifiedImageUrl,
                    originalImageUrl: imageUrl,
                    preservedContext: true
                }
            });

            console.log(`💾 Edit job saved to database and vault! Image context preserved ✅`);

            // Track successful edit
            const duration = Date.now() - startTime;
            trackEvent(MixpanelEvents.IMAGE_MODIFIED, jobUserId, {
                job_id: job.id,
                edit_mode: 'gemini-image-edit',
                context_preserved: true,
                duration_ms: duration,
                ai_model: 'gemini-2.5-flash-image',
                prompt_length: prompt.length
            });

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    imageUrl: modifiedImageUrl,
                    originalImageUrl: imageUrl,
                    userPrompt: prompt,
                    editPrompt: editPrompt,
                    model: 'gemini-2.5-flash-image',
                    editMode: 'gemini-image-edit',
                    contextPreserved: true,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Image editing failed:', error);
            
            // Track edit failure
            trackEvent(MixpanelEvents.AI_GENERATION_FAILED, req.user?.userId, {
                content_type: 'image',
                action: 'edit',
                edit_mode: 'gemini-image-edit',
                ai_model: 'gemini-2.5-flash-image',
                error: error?.response?.data?.error?.message || error?.message || 'Unknown error'
            });
            
            // Log detailed error info for debugging
            if (error?.response) {
                console.error('API Response Error:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            
            // Try to update job status to failed
            try {
                if (req.body.imageUrl) {
                    const jobUserId = req.user!.userId;
                    // Find the most recent job for this user
                    const jobs = await SupabaseDB.getUserGenerationJobs(jobUserId);
                    const latestJob = jobs?.[0];
                    if (latestJob) {
                        await SupabaseDB.updateGenerationJob(latestJob.id, jobUserId, {
                            status: 'failed',
                            error_message: error?.response?.data?.error?.message || error.message || 'Image editing failed'
                        });
                    }
                }
            } catch (updateError) {
                console.error('Failed to update job status:', updateError);
            }
            
            return res.status(500).json({ 
                error: 'Image editing failed', 
                details: error?.response?.data?.error?.message || error?.message || 'Unknown error occurred',
                suggestion: 'The edit could not be applied. Try rephrasing your editing request or ensure the original image is accessible.'
            });
        }
    }
}

export default ImageModifierController;
