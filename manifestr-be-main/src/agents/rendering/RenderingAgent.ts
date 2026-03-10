import { BaseAgent } from "../core/BaseAgent";
import { ContentResponse, RenderResponse } from "../protocols/types";
import SupabaseDB from "../../lib/supabase-db";
import { s3Util } from "../../utils/s3.util";
import { PresentationEngine } from "./engines/PresentationEngine";

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

        if (format === 'presentation') {
            editorState = await this.convertToPolotno(input);
        } else if (format === 'document') {
            // Check if this is a semantic document
            const firstBlock = input.generatedContent?.[0];
            if (firstBlock?.content?.semanticDocument) {
                editorState = await this.convertSemanticToTiptap(firstBlock.content);
            } else {
                editorState = await this.convertToTiptap(input); // Legacy Tiptap JSON
            }
        } else {
            editorState = this.convertToUniver(input);
        }

        // In real life, we might upload this JSON to S3 if it's huge
        // For now, we return it.

        return {
            jobId: input.jobId,
            outputFormat: format,
            editorState: editorState,
            tokensUsed: 0, // Placeholder
            status: "success"
        };
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
            const vaultItem = await SupabaseDB.createVaultItem(job.user_id, {
                title: job.input_data?.title || "Untitled Generation",
                type: 'file',
                status: 'Final',
                file_key: fileKey,
                thumbnail_url: job.input_data?.cover_image,
                project: "Generations",
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: job.type
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
    private async convertSemanticToTiptap(content: any): Promise<any> {
        const { documentType, semanticDocument } = content;
        const contentNodes: any[] = [];

        // Add document title/header
        contentNodes.push({
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: this.extractDocumentTitle(semanticDocument, documentType) }]
        });

        // Add spacing
        contentNodes.push({ type: "paragraph", content: [] });
        
        // Add horizontal rule for visual separation
        contentNodes.push({ type: "horizontalRule" });
        
        // Add spacing
        contentNodes.push({ type: "paragraph", content: [] });

        // Convert semantic structure to readable Tiptap format
        this.convertObjectToTiptap(semanticDocument, contentNodes, 2);

        return {
            type: "doc",
            content: contentNodes
        };
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
                // Handle primitive values with markdown-style formatting
                const formattedContent = this.parseMarkdownText(String(value));
                
                // If it's a short label-value pair
                if (String(value).length < 200) {
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
                    const paragraphs = String(value).split('\n\n');
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
}
