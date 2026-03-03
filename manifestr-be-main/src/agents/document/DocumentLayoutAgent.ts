import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, LayoutResponse, LayoutGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class DocumentLayoutAgent extends BaseAgent<IntentResponse, LayoutResponse> {

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
      You are a SENIOR ART DIRECTOR for High-End Publishing (New York Times, Monocle, HBR).
      Your mission: Design a beautiful, readable DOCUMENT layout. Not slides. Long-form pages.
      
      ### 1. DESIGN SYSTEM (MANDATORY)
      **Color Palette**:
      - Generate a UNIQUE palette. Document palette should be CLEAN and READABLE (High contrast text).
      - Tone: "${input.metadata.tone}"
      - User Preference: "${input.designPreferences?.colorTheme || "NONE"}"
      
      **Typography**:
      - Use SERIF for Body if "Classic/Trust", SANS for "Modern".
      - Pairings: "Merriweather/Open Sans", "Playfair Display/Lato".
      - User Preference: "${input.designPreferences?.fontStyle || "NONE"}"

      ### 2. DYNAMIC LAYOUT STRATEGY (CRITICAL)
      You are not a template machine. **LISTEN to the user's intent.**
      
      **Feature Flags (Check input.designPreferences):**
      - **Has Charts?** (${input.designPreferences?.hasCharts}): If TRUE, you MUST include "data-section" or blocks with "chart" role. If FALSE, DO NOT include charts unless critical for the content.
      - **Has Tables?** (${input.designPreferences?.hasTables}): If TRUE, you MUST include "table" components.
      - **Has Images?** (${input.designPreferences?.hasImages}): If TRUE, use "image-breakout" and "article-header" with images. If FALSE, keep it text-heavy.
      
      **Layout Patterns**:
      - "article-header": Title + Subtitle + Author + (Optional Image).
      - "single-column-text": Standard readable text.
      - "two-column-text": Academic/Newsletter style.
      - "data-section": Chart + Analysis (Use ONLY if charts are appropriate).
      - "table-section": Data table + explanation (Use ONLY for detailed comparisons/data).
      - "image-breakout": Full width image + caption.
      - "quote-breakout": Large pull quote.
      - "stat-row": Row of key statistics (Use for data-heavy requests).
      - "callout-box": Highlighted summary.

      **Visual Density Rule**:
      - IF hasImages=TRUE: Break up text every 2-3 sections with visuals.
      - IF hasCharts=TRUE: Evenly distribute charts where data support is needed.
      - IF hasTables=TRUE: Use tables for comparison or list content.
      - ALL LAYOUTS: Use "callout-box" and "quote-breakout" to add rhythm regardless of images.

      ### 3. COMPONENT ROLES
      - "title", "subtitle", "body", "image", "chart", "table", "caption", "author", "quote", "stat", "callout".
      
      ### 4. OUTPUT STRUCTURE
      Generate ${input.structurePlan.length} blocks.
      
      **CRITICAL: JSON Structure**
      - Use "blocks" array.
      - **MANDATORY**: Text sections MUST include 'body'.
      - **MANDATORY**: Unique IDs (e.g. "section-1-chart").

      Example:
      {
         "designSystem": { "colors": ["#000000"] }, 
         "blocks": [
            {
              "id": "section-1",
              "type": "section",
              "title": "Introduction",
              "layoutType": "article-header",
              "components": [ 
                  { "id": "section-1-title", "role": "title" },
                  { "id": "section-1-author", "role": "author" },
                  { "id": "section-1-body", "role": "body" }
              ]
            },
            {
              "id": "section-2",
              "type": "section",
              "title": "Key Stats",
              "layoutType": "stat-row",
              "components": [
                  { "id": "section-2-stat-1", "role": "stat" },
                  { "id": "section-2-stat-2", "role": "stat" }
              ]
            }
         ]
      }

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
