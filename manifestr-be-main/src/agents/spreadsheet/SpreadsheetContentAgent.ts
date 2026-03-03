import { BaseAgent } from "../core/BaseAgent";
import { LayoutResponse, ContentResponse, ContentGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class SpreadsheetContentAgent extends BaseAgent<LayoutResponse, ContentResponse> {

  getProcessingStatus(): string {
    return 'processing_content';
  }

  extractInput(job: any): LayoutResponse {
    // Get output from previous agent (Layout)
    return job.result || job.current_step_data;
  }

  async process(input: LayoutResponse, job: any): Promise<ContentResponse> {
    if (!input || !input.blocks) {
      throw new Error("Invalid Input: LayoutResponse is missing 'blocks'. Ensure LayoutAgent completed successfully.");
    }

    const systemPrompt = `
      You are an ADVANCED EXPERT in FINANCIAL MODELING and Univer/Spreadsheet JSON Structure.
      Your mission: Generate a COMPLETE, COMPLEX Workbook JSON structure.

      ### 1. THE TASK
      - The user needs a full multi-sheet spreadsheet.
      - You must output a SINGLE JSON OBJECT (or stringified JSON) representing the "Univer" snapshot.
      
      ### 2. CORE STRUCTURE (Univer-like)
      {
        "id": "workbook-1",
        "appVersion": "3.0.0-alpha",
        "locale": "en-US",
        "name": "Financial Model",
        "sheetOrder": ["sheet-1", "sheet-2"],
        "styles": { "style-header": { "ff": "Arial", "fs": 12, "bl": 1, "bg": { "rgb": "#eee" } } },
        "sheets": {
           "sheet-1": {
              "id": "sheet-1",
              "name": "Dashboard",
              "rowCount": 50,
              "columnCount": 20,
              "cellData": {
                 "0": { "0": { "v": "Title", "s": "style-header" } }, 
                 "1": { "0": { "v": 100, "t": 2, "f": "=SUM(A1:A10)" } }
              }
           },
           "sheet-2": { "id": "sheet-2", "name": "Data", "cellData": {} }
        }
      }

      ### 2. DATA DENSITY & STYLING (CRITICAL)
      - **Scale**: CHECK "Layout Instructions" above.
         - If it says "100+", generate **100 rows minimum**.
         - If it says "10 years", generate **10 columns**.
         - **DEFAULT**: Generate **50+ rows** of realistic data if no number is specified.
      - **Consolidation**: Put ALL tasks/data in the Main Sheet. Do not split them.
      
      **ADVANCED STYLING LOGIC**:
      - **Conditional Formatting**: 
         - If Status = "Completed", set cell style to "style-completed" (Green text/bg).
         - If Status = "Overdue", set cell style to "style-overdue" (Red text/bg).
         - If Status = "In Progress", set cell style to "style-active" (Blue/Yellow).
      - **Headers**: Freeze the top row (if possible) and use "style-header" (Bold, Gray BG).

      **SCHEMA REQUIREMENTS**:
      - "styles": Define "style-completed", "style-overdue", "style-header", "style-active".
      - "cellData": Populate rows 1 to 100.
      
      **Example Row Data (Gantt)**:
      - Row 1: Headers ["Task", "Start", "End", "Status", "Assignee"]
      - Row 2: ["Design Mockups", "2024-01-01", "2024-01-10", "Completed", "Alice"] (Style: style-completed)
      - Row 3: ["Backend API", "2024-01-05", "2024-02-01", "Overdue", "Bob"] (Style: style-overdue)

      **NEGATIVE CONSTRAINT**: 
      - Do NOT create many small sheets. 
      - Do NOT leave cells empty. Fill them with plausible dummy data.

      ### 3. ADVANCED FORMULAS & MODELING (CRITICAL)
      - **Users demand EXPERT LEVEL modeling.** Do not just use SUM.
      - **Project Management formulas**:
         - Duration: \`=DATEDIF(B2,C2,"d")\`
         - Workdays: \`=NETWORKDAYS(B2,C2)\`
         - Status Checks: \`=IF(C2<TODAY(),"Overdue","On Track")\`
         - Progress bars: (Simulate with conditional formatting or sparklines if supported).
      - **Financial formulas**:
         - Growth: \`=(C2-B2)/B2\`
         - NPV: \`=NPV(0.1, D2:D10)\`
         - LOOKUPS: Use \`=VLOOKUP(A2, 'Data'!A:B, 2, FALSE)\` for cross-sheet references.

      ### 4. REQUIREMENTS
      - **CRITICAL**: 'sheetOrder' array MUST match the keys in 'sheets'.
      - **MANDATORY**: Every calculated column MUST use a formula "f": "..." attribute.
      - Use STYLES heavily (Bold headers, Currency formatting ($), Status Colors).
      - REALISTIC DATA based on intent.

      ### 5. OUTPUT FORMAT
      Return valid JSON matching \`ContentGenerationSchema\`:
      {
         "generatedContent": [
           {
             "blockId": "workbook-container",
             "content": {
               "workbook": <THE FULL VALID JSON OBJECT>
             }
           }
         ]
      }
      `;

    // BYPASS VALIDATION - accept anything from OpenAI
    const generatedData: any = await generateJSON<any>(
      null,
      systemPrompt,
      JSON.stringify(input.blocks)
    );

    let contentArray = generatedData.generatedContent || generatedData.content ||
      generatedData.blocks || Object.values(generatedData)[0];

    if (!Array.isArray(contentArray)) contentArray = [];

    generatedData.generatedContent = input.blocks.map((block: any, index: number) => {
      const aiContent = contentArray[index] || {};
      return {
        blockId: block.id,
        content: typeof aiContent.content === 'string'
          ? { text: aiContent.content }
          : (aiContent.content || aiContent || {})
      };
    });

    const response: ContentResponse = {
      jobId: input.jobId,
      layout: input,
      ...generatedData
    };

    return response;
  }
}
