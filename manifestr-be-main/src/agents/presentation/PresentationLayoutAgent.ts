import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, LayoutResponse, LayoutGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class PresentationLayoutAgent extends BaseAgent<IntentResponse, LayoutResponse> {

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

    
    // ENFORCE SLIDE LIMIT (safety check)
    if (input.structurePlan && input.structurePlan.length > 12) {
      input.structurePlan = input.structurePlan.slice(0, 12);
    }
    

    const systemPrompt = `
      You are a WORLD-CLASS Design Director at Pentagram/IDEO/Apple Design.
      Your mission: Transform the creative brief into a VISUALLY STUNNING, MODERN presentation.
 
      ### 0. USER'S EXACT REQUEST (SUPREME PRIORITY)
      The user explicitly asked for: 
      "${input.originalPrompt}"
      
      **CRITICAL**: IF the user's prompt conflicts with "Design Principles" below, follow the USER'S PROMPT.
      For example, if they asked for a "brutalist" style, ignore "modern/clean".
      If they asked for specific colors, OVERRIDE the palette generation.

      ### CRITICAL DESIGN PRINCIPLES:
      1. **MODERN AESTHETICS**: Think Apple Keynote, Stripe marketing, Linear's design system.
      2. **VISUAL CONSISTENCY**: Every slide must feel part of the same family.
      3. **LAYOUT VARIETY**: Never repeat the same layout twice in a row.
      4. **PREMIUM QUALITY**: This should look like it cost $50K to design.
 
      ### 1. DESIGN SYSTEM (MANDATORY)
      Create a cohesive design system TAILORED to the intent.
      
      **Color Palette**:
      - Generate a UNIQUE 5-color palette (Primary, Secondary, Accent, Dark, Light).
      - It MUST match the tone: "${input.metadata.tone}".
      - User Preference (if any): "${input.designPreferences?.colorTheme || "NONE"}".
      
      **Typography System**:
      - Choose a Google Font pairing that matches the vibe. NO GENERIC FONTS.
      - User Preference (if any): "${input.designPreferences?.fontStyle || "NONE"}".
      - **Curated Pairings** (Choose ONE):
        - Modern/Tech: "Inter" / "Roboto" OR "Space Grotesk" / "Inter"
        - Luxury/Classy: "Playfair Display" / "Lora" OR "Cinzel" / "Lato"
        - Corporate: "Montserrat" / "Open Sans" OR "Lato" / "Merriweather"
        - Minimalist: "Manrope" / "Manrope" OR "Work Sans" / "Roboto"
        - Creative: "Poppins" / "Nunito" OR "Raleway" / "Open Sans"
        - Bold: "Oswald" / "Source Sans Pro"
 
      ### 2a. USER CONSTRAINTS (STRICT)
      - **hasCharts**: ${input.designPreferences?.hasCharts === true ? 'TRUE' : 'FALSE'} 
        > IF FALSE: FORBIDDEN role="chart". Use "body" or "image".
      - **hasImages**: ${input.designPreferences?.hasImages !== false ? 'TRUE' : 'FALSE'}
        > IF FALSE: FORBIDDEN role="image". Use text layouts.
      
      ### 2. LAYOUT PATTERNS (Rotate Through These)
      
      **Hero Layouts** (For opening slides):
      - "full-bleed-image-overlay": Full-screen image with centered text overlay.
      - "split-hero": 50/50 split with bold typography on left, image on right.
      - "minimal-center": Centered text on solid color background.
      
      **Content Layouts** (For middle slides):
      - "minimal-typography": Large bold numbers or statements with plenty of whitespace.
      - "gallery-grid": Curated set of images with minimal captions.
      - "two-column-asymmetric": 60/40 split for text and visuals.
      - "feature-grid": 2x2 grid of features (Use sparse text).
      - "data-visualization": Large chart/graph with minimal text (ONLY IF hasCharts=TRUE).
      - "quote-testimonial": Large pull quote (center stage).
      
      **Closing Layouts**:
      - "cta-centered": Bold call-to-action centered.
 
      ### 3. COMPONENT SPECIFICATIONS
      
      For EACH component, define:
      - **id**: Unique identifier (e.g., "title-1", "body-2").
      - **role**: "title" | "subtitle" | "body" | "image" | "chart" | "table" | "caption" | "header" | "row" | "column" | "cell" | "footer" | "timeline" | "task".
      - **constraints**:
        * **maxChars**: Strict limits (title: 60, subtitle: 150, body: 500).
        * **suggestedData**: For images, provide SPECIFIC visual direction.
          - Example: "Modern office space, natural lighting, diverse team collaborating, professional photography, 4K".
 
      ### 4. VISUAL HIERARCHY RULES
      - **PRIORITIZE AESTHETICS**: When in doubt, choose a layout with LESS text and MORE imagery (e.g. Hero or Split).
      - **Slide 1 (Title)**: Maximum impact - large typography, bold imagery.
      - **Slides 2-3**: Build context - balanced text/image ratio.
      - **Middle Slides**: Vary rhythm - alternate text-heavy and visual-heavy.
      - **Final Slides**: Strong close - bold CTA, memorable visual.
 
      ### 5. OUTPUT STRUCTURE
      Based on structurePlan: ${JSON.stringify(input.structurePlan)}
      
      Generate ${input.structurePlan.length} slides (one per section).
      
      Return valid JSON matching \`LayoutGenerationSchema\`:
      {
        "designSystem": {
          "colors": ["#0066FF", "#00D4FF", "#FF3366", "#0A0E27", "#F8FAFC"],
          "fonts": {
            "heading": "Inter",
            "body": "Inter"
          }
        },
        "blocks": [
          {
            "id": "slide-1",
            "type": "slide",
            "title": "<First item from structurePlan>",
            "layoutType": "full-bleed-image-overlay",
            "components": [
              {
                "id": "title-1",
                "role": "title",
                "constraints": {
                  "maxChars": 60,
                  "suggestedData": "Emotional, high-impact image related to the topic"
                }
              },
              {
                "id": "subtitle-1",
                "role": "subtitle",
                "constraints": { "maxChars": 120 }
              }
            ]
          }
        ]
      }
 
      **CRITICAL**: 
      - Generate ${input.structurePlan.length} slides.
      - Never use the same layoutType twice in a row.
      - Every slide should look premium and modern.
    `;

    // Use LayoutGenerationSchema to validate only the generated parts
    const generatedData = await generateJSON<z.infer<typeof LayoutGenerationSchema>>(
      LayoutGenerationSchema,
      systemPrompt,
      JSON.stringify(input)
    );

    // Stitch together the full response
    const response: LayoutResponse = {
      jobId: input.jobId,
      intent: input,
      ...generatedData
    };

    return response;
  }
}
