import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, IntentResponseSchema, UserPrompt } from "../protocols/types";
    import { generateJSON } from "../../lib/claude";
import { selectTemplate } from "../presentation/TemplateSelector";
import { initGenerationLog, appendLog } from "../presentation/GenerationLogger";

export class IntentAgent extends BaseAgent<UserPrompt, IntentResponse> {

    constructor() {
        super();
    }

    getProcessingStatus(): string {
        return 'processing_intent';
    }

    extractInput(job: any): UserPrompt {
        // Job structure from Supabase:
        // { id, user_id, type, input_data: { prompt, meta, ... }, result, ... }
        const inputData = job.input_data || {};

        return {
            prompt: inputData.prompt || job.prompt || '',
            userId: job.user_id || job.userId,
            jobId: job.id,
            output: job.type || inputData.output || 'presentation',
            meta: inputData.meta || job.meta || {},
        };
    }

    async process(input: UserPrompt, job: any): Promise<IntentResponse> {

        // ─────────────────────────────────────────────────────────────
        // INITIALIZE GENERATION LOG FILE
        // ─────────────────────────────────────────────────────────────
        const topicSummary = (input.meta?.title || input.prompt)
            .split(/[.!?\n]/)[0]
            .replace(/^(Specific Requirements:|Objective:)/i, '')
            .trim()
            .substring(0, 60);
        initGenerationLog(input.jobId, topicSummary);

        // ─────────────────────────────────────────────────────────────
        // STEP 1: SELECT OPTIMAL TEMPLATE DECK
        // ─────────────────────────────────────────────────────────────
        let templateSelection;
        try {
            if (input.output === 'presentation') {
                templateSelection = await selectTemplate(input.prompt, input.meta || {});
            } else {
                templateSelection = null;
            }
        } catch (err) {
            appendLog(`❌ Template selector error: ${err}`);
            templateSelection = null;
        }
        
        // Fallback for non-presentation or errors
        if (!templateSelection) {
            templateSelection = {
                selectedDeck: 'Deck.1.polotno.json',
                deckIndex: 0,
                reasoning: 'Default template',
                matchScore: 0.5,
                alternativeDecks: [],
            };
        }

        const systemPrompt = `
      You are a STRATEGIC CREATIVE DIRECTOR at a world-class agency (Ogilvy/Pentagram/IDEO).
      Your mission: Transform the user's request into a COMPREHENSIVE, STRATEGIC creative brief for a premium presentation.

      ### USER METADATA (CRITICAL CONTEXT)
      This is extra data provided by the user. PRIORITIZE this over generic inference.
      ${JSON.stringify(input.meta || {}, null, 2)}

      ### ⚠️ CRITICAL REQUIREMENTS - FAILURE TO FOLLOW = REJECTED ⚠️
      
      1. **SLIDE COUNT (ABSOLUTE REQUIREMENT)**:
         - MINIMUM: 10 slides
         - MAXIMUM: 12 slides  
         - DEFAULT: 10-11 slides
         - If you generate 13+ slides, they will be CUT OFF
         - If you generate <10 slides, it's a FAILURE
         
      2. **COMPREHENSIVE COVERAGE**: Every topic must be broken down. Cover all key aspects thoroughly.
      3. **STRATEGIC NARRATIVE**: Build a complete story: Hook -> Problem -> Solution -> Proof -> Execution -> Action.

      ### 1. DEEP AUDIENCE & CONTEXT ANALYSIS
      - **Audience Psychology**: Who are we REALLY talking to? What keeps them up at night?
        * Example: "Investors" → Need: ROI proof, risk mitigation, market validation, competitive moats
      - **Tone Calibration**: Match the exact emotional register needed.
      - **Goal Precision**: What specific action should the audience take after viewing?

      ### 2. COMPREHENSIVE STRUCTURE PLANNING
      Create a COMPLETE narrative arc with EXACTLY 10-12 items (no more, no less).

      **Recommended Structure (DEFAULT: 11 slides):**
      1.  **Title & Hook**: The Big Idea (1 Slide)
      2.  **Executive Summary**: Quick overview (1 Slide)
      3.  **The Problem**: Current pain points, market gaps (1-2 Slides)
      4.  **The Solution**: Core offering, how it works (2 Slides)
      5.  **Key Features**: Unique capabilities (1 Slide)
      6.  **Validation**: Market evidence, metrics, testimonials (1 Slide)
      7.  **Business Model**: Revenue strategy (1 Slide)
      8.  **Go-to-Market**: Execution plan (1 Slide)
      9.  **Team**: Why us, credentials (1 Slide)
      10. **The Ask**: Clear next steps (1 Slide)
      
      *Total: 10-12 slides*

      ### 3. SECTION NAMING EXCELLENCE
      - Use COMPELLING, SPECIFIC titles (not generic labels)
      - Bad: "Introduction", "Overview", "Conclusion"
      - Good: "The $10B Problem Nobody's Solving", "Why Traditional Solutions Fail", "Our Unfair Advantage"

      ### 5. OUTPUT FORMAT
      Return valid JSON matching \`IntentResponseSchema\`.
      
      **ABSOLUTE REQUIREMENT**: structurePlan array MUST have between 10-12 items. COUNT THEM!!
      {
        "styleGuide": null,
        "jobId": "${input.jobId}",
        "originalPrompt": "${input.prompt}",
        "title": "Project Title",
        "metadata": {
          "type": "Presentation",
          "tone": "Professional",
          "goal": "Persuade",
          "audience": "Stakeholders",
          "depth": "Deep",
          "scope": "Comprehensive",
          "size": "Standard (10-12 slides)",
          "outputFormat": "presentation"
        },
        "designPreferences": {
          "hasCharts": false,
          "hasTables": false,
          "hasImages": true,
          "colorTheme": "Modern Blue",
          "mood": "Professional"
        },
        "structurePlan": [
           "1. The Big Idea",
           "2. Executive Summary",
           "3. The Problem",
           "4. Market Context",
           "5. Our Solution",
           "6. Key Features",
           "7. Market Validation",
           "8. Business Model",
           "9. Go-to-Market",
           "10. The Team",
           "11. Next Steps"
        ]
      }

      **CRITICAL - REQUIRED FIELDS (NEVER OMIT THESE)**:
      - designPreferences.hasCharts (boolean, REQUIRED)
      - designPreferences.hasImages (boolean, REQUIRED)
      - structurePlan MUST have EXACTLY 10-12 items
      
      ⚠️ FINAL CHECK BEFORE RETURNING ⚠️:
      1. Count structurePlan items - is it between 10-12? If not, FIX IT NOW!
      2. Did you include hasCharts and hasImages booleans? If not, ADD THEM!
      3. Does each slide have a compelling title? Generic titles = FAILURE!
      
      **SLIDE COUNT VERIFICATION**: Your structurePlan has ___ items. (Must be 10-12)
    `;

        // In a real app, use the Zod Schema to validate specifically, or use LangChain structured output
        const response = await generateJSON<IntentResponse>(IntentResponseSchema, systemPrompt, input.prompt);

        // Fallback if AI forgot outputFormat but we knew it from input
        if (input.output && response.metadata.outputFormat !== input.output) {
            response.metadata.outputFormat = input.output;
        }

        // Attach template selection to response
        response.metadata.selectedTemplate = templateSelection.selectedDeck;
        response.metadata.templateReasoning = templateSelection.reasoning;
        
        // LOG TEMPLATE SELECTION RESULTS TO FILE
        appendLog('\n╔══════════════════════════════════════════════════════════════════╗');
        appendLog('║             🎯 TEMPLATE SELECTOR - FINAL DECISION              ║');
        appendLog('╚══════════════════════════════════════════════════════════════════╝');
        appendLog(`\n📝 USER PROMPT: "${input.prompt.substring(0, 100)}${input.prompt.length > 100 ? '...' : ''}"`);
        appendLog(`📋 OUTPUT TYPE: ${response.metadata.outputFormat}`);
        appendLog(`👥 AUDIENCE: ${response.metadata.audience}`);
        appendLog(`🎭 TONE: ${response.metadata.tone}`);
        appendLog(`🎯 GOAL: ${response.metadata.goal}`);
        appendLog('\n' + '─'.repeat(68));
        appendLog(`\n✅ SELECTED TEMPLATE: ${templateSelection.selectedDeck}`);
        appendLog(`📊 CONFIDENCE SCORE: ${(templateSelection.matchScore * 100).toFixed(0)}%`);
        appendLog(`\n💡 REASONING:\n   ${templateSelection.reasoning}`);
        if (templateSelection.alternativeDecks?.length) {
            appendLog(`\n🔄 ALTERNATIVES CONSIDERED: ${templateSelection.alternativeDecks.join(', ')}`);
        }
        appendLog('\n' + '═'.repeat(68) + '\n');

        // CRITICAL ENFORCEMENT: Limit slides to 10-12 MAX
        
        if (response.structurePlan && response.structurePlan.length > 12) {
            response.structurePlan = response.structurePlan.slice(0, 12);
        } else if (response.structurePlan && response.structurePlan.length < 10) {
        } else {
        }
        
        response.structurePlan?.forEach((item: string, idx: number) => {
        });

        return response;
    }
}
