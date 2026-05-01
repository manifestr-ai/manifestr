import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import { generateJSON } from '../lib/claude';

interface GenerateChartRequest {
    prompt: string;
    userId?: string;
    meta?: any;
}

interface ModifyChartRequest {
    prompt: string;
    chartData: any;
    userId?: string;
    meta?: any;
    generationId?: string;
}

export class ChartGeneratorController extends BaseController {
    public basePath = '/chart-generator';

    constructor() {
        super();
    }

    // Middleware to increase timeout for AI-heavy routes
    private extendTimeout(req: Request, res: Response, next: any) {
        // Increase timeout to 10 minutes for this request only (charts can be complex)
        req.socket.setTimeout(600000); // 10 minutes
        res.socket?.setTimeout(600000);
        
        // Send keep-alive headers to prevent proxy timeouts
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Keep-Alive', 'timeout=600');
        
        next();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/generate',
                middlewares: [this.extendTimeout.bind(this)],
                handler: this.generateChart.bind(this),
            },
            {
                verb: 'POST',
                path: '/modify',
                middlewares: [this.extendTimeout.bind(this)],
                handler: this.modifyChart.bind(this),
            },
        ];
    }

    private async generateChart(req: Request, res: Response) {
        try {
            const { prompt, userId, meta } = req.body as GenerateChartRequest;

            if (!prompt) {
                return res.status(400).json({ error: 'Missing required field: prompt' });
            }

            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`📊 Generating chart for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

            // Create job in database
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'chart',
                input_data: {
                    prompt: prompt,
                    output: 'chart',
                    meta: meta || {},
                    title: prompt.substring(0, 60)
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            // Generate chart using Claude
            const systemPrompt = `
You are a CHART GENERATION EXPERT.
Your task is to generate a chart visualization based on the user's request.

CRITICAL RULES:
- Generate realistic and appropriate sample data
- Choose the most suitable chart type for the data
- Include proper labels and titles
- Use professional color schemes
- Ensure data is properly formatted

CHART TYPES AVAILABLE:
- bar: Vertical bar chart for comparing categories
- horizontalBar: Horizontal bar chart
- line: Line chart for trends over time
- area: Area chart (filled line chart)
- pie: Pie chart for parts of a whole
- doughnut: Doughnut chart (donut-shaped pie)
- radar: Radar/spider chart for multivariate data
- polarArea: Polar area chart
- scatter: Scatter plot for X-Y relationships
- bubble: Bubble chart (scatter with sized points)
- histogram: Histogram for distributions
- boxplot: Box and whisker plot for statistical data
- waterfall: Waterfall chart for cumulative values
- funnel: Funnel chart for conversion/pipeline data
- gauge: Gauge chart for KPIs
- gantt: Gantt chart for timelines/projects

COLOR SCHEMES AVAILABLE:
- professional: Blues and reds
- ocean: Blues and teals
- sunset: Oranges and yellows
- mono: Grayscale
- pastel: Soft pastels
- earth: Earth tones
- neon: Bright neons

IMPORTANT: Return a JSON object with this exact structure:
{
  "chartType": "bar",
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [
    {
      "label": "Revenue",
      "data": [100, 120, 110, 150]
    },
    {
      "label": "Profit",
      "data": [30, 45, 40, 60]
    }
  ],
  "chartTitle": "Quarterly Performance",
  "showLegend": true,
  "showGrid": true,
  "selectedColorScheme": "professional"
}
`;

            const userPrompt = `
USER REQUEST: "${prompt}"

Generate a complete, professional chart that fulfills this request.
Make sure to include:
- Appropriate chart type for the data
- Meaningful labels (at least 4-8 data points)
- Realistic sample data (1-3 datasets)
- Descriptive title
- Proper settings (legend, grid, color scheme)

Return ONLY the JSON structure specified above, nothing else.
`;

            const chartResult = await generateJSON<any>(
                null,
                systemPrompt,
                userPrompt
            );

            console.log(`✅ Chart structure generated successfully!`);

            // Save result to database
            const result = {
                jobId: job.id,
                outputFormat: 'chart',
                editorState: {
                    chartState: chartResult,
                    type: 'chart'
                },
                status: 'success',
                tokensUsed: 0
            };

            // Save JSON to Supabase Storage
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/charts/${job.id}.json`;
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
                const localJsonDir = path.join(process.cwd(), 'public/uploads/charts');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                jsonUrl = `${baseUrl}/uploads/charts/${job.id}.json`;
            }

            // Update job as completed
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: jsonUrl
            });

            // Create vault item
            await SupabaseDB.createVaultItem(jobUserId, {
                title: prompt.substring(0, 100) || 'AI Generated Chart',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: '',
                project: 'Charts',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'chart',
                    chartType: chartResult.chartType
                }
            });

            console.log(`💾 Chart saved to database and vault!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    chartData: chartResult,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Chart generation failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    private async modifyChart(req: Request, res: Response) {
        try {
            const { prompt, chartData, userId, meta, generationId } = req.body as ModifyChartRequest;

            if (!prompt || !chartData) {
                return res.status(400).json({ error: 'Missing required fields: prompt and chartData' });
            }

            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`📊 Modifying chart for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
            
            // Check if we're updating an existing generation
            let job: any;
            if (generationId) {
                console.log(`🔄 Updating existing generation: ${generationId}`);
                job = { id: generationId };
                await SupabaseDB.updateGenerationJob(generationId, jobUserId, {
                    status: 'processing',
                    progress: 0
                });
            } else {
                // Create NEW job in database
                job = await SupabaseDB.createGenerationJob(jobUserId, {
                    type: 'chart',
                    input_data: {
                        prompt: prompt,
                        chartData: chartData,
                        output: 'chart',
                        meta: meta || {},
                        title: `Modified: ${prompt.substring(0, 50)}`
                    },
                    status: 'processing'
                });
            }

            console.log(`📝 Job ID: ${job.id}`);

            // Generate modification prompt
            const systemPrompt = `
You are a CHART MODIFICATION EXPERT.
Your task is to take an existing chart and modify it according to the user's request.

CRITICAL RULES:
- ONLY modify what the user specifically asks for
- Keep the existing chart type unless explicitly told to change it
- Maintain data integrity and structure
- If adding data, make it realistic and consistent with existing data
- If changing visualization, choose the most appropriate chart type
- Return the COMPLETE modified chart in the same JSON format

AVAILABLE CHART TYPES:
bar, horizontalBar, line, area, pie, doughnut, radar, polarArea, scatter, bubble, histogram, boxplot, waterfall, funnel, gauge, gantt

AVAILABLE COLOR SCHEMES:
professional, ocean, sunset, mono, pastel, earth, neon
`;

            const userPrompt = `
USER MODIFICATION REQUEST: "${prompt}"

CURRENT CHART DATA:
${JSON.stringify(chartData, null, 2)}

Please modify the chart according to the user's request and return the COMPLETE modified version.
Maintain the same JSON structure:
{
  "chartType": "...",
  "labels": [...],
  "datasets": [...],
  "chartTitle": "...",
  "showLegend": true/false,
  "showGrid": true/false,
  "selectedColorScheme": "..."
}

Return ONLY the JSON structure, nothing else.
`;

            const modifiedChart = await generateJSON<any>(
                null,
                systemPrompt,
                userPrompt
            );

            console.log(`✅ Chart modified successfully!`);

            // Save result
            const result = {
                jobId: job.id,
                outputFormat: 'chart',
                editorState: {
                    chartState: modifiedChart,
                    originalData: chartData,
                    type: 'chart'
                },
                status: 'success',
                tokensUsed: 0
            };

            // Save to storage
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/charts/${job.id}.json`;
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
                const localJsonDir = path.join(process.cwd(), 'public/uploads/charts');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                jsonUrl = `${baseUrl}/uploads/charts/${job.id}.json`;
            }

            // Update job
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: jsonUrl
            });

            // Create vault item
            await SupabaseDB.createVaultItem(jobUserId, {
                title: `Modified: ${prompt.substring(0, 80)}` || 'AI Modified Chart',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: '',
                project: 'Charts',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'chart-modification',
                    chartType: modifiedChart.chartType
                }
            });

            console.log(`💾 Modified chart saved!`);

            // Return the modified chart to frontend
            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    chartData: modifiedChart,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Chart modification failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }
}

export default ChartGeneratorController;
