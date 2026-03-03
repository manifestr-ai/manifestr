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
      Your mission: Define a container for a spreadsheet workbook tailored EXACTLY to the user's request.

      ### 1. LAYOUT STRATEGY
      - Spreadsheets are monolithic structures, not linear slides.
      - We will use a SINGLE "Workbook Container" block to hold the entire state.
      
      ### 2. INTENT ANALYSIS & SHEET STRATEGY
      - **Goal**: ${input.metadata.goal}
      - **Type**: ${input.metadata.type}
      
      **CRITICAL STRATEGY**:
      - **MODELING BEST PRACTICES**: Separate Inputs from Outputs.
      - **Finance**: 
          1. "Assumptions" (Drivers, Growth Rates).
          2. "Financial Model" (Calculations driven by formulas).
          3. "Dashboard" (Summary Charts).
      - **Gantt/Project**: 
          1. "Project Tracker" (The massive data sheet).
          2. "Dashboard" (Executive Summary).
      
      **CONSOLIDATION RULE**: 
      - Keep all raw data in ONE place.
      - Never create fragmentation (e.g. "Jan", "Feb", "Mar" sheets). Use columns instead.

      ### 3. OUTPUT STRUCTURE
      Return a JSON object with a "blocks" array.
      
      ** NEGATIVE CONSTRAINTS **:
    - DO NOT flatten the structure. 
      - The Root Object must NOT contain "component" or "components". 
      - The Root Object must NOT contain "layoutType".
      - These belong INSIDE the "blocks" array items.

      ** REQUIRED JSON **:
    {
      "blocks": [
        {
          "id": "workbook-container",
          "type": "sheet",
          "title": "${input.title || "Workbook"}",
          "layoutType": "spreadsheet-master",
          "components": [
            {
              "id": "workbook",
              "role": "table",
              "constraints": {
                 "suggestedData": "Create 2 sheets max. Main Sheet MUST have ${input.metadata.itemCount || '50+'} rows/items. Dashboard separates visuals."
              }
            }
          ]
        }
      ]
    }

      ### 4. COMPONENT ROLES
      - "title", "subtitle", "body", "image", "chart", "table", "caption", "header", "row", "column", "cell", "footer", "timeline", "task".

       Return valid JSON per LayoutGenerationSchema.
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
