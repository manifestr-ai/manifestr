import { z } from 'zod';

// ------------------------------------------------------------------
// 1. Initial User Request
// ------------------------------------------------------------------
export const UserPromptSchema = z.object({
    prompt: z.string(),
    style_guide_id: z.number().optional().nullable(),
    output: z.enum(["presentation", "document", "spreadsheet", "image", "chart"]).optional().nullable(),
    meta: z.any().optional(),
    userId: z.string().describe("Supabase UUID for the user"), // Supabase UUID
    jobId: z.string().uuid(),  // The tracking ID
});

export type UserPrompt = z.infer<typeof UserPromptSchema>;

// ------------------------------------------------------------------
// 2. Intent Agent Output (Input for Layout Agent)
// ------------------------------------------------------------------
export const IntentResponseSchema = z.object({
    jobId: z.string().uuid(),
    originalPrompt: z.string(),
    title: z.string().describe("A professional, short title for the project"),
    metadata: z.object({
        type: z.string().describe("e.g. Pitch Deck, Sales Report"),
        tone: z.string().describe("e.g. Professional, Casual"),
        goal: z.string(),
        audience: z.string(),
        depth: z.string(),
        scope: z.string(),
        size: z.string(),
        itemCount: z.string().optional().describe("Quantifier from user prompt e.g. '100+ tasks', '50 rows', '10 years'"),
        outputFormat: z.enum(["presentation", "document", "spreadsheet", "image", "chart"]),
        selectedTemplate: z.string().optional().describe("The deck template filename selected by TemplateSelector"),
        templateReasoning: z.string().optional().describe("Why this template was selected"),
        appliedLogic: z.string().optional().describe("Name of the logic framework applied (e.g. 'Proposal Logic', 'Strategy Logic')"),
        logicFrameworkId: z.string().optional().describe("ID of the logic framework (e.g. 'proposal', 'strategy')"),
    }),
    styleGuide: z.any().nullable().optional(),
    userPreferences: z.object({
        explicit: z.any().optional(),
        implicit: z.any().optional(),
        referencePattern: z.any().optional(),
    }).optional(),
    designPreferences: z.object({
        hasCharts: z.boolean().describe("true ONLY if user explicitly asked for data/charts or topic requires it. default false"),
        hasTables: z.boolean().optional().describe("true ONLY if user asked for tables/data grids. default false"),
        hasImages: z.boolean().describe("default true"),
        colorTheme: z.string().optional().describe("e.g. 'Blue and White' or 'Dark Mode'"),
        fontStyle: z.string().optional(),
        mood: z.string().optional(),
    }).optional(),
    // Derived from analyzing the request
    structurePlan: z.array(z.string()).describe("High level list of sections/slides"),
});

export type IntentResponse = z.infer<typeof IntentResponseSchema>;

// ------------------------------------------------------------------
// 3. Layout Agent Output (Input for Content Agent)
// ------------------------------------------------------------------
export const LayoutBlockSchema = z.object({
    id: z.string(),
    type: z.enum(["slide", "section", "sheet"]),
    title: z.string(),
    description: z.string().optional(),
    layoutType: z.string().describe("specific layout name e.g. 'hero-left', 'two-column', 'grid'"),
    components: z.array(z.object({
        id: z.string(),
        role: z.enum(["title", "subtitle", "body", "image", "chart", "table", "caption", "header", "row", "column", "cell", "footer", "timeline", "task", "quote", "stat", "callout", "author"]),
        constraints: z.object({
            minChars: z.number().optional(),
            maxChars: z.number().optional(),
            suggestedData: z.any().optional(),
        }).optional(),
    })),
});

export const LayoutResponseSchema = z.object({
    jobId: z.string().uuid(),
    intent: IntentResponseSchema, // Pass through previous context
    blocks: z.array(LayoutBlockSchema),
    designSystem: z.object({
        colors: z.array(z.string()),
        fonts: z.object({
            heading: z.string(),
            body: z.string(),
        }),
    }).optional(),
    // 🆕 NEW: Semantic document support (flexible schema generation)
    documentType: z.string().optional().describe("Type of document detected: business_letter, checklist, run_sheet, invoice, etc."),
    semanticSchema: z.any().optional().describe("Flexible JSON schema matching the document type structure"),
});

export const LayoutGenerationSchema = LayoutResponseSchema.omit({ jobId: true, intent: true });

export type LayoutResponse = z.infer<typeof LayoutResponseSchema>;

// ------------------------------------------------------------------
// 4. Content Agent Output (Input for Render Agent)
// ------------------------------------------------------------------
export const ContentBlockSchema = z.object({
    blockId: z.string(), // Matches LayoutBlockSchema.id
    content: z.record(z.string(), z.any()).describe("Map of componentId -> generated content (text, image prompt, data)"),
});

export const ContentResponseSchema = z.object({
    jobId: z.string().uuid(),
    layout: LayoutResponseSchema, // Pass through
    generatedContent: z.array(ContentBlockSchema),
});

export const ContentGenerationSchema = ContentResponseSchema.omit({ jobId: true, layout: true });

export type ContentResponse = z.infer<typeof ContentResponseSchema>;

export const CriticGenerationSchema = z.object({
    blocks: z.array(LayoutBlockSchema),
    generatedContent: z.array(ContentBlockSchema),
});

// ------------------------------------------------------------------
// 5. Render Agent Output (Final Result)
// ------------------------------------------------------------------
export const RenderResponseSchema = z.object({
    jobId: z.string().uuid(),
    outputFormat: z.enum(["presentation", "document", "spreadsheet", "image"]),
    finalUrl: z.string().url().optional(), // S3 URL
    editorState: z.any(), // The huge JSON for Polotno/Tiptap/Univer
    tokensUsed: z.number(),
    status: z.enum(["success", "failed"]),
});

export type RenderResponse = z.infer<typeof RenderResponseSchema>;
