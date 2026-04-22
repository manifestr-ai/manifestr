import { BaseAgent } from "../core/BaseAgent";
import { LayoutResponse, ContentResponse, ContentGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";
import { detectSpreadsheetCategory, getSpreadsheetPrompt, COMMON_FOOTER } from "./SpreadsheetTemplates";

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

    // 🎯 DETECT THE SPREADSHEET CATEGORY
    const originalPrompt = job.input_data?.prompt || '';
    const metadata = input.intent?.metadata || {};
    
    console.log(`\n🔍 Detection Inputs:`, {
      prompt: originalPrompt,
      goal: metadata.goal,
      type: metadata.type
    });
    
    const category = detectSpreadsheetCategory(originalPrompt, metadata);
    
    console.log(`\n🎯 Detected Spreadsheet Category: ${category.toUpperCase()}`);
    console.log(`📝 Original Prompt: "${originalPrompt}"`);

    // 🎨 GET THE APPROPRIATE PROMPT TEMPLATE
    const categoryPrompt = getSpreadsheetPrompt(category);
    const systemPrompt = `${categoryPrompt}${COMMON_FOOTER}
    
    CONTEXT FROM USER:
    Original Request: "${originalPrompt}"
    Goal: ${metadata.goal || 'Not specified'}
    Tone: ${metadata.tone || 'Professional'}
    Audience: ${metadata.audience || 'General'}
    
    ⚠️ CRITICAL: You are generating a ${category.toUpperCase()} spreadsheet.
    Do NOT generate financial sheets unless the category is "financial".
    Match the sheet structure EXACTLY to the ${category.toUpperCase()} template above!
    `;

    // BYPASS VALIDATION - accept complex object
    // 🔥 CRITICAL: Use HIGHER token limit for spreadsheets (needs to generate lots of data!)
    const generatedData: any = await generateJSON<any>(
      null,
      systemPrompt,
      JSON.stringify(input.blocks),
      10,  // maxRetries
      16000  // maxTokens - INCREASED from default 8000 to 16000
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

    // 🔥 VALIDATION: Ensure the workbook has REQUIRED Univer fields
    if (!workbook || typeof workbook !== 'object') {
        throw new Error("AI did not generate a valid workbook object");
    }

    // Fix missing or invalid required fields
    if (!workbook.id) workbook.id = `workbook-${input.jobId}`;
    if (!workbook.appVersion) workbook.appVersion = "3.0.0-alpha";
    if (!workbook.name) workbook.name = "Generated Spreadsheet";
    if (!workbook.locale) workbook.locale = "en-US";
    if (!workbook.styles) workbook.styles = {};
    if (!workbook.sheets || typeof workbook.sheets !== 'object') {
        throw new Error("AI did not generate valid sheets object");
    }

    // Validate sheetOrder
    const sheetKeys = Object.keys(workbook.sheets);
    if (!workbook.sheetOrder || !Array.isArray(workbook.sheetOrder) || workbook.sheetOrder.length === 0) {
        workbook.sheetOrder = sheetKeys;
    }

    // Validate each sheet has required fields AND has actual cell data
    let totalCells = 0;
    sheetKeys.forEach(sheetId => {
        const sheet = workbook.sheets[sheetId];
        if (!sheet.id) sheet.id = sheetId;
        if (!sheet.name) sheet.name = `Sheet ${sheetKeys.indexOf(sheetId) + 1}`;
        if (!sheet.rowCount) sheet.rowCount = 100;
        if (!sheet.columnCount) sheet.columnCount = 20;
        if (!sheet.cellData) sheet.cellData = {};
        
        // Count cells in this sheet
        const cellCount = Object.keys(sheet.cellData).reduce((total, rowKey) => {
            const row = sheet.cellData[rowKey];
            return total + (row ? Object.keys(row).length : 0);
        }, 0);
        totalCells += cellCount;
        
        console.log(`  📄 Sheet "${sheet.name}": ${cellCount} cells`);
    });

    console.log(`✅ Validated workbook with ${sheetKeys.length} sheets: ${sheetKeys.map(k => workbook.sheets[k].name).join(', ')}`);
    console.log(`📊 Total cells generated: ${totalCells}`);
    
    if (totalCells === 0) {
        console.error(' WARNING: AI generated workbook structure but NO CELL DATA! Sheets are empty!');
        console.error('This usually means max_tokens was too low and Claude ran out of space.');
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
