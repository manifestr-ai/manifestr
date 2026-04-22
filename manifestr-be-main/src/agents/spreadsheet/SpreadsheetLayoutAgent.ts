import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, LayoutResponse, LayoutGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";
import { detectSpreadsheetCategory } from "./SpreadsheetTemplates";

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

    // Detect category to provide better architectural guidance
    const originalPrompt = job.input_data?.prompt || input.originalPrompt || '';
    const category = detectSpreadsheetCategory(originalPrompt, input.metadata);

    const systemPrompt = `
      Your mission: Define the ARCHITECTURE for a spreadsheet application.
      
      ### 1. PHILOSOPHY: "The Spreadsheet App"
      - We do NOT build simple CSV dumps. We build **Structured Applications**.
      - The output must be a SINGLE "Workbook Master" block that describes the entire system.
      
      ### 2. INTENT ANALYSIS
      - **Goal**: ${input.metadata.goal}
      - **Type**: ${input.metadata.type}
      - **Detected Category**: ${category.toUpperCase()}
      
      **ARCHITECTURAL PATTERNS BY CATEGORY**:
      
      🔹 **FINANCIAL**:
      [Dashboard: KPIs, Charts] → [Analysis/Model: Formulas, Scenarios] → [Transactions: Raw Data] → [Settings: Categories]
      
      🔹 **PROJECT TRACKER**:
      [Overview: Progress, Milestones] → [Task Board: Tasks, Status, Assignees] → [Team & Resources] → [Settings: Team, Statuses]
      
      🔹 **MEETING NOTES**:
      [Dashboard: Stats, Recent] → [Meeting Log: All Meetings] → [Action Items: Linked Actions] → [Attendees & Templates]
      
      🔹 **CALENDAR**:
      [Calendar View: Visual Grid] → [Events Database: All Events] → [Availability Matrix] → [Settings: Types, Locations]
      
      🔹 **LIST** (Simple):
      [Main List: Items, Status, Category] → [Categories (optional)] → [Archive (optional)]
      Keep it SIMPLE - no complex multi-sheet structure needed!
      
      🔹 **MARKETING**:
      [Campaign Dashboard: KPIs, Performance] → [Campaign Tracker: All Campaigns] → [Content Calendar: Posts, Schedule] → [Analytics & Settings]
      
      🔹 **WIP TRACKER**:
      [WIP Dashboard: Pipeline, Bottlenecks] → [Items Database: All Items, Stages] → [Stage History: Audit Log] → [Team & Capacity]
      
      🔹 **GENERAL**:
      [Overview/Dashboard] → [Main Data] → [Analysis/Details] → [Reference/Settings]
      
      ### 3. OUTPUT STRUCTURE
      Return a JSON object with a **SINGLE** block representing the Workbook.
      
      **CRITICAL**: 
      - The 'constraints.description' field MUST contain the detailed "Blueprint" for the Content Agent.
      - List exactly which sheets to create and their purpose based on the detected category.
      - Mention the category so the Content Agent knows which template to use.

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
                    "description": "Category: ${category}. Create appropriate multi-sheet workbook following the ${category} architectural pattern. Include proper formulas, styling, and realistic data." 
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
