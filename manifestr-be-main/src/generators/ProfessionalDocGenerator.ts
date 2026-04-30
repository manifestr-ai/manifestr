import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    HeadingLevel,
    BorderStyle,
    WidthType,
    ShadingType,
    VerticalAlign,
    PageNumber,
    Header,
    Footer,
    LevelFormat,
    convertInchesToTwip,
} from 'docx';
import Anthropic from '@anthropic-ai/sdk';

// Professional color palette
const COLORS = {
    BLUE: '1F4E79',
    LIGHT_BLUE: 'D6E4F0',
    MID_BLUE: '2E75B6',
    GRAY: 'F5F5F5',
    TEXT: '2C2C2C',
    DARK_GRAY: '666666',
    LIGHT_GRAY: '999999',
    BORDER: 'CCCCCC',
    ACCENT_PURPLE: '5B2C91',
    ACCENT_TEAL: '00B8A9',
    ACCENT_ORANGE: 'FF6B35',
};

// Reusable border definitions
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.BORDER };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

interface DocumentRequest {
    documentType: string;
    tool: string;
    prompt: string;
}

interface DocumentStructure {
    title: string;
    subtitle?: string;
    sections: Section[];
}

interface Section {
    heading: string;
    type: 'text' | 'table' | 'list' | 'fields' | 'checklist';
    content: any;
    note?: string;
}

export class ProfessionalDocGenerator {
    private claude: Anthropic;

    constructor() {
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY or CLAUDE_API_KEY environment variable is required');
        }
        this.claude = new Anthropic({
            apiKey: apiKey,
        });
    }

    // Helper: Create styled heading 1
    private heading1(text: string): Paragraph {
        return new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            border: {
                bottom: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: COLORS.MID_BLUE,
                    space: 4,
                },
            },
            children: [
                new TextRun({
                    text,
                    bold: true,
                    size: 28,
                    color: COLORS.BLUE,
                    font: 'Arial',
                }),
            ],
        });
    }

    // Helper: Create styled heading 2
    private heading2(text: string): Paragraph {
        return new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
                new TextRun({
                    text,
                    bold: true,
                    size: 24,
                    color: COLORS.MID_BLUE,
                    font: 'Arial',
                }),
            ],
        });
    }

    // Helper: Section note (italicized context)
    private sectionNote(text: string): Paragraph {
        return new Paragraph({
            spacing: { before: 80, after: 160 },
            children: [
                new TextRun({
                    text,
                    size: 18,
                    color: COLORS.DARK_GRAY,
                    font: 'Arial',
                    italics: true,
                }),
            ],
        });
    }

    // Helper: Spacer paragraphs
    private spacer(lines: number = 1): Paragraph[] {
        return Array.from({ length: lines }, () =>
            new Paragraph({
                children: [new TextRun('')],
                spacing: { after: 80 },
            })
        );
    }

    // Helper: Field row (label + underline for filling)
    private fieldRow(labelText: string, hint: string = '___________________________________'): Table {
        return new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2800, 6560],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            borders: noBorders,
                            width: { size: 2800, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 0, right: 120 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: labelText,
                                            bold: true,
                                            size: 20,
                                            color: COLORS.TEXT,
                                            font: 'Arial',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            borders: {
                                top: noBorder,
                                left: noBorder,
                                right: noBorder,
                                bottom: {
                                    style: BorderStyle.SINGLE,
                                    size: 4,
                                    color: 'AAAAAA',
                                },
                            },
                            width: { size: 6560, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 120, right: 0 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: hint,
                                            size: 20,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                            italics: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
            margins: { top: 80, bottom: 80 },
        });
    }

    // Helper: Two-column field row
    private twoColFieldRow(label1: string, label2: string): Table {
        return new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [1800, 2880, 1800, 2880],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            borders: noBorders,
                            width: { size: 1800, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 0, right: 80 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: label1,
                                            bold: true,
                                            size: 20,
                                            color: COLORS.TEXT,
                                            font: 'Arial',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            borders: {
                                top: noBorder,
                                left: noBorder,
                                right: noBorder,
                                bottom: {
                                    style: BorderStyle.SINGLE,
                                    size: 4,
                                    color: 'AAAAAA',
                                },
                            },
                            width: { size: 2880, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 80, right: 240 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: '',
                                            size: 20,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                            italics: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            borders: noBorders,
                            width: { size: 1800, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 80, right: 80 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: label2,
                                            bold: true,
                                            size: 20,
                                            color: COLORS.TEXT,
                                            font: 'Arial',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            borders: {
                                top: noBorder,
                                left: noBorder,
                                right: noBorder,
                                bottom: {
                                    style: BorderStyle.SINGLE,
                                    size: 4,
                                    color: 'AAAAAA',
                                },
                            },
                            width: { size: 2880, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 80, right: 0 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: '',
                                            size: 20,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                            italics: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
    }

    // Helper: Data table with headers
    private dataTable(
        headers: string[],
        rows: string[][],
        columnWidths: number[]
    ): Table {
        const headerRow = new TableRow({
            children: headers.map(
                (h, i) =>
                    new TableCell({
                        borders,
                        width: { size: columnWidths[i], type: WidthType.DXA },
                        shading: { fill: COLORS.LIGHT_BLUE, type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: h,
                                        bold: true,
                                        size: 18,
                                        color: COLORS.BLUE,
                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                    })
            ),
        });

        const dataRows = rows.map(
            (row) =>
                new TableRow({
                    children: row.map(
                        (cell, i) =>
                            new TableCell({
                                borders,
                                width: { size: columnWidths[i], type: WidthType.DXA },
                                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: cell,
                                                size: 18,
                                                font: 'Arial',
                                                color: COLORS.TEXT,
                                            }),
                                        ],
                                    }),
                                ],
                            })
                    ),
                })
        );

        return new Table({
            width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
            columnWidths,
            rows: [headerRow, ...dataRows],
        });
    }

    // Helper: Checklist
    private checklistItem(text: string): Paragraph {
        return new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [
                new TextRun({
                    text: '\u2610  ',
                    size: 20,
                    font: 'Arial',
                    color: COLORS.TEXT,
                }),
                new TextRun({
                    text,
                    size: 20,
                    font: 'Arial',
                    color: COLORS.TEXT,
                }),
            ],
        });
    }

    // Helper: Regular paragraph with content
    private textParagraph(text: string, isBold: boolean = false): Paragraph {
        return new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
                new TextRun({
                    text,
                    size: 20,
                    font: 'Arial',
                    color: COLORS.TEXT,
                    bold: isBold,
                }),
            ],
        });
    }

    // Generate document structure from AI
    private async generateStructureFromAI(
        documentType: string,
        tool: string,
        prompt: string
    ): Promise<DocumentStructure> {
        console.log('\n🤖 Asking Claude to generate document structure...');

        const systemPrompt = `You are a professional business document architect. Generate a comprehensive, detailed document structure.

Output a JSON object with this EXACT structure:
{
  "title": "Main Document Title",
  "subtitle": "Optional subtitle",
  "sections": [
    {
      "heading": "Section Name",
      "type": "text" | "table" | "list" | "fields" | "checklist",
      "note": "Optional guidance note",
      "content": {
        // For "text": { "paragraphs": ["text1", "text2"] }
        // For "table": { "headers": ["Col1", "Col2"], "rows": [["a", "b"], ["c", "d"]], "widths": [2000, 2000] }
        // For "list": { "items": ["item1", "item2"] }
        // For "fields": { "fields": [{"label": "Name:", "hint": "Enter name"}] }
        // For "checklist": { "items": ["task1", "task2"] }
      }
    }
  ]
}

IMPORTANT:
- Generate REAL, SPECIFIC, PROFESSIONAL content (not placeholders)
- Use realistic numbers, dates, names, and details
- Create 5-8 major sections maximum
- Each section should be concise but comprehensive
- For tables: include 3-5 realistic data rows
- Make content relevant to: ${documentType} for ${tool}`;

        const userPrompt = `Create a professional ${documentType} document with the following details:

${prompt}

Generate a complete, realistic document structure with specific content. Be professional and detailed.`;

        const completion = await this.claude.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        });

        let responseText = '';
        if (completion.content[0].type === 'text') {
            responseText = completion.content[0].text;
        }

        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from AI response');
        }

        const structure: DocumentStructure = JSON.parse(jsonMatch[0]);
        console.log('✅ Structure generated:', structure.sections.length, 'sections');
        
        return structure;
    }

    // Build the complete document
    private buildDocument(
        structure: DocumentStructure,
        documentType: string
    ): Document {
        console.log('\n📝 Building Word document...');

        const children: any[] = [];

        // Document header info
        children.push(
            new Paragraph({
                spacing: { before: 200, after: 80 },
                children: [
                    new TextRun({
                        text: 'DOCUMENT INFORMATION',
                        bold: true,
                        size: 22,
                        color: COLORS.BLUE,
                        font: 'Arial',
                    }),
                ],
            })
        );

        children.push(
            new Paragraph({
                spacing: { before: 0, after: 160 },
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.MID_BLUE },
                },
                children: [],
            })
        );

        children.push(...this.spacer(1));
        children.push(this.twoColFieldRow('Prepared By:', 'Date:'));
        children.push(...this.spacer(1));
        children.push(this.twoColFieldRow('Department:', 'Version:'));
        children.push(...this.spacer(2));

        // Add all sections from structure
        structure.sections.forEach((section, idx) => {
            children.push(this.heading1(`${idx + 1}. ${section.heading}`));

            if (section.note) {
                children.push(this.sectionNote(section.note));
            }

            switch (section.type) {
                case 'text':
                    if (section.content.paragraphs) {
                        section.content.paragraphs.forEach((para: string) => {
                            children.push(this.textParagraph(para));
                        });
                    }
                    break;

                case 'table':
                    if (
                        section.content.headers &&
                        section.content.rows &&
                        section.content.widths
                    ) {
                        children.push(
                            this.dataTable(
                                section.content.headers,
                                section.content.rows,
                                section.content.widths
                            )
                        );
                    }
                    break;

                case 'list':
                    if (section.content.items) {
                        section.content.items.forEach((item: string) => {
                            children.push(
                                new Paragraph({
                                    spacing: { before: 60, after: 60 },
                                    bullet: { level: 0 },
                                    children: [
                                        new TextRun({
                                            text: item,
                                            size: 20,
                                            font: 'Arial',
                                            color: COLORS.TEXT,
                                        }),
                                    ],
                                })
                            );
                        });
                    }
                    break;

                case 'fields':
                    if (section.content.fields) {
                        section.content.fields.forEach((field: any) => {
                            children.push(this.fieldRow(field.label, field.hint || ''));
                            children.push(...this.spacer(1));
                        });
                    }
                    break;

                case 'checklist':
                    if (section.content.items) {
                        section.content.items.forEach((item: string) => {
                            children.push(this.checklistItem(item));
                        });
                    }
                    break;
            }

            children.push(...this.spacer(2));
        });

        // Create the document
        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: { font: 'Arial', size: 20, color: COLORS.TEXT },
                    },
                },
                paragraphStyles: [
                    {
                        id: 'Heading1',
                        name: 'Heading 1',
                        basedOn: 'Normal',
                        next: 'Normal',
                        quickFormat: true,
                        run: { size: 28, bold: true, font: 'Arial', color: COLORS.BLUE },
                        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 },
                    },
                    {
                        id: 'Heading2',
                        name: 'Heading 2',
                        basedOn: 'Normal',
                        next: 'Normal',
                        quickFormat: true,
                        run: { size: 24, bold: true, font: 'Arial', color: COLORS.MID_BLUE },
                        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
                    },
                ],
            },
            numbering: {
                config: [
                    {
                        reference: 'bullets',
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.BULLET,
                                text: '\u2022',
                                alignment: AlignmentType.LEFT,
                                style: {
                                    paragraph: { indent: { left: 720, hanging: 360 } },
                                    run: { font: 'Arial', size: 20 },
                                },
                            },
                        ],
                    },
                ],
            },
            sections: [
                {
                    properties: {
                        page: {
                            size: { width: 12240, height: 15840 },
                            margin: {
                                top: 1080,
                                right: 1260,
                                bottom: 1080,
                                left: 1260,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Table({
                                    width: { size: 9720, type: WidthType.DXA },
                                    columnWidths: [6720, 3000],
                                    rows: [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    borders: {
                                                        top: noBorder,
                                                        left: noBorder,
                                                        right: noBorder,
                                                        bottom: {
                                                            style: BorderStyle.SINGLE,
                                                            size: 8,
                                                            color: COLORS.MID_BLUE,
                                                        },
                                                    },
                                                    width: { size: 6720, type: WidthType.DXA },
                                                    margins: {
                                                        top: 60,
                                                        bottom: 60,
                                                        left: 0,
                                                        right: 120,
                                                    },
                                                    children: [
                                                        new Paragraph({
                                                            children: [
                                                                new TextRun({
                                                                    text: structure.title.toUpperCase(),
                                                                    bold: true,
                                                                    size: 24,
                                                                    color: COLORS.BLUE,
                                                                    font: 'Arial',
                                                                }),
                                                            ],
                                                        }),
                                                        new Paragraph({
                                                            children: [
                                                                new TextRun({
                                                                    text:
                                                                        structure.subtitle ||
                                                                        `Professional ${documentType}`,
                                                                    size: 18,
                                                                    color: COLORS.DARK_GRAY,
                                                                    font: 'Arial',
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    borders: {
                                                        top: noBorder,
                                                        left: noBorder,
                                                        right: noBorder,
                                                        bottom: {
                                                            style: BorderStyle.SINGLE,
                                                            size: 8,
                                                            color: COLORS.MID_BLUE,
                                                        },
                                                    },
                                                    width: { size: 3000, type: WidthType.DXA },
                                                    verticalAlign: VerticalAlign.BOTTOM,
                                                    margins: {
                                                        top: 60,
                                                        bottom: 60,
                                                        left: 120,
                                                        right: 0,
                                                    },
                                                    children: [
                                                        new Paragraph({
                                                            alignment: AlignmentType.RIGHT,
                                                            children: [
                                                                new TextRun({
                                                                    text: 'Confidential | Internal Use',
                                                                    size: 16,
                                                                    color: COLORS.LIGHT_GRAY,
                                                                    font: 'Arial',
                                                                    italics: true,
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({
                                    spacing: { before: 120 },
                                    border: {
                                        top: {
                                            style: BorderStyle.SINGLE,
                                            size: 4,
                                            color: COLORS.BORDER,
                                            space: 4,
                                        },
                                    },
                                    children: [
                                        new TextRun({
                                            text: `${structure.title}  |  Page `,
                                            size: 16,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                        }),
                                        new TextRun({
                                            children: [PageNumber.CURRENT],
                                            size: 16,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                        }),
                                        new TextRun({
                                            text: ' of ',
                                            size: 16,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                        }),
                                        new TextRun({
                                            children: [PageNumber.TOTAL_PAGES],
                                            size: 16,
                                            color: COLORS.LIGHT_GRAY,
                                            font: 'Arial',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                    children,
                },
            ],
        });

        console.log('✅ Document built successfully!');
        return doc;
    }

    // Main generation method
    async generateDocument(request: DocumentRequest): Promise<Buffer> {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚀 PROFESSIONAL DOCX GENERATION STARTED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📄 Document Type:', request.documentType);
        console.log('🔧 Tool:', request.tool);
        console.log('💬 Prompt:', request.prompt.substring(0, 100) + '...');

        // Step 1: Generate structure from AI
        const structure = await this.generateStructureFromAI(
            request.documentType,
            request.tool,
            request.prompt
        );

        // Step 2: Build the Word document
        const doc = this.buildDocument(structure, request.documentType);

        // Step 3: Convert to buffer
        console.log('\n📦 Converting to .docx buffer...');
        const buffer = await Packer.toBuffer(doc);
        console.log('✅ Buffer generated:', buffer.length, 'bytes');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        return buffer;
    }

    /**
     * Generate document from existing semantic content (no AI call needed)
     * Used by RenderingAgent to convert already-generated content to .docx
     */
    async generateDocumentFromSemanticContent(
        documentType: string,
        tool: string,
        semanticDocument: any
    ): Promise<Buffer> {
        console.log('📝 Converting semantic content to Word document...');
        console.log('   Document Type:', documentType);
        console.log('   Tool:', tool);

        // Convert semantic structure to our internal DocumentStructure format
        const structure: DocumentStructure = this.convertSemanticToStructure(
            semanticDocument,
            documentType
        );

        console.log('   Sections:', structure.sections.length);

        // Build the Word document
        const doc = this.buildDocument(structure, documentType);

        // Convert to buffer
        const buffer = await Packer.toBuffer(doc);
        console.log('✅ Semantic document converted:', Math.round(buffer.length / 1024), 'KB');

        return buffer;
    }

    /**
     * Convert semantic document structure to our DocumentStructure format
     */
    private convertSemanticToStructure(
        semanticDocument: any,
        documentType: string
    ): DocumentStructure {
        const title = this.extractTitle(semanticDocument, documentType);
        const subtitle = `Professional ${documentType}`;
        const sections: Section[] = [];

        // Recursively convert semantic object to sections
        this.convertObjectToSections(semanticDocument, sections);

        return {
            title,
            subtitle,
            sections
        };
    }

    /**
     * Extract title from semantic document
     */
    private extractTitle(obj: any, documentType: string): string {
        // Try common title fields
        const titleFields = ['title', 'name', 'document_title', 'heading', 'subject'];
        for (const field of titleFields) {
            if (obj[field] && typeof obj[field] === 'string') {
                return obj[field];
            }
        }
        return `${documentType} Document`;
    }

    /**
     * Recursively convert semantic object to sections
     */
    private convertObjectToSections(obj: any, sections: Section[]): void {
        if (!obj || typeof obj !== 'object') return;

        for (const [key, value] of Object.entries(obj)) {
            // Skip internal fields
            if (key === 'documentType' || key === 'id' || key === '_internal') continue;

            const heading = this.formatKey(key);

            if (Array.isArray(value)) {
                // Handle arrays as tables or lists
                if (value.length > 0 && typeof value[0] === 'object') {
                    // Array of objects → table
                    const headers = this.extractHeaders(value);
                    const rows = value.map(item => 
                        headers.map(h => this.formatCellValue(item[h]))
                    );
                    const widths = this.calculateColumnWidths(headers.length);

                    sections.push({
                        heading,
                        type: 'table',
                        content: { headers, rows, widths }
                    });
                } else {
                    // Simple array → list
                    sections.push({
                        heading,
                        type: 'list',
                        content: { items: value.map(String) }
                    });
                }
            } else if (typeof value === 'object' && value !== null) {
                // Nested object → recurse
                sections.push({
                    heading,
                    type: 'text',
                    content: { paragraphs: [] }
                });
                this.convertObjectToSections(value, sections);
            } else {
                // Primitive value → text paragraph
                sections.push({
                    heading,
                    type: 'text',
                    content: { paragraphs: [String(value)] }
                });
            }
        }
    }

    /**
     * Extract headers from array of objects
     */
    private extractHeaders(items: any[]): string[] {
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
        return Array.from(allKeys).map(k => this.formatKey(k));
    }

    /**
     * Calculate column widths for table
     */
    private calculateColumnWidths(numColumns: number): number[] {
        const totalWidth = 9360; // Standard page width
        const columnWidth = Math.floor(totalWidth / numColumns);
        return Array(numColumns).fill(columnWidth);
    }

    /**
     * Format key to display name
     */
    private formatKey(key: string): string {
        return key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .split(' ')
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    /**
     * Format cell value
     */
    private formatCellValue(value: any): string {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No';
        if (typeof value === 'number') return value.toLocaleString('en-US');
        if (Array.isArray(value)) return value.map(v => String(v)).join(' • ');
        if (typeof value === 'object') {
            // Extract first meaningful field
            const priorityKeys = ['name', 'title', 'label', 'description', 'value'];
            for (const key of priorityKeys) {
                if (value[key]) return String(value[key]).substring(0, 200);
            }
            return '—';
        }
        return String(value).substring(0, 300);
    }
}

