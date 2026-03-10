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
      You are an WORLD-CLASS MANAGEMENT CONSULTANT and EXPERT FINANCIAL MODELER.
      Your mission: Create an "EXTRA ORDINARY", PROFESSIONAL-GRADE Spreadsheet Application.

      ### 1. THE GOAL
      - The user demands "Component Section Based Spreadsheets".
      - This means NOT just a grid of data. But a structured APPLICATION.
      - Each Sheet must look like a DASHBOARD or a TOOL, not just a CSV dump.

      ### 2. THE BLUEPRINT (Multi-Sheet Architecture)
      You must generate a SINGLE JSON object representing a full Univer Workbook with multiple sheets.
      
      **MANDATORY SHEETS STRUCTURE**:
      1. **"1. Dashboard"**: 
         - **Header Section**: Title, Date, "Refresh" button (simulated).
         - **KPI Cards Section**: Top row with big numbers (Revenue, Growth, Task Completion).
         - **Chart Data Section**: Summary tables ready for charting.
      2. **"2. Analysis / Model"**:
         - **Assumptions Box**: clearly separated inputs (Growth Rate, Tax, Headcount).
         - **Scenario Switcher**: A dropdown cell (Data Validation) to select "Base", "Upside", "Downside".
         - **Main Calculation Grid**: Complex formulas linking Assumptions to Outputs.
      3. **"3. Database"**:
         - **Raw Data Table**: Clean, flat data (50+ rows). 
         - Columns: ID, Date, Category, Sub-Category, Value, Status, Owner.
      4. **"4. Settings"**:
         - Lists for dropdowns (Categories, Team Members, Statuses).

      ### 3. ADVANCED STYLING (The "Extra Ordinary" Factor)
      - **Use "styles" heavily.**
      - **Color Palette**: Use Professional Blues (#1F4E78), Light Grays (#F2F2F2), and Semantic Colors (Green #E2EFDA for Good, Red #FFC7CE for Bad).
      - **Borders**: Use borders to define "Sections" (e.g. thick border around the KPI section).
      - **Fonts**: Use "Roboto" or "Arial", Size 10 for data, Size 14 for headers, Bold for KPIs.

      ### 4. FORMULA INTELLIGENCE
      - **NO STATIC VALUES** in the Model sheet. Everything must be calculated.
      - **Cross-Sheet References**: \`='3. Database'!C5\`
      - **Advanced Functions**:
         - \`=SUMIFS('3. Database'!E:E, '3. Database'!C:C, "Category A")\`
         - \`=VLOOKUP(A5, '4. Settings'!A:B, 2, FALSE)\`
         - \`=IF(C5 > 1000, "High", "Low")\`
         - \`=PMT(rate/12, months, loan_amount)\` (for Finance)

      ### 5. OUTPUT SPECIFICATION (Univer JSON)
      Return a valid JSON object matching this structure:
      {
        "id": "workbook-1",
        "appVersion": "3.0.0-alpha",
        "name": "Professional Model",
        "sheetOrder": ["sheet-dashboard", "sheet-model", "sheet-data", "sheet-settings"],
        "styles": {
           "style-header": { "ff": "Arial", "fs": 14, "bl": 1, "bg": { "rgb": "#1F4E78" }, "cl": { "rgb": "#FFFFFF" }, "ht": 2, "vt": 2 },
           "style-kpi": { "ff": "Arial", "fs": 18, "bl": 1, "ht": 2, "vt": 2, "bd": { "b": { "s": 1, "cl": { "rgb": "#000000" } } } },
           "style-input": { "bg": { "rgb": "#FFF2CC" }, "bd": { "b": { "s": 1, "cl": { "rgb": "#D9D9D9" } } } },
           "style-good": { "bg": { "rgb": "#C6EFCE" }, "cl": { "rgb": "#006100" } },
           "style-bad": { "bg": { "rgb": "#FFC7CE" }, "cl": { "rgb": "#9C0006" } }
        },
        "sheets": {
           "sheet-dashboard": { ... },
           "sheet-model": { ... },
           "sheet-data": { ... },
           "sheet-settings": { ... }
        }
      }

      **CRITICAL CONSTRAINT**:
      - Generate **REALISTIC, COHERENT DATA**. No "Sample 1", "Sample 2". Use real industry terms.
      - If user asks for "Marketing", use "CPC", "CTR", "Conversion Rate".
      - If user asks for "Construction", use "Materials", "Labor", "Permits".
      
      ### 6. RETURN FORMAT
      Return the JSON inside a "content.workbook" field.
      `;

    // BYPASS VALIDATION - accept complex object
    const generatedData: any = await generateJSON<any>(
      null,
      systemPrompt,
      JSON.stringify(input.blocks)
    );

    // Ensure we handle the response correctly.
    // The AI might return { workbook: ... } or just the workbook directly if forced.
    // Our prompt asks for { content: { workbook: ... } } structure via schema (implicitly) or prompt.
    // Let's normalize.

    let workbook = generatedData.content?.workbook || generatedData.workbook || generatedData;
    
    // Safety check: if it's stringified, parse it
    if (typeof workbook === 'string') {
        try { workbook = JSON.parse(workbook); } catch (e) {}
    }

    // Assign to the FIRST block (Master Block)
    const processedContent = [{
        blockId: input.blocks[0].id,
        content: {
            workbook: workbook
        }
    }];

    const response: ContentResponse = {
      jobId: input.jobId,
      layout: input,
      generatedContent: processedContent
    };

    return response;
  }
}
