import SupabaseDB from "../lib/supabase-db";
import { UserPrompt } from "../agents/protocols/types";
import Anthropic from "@anthropic-ai/sdk";
import { fetchUnsplashImage } from "../utils/image.util";
import EventTrackingService from "./EventTracking.service";
import { s3Util } from "../utils/s3.util";

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
    async startGeneration(userId: string, promptData: Partial<UserPrompt>, sessionId?: string): Promise<any> {
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

        // 🎯 Track AI Generation Started
        await EventTrackingService.track({
            userId,
            sessionId,
            eventName: 'AI Generation Started',
            eventCategory: 'product_usage',
            eventAction: 'generation_started',
            resourceId: job.id,
            resourceType: 'generation_job',
            properties: {
                generation_type: promptData.output,
                prompt_length: promptData.prompt?.length || 0,
                has_style_guide: !!promptData.style_guide_id
            }
        });

        // 3. Start the Agent Flow (Async - Fire and Forget)
        // We don't await this so the API returns immediately
        this.runJobFlow(job.id, userId, sessionId).catch(err => {
            console.error(`❌ Job Flow Failed for ${job.id}:`, err);
        });

        return job;
    }

    /**
     * Orchestrates the agent chain directly in-memory
     */
    private async runJobFlow(jobId: string, userId: string, sessionId?: string) {
        console.log(`\n🚀 Starting Job Flow: ${jobId}`);
        
        const startTime = Date.now();
        
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
                
            } else if (format === 'chart') {
                // 📊 CHART FLOW: Use dedicated chart generation logic
                console.log(`📊 Chart generation: Direct AI chart generation with comparison support`);
                
                await this.generateChartWithAI(job);
                
            } else if (format === 'spreadsheet') {
                // 📊 Spreadsheet Flow: Layout -> Content -> Render
                console.log(`📊 Spreadsheet generation: Layout -> Content -> Render`);
                
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

            const endTime = Date.now();
            const durationMs = endTime - startTime;

            // 🎯 Track AI Generation Complete with Performance Metrics
            await EventTrackingService.trackAIGeneration({
                userId,
                eventName: 'AI Generation Completed',
                aiModel: 'claude-sonnet-4-20250514',
                durationMs,
                tokensUsed: job.tokens_used || 0,
                costUsd: 0, // Calculate based on your pricing if needed
                resourceId: jobId,
                resourceType: 'generation_job',
                properties: {
                    generation_type: format,
                    success: true
                }
            });

            // 🎯 Track Content Creation & Activation
            await EventTrackingService.trackContentCreation({
                userId,
                sessionId,
                contentType: format as any,
                action: 'generated',
                resourceId: jobId,
                properties: {
                    duration_ms: durationMs,
                    tokens_used: job.tokens_used || 0,
                    ai_model: 'claude-sonnet-4-20250514'
                }
            });

            console.log(`✅ Job Flow Complete: ${jobId}\n`);

        } catch (error: any) {
            console.error(`❌ Job Flow Error:`, error);
            
            const endTime = Date.now();
            const durationMs = endTime - startTime;

            // 🎯 Track AI Generation Failure
            await EventTrackingService.track({
                userId,
                sessionId,
                eventName: 'AI Generation Failed',
                eventCategory: 'product_usage',
                eventAction: 'generation_failed',
                resourceId: jobId,
                resourceType: 'generation_job',
                properties: {
                    generation_type: job.type,
                    error_message: error.message || 'Unknown error',
                    duration_ms: durationMs
                }
            });
            
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

    /**
     * Generate chart using AI with intelligent comparison support
     */
    private async generateChartWithAI(job: any) {
        console.log(`\n📊 === SMART CHART GENERATION START ===`);
        
        const prompt = job.input_data?.prompt || '';
        const meta = job.input_data?.meta || {};
        
        console.log(`📝 User Prompt: "${prompt}"`);
        
        // Update job status
        await SupabaseDB.updateGenerationJob(job.id, job.user_id, {
            status: 'processing',
            progress: 30
        });

        // Generate chart using Claude with SMART comparison detection
        const systemPrompt = `You are an EXPERT CHART GENERATION AI with ADVANCED COMPARISON DETECTION.

Your mission: Generate professional, data-rich charts that INTELLIGENTLY detect comparison requests.

🎯 CRITICAL COMPARISON DETECTION RULES:
1. When user says "compare X vs Y" or "X versus Y" → Create MULTIPLE datasets for comparison
2. When user says "X and Y performance" → Create datasets for both X and Y
3. When user mentions 2+ entities (companies, products, regions) → Create dataset for EACH
4. When user says "between A and B" → Create datasets for A and B
5. For single entity requests → Create single dataset

📊 CHART TYPE SELECTION (SMART):
- Comparison of 2+ entities over time → LINE or BAR chart
- Comparison of 2+ categories at single point → BAR (vertical or horizontal)
- Parts of whole → PIE or DOUGHNUT
- Trend over time (single entity) → LINE or AREA
- Distribution → HISTOGRAM
- Process flow → FUNNEL
- Project timeline → GANTT

AVAILABLE CHART TYPES:
bar, horizontalBar, line, area, pie, doughnut, radar, polarArea, scatter, bubble, histogram, boxplot, waterfall, funnel, gauge, gantt

🎨 OUTPUT STRUCTURE (REQUIRED):
{
  "chartType": "bar",
  "labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
  "datasets": [
    {
      "label": "Product A",
      "data": [12500, 15200, 14800, 18900]
    },
    {
      "label": "Product B", 
      "data": [11200, 13800, 16500, 17200]
    }
  ],
  "chartTitle": "Product A vs Product B - Quarterly Sales",
  "showLegend": true,
  "showGrid": true,
  "selectedColorScheme": "professional"
}

🔥 EXAMPLES:

Example 1 - Comparison Request:
User: "compare sales of iPhone vs Samsung in 2024"
Output: 
{
  "chartType": "line",
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "datasets": [
    {"label": "iPhone Sales", "data": [45000, 48000, 52000, 49000, 55000, 58000]},
    {"label": "Samsung Sales", "data": [38000, 40000, 43000, 45000, 47000, 50000]}
  ],
  "chartTitle": "iPhone vs Samsung Sales Comparison 2024",
  "showLegend": true,
  "showGrid": true,
  "selectedColorScheme": "professional"
}

Example 2 - Multiple Entity Comparison:
User: "revenue comparison between Google, Microsoft, and Apple"
Output:
{
  "chartType": "bar",
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [
    {"label": "Google", "data": [75000, 82000, 79000, 91000]},
    {"label": "Microsoft", "data": [68000, 72000, 76000, 85000]},
    {"label": "Apple", "data": [95000, 98000, 102000, 115000]}
  ],
  "chartTitle": "Google vs Microsoft vs Apple - Quarterly Revenue",
  "showLegend": true,
  "showGrid": true,
  "selectedColorScheme": "professional"
}

Example 3 - Single Entity (NOT a comparison):
User: "show our company revenue growth"
Output:
{
  "chartType": "line",
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "datasets": [
    {"label": "Revenue", "data": [25000, 28000, 32000, 35000, 38000, 42000]}
  ],
  "chartTitle": "Company Revenue Growth 2024",
  "showLegend": true,
  "showGrid": true,
  "selectedColorScheme": "professional"
}

⚡ CRITICAL RULES:
- ALWAYS include 4-12 data points per dataset (labels)
- Generate REALISTIC data that makes sense for the domain
- When comparing, make data COMPARABLE (same scale/range)
- Create DESCRIPTIVE titles that mention what's being compared
- For comparisons, ALWAYS use multiple datasets (one per entity)
- Keep dataset labels clear and concise`;

        const userPrompt = `USER REQUEST: "${prompt}"

CONTEXT:
${meta.tone ? `Tone: ${meta.tone}` : ''}
${meta.audience ? `Audience: ${meta.audience}` : ''}
${meta.brand ? `Brand: ${meta.brand}` : ''}

ANALYZE THIS REQUEST:
1. Is this a COMPARISON request? (look for "vs", "versus", "compare", "between", multiple entities mentioned)
2. What entities/products/companies are being compared?
3. What metric is being measured?
4. What time period or categories should be shown?

Generate a complete, professional chart with:
- Proper chart type for the data
- Multiple datasets if this is a comparison
- Realistic sample data (at least 4-8 data points)
- Clear, descriptive title
- Appropriate color scheme

Return ONLY the JSON structure, nothing else.`;

        // Call Claude to generate chart
        const response = await this.claude.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const textBlock: any = response.content.find((block: any) => block.type === 'text');
        let chartData: any;

        try {
            // Extract JSON from response (might be wrapped in markdown)
            const text = textBlock?.text || '{}';
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                             text.match(/```\n([\s\S]*?)\n```/) ||
                             [null, text];
            
            chartData = JSON.parse(jsonMatch[1] || text);
            
            console.log(`✅ Chart structure generated:`);
            console.log(`   Type: ${chartData.chartType}`);
            console.log(`   Title: ${chartData.chartTitle}`);
            console.log(`   Datasets: ${chartData.datasets?.length || 0}`);
            chartData.datasets?.forEach((ds: any, idx: number) => {
                console.log(`     ${idx + 1}. ${ds.label} (${ds.data?.length || 0} points)`);
            });

        } catch (error) {
            console.error('❌ Failed to parse chart JSON:', error);
            throw new Error('Failed to parse chart data from AI response');
        }

        // Create result structure
        const result = {
            jobId: job.id,
            outputFormat: 'chart',
            editorState: {
                chartState: chartData,
                type: 'chart'
            },
            status: 'success',
            tokensUsed: response.usage?.input_tokens || 0
        };

        // Update job with result
        await SupabaseDB.updateGenerationJob(job.id, job.user_id, {
            status: 'completed',
            result: result,
            progress: 100,
            tokens_used: result.tokensUsed
        });

        // Store in job for vault creation
        job.result = result;
        job.current_step_data = result;

        // Create vault item for the chart
        try {
            const jsonContent = JSON.stringify(result);
            const fileKey = `vaults/generations/${job.user_id}/${job.id}.json`;
            
            // Upload to storage (handled by s3Util or falls back to local)
            await s3Util.uploadFile(fileKey, jsonContent, 'application/json');
            
            const finalUrl = s3Util.getFileUrl(fileKey);

            // Create vault item
            await SupabaseDB.createVaultItem(job.user_id, {
                title: chartData.chartTitle || prompt.substring(0, 100) || 'AI Generated Chart',
                type: 'file',
                status: 'Final',
                file_key: fileKey,
                thumbnail_url: job.input_data?.cover_image || '',
                project: 'Charts',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'chart',
                    chartType: chartData.chartType,
                    datasetCount: chartData.datasets?.length || 0,
                    isComparison: (chartData.datasets?.length || 0) > 1
                }
            });

            // Update job with final URL
            job.final_url = finalUrl;
            await SupabaseDB.updateGenerationJob(job.id, job.user_id, {
                final_url: finalUrl
            });

            console.log(`💾 Chart saved to vault: ${chartData.chartTitle}`);
        } catch (error) {
            console.error('❌ Failed to create vault item:', error);
            // Don't fail the job if vault creation fails
        }

        console.log(`📊 === SMART CHART GENERATION COMPLETE ===\n`);
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
