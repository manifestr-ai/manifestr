import { BaseAgent } from "../core/BaseAgent";
import { IntentResponse, IntentResponseSchema, UserPrompt } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { selectTemplate } from "../presentation/TemplateSelector";
import { initGenerationLog, appendLog } from "../presentation/GenerationLogger";
import { selectLogicFramework, LogicFramework } from "../frameworks/LogicFrameworks";

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
        // STEP 1: SELECT DOCUMENT LOGIC FRAMEWORK
        // ─────────────────────────────────────────────────────────────
        const logicFramework: LogicFramework = selectLogicFramework(input.prompt, input.meta || {});
        
        appendLog('\n╔══════════════════════════════════════════════════════════════════╗');
        appendLog('║          📋 DOCUMENT LOGIC FRAMEWORK - SELECTED                ║');
        appendLog('╚══════════════════════════════════════════════════════════════════╝');
        appendLog(`\n🎯 FRAMEWORK: ${logicFramework.name}`);
        appendLog(`📝 DESCRIPTION: ${logicFramework.description}`);
        appendLog(`📊 BEST FOR: ${logicFramework.bestFor.join(', ')}`);
        appendLog(`📈 STRUCTURE STEPS: ${logicFramework.structure.length}`);
        appendLog('\n' + '═'.repeat(68) + '\n');

        // ─────────────────────────────────────────────────────────────
        // STEP 2: SELECT OPTIMAL TEMPLATE DECK (FOR PRESENTATIONS)
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
      You are a STRATEGIC CREATIVE DIRECTOR at a world-class consultancy (McKinsey/BCG/Bain).
      Your mission: Transform the user's request into a COMPREHENSIVE, STRATEGIC creative brief following proven professional frameworks.

      ### 🎯 DOCUMENT LOGIC FRAMEWORK (CRITICAL - MUST FOLLOW)
      You MUST structure this document using the "${logicFramework.name}" framework:
      
      **Framework:** ${logicFramework.name}
      **Purpose:** ${logicFramework.description}
      **Best For:** ${logicFramework.bestFor.join(', ')}
      
      **REQUIRED STRUCTURE (Follow this EXACTLY):**
      ${logicFramework.structure.map((step, idx) => `
      ${idx + 1}. **${step.step}**
         - Description: ${step.description}
         - Purpose: ${step.purpose}
         - Slides: ${step.slides || '1'}
      `).join('\n')}
      
      **TOTAL SLIDES: ${logicFramework.totalSlides}**

      ### USER METADATA (CRITICAL CONTEXT)
      This is extra data provided by the user. PRIORITIZE this over generic inference.
      ${JSON.stringify(input.meta || {}, null, 2)}

      ### ⚠️ CRITICAL REQUIREMENTS - FAILURE TO FOLLOW = REJECTED ⚠️
      
      1. **FOLLOW THE LOGIC FRAMEWORK (ABSOLUTE REQUIREMENT)**:
         - Your structurePlan MUST match the ${logicFramework.name} framework above
         - Each section must serve its intended purpose
         - Maintain the strategic flow: ${logicFramework.structure.map(s => s.step).join(' → ')}
         
      2. **SLIDE COUNT (ABSOLUTE REQUIREMENT)**:
         - REQUIRED RANGE: ${logicFramework.totalSlides}
         - If you generate outside this range, it's a FAILURE
         
      3. **COMPREHENSIVE COVERAGE**: Every framework step must be thoroughly developed.
      4. **STRATEGIC NARRATIVE**: Follow the logic framework's narrative arc perfectly.

      ### 1. DEEP AUDIENCE & CONTEXT ANALYSIS
      - **Audience Psychology**: Who are we REALLY talking to? What keeps them up at night?
        * Example: "Investors" → Need: ROI proof, risk mitigation, market validation, competitive moats
      - **Tone Calibration**: Match the exact emotional register needed.
      - **Goal Precision**: What specific action should the audience take after viewing?

      ### 2. COMPREHENSIVE STRUCTURE PLANNING
      Create a COMPLETE narrative arc following the ${logicFramework.name} framework EXACTLY.

      **YOUR STRUCTURE MUST BE (based on ${logicFramework.name}):**
      ${logicFramework.structure.map((step, idx) => `${idx + 1}. **${step.step}**: ${step.description} (${step.slides || '1'} slides)`).join('\n      ')}
      
      **CRITICAL:** Your structurePlan array MUST have ${logicFramework.structure.length} main sections minimum.
      Each section can expand to multiple slides if needed, but the LOGIC FLOW must be maintained.

      ### 3. SECTION NAMING EXCELLENCE
      - Use COMPELLING, SPECIFIC titles based on the user's actual content
      - Bad: "Introduction", "Overview", "Conclusion"
      - Good: "The $10B Problem Nobody's Solving", "Why Traditional Solutions Fail", "Our Unfair Advantage"
      - Each title should be UNIQUE to this specific ${input.output} about "${input.prompt.substring(0, 60)}..."

      ### 5. OUTPUT FORMAT
      Return valid JSON matching \`IntentResponseSchema\`.
      
      **ABSOLUTE REQUIREMENT**: structurePlan must follow the ${logicFramework.name} framework!
      {
        "styleGuide": null,
        "jobId": "${input.jobId}",
        "originalPrompt": "${input.prompt}",
        "title": "Project Title",
        "logicFramework": "${logicFramework.name}",
        "metadata": {
          "type": "${(input.output || 'presentation').charAt(0).toUpperCase() + (input.output || 'presentation').slice(1)}",
          "tone": "${input.meta?.tone || 'Professional'}",
          "goal": "${input.meta?.goal || 'Inform'}",
          "audience": "${input.meta?.primaryAudience || 'Stakeholders'}",
          "depth": "Deep",
          "scope": "Comprehensive",
          "size": "${logicFramework.totalSlides}",
          "outputFormat": "${input.output}",
          "appliedLogic": "${logicFramework.name}"
        },
        "designPreferences": {
          "hasCharts": false,
          "hasTables": false,
          "hasImages": true,
          "colorTheme": "Modern Professional",
          "mood": "Professional"
        },
        "structurePlan": [
           ${logicFramework.structure.map((step, idx) => `"${idx + 1}. ${step.step}: [Your compelling, specific title here]"`).join(',\n           ')}
        ]
      }

      **CRITICAL - REQUIRED FIELDS (NEVER OMIT THESE)**:
      - logicFramework: "${logicFramework.name}" (REQUIRED)
      - metadata.appliedLogic: "${logicFramework.name}" (REQUIRED)
      - designPreferences.hasCharts (boolean, REQUIRED)
      - designPreferences.hasImages (boolean, REQUIRED)
      - structurePlan MUST follow ${logicFramework.name} framework structure
      
      ⚠️ FINAL CHECK BEFORE RETURNING ⚠️:
      1. Does your structurePlan follow the ${logicFramework.name} framework? Check each section!
      2. Did you include hasCharts and hasImages booleans? If not, ADD THEM!
      3. Does each section have a compelling, specific title? Generic titles = FAILURE!
      4. Is the narrative flow logical: ${logicFramework.structure.map(s => s.step).join(' → ')}
      
      **LOGIC FRAMEWORK VERIFICATION**: Your structurePlan follows "${logicFramework.name}" framework.
    `;

        // In a real app, use the Zod Schema to validate specifically, or use LangChain structured output
        const response = await generateJSON<IntentResponse>(IntentResponseSchema, systemPrompt, input.prompt);

        // Fallback if AI forgot outputFormat but we knew it from input
        if (input.output && response.metadata.outputFormat !== input.output) {
            response.metadata.outputFormat = input.output;
        }

        // Attach logic framework and template selection to response
        response.metadata.appliedLogic = logicFramework.name;
        response.metadata.logicFrameworkId = logicFramework.id;
        response.metadata.selectedTemplate = templateSelection.selectedDeck;
        response.metadata.templateReasoning = templateSelection.reasoning;
        
        // LOG TEMPLATE SELECTION RESULTS TO FILE
        appendLog('\n╔══════════════════════════════════════════════════════════════════╗');
        appendLog('║          🎯 STRATEGIC BRIEF - FINAL CONFIGURATION               ║');
        appendLog('╚══════════════════════════════════════════════════════════════════╝');
        appendLog(`\n📝 USER PROMPT: "${input.prompt.substring(0, 100)}${input.prompt.length > 100 ? '...' : ''}"`);
        appendLog(`📋 OUTPUT TYPE: ${response.metadata.outputFormat}`);
        appendLog(`👥 AUDIENCE: ${response.metadata.audience}`);
        appendLog(`🎭 TONE: ${response.metadata.tone}`);
        appendLog(`🎯 GOAL: ${response.metadata.goal}`);
        appendLog('\n' + '─'.repeat(68));
        appendLog(`\n🧠 APPLIED LOGIC: ${logicFramework.name}`);
        appendLog(`📐 FRAMEWORK: ${logicFramework.description}`);
        appendLog(`📊 STRUCTURE: ${response.structurePlan?.length || 0} sections`);
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
