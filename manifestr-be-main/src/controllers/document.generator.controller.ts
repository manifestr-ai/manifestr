import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import OpenAI from 'openai';
import { trackEvent, MixpanelEvents } from '../lib/mixpanel';

interface GenerateDocumentRequest {
    tool: 'Strategist' | 'Briefcase' | 'analyser' | 'studio' | 'wordsmith' | 'deck' | 'huddle' | 'cost ctrl';
    documentType: 'Proposal' | 'Report' | 'Briefs' | 'Campaign' | 'Workshop' | 'Playbooks' | 'Research' | 'Templates';
    prompt: string;
    pageCount?: number;
}

interface ModifyDocumentRequest {
    prompt: string;
    documentData: any;
    userId?: string;
    meta?: any;
}

export class DocumentGeneratorController extends BaseController {
    public basePath = '/document-generator';
    private openai: OpenAI;

    constructor() {
        super();
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    protected initializeRoutes(): void {
        /**
         * @openapi
         * /document-generator/create:
         *   post:
         *     tags: [Document Generator]
         *     summary: Generate a Polotno-compatible presentation document
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [tool, documentType, prompt]
         *             properties:
         *               tool:
         *                 type: string
         *                 enum: [Strategist, Briefcase, analyser, studio, wordsmith, deck, huddle, cost ctrl]
         *               documentType:
         *                 type: string
         *                 enum: [Proposal, Report, Briefs, Campaign, Workshop, Playbooks, Research, Templates]
         *               prompt:
         *                 type: string
         *               pageCount:
         *                 type: number
         *                 description: Number of pages to generate (5-20), default is 5.
         *     responses:
         *       200:
         *         description: Generated Polotno JSON schema
         *       400:
         *         description: Missing required fields
         *       500:
         *         description: Internal server error or generation failure
         */
        this.routes = [
            {
                verb: 'POST',
                path: '/create',
                handler: this.generateDocument.bind(this),
            },
            {
                verb: 'POST',
                path: '/modify',
                handler: this.modifyDocument.bind(this),
            },
        ];
    }

    private async generateDocument(req: Request, res: Response) {
        try {
            const { tool, documentType, prompt, pageCount = 5 } = req.body as GenerateDocumentRequest;

            if (!tool || !documentType || !prompt) {
                return res.status(400).json({ error: 'Missing required fields: tool, documentType, prompt' });
            }

            const clampedPageCount = Math.max(5, Math.min(pageCount, 20));

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
  - Example: \`"src": "https://loremflickr.com/1920/1080/nature,forest"\`
  - **MANDATORY**: Overlay Rectangle (rgba(0,0,0,0.7)) behind text.
- **20% of pages**: Modern Gradients (Deep Blue, Slate, Purple).

### 4. LAYERING & Z-INDEX (CRITICAL)
**Polotno renders elements in array order. The LAST item is on TOP.**
To prevent "Blank Pages", you MUST follow this strict order in the 'children' array:

1.  **LAYER 1 (Bottom)**: Background Image (type: "image", width: 1920, height: 1080).
2.  **LAYER 2 (Middle)**: Dark Overlay (type: "figure", fill: "rgba(0,0,0,0.6)").
3.  **LAYER 3 (Top)**: TEXT & CONTENT.
    *   **WARNING**: If you put the Background Image last, it will COVER everything and the page will look blank.

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

### INPUT:
- Context: ${tool} (${documentType})
- Prompt: ${prompt}
- Page Count: ${clampedPageCount}

GENERATE THE JSON NOW.
`;

            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Create a ${clampedPageCount}-page masterpiece presentation about: ${prompt}` }
                ],
                model: 'gpt-4o',
                max_tokens: 16000,
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;

            if (!content) {
                return res.status(500).json({ error: 'Failed to generate content from OpenAI' });
            }

            // Sanitization
            const cleanedContent = content.replace(/^```json/, '').replace(/```$/, '');
            const jsonResponse = JSON.parse(cleanedContent);

            return res.json(jsonResponse);

        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
        }
    }

    private async modifyDocument(req: Request, res: Response) {
        const startTime = Date.now();
        try {
            const { prompt, documentData, userId, meta } = req.body as ModifyDocumentRequest;

            if (!prompt || !documentData) {
                return res.status(400).json({ 
                    error: 'Missing required fields: prompt and documentData are required' 
                });
            }

            console.log('📝 Modifying document with prompt:', prompt);
            console.log('📄 Current document HTML length:', typeof documentData === 'string' ? documentData.length : 0);

            // Track AI generation started
            trackEvent(MixpanelEvents.AI_GENERATION_STARTED, userId, {
                content_type: 'document',
                action: 'modify',
                prompt_length: prompt.length,
            });

            // System prompt for HTML document modification
            const systemPrompt = `
You are a DOCUMENT MODIFICATION EXPERT specializing in HTML content for rich text editors.

**YOUR TASK**: Modify the existing HTML document based on the user's request while maintaining clean, semantic HTML.

**MODIFICATION RULES**:
1. **Preserve HTML Structure**: Keep valid HTML with proper tags (<h1>, <h2>, <p>, <strong>, <em>, <ul>, <ol>, etc.)
2. **Content Updates**: Apply the user's requested changes (text edits, formatting, additions, deletions, restructuring)
3. **Semantic HTML**: Use appropriate tags (h1-h6 for headings, p for paragraphs, strong for bold, em for italic)
4. **Clean Code**: No inline styles unless specifically requested; use semantic HTML tags
5. **Maintain Formatting**: Preserve existing formatting unless user asks to change it

**COMMON MODIFICATIONS**:
- Text changes: Update specific words, sentences, or paragraphs
- Formatting: Add headings, bold, italic, lists
- Structure: Reorder sections, add new paragraphs, remove content
- Style changes: Change heading levels, convert to lists, etc.

**RETURN FORMAT**: Return ONLY the modified HTML content, no extra wrapper, no markdown code blocks, just pure HTML.
`;

            const userPrompt = `
USER MODIFICATION REQUEST: "${prompt}"

CURRENT DOCUMENT HTML:
${documentData}

Please modify the document HTML according to the user's request and return the COMPLETE modified HTML.
Return only the HTML content, no additional formatting or code blocks.
`;

            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                model: 'gpt-4o',
                max_tokens: 16000
            });

            let modifiedHTML = completion.choices[0].message.content;

            if (!modifiedHTML) {
                return res.status(500).json({ error: 'Failed to generate modified document from OpenAI' });
            }

            // Clean up any markdown code blocks if AI added them
            modifiedHTML = modifiedHTML.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();

            console.log('✅ Document modified successfully!');
            console.log('📄 Modified HTML length:', modifiedHTML.length);

            // Track successful modification
            const duration = Date.now() - startTime;
            trackEvent(MixpanelEvents.DOCUMENT_MODIFIED, userId, {
                content_type: 'document',
                prompt_length: prompt.length,
                output_length: modifiedHTML.length,
                duration_ms: duration,
                ai_model: 'gpt-4o',
            });

            return res.json({
                status: 'success',
                data: {
                    documentData: modifiedHTML,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Document modification failed:', error);
            
            // Track generation failure
            trackEvent(MixpanelEvents.AI_GENERATION_FAILED, req.body.userId, {
                content_type: 'document',
                action: 'modify',
                error: error instanceof Error ? error.message : String(error),
            });
            
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }
}
