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
      You are a DOCUMENT ARCHITECT with expertise in professional document design across ALL industries and formats.
      Your mission: Analyze the user's prompt and create a SEMANTIC JSON STRUCTURE that matches the REAL-WORLD format of the requested document type.
      
      ### 🎯 CRITICAL MISSION: FLEXIBLE DOCUMENT SCHEMA GENERATION
      
      **STEP 1: IDENTIFY THE DOCUMENT TYPE**
      Analyze the user's prompt to determine what kind of document they're requesting:
      - Business Letter (formal correspondence)
      - Legal Document (contract, agreement, terms, policy)
      - Checklist (task list, verification list, audit checklist)
      - Run Sheet / Event Plan (schedule, timeline, event coordination)
      - Instructions / Procedures (step-by-step guide, SOP, manual)
      - Meeting Notes / Minutes (agenda, discussion, action items)
      - Financial Document (invoice, budget, expense report, financial statement)
      - Project Brief / Proposal (scope, deliverables, timeline, budget)
      - Marketing Document (campaign brief, content plan, strategy doc)
      - HR Document (job description, performance review, policy)
      - Form / Application (questionnaire, registration, intake form)
      - Resume / CV (professional profile, work history)
      - Risk Assessment / Analysis (risk register, mitigation plan)
      - Report / White Paper (research, findings, analysis)
      - Standard Article / Blog Post (editorial content)
      - Or ANY other professional document type
      
      **STEP 2: DESIGN THE SEMANTIC SCHEMA**
      Create a JSON schema that matches how this document type is ACTUALLY structured in the real world.
      
      **EXAMPLES OF SEMANTIC SCHEMAS:**
      
      **Business Letter:**
      {
        "documentType": "business_letter",
        "header": { "company": "...", "address": "...", "date": "..." },
        "recipient": { "name": "...", "title": "...", "company": "..." },
        "salutation": "Dear ...",
        "body": { "opening": "...", "main_content": "...", "closing": "..." },
        "signature": { "name": "...", "title": "..." }
      }
      
      **Checklist:**
      {
        "documentType": "checklist",
        "title": "...",
        "description": "...",
        "categories": [
          {
            "category": "Pre-Event",
            "items": [
              { "task": "...", "responsible": "...", "deadline": "...", "completed": false },
              ...
            ]
          }
        ]
      }
      
      **Run Sheet / Event Plan:**
      {
        "documentType": "run_sheet",
        "event": { "name": "...", "date": "...", "venue": "..." },
        "schedule": [
          { "time": "09:00", "activity": "...", "responsible": "...", "notes": "...", "duration": "30m" },
          ...
        ],
        "contacts": [ { "role": "...", "name": "...", "phone": "..." } ]
      }
      
      **Legal Document:**
      {
        "documentType": "legal_agreement",
        "title": "...",
        "parties": [ { "name": "...", "role": "Party A" }, ... ],
        "effective_date": "...",
        "clauses": [
          { "number": "1", "title": "...", "content": "..." },
          ...
        ],
        "signatures": [ { "party": "...", "date": "...", "signature": "[SIGNATURE]" } ]
      }
      
      **Financial Document:**
      {
        "documentType": "invoice",
        "invoice_number": "...",
        "date": "...",
        "from": { "company": "...", "address": "..." },
        "to": { "client": "...", "address": "..." },
        "line_items": [
          { "description": "...", "quantity": 1, "rate": 100, "amount": 100 },
          ...
        ],
        "subtotal": 100,
        "tax": 10,
        "total": 110
      }
      
      **Resume:**
      {
        "documentType": "resume",
        "personal_info": { "name": "...", "title": "...", "contact": {...} },
        "summary": "...",
        "experience": [
          { "company": "...", "title": "...", "dates": "...", "responsibilities": [...] }
        ],
        "education": [...],
        "skills": [...]
      }
      
      ### 🚨 CRITICAL RULES:
      1. **NO FIXED STRUCTURE**: Do NOT force a generic article/blog format unless that's what the prompt asks for
      2. **ANALYZE FIRST**: Read the prompt carefully and identify the ACTUAL document type being requested
      3. **SEMANTIC KEYS**: Use meaningful, professional key names that match the document domain
      4. **ARRAYS FOR REPETITION**: Use arrays for repeated elements (items, clauses, schedule entries, etc.)
      5. **HIERARCHICAL**: Organize content logically with proper nesting
      6. **REAL-WORLD FORMAT**: The structure should match how professionals actually organize this document type
      
      ### 📋 YOUR OUTPUT:
      Return ONLY the semantic JSON schema with placeholder descriptions (NO actual content yet).
      
      **Context:**
      - User Prompt: "${input.originalPrompt}"
      - Goal: ${input.metadata.goal}
      - Audience: ${input.metadata.audience}
      - Tone: ${input.metadata.tone}
      
      Return a JSON with TWO fields:
      {
        "documentType": "the_identified_type",
        "schema": { ... the semantic structure ... }
      }
      `;

        // BYPASS SCHEMA - allow flexible semantic structures
        const generatedData: any = await generateJSON<any>(
            null,
            systemPrompt,
            JSON.stringify(input)
        );

        // Store the semantic schema in a flexible format
        // Build response with proper typing
        const response: any = {
            jobId: input.jobId,
            intent: input,
            blocks: [], // Keep for backward compatibility
        };
        
        // Add semantic fields dynamically to avoid type checking
        response.documentType = generatedData.documentType || 'generic';
        response.semanticSchema = generatedData.schema || generatedData;

        return response as LayoutResponse;
    }
}
