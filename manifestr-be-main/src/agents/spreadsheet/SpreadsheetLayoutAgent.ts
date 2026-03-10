import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, LayoutResponse, LayoutGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class SpreadsheetLayoutAgent extends BaseAgent<IntentResponse, LayoutResponse> {

  getProcessingStatus(): string {
    return 'processing_layout';
  }

  extractInput(job: any): IntentResponse {
    // Get output from previous agent (Intent)
    return job.result || job.current_step_data || job.input_data;
  }

  async process(input: IntentResponse, job: any): Promise<LayoutResponse> {
    if (!input || !input.metadata) {
      throw new Error("Invalid input: missing intent metadata");
    }

    const systemPrompt = `
      Your mission: Define the ARCHITECTURE for a complex, multi-sheet spreadsheet application.
      
      ### 1. PHILOSOPHY: "The Spreadsheet App"
      - We do NOT build simple lists. We build **Systems**.
      - The output must be a SINGLE "Workbook Master" block that describes the entire system.
      
      ### 2. INTENT ANALYSIS
      - **Goal**: ${input.metadata.goal}
      - **Type**: ${input.metadata.type}
      
      **ARCHITECTURAL PATTERNS**:
      - **Finance**: [Dashboard] -> [Assumptions] -> [Monthly Model] -> [Summary]
      - **Project**: [Gantt View] -> [Task Database] -> [Team Utilization] -> [Settings]
      - **Inventory**: [Stock Dashboard] -> [In/Out Log] -> [Product Master] -> [Suppliers]
      
      ### 3. OUTPUT STRUCTURE
      Return a JSON object with a **SINGLE** block representing the Workbook.
      
      **CRITICAL**: 
      - The 'constraints.description' field MUST contain the detailed "Blueprint" for the Content Agent.
      - List exactly which sheets to create and their purpose in the description.

      ** REQUIRED JSON **:
      {
        "blocks": [
          {
            "id": "workbook-master",
            "type": "sheet",
            "title": "${input.title || "Master Workbook"}",
            "layoutType": "spreadsheet-app",
            "components": [
               { 
                 "role": "table", 
                 "constraints": { 
                    "description": "Create a multi-sheet workbook with: 1. Executive Dashboard (KPIs, Charts). 2. Detailed Analysis (Complex Formulas). 3. Raw Data (Clean database format). Ensure sheets are linked via VLOOKUP/SUMIFS." 
                 } 
               }
            ]
          }
        ]
      }
      `;

    const generatedData = await generateJSON<z.infer<typeof LayoutGenerationSchema>>(
      LayoutGenerationSchema,
      systemPrompt,
      JSON.stringify(input)
    );

    const response: LayoutResponse = {
      jobId: input.jobId,
      intent: input,
      ...generatedData
    };

    return response;
  }
}
