import { BaseAgent } from "../core/BaseAgent";
import { ContentResponse, RenderResponse } from "../protocols/types";
import SupabaseDB from "../../lib/supabase-db";
import { s3Util } from "../../utils/s3.util";
import { PresentationEngine } from "./engines/PresentationEngine";
import { ProfessionalDocGenerator } from "../../generators/ProfessionalDocGenerator";
import { AnalyzerGenerator } from "../../services/AnalyzerGenerator";
import { AnalyzerCatalogService } from "../../services/AnalyzerCatalogService";
import { Packer } from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';

// @ts-ignore - mammoth doesn't have types
const mammoth = require('mammoth');

// Shared image fetcher used by Tiptap/Univer engines (not needed by Presentation which has its own)
async function fetchImageUrl(query: string): Promise<string> {
    const fallback = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
    if (!process.env.UNSPLASH_ACCESS_KEY) return fallback;
    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
            { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
        );
        const data = await res.json();
        return data.results?.[0]?.urls?.regular || fallback;
    } catch { return fallback; }
}

export class RenderingAgent extends BaseAgent<ContentResponse, RenderResponse> {

    getProcessingStatus(): string {
        return 'rendering';
    }

    extractInput(job: any): ContentResponse {
        // Get output from previous agent (Content)
        return job.result || job.current_step_data;
    }

    async process(rawInput: ContentResponse, job: any): Promise<RenderResponse> {
        let input = rawInput as any;

        // 🔄 ADAPTER: Check if input is IntentResponse (from bypass)
        if (input && input.metadata && !input.layout) {
             console.log("🔄 RenderingAgent: Received IntentResponse. Wrapping for Template-Only Mode.");
             input = {
                jobId: input.jobId,
                layout: {
                    intent: input, // The IntentResponse itself becomes part of layout.intent
                    blocks: [] 
                },
                generatedContent: []
             };
        }
        
        // Defensive checks
        if (!input || !input.layout) {
            throw new Error("Invalid input: missing layout data");
        }

        // 🆕 ANALYZER CHECK (Feature flag protected)
        const ENABLE_ANALYZER = process.env.ENABLE_ANALYZER === 'true';
        const isAnalyzerRequest = input.layout.intent.metadata?.isAnalyzer === true;

        if (ENABLE_ANALYZER && isAnalyzerRequest) {
            console.log('🔍 Analyzer request detected - routing to analyzer generation');
            try {
                return await this.handleAnalyzerGeneration(input, job);
            } catch (error) {
                console.error('❌ Analyzer generation failed, falling back to standard flow:', error);
                // Fall through to existing logic if analyzer fails
            }
        }

        // Check if this is a semantic document (skip block validation)
        const firstBlock = input.generatedContent?.[0];
        const isSemantic = firstBlock?.content?.semanticDocument;

        if (!isSemantic) {
            if (!input.layout.blocks || !Array.isArray(input.layout.blocks)) {
                throw new Error("Invalid input: layout.blocks is missing or not an array");
            }
            
            // Validate content mapping for legacy block-based documents
            if (!input.generatedContent || input.generatedContent.length === 0) {
            } else {
                // Check for mismatches
                const contentIds = new Set(input.generatedContent.map((c: any) => c.blockId));
                const layoutIds = new Set(input.layout.blocks.map((b: any) => b.id));
                
                input.layout.blocks.forEach((block: any) => {
                    if (!contentIds.has(block.id)) {
                    }
                });
            }
        }

        const format = input.layout.intent.metadata.outputFormat;
        let editorState: any = {};
        let docxDownloadUrl: string | undefined = undefined;

        if (format === 'presentation') {
            editorState = await this.convertToPolotno(input);
        } else if (format === 'document') {
            // Check if this is a semantic document
            const firstBlock = input.generatedContent?.[0];
            if (firstBlock?.content?.semanticDocument) {
                console.log('\n🎨 Generating professional document...');
                
                // Generate BEAUTIFUL HTML (NO MORE TIPTAP!)
                editorState = await this.convertSemanticToHTML(firstBlock.content);
                
                // ALSO generate beautiful Word document
                try {
                    const docxUrl = await this.generateAndUploadDocx(
                        input,
                        firstBlock.content,
                        job
                    );
                    docxDownloadUrl = docxUrl;
                    console.log('✅ Professional .docx generated:', docxUrl);
                } catch (error) {
                    console.error('❌ Failed to generate .docx (continuing with HTML only):', error);
                }
            } else {
                editorState = await this.convertToTiptap(input); // Legacy Tiptap JSON
            }
        } else if (format === 'spreadsheet' || format === 'chart') {
            // Both spreadsheet and chart use Univer format (data grid)
            // Frontend will render charts in chart-editor, spreadsheets in spreadsheet-editor
            editorState = this.convertToUniver(input);
        } else {
            // Fallback
            editorState = this.convertToUniver(input);
        }

        // In real life, we might upload this JSON to S3 if it's huge
        // For now, we return it.

        const response: RenderResponse = {
            jobId: input.jobId,
            outputFormat: format,
            editorState: editorState,
            docxUrl: docxDownloadUrl,
            tokensUsed: 0,
            status: "success"
        };

        return response;
    }

    protected async onJobCompleted(job: any): Promise<void> {

        try {
            // 1. Upload JSON output to S3
            const jsonContent = JSON.stringify(job.current_step_data);
            const fileKey = `vaults/generations/${job.userId}/${job.id}.json`;

            await s3Util.uploadFile(fileKey, jsonContent, 'application/json');

            // 2. Update Job with location
            // Use full URL for local storage compatibility
            job.final_url = s3Util.getFileUrl(fileKey);
            
            // Job is saved by BaseAgent after this hook returns, or we can save here to be safe but BaseAgent saves it.
            // Actually BaseAgent saves job AFTER this hook. So we just modify the object.

            // 3. Create Vault Item using Supabase
            // Extract specific document type from metadata if available
            const resultData = job.current_step_data || {};
            const metadata = resultData.layout?.intent?.metadata as any;
            const specificDocType = metadata?.specificDocumentType;
            const displayTitle = specificDocType || job.input_data?.title || "Untitled Generation";
            
            const vaultItem = await SupabaseDB.createVaultItem(job.user_id, {
                title: displayTitle,
                type: 'file',
                status: 'Final',
                file_key: fileKey,
                thumbnail_url: job.input_data?.cover_image,
                project: "Generations",
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: job.type,
                    specificDocumentType: specificDocType,
                    toolId: metadata?.toolId,
                    documentCategory: metadata?.documentCategory
                }
            });


        } catch (error) {
            // We don't throw here to avoid failing the job status itself, or maybe we do?
            // If vault save fails, the job is technically done but not persisted as user wants.
            // Let's log and proceed.
        }
    }

    // Presentation output → delegated entirely to PresentationEngine
    private async convertToPolotno(input: ContentResponse) {
        return PresentationEngine.render(input);
    }

    /**
     * Generate beautiful Word document and upload to S3
     */
    private async generateAndUploadDocx(
        input: ContentResponse,
        semanticContent: any,
        job: any
    ): Promise<string> {
        console.log('\n📄 Generating professional Word document...');
        
        const docGenerator = new ProfessionalDocGenerator();
        
        // Extract document info with safe access
        const metadata = input.layout.intent.metadata as any;
        // Use specific document type if matched, otherwise fall back to generic type
        const documentType = metadata.specificDocumentType || metadata.type || 'Report';
        const tool = metadata.selectedTool || 'Strategist';
        const prompt = job.input_data?.brief || 'Professional document';
        
        // Generate the Word document using the semantic structure
        const docxBuffer = await docGenerator.generateDocumentFromSemanticContent(
            documentType,
            tool,
            semanticContent.semanticDocument
        );
        
        console.log('✅ Word document generated:', Math.round(docxBuffer.length / 1024), 'KB');
        
        // Upload to S3
        const timestamp = Date.now();
        const filename = `${documentType}_${job.id}_${timestamp}.docx`;
        const s3Key = `vaults/generations/${job.userId || 'anonymous'}/${filename}`;
        
        console.log('📤 Uploading to S3:', s3Key);
        
        await s3Util.uploadFile(
            s3Key,
            docxBuffer,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        
        const downloadUrl = s3Util.getFileUrl(s3Key);
        console.log('✅ Upload complete! Download URL:', downloadUrl);
        
        return downloadUrl;
    }

    private async convertToTiptap(input: ContentResponse) {
        const contentNodes: any[] = [];

        for (const block of input.layout.blocks) {
            const blockContent = input.generatedContent.find(c => c.blockId === block.id);

            // Section Header
            contentNodes.push({
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: block.title }]
            });

            // Components
            for (const comp of block.components) {
                let text = blockContent?.content[comp.id];

                // Handle Images specifically
                if (comp.role === 'image') {
                    // Start async fetch
                    // The text here is the "prompt" for the image
                    const prompt = text || block.title;
                    const imageUrl = await fetchImageUrl(prompt);

                    contentNodes.push({
                        type: "image",
                        attrs: {
                            src: imageUrl,
                            alt: prompt,
                            title: prompt
                        }
                    });
                    continue;
                }

                if (!text) {
                    if (comp.role === 'body') {
                        text = "Writing content..."; // Better placeholder for UI
                    } else {
                        continue;
                    }
                }

                // Premium Components
                else if (comp.role === 'quote') {
                    contentNodes.push({
                        type: "blockquote",
                        content: [{ type: "paragraph", content: [{ type: "text", text: text }] }]
                    });
                } else if (comp.role === 'callout') {
                    // Simulating a callout with a specialized blockquote or just bold text if no extension
                    // Ideally use a 'callout' node if available, else Blockquote with strong.
                    contentNodes.push({
                        type: "blockquote",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    { type: "text", text: "💡 PRO TIP: ", marks: [{ type: "bold" }] },
                                    { type: "text", text: text }
                                ]
                            }
                        ]
                    });
                } else if (comp.role === 'stat') {
                    // Render as a large centered heading
                    contentNodes.push({
                        type: "heading",
                        attrs: { level: 2, textAlign: 'center' }, // alignment might depend on editor
                        content: [{ type: "text", text: text }]
                    });
                } else if (comp.role === 'table') {
                    // Table Rendering
                    try {
                        let tableData = text;
                        // Attempt to parse if string
                        if (typeof text === 'string') {
                            try { tableData = JSON.parse(text); } catch (e) {
                                // Fallback for simple csv or raw text? 
                            }
                        }

                        // Tiptap expected structure: table > tableRow > tableHeader/tableCell
                        if (tableData && tableData.headers && tableData.rows) {
                            const tableRows: any[] = [];

                            // Headers
                            const headerCells = tableData.headers.map((h: string) => ({
                                type: "tableHeader",
                                content: [{ type: "paragraph", content: [{ type: "text", text: String(h) }] }]
                            }));
                            tableRows.push({ type: "tableRow", content: headerCells });

                            // Rows
                            tableData.rows.forEach((row: string[]) => {
                                const cells = row.map(cell => ({
                                    type: "tableCell",
                                    content: [{ type: "paragraph", content: [{ type: "text", text: String(cell) }] }]
                                }));
                                tableRows.push({ type: "tableRow", content: cells });
                            });

                            contentNodes.push({
                                type: "table",
                                content: tableRows
                            });
                        }
                    } catch (e) {
                    }
                }

                if (comp.role === 'title') {
                    contentNodes.push({
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: text }]
                    });
                } else if (comp.role === 'author') {
                    contentNodes.push({
                        type: "paragraph",
                        content: [{ type: "text", text: text, marks: [{ type: "italic" }] }]
                    });
                } else if (comp.role === 'subtitle') {
                    contentNodes.push({
                        type: "heading",
                        attrs: { level: 3 },
                        content: [{ type: "text", text: text }]
                    });
                } else if (comp.role === 'body') {
                    // Markdown Parsing Logic
                    // 1. Split by newlines allowing for empty lines to signal paragraph breaks
                    const lines = text.split('\n');

                    lines.forEach((line: string) => {
                        const trimmed = line.trim();
                        if (!trimmed) return;

                        // Check for Headers (###, ##, #)
                        // IMPORTANT: Tiptap doesn't like converting paragraphs to headings if they are mixed
                        if (trimmed.startsWith('#')) {
                            const level = trimmed.match(/^#+/)?.[0].length || 1;
                            const cleanText = trimmed.replace(/^#+\s*/, '');

                            // Adjust level: MD '##' -> Tiptap Level 2, etc.
                            // We start at level 3 for body headings to keep hierarchy below section titles
                            const tiptapLevel = Math.min(Math.max(level + 1, 3), 5); // Shift +1, so # -> H3

                            contentNodes.push({
                                type: "heading",
                                attrs: { level: tiptapLevel },
                                content: [{ type: "text", text: cleanText }]
                            });
                        }
                        // Basic Paragraph
                        else {
                            // Check for Bold (**text**) - Simple implementation
                            const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                            const paragraphContent: any[] = [];

                            parts.forEach(part => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    paragraphContent.push({
                                        type: "text",
                                        text: part.slice(2, -2),
                                        marks: [{ type: "bold" }]
                                    });
                                } else if (part) {
                                    paragraphContent.push({
                                        type: "text",
                                        text: part
                                    });
                                }
                            });

                            if (paragraphContent.length > 0) {
                                contentNodes.push({
                                    type: "paragraph",
                                    content: paragraphContent
                                });
                            }
                        }
                    });
                }
            }

            // Add a horizontal rule between sections
            contentNodes.push({ type: "horizontalRule" });
        }

        return {
            type: "doc",
            content: contentNodes
        };
    }

    private convertToUniver(input: ContentResponse) {
        // Check for direct workbook injection (Advanced Generation from ContentAgent)
        // This allows ContentAgent to generate the FULL complex JSON structure (styles, sheets, formulas)
        // instead of us trying to piece it together from blocks.
        const firstBlock = input.generatedContent[0];
        if (firstBlock && firstBlock.content && firstBlock.content['workbook']) {
            const wb = firstBlock.content['workbook'];
            return typeof wb === 'string' ? JSON.parse(wb) : wb;
        }

        // Fallback: Create a basic Univer Snapshot structure from blocks
        // This is a simplified version; Univer's spec is very complex.
        const styles: any = {};
        const sheets: any = {};

        input.layout.blocks.forEach((block, index) => {
            const blockContent = input.generatedContent.find(c => c.blockId === block.id);
            const sheetId = `sheet-${index}`;
            const cellData: any = {};

            // We assume mapped components are Columns for a spreadsheet layout
            // Unless one component IS the whole table. 
            // Let's implement a logical flow where if content is an array, we spread it down rows.

            let currentRow = 0;

            // 1. Headers (Component Roles/Titles)
            cellData[currentRow] = {};
            block.components.forEach((comp, colIndex) => {
                cellData[currentRow][colIndex] = {
                    v: comp.role === 'table' ? (blockContent?.content[comp.id]?.title || "Table") : comp.role.toUpperCase(),
                    t: 1,
                    s: { key: 'headerStyle' } // Placeholder for style
                };
            });
            currentRow++;

            // 2. Data Population
            // Check if any component has Array data (e.g. a Table component)
            const tableComp = block.components.find(c => c.role === 'table');

            if (tableComp) {
                const tableData = blockContent?.content[tableComp.id];
                // Expecting tableData to be [{ col1: val, col2: val }, ...] or [[val, val], ...]
                if (Array.isArray(tableData)) {
                    tableData.forEach((rowItem: any) => {
                        cellData[currentRow] = {};
                        // If rowItem is object, map to columns? Or just dump values?
                        // Simple dump for robustness:
                        const values = typeof rowItem === 'object' ? Object.values(rowItem) : [rowItem];
                        values.forEach((v: any, cIdx) => {
                            cellData[currentRow][cIdx] = { v: String(v), t: typeof v === 'number' ? 2 : 1 };
                        });
                        currentRow++;
                    });
                }
            } else {
                // Standard Key-Value Vertical List 
                cellData[currentRow] = {};
                block.components.forEach((comp, colIndex) => {
                    const val = blockContent?.content[comp.id] || "";
                    cellData[currentRow][colIndex] = {
                        v: val,
                        t: typeof val === 'number' ? 2 : 1
                    };
                });
            }

            sheets[sheetId] = {
                id: sheetId,
                name: block.title,
                rowCount: Math.max(100, currentRow + 20),
                columnCount: 20,
                cellData: cellData
            };
        });

        return {
            id: input.jobId,
            appVersion: "3.0.0",
            sheets: sheets,
            locale: "en_US",
            styles: styles,
            resources: []
        };
    }

    /**
     * 🆕 NEW METHOD: Convert semantic document JSON to Tiptap format for display
     */
    /**
     * Load template DOCX and fill it with AI-generated content
     */
    private async fillTemplateWithContent(semanticDocument: any, documentType: string): Promise<string> {
        console.log('\n📄 Loading template and filling with content...');
        
        // Path to the template in the frontend public folder
        const templatePath = path.join(__dirname, '../../../manifestr-fe-main/public/Merchandise_Operations_Template.docx');
        
        try {
            // Read the template file
            const templateBuffer = fs.readFileSync(templatePath);
            console.log('✅ Template loaded successfully');
            
            // Convert DOCX to HTML using mammoth
            const result = await mammoth.convertToHtml(
                { buffer: templateBuffer },
                {
                    styleMap: [
                        "p[style-name='Heading 1'] => h1:fresh",
                        "p[style-name='Heading 2'] => h2:fresh",
                        "p[style-name='Heading 3'] => h3:fresh",
                    ]
                }
            );
            
            const templateHtml = result.value;
            console.log('✅ Template converted to HTML:', templateHtml.length, 'chars');
            
            // Initialize Anthropic client
            const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
            if (!apiKey) {
                throw new Error('ANTHROPIC_API_KEY or CLAUDE_API_KEY not configured');
            }
            
            const anthropic = new Anthropic({ apiKey });
            
            // Prepare the semantic content as JSON string
            const contentJson = JSON.stringify(semanticDocument, null, 2);
            
            console.log('🤖 Calling Claude to fill template with content...');
            
            // Call Claude to fill the template
            const response = await anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 8000,
                temperature: 0.7,
                system: `You are an expert document editor specializing in filling professional templates with relevant content.

CRITICAL INSTRUCTIONS:
1. You will receive an HTML template document and structured content data
2. Fill the template fields with appropriate content from the data
3. Preserve ALL HTML structure, styles, and formatting EXACTLY
4. Replace placeholder text (like "_______", "___", empty fields) with actual content from the data
5. Keep the same sections and structure - only fill in the content
6. Return ONLY the filled HTML, no explanations or markdown code blocks
7. Ensure all content is relevant and properly formatted`,
                messages: [{
                    role: 'user',
                    content: `Fill this HTML template document with the provided content data:

TEMPLATE HTML:
${templateHtml}

CONTENT DATA (JSON):
${contentJson}

Instructions:
- Map the content data to appropriate sections in the template
- Fill in all placeholder fields with relevant data
- Keep the same section headings and structure
- Ensure tables are filled with appropriate data if available
- Replace generic text with specific content from the data
- Maintain the professional formatting and style

Return the complete filled HTML document (raw HTML only, no code blocks):`
                }]
            });
            
            let filledHtml = response.content[0].type === 'text' 
                ? response.content[0].text.trim() 
                : templateHtml;
            
            // Clean up response - remove markdown code blocks if present
            if (filledHtml.startsWith('```html')) {
                filledHtml = filledHtml.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
            } else if (filledHtml.startsWith('```')) {
                filledHtml = filledHtml.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
            }
            
            console.log('✅ Template filled successfully!');
            console.log('📊 Tokens used:', response.usage.input_tokens + response.usage.output_tokens);
            
            return filledHtml;
            
        } catch (error) {
            console.error('❌ Error filling template:', error);
            console.error('Falling back to standard HTML generation...');
            // Fallback to the original method if template loading fails
            return this.generateHTMLFromScratch(documentType, semanticDocument);
        }
    }

    /**
     * Convert semantic document to BEAUTIFUL STYLED HTML (NO MORE TIPTAP!)
     */
    private async convertSemanticToHTML(content: any): Promise<string> {
        const { documentType, semanticDocument } = content;

        console.log('\n🎨 ═══════════════════════════════════════════════');
        console.log('🎨 PROFESSIONAL HTML DOCUMENT GENERATION');
        console.log('🎨 ═══════════════════════════════════════════════');
        console.log('📄 Document Type:', documentType);

        // Use template-based generation
        return await this.fillTemplateWithContent(semanticDocument, documentType);
    }

    /**
     * Fallback: Generate HTML from scratch (original method)
     */
    private async generateHTMLFromScratch(documentType: string, semanticDocument: any): Promise<string> {
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const docTitle = this.extractDocumentTitle(semanticDocument, documentType);

        // Professional CSS styling
        const styles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #2C2C2C;
                    background: #ffffff;
                    padding: 60px 80px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .document-header {
                    border-bottom: 3px solid #2E75B6;
                    padding-bottom: 24px;
                    margin-bottom: 48px;
                }
                
                .document-title {
                    font-size: 36px;
                    font-weight: 700;
                    color: #1F4E79;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                
                .document-subtitle {
                    font-size: 18px;
                    color: #666666;
                    font-style: italic;
                }
                
                .info-section {
                    background: #F5F9FC;
                    border-left: 4px solid #2E75B6;
                    padding: 24px;
                    margin: 32px 0;
                    border-radius: 4px;
                }
                
                .info-section h2 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1F4E79;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .info-table td {
                    padding: 12px;
                    border-bottom: 1px solid #E5E7EB;
                }
                
                .info-table td:first-child {
                    font-weight: 600;
                    color: #1F4E79;
                    width: 30%;
                }
                
                .section {
                    margin: 48px 0;
                }
                
                .section-heading {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1F4E79;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #D6E4F0;
                }
                
                .section-note {
                    font-size: 15px;
                    color: #666666;
                    font-style: italic;
                    margin-bottom: 24px;
                    padding-left: 20px;
                    border-left: 3px solid #D6E4F0;
                    padding: 12px 20px;
                    background: #FAFBFC;
                }
                
                .subsection-heading {
                    font-size: 22px;
                    font-weight: 600;
                    color: #2E75B6;
                    margin: 32px 0 16px 0;
                }
                
                .content-text {
                    margin: 16px 0;
                    line-height: 1.8;
                }
                
                .content-text strong {
                    color: #1F4E79;
                    font-weight: 600;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 24px 0;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                thead {
                    background: linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%);
                }
                
                th {
                    padding: 16px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: white;
                    border-right: 1px solid rgba(255,255,255,0.1);
                }
                
                th:last-child {
                    border-right: none;
                }
                
                td {
                    padding: 14px 16px;
                    border-bottom: 1px solid #E5E7EB;
                    font-size: 15px;
                }
                
                tbody tr:hover {
                    background: #F9FAFB;
                }
                
                tbody tr:last-child td {
                    border-bottom: none;
                }
                
                ul {
                    list-style: none;
                    margin: 20px 0;
                    padding: 0;
                }
                
                li {
                    padding: 10px 0 10px 32px;
                    position: relative;
                    line-height: 1.6;
                }
                
                li:before {
                    content: "•";
                    position: absolute;
                    left: 12px;
                    color: #2E75B6;
                    font-weight: bold;
                    font-size: 20px;
                }
                
                .checklist {
                    list-style: none;
                    margin: 20px 0;
                }
                
                .checklist li {
                    padding: 12px 0 12px 36px;
                    position: relative;
                }
                
                .checklist li:before {
                    content: "☐";
                    position: absolute;
                    left: 0;
                    color: #2E75B6;
                    font-size: 18px;
                }
                
                hr {
                    border: none;
                    border-top: 2px solid #D6E4F0;
                    margin: 48px 0;
                }
                
                .footer {
                    margin-top: 64px;
                    padding-top: 24px;
                    border-top: 1px solid #E5E7EB;
                    text-align: center;
                    color: #999999;
                    font-size: 14px;
                    font-style: italic;
                }
                
                @media print {
                    body {
                        padding: 40px;
                    }
                    
                    .section {
                        page-break-inside: avoid;
                    }
                    
                    table {
                        page-break-inside: avoid;
                    }
                }
            </style>
        `;

        // Build HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${docTitle}</title>
                ${styles}
            </head>
            <body>
                <div class="document-header">
                    <h1 class="document-title">${docTitle}</h1>
                    <p class="document-subtitle">Professional Business Document | ${currentDate}</p>
                </div>
                
                <div class="info-section">
                    <h2>📋 Document Information</h2>
                    <table class="info-table">
                        <tr>
                            <td><strong>Prepared By:</strong></td>
                            <td>___________________________________</td>
                        </tr>
                        <tr>
                            <td><strong>Date:</strong></td>
                            <td>${currentDate}</td>
                        </tr>
                        <tr>
                            <td><strong>Department:</strong></td>
                            <td>___________________________________</td>
                        </tr>
                        <tr>
                            <td><strong>Version:</strong></td>
                            <td>1.0</td>
                        </tr>
                    </table>
                </div>
                
                <hr>
        `;

        // Convert semantic structure to HTML
        htmlContent += this.convertObjectToHTML(semanticDocument, 1);

        // Footer
        htmlContent += `
                <hr>
                <div class="footer">
                    <p>End of Document</p>
                </div>
            </body>
            </html>
        `;

        console.log('✅ Professional HTML document generated!');
        console.log('📄 Total HTML length:', htmlContent.length, 'characters');
        console.log('🎨 ═══════════════════════════════════════════════\n');

        return htmlContent;
    }

    /**
     * Convert semantic object to HTML
     */
    private convertObjectToHTML(obj: any, sectionNumber: number): string {
        if (!obj || typeof obj !== 'object') return '';

        let html = '';
        let currentSection = sectionNumber;

        for (const [key, value] of Object.entries(obj)) {
            // Skip internal fields
            if (key === 'documentType' || key === 'id' || key === '_internal') continue;

            const displayKey = this.formatKey(key);

            if (Array.isArray(value)) {
                // Array handling
                html += `<div class="section">`;
                html += `<h2 class="section-heading">${currentSection}. ${displayKey}</h2>`;

                if (value.length > 0 && typeof value[0] === 'object') {
                    // Array of objects → Table
                    html += this.arrayToHTMLTable(value);
                } else {
                    // Simple array → List
                    html += '<ul>';
                    value.forEach(item => {
                        html += `<li>${this.escapeHTML(String(item))}</li>`;
                    });
                    html += '</ul>';
                }

                html += `</div>`;
                currentSection++;

            } else if (typeof value === 'object' && value !== null) {
                // Nested object
                html += `<div class="section">`;
                html += `<h2 class="section-heading">${currentSection}. ${displayKey}</h2>`;
                html += this.convertObjectToHTML(value, 1);
                html += `</div>`;
                currentSection++;

            } else {
                // Primitive value
                const valueString = String(value);
                
                if (valueString.includes('<') && valueString.includes('>')) {
                    // Has HTML tags - render as-is (but sanitize first)
                    html += `<div class="content-text">${valueString}</div>`;
                } else {
                    html += `<div class="content-text"><strong>${displayKey}:</strong> ${this.escapeHTML(valueString)}</div>`;
                }
            }
        }

        return html;
    }

    /**
     * Convert array of objects to HTML table
     */
    private arrayToHTMLTable(items: any[]): string {
        if (!items || items.length === 0) return '';

        // Get all unique keys
        const allKeys = new Set<string>();
        items.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(k => {
                    if (k !== 'id' && k !== '_internal') {
                        allKeys.add(k);
                    }
                });
            }
        });

        if (allKeys.size === 0) return '';

        const keys = Array.from(allKeys);

        let html = '<table><thead><tr>';
        
        // Headers
        keys.forEach(key => {
            html += `<th>${this.escapeHTML(this.formatKey(key))}</th>`;
        });
        
        html += '</tr></thead><tbody>';

        // Rows
        items.forEach(item => {
            html += '<tr>';
            keys.forEach(key => {
                const cellValue = this.formatCellValueForHTML(item[key]);
                html += `<td>${cellValue}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';

        return html;
    }

    /**
     * Format cell value for HTML display
     */
    private formatCellValueForHTML(value: any): string {
        if (value === null || value === undefined) return '<span style="color: #999;">—</span>';
        if (typeof value === 'boolean') return value ? '<span style="color: #10B981;">✓ Yes</span>' : '<span style="color: #EF4444;">✗ No</span>';
        if (typeof value === 'number') return this.escapeHTML(value.toLocaleString('en-US'));

        if (Array.isArray(value)) {
            return value
                .map(v => this.formatCellValueForHTML(v))
                .filter(Boolean)
                .join(' • ');
        }

        if (typeof value === 'object') {
            // Extract meaningful field
            const priorityKeys = ['name', 'title', 'label', 'description', 'value', 'finding', 'milestone'];
            for (const key of priorityKeys) {
                if (value[key] && typeof value[key] === 'string') {
                    return this.escapeHTML(value[key].substring(0, 200));
                }
            }
            return '<span style="color: #999;">—</span>';
        }

        const str = String(value).trim();
        
        // Try to parse JSON strings
        if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
            try {
                const parsed = JSON.parse(str);
                return this.formatCellValueForHTML(parsed);
            } catch {}
        }

        return this.escapeHTML(str.length > 300 ? str.substring(0, 300) + '...' : str);
    }

    /**
     * Escape HTML special characters
     */
    private escapeHTML(str: string): string {
        const div = { textContent: str } as any;
        return div.textContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    private async convertSemanticToTiptap(content: any): Promise<any> {
        const { documentType, semanticDocument } = content;
        const contentNodes: any[] = [];

        console.log('\n🎨 ═══════════════════════════════════════════════');
        console.log('🎨 PROFESSIONAL DOCUMENT RENDERING');
        console.log('🎨 ═══════════════════════════════════════════════');
        console.log('📄 Document Type:', documentType);

        // ========================================
        // DOCUMENT HEADER SECTION
        // ========================================
        
        // Add styled title
        const docTitle = this.extractDocumentTitle(semanticDocument, documentType);
        contentNodes.push({
            type: "heading",
            attrs: { level: 1 },
            content: [
                { 
                    type: "text", 
                    text: docTitle,
                    marks: [{ type: "bold" }]
                }
            ]
        });

        // Add subtitle with document info
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        contentNodes.push({
            type: "paragraph",
            content: [
                { type: "text", text: "Professional Business Document", marks: [{ type: "italic" }] },
                { type: "text", text: " | " },
                { type: "text", text: currentDate, marks: [{ type: "italic" }] }
            ]
        });

        // Add horizontal rule separator
        contentNodes.push({ type: "horizontalRule" });
        contentNodes.push({ type: "paragraph", content: [] });

        // ========================================
        // DOCUMENT INFORMATION SECTION
        // ========================================
        
        contentNodes.push({
            type: "heading",
            attrs: { level: 2 },
            content: [
                { type: "text", text: "📋 DOCUMENT INFORMATION", marks: [{ type: "bold" }] }
            ]
        });

        // Create info table
        contentNodes.push(this.createInfoTable([
            ["Prepared By:", "___________________________________"],
            ["Date:", currentDate],
            ["Department:", "___________________________________"],
            ["Version:", "1.0"]
        ]));

        contentNodes.push({ type: "paragraph", content: [] });
        contentNodes.push({ type: "horizontalRule" });
        contentNodes.push({ type: "paragraph", content: [] });

        // ========================================
        // MAIN CONTENT SECTIONS
        // ========================================

        console.log('📊 Converting semantic document to professional format...');
        this.convertObjectToTiptapProfessional(semanticDocument, contentNodes, 2, 1);

        // ========================================
        // FOOTER SECTION
        // ========================================
        
        contentNodes.push({ type: "horizontalRule" });
        contentNodes.push({
            type: "paragraph",
            content: [
                { type: "text", text: "End of Document", marks: [{ type: "italic" }] }
            ]
        });

        console.log('✅ Professional document rendering complete!');
        console.log(`📄 Generated ${contentNodes.length} content nodes`);
        console.log('🎨 ═══════════════════════════════════════════════\n');

        return {
            type: "doc",
            content: contentNodes
        };
    }

    /**
     * Enhanced professional object-to-Tiptap conversion
     */
    private convertObjectToTiptapProfessional(
        obj: any, 
        nodes: any[], 
        headingLevel: number = 2,
        sectionNumber: number = 1
    ): void {
        if (!obj || typeof obj !== 'object') return;

        let currentSection = sectionNumber;

        for (const [key, value] of Object.entries(obj)) {
            // Skip internal fields
            if (key === 'documentType' || key === 'id' || key === '_internal') continue;

            const displayKey = this.formatKey(key);

            if (Array.isArray(value)) {
                // ========================================
                // ARRAY HANDLING (Tables, Lists)
                // ========================================
                
                nodes.push({
                    type: "heading",
                    attrs: { level: Math.min(headingLevel, 3) },
                    content: [
                        { 
                            type: "text", 
                            text: `${currentSection}. ${displayKey}`, 
                            marks: [{ type: "bold" }] 
                        }
                    ]
                });

                nodes.push({ type: "paragraph", content: [] });

                // Convert array items to professional table if they're objects
                if (value.length > 0 && typeof value[0] === 'object') {
                    const table = this.arrayToTableProfessional(value);
                    if (table) {
                        nodes.push(table);
                        nodes.push({ type: "paragraph", content: [] });
                    } else {
                        // Fallback: render as structured cards
                        value.forEach((item, index) => {
                            nodes.push({
                                type: "heading",
                                attrs: { level: Math.min(headingLevel + 1, 4) },
                                content: [
                                    { 
                                        type: "text", 
                                        text: `${currentSection}.${index + 1} ${displayKey.slice(0, -1)} ${index + 1}`,
                                        marks: [{ type: "bold" }]
                                    }
                                ]
                            });
                            this.convertObjectToTiptapProfessional(item, nodes, headingLevel + 2, index + 1);
                            nodes.push({ type: "paragraph", content: [] });
                        });
                    }
                } else {
                    // Simple array values - render as styled bullet list
                    value.forEach(item => {
                        nodes.push({
                            type: "paragraph",
                            content: [
                                { type: "text", text: "• ", marks: [{ type: "bold" }] },
                                { type: "text", text: String(item) }
                            ]
                        });
                    });
                    nodes.push({ type: "paragraph", content: [] });
                }

                currentSection++;

            } else if (typeof value === 'object' && value !== null) {
                // ========================================
                // NESTED OBJECT HANDLING
                // ========================================
                
                nodes.push({
                    type: "heading",
                    attrs: { level: Math.min(headingLevel, 3) },
                    content: [
                        { 
                            type: "text", 
                            text: `${currentSection}. ${displayKey}`, 
                            marks: [{ type: "bold" }] 
                        }
                    ]
                });
                
                nodes.push({ type: "paragraph", content: [] });
                
                this.convertObjectToTiptapProfessional(value, nodes, headingLevel + 1, 1);
                
                currentSection++;

            } else {
                // ========================================
                // PRIMITIVE VALUE HANDLING
                // ========================================
                
                const valueString = String(value);

                // Check if content contains HTML tags
                if (valueString.includes('<') && valueString.includes('>')) {
                    this.parseHTMLToTiptap(valueString, nodes, displayKey, headingLevel);
                } else {
                    // Render as key-value pair with styling
                    nodes.push({
                        type: "paragraph",
                        content: [
                            { type: "text", text: `${displayKey}: `, marks: [{ type: "bold" }] },
                            { type: "text", text: valueString }
                        ]
                    });
                }

                nodes.push({ type: "paragraph", content: [] });
            }
        }
    }

    /**
     * Create a professional info table for document metadata
     */
    private createInfoTable(rows: string[][]): any {
        const tableRows = rows.map(([label, value]) => ({
            type: "tableRow",
            content: [
                {
                    type: "tableCell",
                    attrs: {},
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: label, marks: [{ type: "bold" }] }
                            ]
                        }
                    ]
                },
                {
                    type: "tableCell",
                    attrs: {},
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: value }
                            ]
                        }
                    ]
                }
            ]
        }));

        return {
            type: "table",
            content: tableRows
        };
    }

    /**
     * Enhanced professional table generation from array of objects
     */
    private arrayToTableProfessional(items: any[]): any | null {
        if (!items || items.length === 0) return null;

        // Collect ALL unique keys across all items
        const allKeys = new Set<string>();
        items.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(k => {
                    if (k !== 'id' && k !== '_internal') {
                        allKeys.add(k);
                    }
                });
            }
        });

        if (allKeys.size === 0) return null;

        const keys = Array.from(allKeys);

        // Create header row with bold styling
        const headerRow = {
            type: "tableRow",
            content: keys.map(key => ({
                type: "tableHeader",
                attrs: {},
                content: [
                    {
                        type: "paragraph",
                        content: [
                            { 
                                type: "text", 
                                text: this.formatKey(key),
                                marks: [{ type: "bold" }]
                            }
                        ]
                    }
                ]
            }))
        };

        // Create data rows with improved cell formatting
        const dataRows = items.map(item => ({
            type: "tableRow",
            content: keys.map(key => {
                const cellValue = this.formatCellValueProfessional(item[key]);
                return {
                    type: "tableCell",
                    attrs: {},
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: cellValue }
                            ]
                        }
                    ]
                };
            })
        }));

        return {
            type: "table",
            content: [headerRow, ...dataRows]
        };
    }

    /**
     * Enhanced cell value formatting for professional appearance
     */
    private formatCellValueProfessional(value: any): string {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No';
        if (typeof value === 'number') {
            // Format large numbers with commas
            return value.toLocaleString('en-US');
        }

        if (Array.isArray(value)) {
            return value
                .map(v => this.formatCellValueProfessional(v))
                .filter(Boolean)
                .join(' • ');
        }

        if (typeof value === 'object') {
            // Extract the most important field
            const priorityKeys = ['name', 'title', 'label', 'description', 'value', 'finding', 'milestone'];
            for (const key of priorityKeys) {
                if (value[key] && typeof value[key] === 'string') {
                    return value[key].substring(0, 200);
                }
            }
            // Fallback: try to find any string field
            for (const key of Object.keys(value)) {
                if (typeof value[key] === 'string' && value[key].trim()) {
                    return value[key].substring(0, 200);
                }
            }
            return '—';
        }

        const str = String(value).trim();
        
        // Try to parse JSON strings
        if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
            try {
                const parsed = JSON.parse(str);
                return this.formatCellValueProfessional(parsed);
            } catch {}
        }

        // Limit length for readability
        return str.length > 300 ? str.substring(0, 300) + '...' : str;
    }

    /**
     * Recursively convert semantic object to Tiptap nodes with enhanced formatting
     */
    private convertObjectToTiptap(obj: any, nodes: any[], headingLevel: number = 2): void {
        if (!obj || typeof obj !== 'object') return;

        for (const [key, value] of Object.entries(obj)) {
            // Skip internal fields
            if (key === 'documentType' || key === 'id' || key === '_internal') continue;

            const displayKey = this.formatKey(key);

            if (Array.isArray(value)) {
                // Handle arrays (items, clauses, schedule, etc.)
                nodes.push({
                    type: "heading",
                    attrs: { level: Math.min(headingLevel, 4) },
                    content: [{ type: "text", text: displayKey, marks: [{ type: "bold" }] }]
                });

                // Add spacing
                nodes.push({ type: "paragraph", content: [] });

                // Convert array items to table if they're objects
                if (value.length > 0 && typeof value[0] === 'object') {
                    const table = this.arrayToTable(value);
                    if (table) {
                        nodes.push(table);
                        // Add spacing after table
                        nodes.push({ type: "paragraph", content: [] });
                    } else {
                        // Fallback: render as structured list
                        value.forEach((item, index) => {
                            nodes.push({
                                type: "heading",
                                attrs: { level: Math.min(headingLevel + 1, 5) },
                                content: [{ type: "text", text: `${index + 1}. ${displayKey.slice(0, -1)}` }]
                            });
                            this.convertObjectToTiptap(item, nodes, headingLevel + 2);
                            nodes.push({ type: "paragraph", content: [] }); // Spacing
                        });
                    }
                } else {
                    // Simple array values - render as bullet list
                    value.forEach(item => {
                        nodes.push({
                            type: "paragraph",
                            content: [{ type: "text", text: `• ${String(item)}` }]
                        });
                    });
                    nodes.push({ type: "paragraph", content: [] }); // Spacing
                }
            } else if (typeof value === 'object' && value !== null) {
                // Handle nested objects
                nodes.push({
                    type: "heading",
                    attrs: { level: Math.min(headingLevel, 4) },
                    content: [{ type: "text", text: displayKey, marks: [{ type: "bold" }] }]
                });
                nodes.push({ type: "paragraph", content: [] }); // Spacing
                this.convertObjectToTiptap(value, nodes, headingLevel + 1);
            } else {
                // Handle primitive values - parse HTML if present
                const valueString = String(value);
                
                // Check if content contains HTML tags
                if (valueString.includes('<') && valueString.includes('>')) {
                    // Parse HTML content and convert to Tiptap nodes
                    this.parseHTMLToTiptap(valueString, nodes, displayKey, headingLevel);
                } else {
                    // Handle plain text with markdown-style formatting
                    const formattedContent = this.parseMarkdownText(valueString);
                    
                    // If it's a short label-value pair
                    if (valueString.length < 200) {
                        nodes.push({
                            type: "paragraph",
                            content: [
                                { type: "text", text: `${displayKey}: `, marks: [{ type: "bold" }] },
                                ...formattedContent
                            ]
                        });
                    } else {
                        // Long content - separate heading from content
                        nodes.push({
                            type: "heading",
                            attrs: { level: Math.min(headingLevel, 4) },
                            content: [{ type: "text", text: displayKey }]
                        });
                        
                        // Split long content into paragraphs
                        const paragraphs = valueString.split('\n\n');
                        paragraphs.forEach(para => {
                            if (para.trim()) {
                                const paraContent = this.parseMarkdownText(para.trim());
                                nodes.push({
                                    type: "paragraph",
                                    content: paraContent
                                });
                            }
                        });
                        nodes.push({ type: "paragraph", content: [] }); // Spacing
                    }
                }
            }
        }
    }

    /**
     * Parse markdown-style text formatting (**bold**, *italic*)
     */
    private parseMarkdownText(text: string): any[] {
        const content: any[] = [];
        
        // Simple regex-based markdown parser
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        
        parts.forEach(part => {
            if (!part) return;
            
            if (part.startsWith('**') && part.endsWith('**')) {
                // Bold text
                content.push({
                    type: "text",
                    text: part.slice(2, -2),
                    marks: [{ type: "bold" }]
                });
            } else if (part.startsWith('*') && part.endsWith('*')) {
                // Italic text
                content.push({
                    type: "text",
                    text: part.slice(1, -1),
                    marks: [{ type: "italic" }]
                });
            } else {
                // Regular text
                content.push({
                    type: "text",
                    text: part
                });
            }
        });
        
        return content.length > 0 ? content : [{ type: "text", text: text }];
    }

    /**
     * Convert array of objects to Tiptap table with enhanced formatting
     */
    private arrayToTable(items: any[]): any | null {
        if (!items || items.length === 0 || typeof items[0] !== 'object') return null;

        // Extract headers from first object
        const headers = Object.keys(items[0]).filter(k => !k.startsWith('_') && !k.startsWith('id'));
        if (headers.length === 0) return null;

        const tableRows: any[] = [];

        // Header row with bold formatting
        const headerCells = headers.map(h => ({
            type: "tableHeader",
            attrs: { colspan: 1, rowspan: 1, colwidth: null },
            content: [{
                type: "paragraph",
                content: [{
                    type: "text",
                    text: this.formatKey(h),
                    marks: [{ type: "bold" }]
                }]
            }]
        }));
        tableRows.push({ type: "tableRow", content: headerCells });

        // Data rows with proper formatting
        items.forEach((item, rowIndex) => {
            const cells = headers.map(h => {
                const value = item[h];
                const displayValue = this.formatCellValue(value);
                
                return {
                    type: "tableCell",
                    attrs: { colspan: 1, rowspan: 1, colwidth: null },
                    content: [{
                        type: "paragraph",
                        content: displayValue ? [{
                            type: "text",
                            text: displayValue
                        }] : []
                    }]
                };
            });
            tableRows.push({ type: "tableRow", content: cells });
        });

        return {
            type: "table",
            content: tableRows
        };
    }

    /**
     * Format cell value for display
     */
    private formatCellValue(value: any): string {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number') {
            // Format numbers with commas for thousands
            return value.toLocaleString();
        }
        if (typeof value === 'object') {
            // Handle nested objects
            return JSON.stringify(value);
        }
        return String(value);
    }

    /**
     * Extract document title from semantic structure
     */
    private extractDocumentTitle(doc: any, docType: string): string {
        // Try common title fields
        if (doc.title) return doc.title;
        if (doc.name) return doc.name;
        if (doc.subject) return doc.subject;
        if (doc.event?.name) return doc.event.name;
        
        // Generate from document type
        return this.formatKey(docType);
    }

    /**
     * Format snake_case keys to Title Case
     */
    private formatKey(key: string): string {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    /**
     * Parse HTML string and convert to Tiptap nodes (ENHANCED)
     */
    private parseHTMLToTiptap(html: string, nodes: any[], sectionLabel?: string, headingLevel: number = 2): void {
        // Add section label if provided
        if (sectionLabel) {
            nodes.push({
                type: "heading",
                attrs: { level: Math.min(headingLevel, 4) },
                content: [{ type: "text", text: sectionLabel }]
            });
        }

        const htmlContent = html.trim();
        
        // Split by top-level tags and process each
        const elementPattern = /<(h[1-6]|p|ul|ol|table|blockquote|pre|div)([^>]*)>([\s\S]*?)<\/\1>/gi;
        let processedAny = false;
        let match;
        
        while ((match = elementPattern.exec(htmlContent)) !== null) {
            processedAny = true;
            const tag = match[1].toLowerCase();
            const content = match[3];
            
            switch (tag) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    const level = parseInt(tag[1]);
                    nodes.push({
                        type: "heading",
                        attrs: { level: level },
                        content: [{ type: "text", text: this.stripHTML(content) }]
                    });
                    break;
                    
                case 'p':
                    const paragraphContent = this.parseInlineHTML(content);
                    if (paragraphContent.length > 0) {
                        nodes.push({
                            type: "paragraph",
                            content: paragraphContent
                        });
                    }
                    break;
                    
                case 'ul':
                    this.parseList(content, nodes, 'bulletList');
                    break;
                    
                case 'ol':
                    this.parseList(content, nodes, 'orderedList');
                    break;
                    
                case 'table':
                    this.parseHTMLTable(content, nodes);
                    break;
                    
                case 'blockquote':
                    const quoteContent = this.parseInlineHTML(content);
                    nodes.push({
                        type: "blockquote",
                        content: [{
                            type: "paragraph",
                            content: quoteContent
                        }]
                    });
                    break;
                    
                case 'pre':
                    const codeMatch = /<code[^>]*>([\s\S]*?)<\/code>/i.exec(content);
                    const codeText = codeMatch ? codeMatch[1] : content;
                    nodes.push({
                        type: "codeBlock",
                        content: [{ type: "text", text: this.stripHTML(codeText) }]
                    });
                    break;
                    
                case 'div':
                    // Handle special div classes (callout, stat, etc.)
                    const classMatch = /class=['"]([^'"]+)['"]/i.exec(match[2]);
                    const className = classMatch ? classMatch[1] : '';
                    
                    if (className.includes('callout')) {
                        const calloutContent = this.parseInlineHTML(content);
                        nodes.push({
                            type: "paragraph",
                            content: calloutContent
                        });
                    } else {
                        // Generic div - parse content
                        this.parseHTMLToTiptap(content, nodes, undefined, headingLevel);
                    }
                    break;
            }
        }
        
        // If no matches found, treat as plain text or inline HTML
        if (!processedAny && htmlContent) {
            const inlineContent = this.parseInlineHTML(htmlContent);
            if (inlineContent.length > 0) {
                nodes.push({
                    type: "paragraph",
                    content: inlineContent
                });
            }
        }
    }

    /**
     * Parse inline HTML elements (strong, em, code) within text (ENHANCED)
     */
    private parseInlineHTML(html: string): any[] {
        const result: any[] = [];
        
        // First strip all tags and check if we have content
        const strippedText = this.stripHTML(html).trim();
        if (!strippedText) {
            return [{ type: "text", text: "" }];
        }
        
        // If no HTML tags, return as plain text
        if (!html.includes('<')) {
            return [{ type: "text", text: strippedText }];
        }
        
        // Parse with better regex that handles nested content
        let currentPos = 0;
        const tagPattern = /<(strong|em|code|b|i)([^>]*)>(.*?)<\/\1>/gi;
        let lastMatch: RegExpExecArray | null = null;
        
        // Reset regex
        tagPattern.lastIndex = 0;
        
        while (true) {
            const match = tagPattern.exec(html);
            if (!match) break;
            
            // Add text before the tag
            if (match.index > currentPos) {
                const beforeText = html.substring(currentPos, match.index);
                const cleaned = this.stripHTML(beforeText).trim();
                if (cleaned) {
                    result.push({ type: "text", text: cleaned });
                }
            }
            
            // Add tagged content
            const tag = match[1].toLowerCase();
            const innerContent = this.stripHTML(match[3]).trim();
            if (innerContent) {
                const marks: any[] = [];
                if (tag === 'strong' || tag === 'b') marks.push({ type: "bold" });
                else if (tag === 'em' || tag === 'i') marks.push({ type: "italic" });
                else if (tag === 'code') marks.push({ type: "code" });
                
                result.push({ 
                    type: "text", 
                    text: innerContent, 
                    marks: marks.length > 0 ? marks : undefined 
                });
            }
            
            currentPos = match.index + match[0].length;
            lastMatch = match;
        }
        
        // Add remaining text after last tag
        if (currentPos < html.length) {
            const afterText = html.substring(currentPos);
            const cleaned = this.stripHTML(afterText).trim();
            if (cleaned) {
                result.push({ type: "text", text: cleaned });
            }
        }
        
        return result.length > 0 ? result : [{ type: "text", text: strippedText }];
    }

    /**
     * Parse HTML list (ul/ol) to Tiptap format (ENHANCED)
     */
    private parseList(html: string, nodes: any[], listType: 'bulletList' | 'orderedList'): void {
        const items: any[] = [];
        const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
        let match;
        
        while ((match = liPattern.exec(html)) !== null) {
            const itemHTML = match[1].trim();
            
            // Parse list item content (might contain HTML)
            let content: any[];
            if (itemHTML.includes('<') && itemHTML.includes('>')) {
                content = this.parseInlineHTML(itemHTML);
            } else {
                content = itemHTML ? [{ type: "text", text: itemHTML }] : [{ type: "text", text: "" }];
            }
            
            items.push({
                type: "listItem",
                content: [{
                    type: "paragraph",
                    content: content
                }]
            });
        }
        
        if (items.length > 0) {
            nodes.push({
                type: listType,
                content: items
            });
        }
    }

    /**
     * Parse HTML table to Tiptap format (ENHANCED)
     */
    private parseHTMLTable(html: string, nodes: any[]): void {
        const tableRows: any[] = [];
        
        // Extract thead
        const theadMatch = /<thead[^>]*>([\s\S]*?)<\/thead>/i.exec(html);
        if (theadMatch) {
            const headerRow = this.parseTableRow(theadMatch[1], true);
            if (headerRow) tableRows.push(headerRow);
        }
        
        // Extract tbody
        const tbodyMatch = /<tbody[^>]*>([\s\S]*?)<\/tbody>/i.exec(html);
        if (tbodyMatch) {
            const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
            let match;
            while ((match = trPattern.exec(tbodyMatch[1])) !== null) {
                const row = this.parseTableRow(match[1], false);
                if (row) tableRows.push(row);
            }
        } else {
            // No tbody - try to parse tr directly
            const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
            let match;
            let firstRow = true;
            while ((match = trPattern.exec(html)) !== null) {
                const row = this.parseTableRow(match[1], firstRow);
                if (row) tableRows.push(row);
                firstRow = false;
            }
        }
        
        if (tableRows.length > 0) {
            nodes.push({
                type: "table",
                content: tableRows
            });
        }
    }

    /**
     * Parse table row (ENHANCED to handle HTML in cells)
     */
    private parseTableRow(rowHTML: string, isHeader: boolean): any | null {
        const cells: any[] = [];
        const cellPattern = isHeader ? /<th[^>]*>([\s\S]*?)<\/th>/gi : /<td[^>]*>([\s\S]*?)<\/td>/gi;
        let match;
        
        while ((match = cellPattern.exec(rowHTML)) !== null) {
            const cellHTML = match[1].trim();
            
            // Parse cell content (might contain HTML)
            let cellContent: any[];
            if (cellHTML.includes('<') && cellHTML.includes('>')) {
                // Cell contains HTML - parse it
                cellContent = this.parseInlineHTML(cellHTML);
            } else {
                // Plain text
                cellContent = cellHTML ? [{ type: "text", text: cellHTML }] : [{ type: "text", text: "" }];
            }
            
            cells.push({
                type: isHeader ? "tableHeader" : "tableCell",
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [{
                    type: "paragraph",
                    content: cellContent
                }]
            });
        }
        
        return cells.length > 0 ? { type: "tableRow", content: cells } : null;
    }

    /**
     * Handle Analyzer chart generation
     */
    private async handleAnalyzerGeneration(input: any, job: any): Promise<RenderResponse> {
        console.log('\n🔍 === ANALYZER GENERATION START ===');

        const metadata = input.layout.intent.metadata;
        const templateId = metadata.analyzerTemplateId;
        const prompt = input.layout.intent.originalPrompt;

        // Get template from catalog
        const catalogService = AnalyzerCatalogService.getInstance();
        let template = null;

        if (templateId) {
            template = await catalogService.getTemplateById(templateId);
        } else {
            // Try to find best match
            template = await catalogService.findBestMatch(prompt);
        }

        if (!template) {
            throw new Error('No analyzer template found for request');
        }

        console.log(`📊 Using template: ${template.template_name} (${template.chart_type})`);

        // Generate chart data using AI
        const generator = new AnalyzerGenerator();
        const result = await generator.generateChartData(prompt, template);

        console.log('✅ Chart data generated successfully');

        // Format for Univer (chart-editor compatible)
        const editorState = {
            type: 'analyzer',
            chartType: result.chartType,
            title: result.title,
            description: result.description,
            data: result.data,
            config: result.config,
            template: {
                id: result.templateId,
                name: result.templateName
            }
        };

        console.log('🔍 === ANALYZER GENERATION COMPLETE ===\n');

        return {
            jobId: input.jobId,
            outputFormat: 'chart',
            editorState: editorState,
            tokensUsed: 0,
            status: 'success'
        };
    }

    /**
     * Strip all HTML tags from text
     */
    private stripHTML(html: string): string {
        return html.replace(/<[^>]*>/g, '').trim();
    }
}
