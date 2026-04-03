import SupabaseDB from "../lib/supabase-db";
import { UserPrompt } from "../agents/protocols/types";
import Anthropic from "@anthropic-ai/sdk";
import { fetchUnsplashImage } from "../utils/image.util";

// Import Agents
import { IntentAgent } from "../agents/intent/IntentAgent";
import { PresentationLayoutAgent } from "../agents/presentation/PresentationLayoutAgent";
import { PresentationContentAgent } from "../agents/presentation/PresentationContentAgent";
import { DocumentLayoutAgent } from "../agents/document/DocumentLayoutAgent";
import { DocumentContentAgent } from "../agents/document/DocumentContentAgent";
import { SpreadsheetLayoutAgent } from "../agents/spreadsheet/SpreadsheetLayoutAgent";
import { SpreadsheetContentAgent } from "../agents/spreadsheet/SpreadsheetContentAgent";
import { RenderingAgent } from "../agents/rendering/RenderingAgent";
import { ImageGenerationAgent } from "../agents/image/ImageGenerationAgent";

export class AIOrchestrator {
    private claude: Anthropic;
    
    // Agents
    private intentAgent: IntentAgent;
    private renderingAgent: RenderingAgent;
    
    private presLayout: PresentationLayoutAgent;
    private presContent: PresentationContentAgent;
    
    private docLayout: DocumentLayoutAgent;
    private docContent: DocumentContentAgent;
    
    private sheetLayout: SpreadsheetLayoutAgent;
    private sheetContent: SpreadsheetContentAgent;
    
    private imageAgent: ImageGenerationAgent;

    constructor() {
        this.claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
        
        // Initialize Agents (No SQS needed anymore!)
        this.intentAgent = new IntentAgent();
        this.renderingAgent = new RenderingAgent();
        
        this.presLayout = new PresentationLayoutAgent();
        this.presContent = new PresentationContentAgent();
        
        this.docLayout = new DocumentLayoutAgent();
        this.docContent = new DocumentContentAgent();
        
        this.sheetLayout = new SpreadsheetLayoutAgent();
        this.sheetContent = new SpreadsheetContentAgent();
        
        this.imageAgent = new ImageGenerationAgent();
    }

    
    /**
     * Starts the generation process
     */
    async startGeneration(userId: string, promptData: Partial<UserPrompt>): Promise<any> {
        // 1. Generate metadata first
        let title = "New Generation";
        let coverImage = null;

        try {
            [title, coverImage] = await Promise.all([
                this.generateTitle(promptData.prompt!),
                fetchUnsplashImage(promptData.prompt!)
            ]);
        } catch (error) {
        }

        // 2. Create Job Entry using Supabase
        const job = await SupabaseDB.createGenerationJob(userId, {
            type: promptData.output as string,
            input_data: {
                prompt: promptData.prompt,
                style_guide_id: promptData.style_guide_id,
                output: promptData.output,
                meta: promptData.meta,
                title,
                cover_image: coverImage
            },
            status: 'queued'
        });

        // 3. Start the Agent Flow (Async - Fire and Forget)
        // We don't await this so the API returns immediately
        this.runJobFlow(job.id, userId).catch(err => {
            console.error(`❌ Job Flow Failed for ${job.id}:`, err);
        });

        return job;
    }

    /**
     * Orchestrates the agent chain directly in-memory
     */
    private async runJobFlow(jobId: string, userId: string) {
        console.log(`\n🚀 Starting Job Flow: ${jobId}`);
        
        // 1. Fetch fresh job
        let job = await SupabaseDB.getGenerationJobById(jobId, userId);
        if (!job) {
            console.error(`❌ Job ${jobId} not found in DB`);
            return;
        }

        try {
            // ─────────────────────────────────────────────────────────────
            // STEP 1: INTENT AGENT
            // ─────────────────────────────────────────────────────────────
            const intentOutput = await this.intentAgent.run(job);
            
            // Update local job state for next step
            job.result = intentOutput;
            job.current_step_data = intentOutput;
            
            const format = intentOutput.metadata.outputFormat || 'presentation';

            // ─────────────────────────────────────────────────────────────
            // STEP 2: BRANCHING LOGIC
            // ─────────────────────────────────────────────────────────────
            
            if (format === 'presentation') {
                // 🚀 PRESENTATION BYPASS: Skip Layout/Content -> Go Direct to Rendering
                console.log(`⏩ Presentation detected: Bypassing Layout/Content agents.`);
                
                // RenderingAgent handles the IntentResponse via the adapter we added
                await this.renderingAgent.run(job);
                
            } else if (format === 'image') {
                // 🎨 IMAGE GENERATION: Use DALL-E to generate image
                console.log(`🎨 Image generation detected: Using ImageGenerationAgent.`);
                
                // ImageGenerationAgent handles everything - from Intent to final image URL
                await this.imageAgent.run(job);
                
            } else if (format === 'document') {
                // Document Flow: Layout -> Content -> Render
                
                // Layout
                const layoutOutput = await this.docLayout.run(job);
                job.result = layoutOutput;
                job.current_step_data = layoutOutput;
                
                // Content
                const contentOutput = await this.docContent.run(job);
                job.result = contentOutput;
                job.current_step_data = contentOutput;
                
                // Render
                await this.renderingAgent.run(job);
                
            } else if (format === 'spreadsheet' || format === 'chart') {
                // Spreadsheet/Chart Flow: Layout -> Content -> Render
                // Both use same data generation, but frontend renders differently
                
                console.log(`📊 ${format === 'chart' ? 'Chart (THE analyser)' : 'Spreadsheet'} generation: Layout -> Content -> Render`);
                
                // Layout
                const layoutOutput = await this.sheetLayout.run(job);
                job.result = layoutOutput;
                job.current_step_data = layoutOutput;
                
                // Content
                const contentOutput = await this.sheetContent.run(job);
                job.result = contentOutput;
                job.current_step_data = contentOutput;
                
                // Render
                await this.renderingAgent.run(job);
            }

            console.log(`✅ Job Flow Complete: ${jobId}\n`);

        } catch (error) {
            console.error(`❌ Job Flow Error:`, error);
            // Error handling is done inside BaseAgent.run(), so DB should be updated already
        }
    }

    async getJobStatus(jobId: string, userId: string) {
        // Get job using Supabase
        return await SupabaseDB.getGenerationJobById(jobId, userId);
    }

    async getUserJobs(userId: string) {
        // Get all user jobs using Supabase
        return await SupabaseDB.getUserGenerationJobs(userId);
    }

    async getRecentJobs(userId: string, limit: number = 3) {
        // Get recent jobs using Supabase
        const jobs = await SupabaseDB.getUserGenerationJobs(userId);
        return jobs.slice(0, limit);
    }

    private async generateTitle(prompt: string): Promise<string> {
        try {
            const response = await this.claude.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 20,
                temperature: 0.7,
                system: "Generate a concise 3-4 word title for this user request. No quotes. Do not use 'Presentation for' or 'Guide for' prefixes unless necessary, just the topic.",
                messages: [
                    { role: "user", content: prompt }
                ]
            });
            const textBlock: any = response.content.find((block: any) => block.type === 'text');
            return textBlock?.text?.replace(/^"|"$/g, '').trim() || "New Generation";
        } catch (e) {
            return "New Generation";
        }
    }
}
