import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import { generateJSON } from '../lib/claude';
import { detectSpreadsheetCategory, getSpreadsheetPrompt } from '../agents/spreadsheet/SpreadsheetTemplates';

interface GenerateSpreadsheetRequest {
    prompt: string;
    userId?: string;
    meta?: any;
}

interface ModifySpreadsheetRequest {
    prompt: string;
    spreadsheetData: any;
    userId?: string;
    meta?: any;
}

export class SpreadsheetGeneratorController extends BaseController {
    public basePath = '/spreadsheet-generator';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/generate',
                handler: this.generateSpreadsheet.bind(this),
            },
            {
                verb: 'POST',
                path: '/modify',
                handler: this.modifySpreadsheet.bind(this),
            },
        ];
    }

    private async generateSpreadsheet(req: Request, res: Response) {
        try {
            const { prompt, userId, meta } = req.body as GenerateSpreadsheetRequest;

            if (!prompt) {
                return res.status(400).json({ error: 'Missing required field: prompt' });
            }

            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`📊 Generating spreadsheet for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

            // 1. Create job in database
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'spreadsheet',
                input_data: {
                    prompt: prompt,
                    output: 'spreadsheet',
                    meta: meta || {},
                    title: prompt.substring(0, 60)
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            // 2. Detect spreadsheet category
            const category = detectSpreadsheetCategory(prompt, meta || {});
            console.log(`📊 Detected category: ${category.toUpperCase()}`);

            // 3. Get appropriate system prompt for the category
            const systemPrompt = getSpreadsheetPrompt(category);

            // 4. Generate spreadsheet structure using Claude
            const userPrompt = `
USER REQUEST: "${prompt}"

Generate a complete, professional spreadsheet that fulfills this request.
Make sure to include:
- Multiple relevant sheets/tabs
- Proper column headers
- Realistic sample data (at least 10-20 rows per sheet)
- Formulas where appropriate
- Clean, professional formatting

IMPORTANT: Return a JSON object with this exact structure:
{
  "workbook": {
    "name": "Spreadsheet Title",
    "sheets": [
      {
        "name": "Sheet Name",
        "data": [
          ["Header1", "Header2", "Header3"],
          ["Value1", "Value2", "Value3"],
          ...
        ],
        "formulas": {
          "A1": "=SUM(B2:B10)",
          ...
        },
        "formatting": {
          "columnWidths": [100, 150, 200],
          "headerRow": 0
        }
      }
    ]
  },
  "metadata": {
    "category": "${category}",
    "createdAt": "${new Date().toISOString()}"
  }
}
`;

            const spreadsheetResult = await generateJSON<any>(
                null,
                systemPrompt,
                userPrompt
            );

            console.log(`✅ Spreadsheet structure generated successfully!`);

            // 5. Save result to database
            const result = {
                jobId: job.id,
                outputFormat: 'spreadsheet',
                editorState: spreadsheetResult,
                status: 'success',
                tokensUsed: 0
            };

            // 6. Save JSON to Supabase Storage
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/spreadsheets/${job.id}.json`;
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
                const localJsonDir = path.join(process.cwd(), 'public/uploads/spreadsheets');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                jsonUrl = `${baseUrl}/uploads/spreadsheets/${job.id}.json`;
            }

            // 7. Update job as completed
            await SupabaseDB.updateGenerationJob(job.id, jobUserId, {
                status: 'completed',
                result: result,
                progress: 100,
                final_url: jsonUrl
            });

            // 8. Create vault item
            await SupabaseDB.createVaultItem(jobUserId, {
                title: prompt.substring(0, 100) || 'AI Generated Spreadsheet',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: '', // No thumbnail for spreadsheets
                project: 'Spreadsheets',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'spreadsheet',
                    category: category
                }
            });

            console.log(`💾 Spreadsheet saved to database and vault!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    spreadsheetData: spreadsheetResult,
                    category: category,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Spreadsheet generation failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    private async modifySpreadsheet(req: Request, res: Response) {
        try {
            const { prompt, spreadsheetData, userId, meta } = req.body as ModifySpreadsheetRequest;

            if (!prompt || !spreadsheetData) {
                return res.status(400).json({ error: 'Missing required fields: prompt and spreadsheetData' });
            }

            const defaultUserId = 'dcbe9e7d-3aca-48c7-b3de-ba8d4e39ba0b';
            const jobUserId = userId || (req as any).user?.userId || defaultUserId;

            console.log(`📊 Modifying spreadsheet for user ${jobUserId}...`);
            console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

            // 1. Create job in database
            const job = await SupabaseDB.createGenerationJob(jobUserId, {
                type: 'spreadsheet',
                input_data: {
                    prompt: prompt,
                    spreadsheetData: spreadsheetData,
                    output: 'spreadsheet',
                    meta: meta || {},
                    title: `Modified: ${prompt.substring(0, 50)}`
                },
                status: 'processing'
            });

            console.log(`📝 Job created: ${job.id}`);

            // 2. Generate modification prompt
            const systemPrompt = `
You are a SPREADSHEET MODIFICATION EXPERT.
Your task is to take an existing spreadsheet and modify it according to the user's request.

CRITICAL RULES:
- ONLY modify what the user specifically asks for
- Keep the existing structure intact unless explicitly told to change it
- Maintain data integrity and formulas
- If adding data, make it realistic and consistent with existing data
- If adding columns/rows, maintain proper formatting
- Return the COMPLETE modified spreadsheet in the same JSON format
`;

            const userPrompt = `
USER MODIFICATION REQUEST: "${prompt}"

CURRENT SPREADSHEET DATA:
${JSON.stringify(spreadsheetData, null, 2)}

Please modify the spreadsheet according to the user's request and return the COMPLETE modified version.
Maintain the same JSON structure.
`;

            const modifiedSpreadsheet = await generateJSON<any>(
                null,
                systemPrompt,
                userPrompt
            );

            console.log(`✅ Spreadsheet modified successfully!`);

            // 3. Save result
            const result = {
                jobId: job.id,
                outputFormat: 'spreadsheet',
                editorState: modifiedSpreadsheet,
                originalData: spreadsheetData,
                status: 'success',
                tokensUsed: 0
            };

            // 4. Save to storage
            const jsonContent = JSON.stringify(result);
            const jsonPath = `${jobUserId}/spreadsheets/${job.id}.json`;
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
                const localJsonDir = path.join(process.cwd(), 'public/uploads/spreadsheets');
                if (!fs.existsSync(localJsonDir)) {
                    fs.mkdirSync(localJsonDir, { recursive: true });
                }
                fs.writeFileSync(path.join(localJsonDir, `${job.id}.json`), jsonContent);
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                jsonUrl = `${baseUrl}/uploads/spreadsheets/${job.id}.json`;
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
                title: `Modified: ${prompt.substring(0, 80)}` || 'AI Modified Spreadsheet',
                type: 'file',
                status: 'Final',
                file_key: jsonPath,
                thumbnail_url: '',
                project: 'Spreadsheets',
                size: Buffer.byteLength(jsonContent),
                meta: {
                    generationJobId: job.id,
                    outputType: 'spreadsheet-modification'
                }
            });

            console.log(`💾 Modified spreadsheet saved!`);

            return res.json({
                status: 'success',
                data: {
                    jobId: job.id,
                    spreadsheetData: modifiedSpreadsheet,
                    generatedAt: new Date().toISOString()
                }
            });

        } catch (error: any) {
            console.error('❌ Spreadsheet modification failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }
}

export default SpreadsheetGeneratorController;
