import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import { generateJSON } from '../lib/claude';
import axios from 'axios';

interface GeneratePresentationRequest {
    prompt: string;
    pageCount?: number;
    userId?: string;
    meta?: any;
}

interface ModifyPresentationRequest {
    prompt: string;
    presentationData: any;
    userId?: string;
    meta?: any;
    generationId?: string;
}

export class PresentationGeneratorController extends BaseController {
    public basePath = '/presentation-generator';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/generate',
                handler: this.generatePresentation.bind(this),
            },
            {
                verb: 'POST',
                path: '/modify',
                handler: this.modifyPresentation.bind(this),
            },
        ];
    }

    private async generatePresentation(req: Request, res: Response) {
        try {
            const { prompt, pageCount = 5, userId, meta } = req.body as GeneratePresentationRequest;

            if (!prompt) {
                return res.status(400).json({ error: 'Missing required field: prompt' });
            }

            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`📽️  Generating presentation for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
            console.log(`📄 Pages: ${pageCount}`);

            // 1. Create job in database
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'presentation',
                input_data: {
                    prompt: prompt,
                    pageCount: pageCount,
                    output: 'presentation',
                    meta: meta || {},
                    title: prompt.substring(0, 60)
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            const clampedPageCount = Math.max(3, Math.min(pageCount, 20));

            // 2. Generate presentation using Claude
            const systemPrompt = `
You are a SENIOR ART DIRECTOR at a top design agency (Pentagram/IDEO).
Your goal is to create a "Dribbble-worthy", award-winning presentation JSON for Polotno.
NO BORING CORPORATE SLIDES. We want "Editorial Design" quality.

### 1. NARRATIVE & PACING (CRITICAL)
- **Total Pages**: You MUST generate exactly ${clampedPageCount} pages.
- **Structure**:
  - **Page 1**: Title Slide (The Hook).
  - **Page 2**: Table of Contents / Executive Summary.
  - **Pages 3 to ${clampedPageCount - 1}**: The Core Story (Problem, Solution, Data, Strategy). Ensure a logical flow.
  - **Page ${clampedPageCount}**: Conclusion / Call to Action (The Mic Drop).
- **Rule**: Do not leave the story hanging. Wrap it up fully by Page ${clampedPageCount}.

### 2. LAYOUT & ALIGNMENT (THE "SAFE ZONE")
**CRITICAL**: Text often gets clipped. Follow these rules to keep it **ON SCREEN**:

**A. The "Safe Zone"**:
- **NEVER** place text closer than **100px** to the edge.
- **Min X**: 100
- **Max X + Width**: 1820

**B. "Foolproof Centering" Rule**:
- If you want text centered on screen:
  - SET \`x: 0\`
  - SET \`width: 1920\`
  - SET \`align: "center"\`
  - This guarantees it is centered. Do not try to guess "x=800".

**C. Typography Sizing**:
- **Titles**: 80px - 140px. (If title is long, reduce size to keep on screen).
- **Body**: 32px - 48px. (Never smaller than 24px).
- **Line Height**: 1.2 for titles, 1.5 for body.

### 3. VISUAL STYLE (THE "LOOK")
**Typography**:
- **Modern**: 'Inter' (Bold) + 'Roboto'
- **Elegant**: 'Playfair Display' (Italic) + 'Lato'
- **Contrast**: Text MUST be readable. Dark BG? Light Text.

**Backgrounds**:
- **80% of pages**: Full-Screen Image (LoremFlickr).
  - URL: \`https://loremflickr.com/1920/1080/{keywords}\`
  - **Keywords**: Comma-separated single words. NO spaces, NO extra slashes.
  - Example: \`"src": "https://loremflickr.com/1920/1080/startup,office"\`
  - **MANDATORY**: Overlay Rectangle (rgba(0,0,0,0.7)) behind text.
- **20% of pages**: Modern Gradients (Deep Blue, Slate, Purple).

### 4. LAYERING & Z-INDEX (CRITICAL)
**Polotno renders elements in array order. The LAST item is on TOP.**
To prevent "Blank Pages", you MUST follow this strict order in the 'children' array:

1.  **LAYER 1 (Bottom)**: Background Image (type: "image", width: 1920, height: 1080).
2.  **LAYER 2 (Middle)**: Dark Overlay (type: "figure", fill: "rgba(0,0,0,0.6)").
3.  **LAYER 3 (Top)**: TEXT & CONTENT.

### STRICT JSON RULES:
- **schemaVersion**: 1
- **width**: 1920, **height**: 1080, **unit**: "px", **dpi**: 72
- **fonts**: [], **audios**: []
- **pages**: Array of Page objects.

### Page Object Structure:
- **id**: string (e.g., "page-1")
- **background**: "#000000" (Always set a dark fallback color)
- **children**: Array of elements (See Layering Rule above).

### Attributes Reference:
- **Text**: id, type="text", x, y, width, fontSize, fontFamily, fill, align, fontWeight.
- **Image**: id, type="image", x, y, width, height, src, opacity.
- **Figure**: id, type="figure", x, y, width, height, fill, subType="rect".

Return ONLY valid Polotno JSON. No markdown, no explanation.
`;

            const userPrompt = `
USER REQUEST: "${prompt}"

Generate a complete, professional presentation with exactly ${clampedPageCount} pages.
Make it visually stunning, with modern design, proper typography, and engaging layout.
`;

            const presentationResult = await generateJSON<any>(
                null,
                systemPrompt,
                userPrompt
            );

            console.log(`✅ Presentation structure generated successfully!`);

            // 3. Save result to database
            const result = {
                jobId: job.id,
                outputFormat: 'presentation',
                editorState: presentationResult,
                status: 'success',
                tokensUsed: 0
            };

            // 4. Save JSON to Supabase Storage
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/presentations/${job.id}.json`;
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
                const localJsonDir = path.join(process.cwd(), 'public/uploads/presentations');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                jsonUrl = `${baseUrl}/uploads/presentations/${job.id}.json`;
            }

            // 5. Update job as completed
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: jsonUrl
            });

            // 6. Create vault item
            await SupabaseDB.createVaultItem(jobUserId, {
                title: prompt.substring(0, 100) || 'AI Generated Presentation',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: '',
                project: 'Presentations',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'presentation',
                    pageCount: clampedPageCount
                }
            });

            console.log(`💾 Presentation saved to database and vault!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    presentationData: presentationResult,
                    pageCount: clampedPageCount,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Presentation generation failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    private async modifyPresentation(req: Request, res: Response) {
        try {
            const { prompt, presentationData, userId, meta, generationId } = req.body as ModifyPresentationRequest;

            if (!prompt || !presentationData) {
                return res.status(400).json({ error: 'Missing required fields: prompt and presentationData' });
            }

            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`📽️  Modifying presentation for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

            // Check if we're updating an existing generation
            let job: any;
            if (generationId) {
                console.log(`🔄 Updating existing generation: ${generationId}`);
                // Update existing job
                job = { id: generationId };
                await SupabaseDB.updateGenerationJob(generationId, jobUserId, {
                    status: 'processing',
                    progress: 0
                });
            } else {
                // 1. Create NEW job in database
                job = await SupabaseDB.createGenerationJob(jobUserId, {
                    type: 'presentation',
                    input_data: {
                        prompt: prompt,
                        presentationData: presentationData,
                        output: 'presentation',
                        meta: meta || {},
                        title: `Modified: ${prompt.substring(0, 50)}`
                    },
                    status: 'processing'
                });
            }

            console.log(`📝 Job ID: ${job.id}`);

            // 2. SMART MODIFICATION: Extract slide number from prompt if specified
            // Match patterns: "slide 10", "10th slide", "slide #10", "page 10", etc.
            const slideMatch = prompt.match(/(?:slide|page)\s*#?\s*(\d+)|(\d+)(?:st|nd|rd|th)?\s+(?:slide|page)/i);
            const targetSlideIndex = slideMatch ? parseInt(slideMatch[1] || slideMatch[2]) - 1 : -1;
            
            console.log(`🔍 Prompt analysis: "${prompt}"`);
            console.log(`🔍 Slide match found: ${slideMatch ? 'YES' : 'NO'}`);
            if (slideMatch) {
                console.log(`🎯 Target slide number: ${targetSlideIndex + 1} (index: ${targetSlideIndex})`);
                console.log(`📊 Total slides available: ${presentationData.pages.length}`);
            }

            let modifiedPresentation: any;

            if (targetSlideIndex >= 0 && presentationData.pages && targetSlideIndex < presentationData.pages.length) {
                console.log(`✅ VALID SLIDE NUMBER: Will modify only slide ${targetSlideIndex + 1} of ${presentationData.pages.length}`);
                
                // Extract just the target slide
                const targetSlide = presentationData.pages[targetSlideIndex];
                
                // Smart prompt that only processes ONE slide
                const systemPrompt = `
You are a SLIDE MODIFICATION EXPERT.
Your task is to modify a SINGLE SLIDE from a presentation.

CRITICAL RULES:
- ONLY modify what the user asks for in THIS SLIDE
- Keep the slide dimensions: 1920x1080
- Maintain proper layering: Background → Overlay → Content
- Keep text in safe zones (100px from edges)
- If changing images, use LoremFlickr: https://loremflickr.com/1920/1080/{keywords}
- Return ONLY the modified slide as a valid Polotno page object

Return ONLY valid JSON for the slide. No markdown, no explanation.
`;

                const userPrompt = `
USER REQUEST: "${prompt}"

CURRENT SLIDE DATA:
${JSON.stringify(targetSlide, null, 2)}

Modify this slide according to the request and return the COMPLETE modified slide.
`;

                console.log(`⏱️  Calling Claude for SINGLE slide modification...`);
                const modifiedSlide = await generateJSON<any>(
                    null,
                    systemPrompt,
                    userPrompt
                );

                console.log(`✅ Slide modified! Processing images...`);

                // Find and replace LoremFlickr URLs with permanent Supabase URLs
                const processedSlide = await this.replaceLoremFlickrImages(modifiedSlide, jobUserId, job.id);

                // Replace only the modified slide
                modifiedPresentation = {
                    ...presentationData,
                    pages: presentationData.pages.map((page: any, index: number) => 
                        index === targetSlideIndex ? processedSlide : page
                    )
                };

                console.log(`💾 Slide images made permanent!`);

            } else if (targetSlideIndex >= 0) {
                // Slide number was found but it's invalid
                console.log(`⚠️  INVALID SLIDE NUMBER: User requested slide ${targetSlideIndex + 1} but presentation only has ${presentationData.pages.length} slides`);
                console.log(`🔄 Falling back to full modification...`);
                
                // Fallback: Full modification for invalid slide numbers
                const systemPrompt = `
You are a PRESENTATION MODIFICATION EXPERT.
ONLY modify what the user specifically asks for. Keep everything else IDENTICAL.

RULES:
- Maintain the same structure unless explicitly asked to change
- Keep the same visual style and design
- Maintain safe zones (text 100px from edges)
- Keep proper layering (Background → Overlay → Content)
- Return the COMPLETE modified presentation in valid Polotno JSON
`;

                const userPrompt = `
USER MODIFICATION REQUEST: "${prompt}"

CURRENT PRESENTATION (${presentationData.pages.length} slides):
${JSON.stringify(presentationData, null, 2)}

Modify according to the request. Return ONLY valid Polotno JSON.
`;

                modifiedPresentation = await generateJSON<any>(
                    null,
                    systemPrompt,
                    userPrompt
                );

            } else {
                console.log(`🔄 FULL MODIFICATION: No specific slide targeted, modifying entire presentation`);
                
                // Fallback: Full modification for complex changes
                const systemPrompt = `
You are a PRESENTATION MODIFICATION EXPERT.
ONLY modify what the user specifically asks for. Keep everything else IDENTICAL.

RULES:
- Maintain the same structure unless explicitly asked to change
- Keep the same visual style and design
- Maintain safe zones (text 100px from edges)
- Keep proper layering (Background → Overlay → Content)
- Return the COMPLETE modified presentation in valid Polotno JSON
`;

                const userPrompt = `
USER MODIFICATION REQUEST: "${prompt}"

CURRENT PRESENTATION (${presentationData.pages.length} slides):
${JSON.stringify(presentationData, null, 2)}

Modify according to the request. Return ONLY valid Polotno JSON.
`;

                modifiedPresentation = await generateJSON<any>(
                    null,
                    systemPrompt,
                    userPrompt
                );
            }

            console.log(`✅ Presentation modified successfully!`);

            // 2.5. Process ALL LoremFlickr images in the presentation to make them permanent
            if (modifiedPresentation && modifiedPresentation.pages && Array.isArray(modifiedPresentation.pages)) {
                console.log(`🖼️  Processing images in all ${modifiedPresentation.pages.length} slides...`);
                const processedPages = await Promise.all(
                    modifiedPresentation.pages.map((page: any, index: number) => 
                        this.replaceLoremFlickrImages(page, jobUserId, `${job.id}_page${index}`)
                    )
                );
                modifiedPresentation = {
                    ...modifiedPresentation,
                    pages: processedPages
                };
                console.log(`💾 All images made permanent!`);
            }

            // 3. Save result
            const result = {
                jobId: job.id,
                outputFormat: 'presentation',
                editorState: modifiedPresentation,
                originalData: presentationData,
                status: 'success',
                tokensUsed: 0
            };

            // 4. Save to storage
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/presentations/${job.id}.json`;
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
                const localJsonDir = path.join(process.cwd(), 'public/uploads/presentations');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                jsonUrl = `${baseUrl}/uploads/presentations/${job.id}.json`;
            }

            // 5. Update job
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: jsonUrl
            });

            // 6. Create vault item
            await SupabaseDB.createVaultItem(jobUserId, {
                title: `Modified: ${prompt.substring(0, 80)}` || 'AI Modified Presentation',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: '',
                project: 'Presentations',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'presentation-modification'
                }
            });

            console.log(`💾 Modified presentation saved!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    presentationData: modifiedPresentation,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Presentation modification failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    // Helper method to replace LoremFlickr URLs with permanent Supabase URLs
    private async replaceLoremFlickrImages(slideData: any, userId: string, jobId: string): Promise<any> {
        // Recursively process the slide to find and replace LoremFlickr URLs
        const processElement = async (element: any, elementIndex: number): Promise<any> => {
            if (!element) return element;

            // Check if this element has a LoremFlickr image URL
            if (element.type === 'image' && element.src && element.src.includes('loremflickr.com')) {
                console.log(`🖼️  Found LoremFlickr URL: ${element.src}`);
                
                try {
                    // Download the image
                    console.log(`⬇️  Downloading image...`);
                    const response = await axios.get(element.src, { 
                        responseType: 'arraybuffer',
                        timeout: 10000 
                    });
                    const imageBuffer = Buffer.from(response.data, 'binary');
                    
                    // Upload to Supabase
                    const imagePath = `${userId}/presentations/${jobId}/slide_${elementIndex}_${Date.now()}.jpg`;
                    console.log(`⬆️  Uploading to Supabase: ${imagePath}`);
                    
                    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                        .from('generated-images')
                        .upload(imagePath, imageBuffer, {
                            contentType: 'image/jpeg',
                            upsert: true
                        });

                    if (uploadError) {
                        console.error(`❌ Upload failed:`, uploadError);
                        return element; // Return original if upload fails
                    }

                    // Get permanent URL
                    const { data: urlData } = supabaseAdmin.storage
                        .from('generated-images')
                        .getPublicUrl(imagePath);
                    
                    const permanentUrl = urlData.publicUrl;
                    console.log(`✅ Permanent URL created: ${permanentUrl}`);

                    // Return element with permanent URL
                    return {
                        ...element,
                        src: permanentUrl
                    };

                } catch (error) {
                    console.error(`❌ Failed to process LoremFlickr image:`, error);
                    return element; // Return original if processing fails
                }
            }

            return element;
        };

        // Process all children in the slide
        if (slideData.children && Array.isArray(slideData.children)) {
            const processedChildren = await Promise.all(
                slideData.children.map((child: any, index: number) => processElement(child, index))
            );

            return {
                ...slideData,
                children: processedChildren
            };
        }

        return slideData;
    }
}

export default PresentationGeneratorController;
