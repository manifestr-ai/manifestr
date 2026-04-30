import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ProfessionalDocGenerator } from '../generators/ProfessionalDocGenerator';
import { trackEvent, MixpanelEvents } from '../lib/mixpanel';
import Anthropic from '@anthropic-ai/sdk';

type Tool =
    | 'Strategist'
    | 'Briefcase'
    | 'analyser'
    | 'studio'
    | 'wordsmith'
    | 'deck'
    | 'huddle'
    | 'cost ctrl';

type DocumentType =
    | 'Proposal'
    | 'Report'
    | 'Briefs'
    | 'Campaign'
    | 'Workshop'
    | 'Playbooks'
    | 'Research'
    | 'Templates';

interface GenerateDocumentRequest {
    tool: Tool;
    documentType: DocumentType;
    prompt: string;
    userId?: string;
}

export class DocumentGeneratorController extends BaseController {
    public basePath = '/document-generator';
    private generator: ProfessionalDocGenerator;

    constructor() {
        super();
        this.generator = new ProfessionalDocGenerator();
    }

    protected initializeRoutes() {
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
        const startTime = Date.now();
        
        try {
            const { tool, documentType, prompt, userId } = req.body as GenerateDocumentRequest;

            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 DOCUMENT GENERATION REQUEST');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📋 Tool:', tool);
            console.log('📄 Document Type:', documentType);
            console.log('💬 Prompt:', prompt?.substring(0, 150) + (prompt?.length > 150 ? '...' : ''));
            console.log('👤 User ID:', userId || 'anonymous');

            if (!tool || !documentType || !prompt) {
                console.log('❌ Missing required fields');
                return res.status(400).json({
                    error: 'Missing required fields: tool, documentType, and prompt are required',
                });
            }

            // Track generation start
            trackEvent(MixpanelEvents.AI_GENERATION_STARTED, userId, {
                content_type: 'professional_docx',
                tool,
                document_type: documentType,
                prompt_length: prompt.length,
            });

            // Generate the Word document
            const docxBuffer = await this.generator.generateDocument({
                tool,
                documentType,
                prompt,
            });

            const duration = Date.now() - startTime;

            console.log('\n✨ Document generation completed!');
            console.log('⏱️  Total duration:', duration, 'ms');
            console.log('📦 File size:', Math.round(docxBuffer.length / 1024), 'KB');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Track successful generation
            trackEvent(MixpanelEvents.DOCUMENT_GENERATED, userId, {
                content_type: 'professional_docx',
                tool,
                document_type: documentType,
                file_size_kb: Math.round(docxBuffer.length / 1024),
                duration_ms: duration,
                ai_model: 'claude-sonnet-4-20250514',
            });

            // Generate filename
            const timestamp = Date.now();
            const filename = `${documentType}_${tool}_${timestamp}.docx`;

            // Set headers for file download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', docxBuffer.length);

            // Send the buffer
            return res.send(docxBuffer);

        } catch (error) {
            const duration = Date.now() - startTime;

            console.error('\n❌━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ GENERATION FAILED');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error:', error);
            console.error('Error message:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error && error.stack) {
                console.error('Stack trace:', error.stack);
            }
            console.error('Duration before failure:', duration, 'ms');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Track failure
            trackEvent(MixpanelEvents.AI_GENERATION_FAILED, req.body.userId, {
                content_type: 'professional_docx',
                action: 'generate',
                error: error instanceof Error ? error.message : String(error),
                duration_ms: duration,
            });

            return res.status(500).json({
                error: 'Failed to generate document',
                details: error instanceof Error ? error.message : String(error),
            });
        }
    }

    private async modifyDocument(req: Request, res: Response) {
        const startTime = Date.now();
        
        try {
            const { documentData, prompt, userId } = req.body;

            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✏️  DOCUMENT MODIFICATION REQUEST');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💬 User Prompt:', prompt?.substring(0, 150) + (prompt?.length > 150 ? '...' : ''));
            console.log('📄 Document data received:', !!documentData);
            console.log('👤 User ID:', userId || 'anonymous');

            if (!documentData || !prompt) {
                console.log('❌ Missing required fields');
                return res.status(400).json({
                    error: 'Missing required fields: documentData and prompt are required',
                });
            }

            // Track modification start
            trackEvent(MixpanelEvents.AI_GENERATION_STARTED, userId, {
                content_type: 'document',
                action: 'modify',
                prompt_length: prompt.length,
            });

            // Initialize Anthropic client
            const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
            if (!apiKey) {
                throw new Error('ANTHROPIC_API_KEY or CLAUDE_API_KEY not configured');
            }

            const anthropic = new Anthropic({ apiKey });

            // Get the HTML content from documentData
            const currentHtml = typeof documentData === 'string' 
                ? documentData 
                : documentData.html || documentData.content || JSON.stringify(documentData);

            console.log('📝 Current HTML length:', currentHtml.length);

            // Call Claude to modify the document
            const response = await anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 8000,
                temperature: 0.7,
                system: `You are an expert HTML document editor. You make precise modifications to HTML documents while preserving all styling, structure, and formatting.

CRITICAL RULES:
1. Return ONLY raw HTML - no markdown code blocks, no explanations
2. Preserve ALL <style> tags and CSS exactly as provided
3. Keep all existing element IDs and classes unchanged
4. Maintain the document structure and hierarchy
5. Make ONLY the specific changes requested by the user
6. Ensure the output is valid, well-formed HTML`,
                messages: [{
                    role: 'user',
                    content: `Modify this HTML document:

${currentHtml}

User's modification request:
${prompt}

Return the complete modified HTML document (raw HTML only, no code blocks):`
                }]
            });

            let modifiedHtml = response.content[0].type === 'text' 
                ? response.content[0].text.trim() 
                : '';

            // Clean up the response - remove markdown code blocks if present
            if (modifiedHtml.startsWith('```html')) {
                modifiedHtml = modifiedHtml.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
            } else if (modifiedHtml.startsWith('```')) {
                modifiedHtml = modifiedHtml.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
            }

            console.log('📝 Modified HTML preview (first 200 chars):', modifiedHtml.substring(0, 200));

            const duration = Date.now() - startTime;

            console.log('\n✨ Document modification completed!');
            console.log('⏱️  Total duration:', duration, 'ms');
            console.log('📊 Tokens used:', response.usage.input_tokens + response.usage.output_tokens);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Track successful modification
            trackEvent(MixpanelEvents.DOCUMENT_GENERATED, userId, {
                content_type: 'document',
                action: 'modify',
                duration_ms: duration,
                tokens_used: response.usage.input_tokens + response.usage.output_tokens,
                ai_model: 'claude-sonnet-4-20250514',
            });

            return res.json({
                success: true,
                data: {
                    documentData: modifiedHtml,
                    html: modifiedHtml,
                    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
                },
            });

        } catch (error) {
            const duration = Date.now() - startTime;

            console.error('\n❌━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ MODIFICATION FAILED');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error:', error);
            console.error('Error message:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error && error.stack) {
                console.error('Stack trace:', error.stack);
            }
            console.error('Duration before failure:', duration, 'ms');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Track failure
            trackEvent(MixpanelEvents.AI_GENERATION_FAILED, req.body.userId, {
                content_type: 'document',
                action: 'modify',
                error: error instanceof Error ? error.message : String(error),
                duration_ms: duration,
            });

            return res.status(500).json({
                error: 'Failed to modify document',
                details: error instanceof Error ? error.message : String(error),
            });
        }
    }
}
