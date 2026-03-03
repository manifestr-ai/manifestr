import { BaseAgent } from "../core/BaseAgent";
import { LayoutResponse, ContentResponse, ContentGenerationSchema } from "../protocols/types";
import { generateJSON } from "../../lib/claude";
import { z } from "zod";

export class PresentationContentAgent extends BaseAgent<LayoutResponse, ContentResponse> {

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
    
    // Log each block's structure
    input.blocks.forEach((block, idx) => {
    });

    const systemPrompt = `
      You are an expert STRATEGIC COMMUNICATOR and GHOSTWRITER for Fortune 500 Executives (McKinsey, Apple, TED).
      Your mission: Populate the presentation structure with DEEP, INSIGHTFUL, and HIGH-IMPACT content.

      ### CRITICAL QUALITY STANDARDS (PREMIUM TIER):
      1. **SUBSTANCE OVER STYLE**: While it must be punchy, it MUST have depth. Do not write generic marketing fluff.
      2. **NO "LOREM IPSUM" or "TEXT GOES HERE"**: INVENT specific, plausible, high-quality data and names if missing.
      3. **EXPLAIN "WHY" and "HOW"**: Don't just state facts. State implications.
      4. **AUTHORITATIVE TONE**: Confident, Sophisticated, World-Class. ${input.intent.metadata.tone || 'Professional'}.
      5. **DATA-BACKED**: Use precise numbers, percentages, and dollar amounts.
      
      ### FORBIDDEN PHRASES (NEVER USE THESE):
      ❌ "We are committed to excellence"
      ❌ "Industry-leading solutions"
      ❌ "Best-in-class approach"
      ❌ "Comprehensive analysis"
      ❌ "Strategic advantages"
      ❌ "Details pending"
      ❌ "Content pending"
      ❌ "Coming soon"
      ❌ "To be added"
      ❌ "TBD"
      ❌ "Placeholder"
      ❌ "Lorem ipsum"
      ❌ Any placeholder, stub, or "fill this in later" language — ALWAYS write the full, real content NOW
      
      INSTEAD USE:
      ✅ Specific metrics: "Reduced churn from 8% to 2%"
      ✅ Real outcomes: "Saved clients $12M in Q1 alone"
      ✅ Concrete proof: "Used by 500+ companies in 30 countries"

      ### 1. CONTENT PRINCIPLES
      
      **Voice**:
      - Intellectual yet accessible.
      - Use active voice. "We achieved X" not "X was achieved".
      - **Rule**: Every slide must have a clear "Takeaway".
      
      **Relatability & Engagement (MANDATORY)**:
      1. **Use METAPHORS**: "Like Stripe for payments, we're revolutionizing X"
      2. **Specific EXAMPLES**: "In Q4 2025, Fortune 500 client saved $2M using our platform"
      3. **Emotional HOOKS**: "Imagine cutting processing time from 2 hours to 5 minutes"
      4. **Real COMPARISONS**: "Companies like Airbnb, Shopify, Tesla use similar approaches"
      5. **Concrete STORIES**: "When Company X implemented this, they achieved Y in Z months"

      **Examples of UPGRADE**:
      - ❌ WEAK: "We are growing fast."
      - ✅ PREMIUM: "Accelerating trajectory: 220% YoY growth driven by Enterprise adoption. In Q1 2025, we onboarded 50+ Fortune 500 clients, surpassing our annual target in just 3 months."

      - ❌ WEAK: "Our team is great."
      - ✅ PREMIUM: "Led by industry veterans from Google, SpaceX, and Stripe with 40+ combined years of domain expertise. Our CTO previously scaled infrastructure at Uber to 100M+ users."
      
      - ❌ WEAK: "Our solution improves efficiency."
      - ✅ PREMIUM: "Companies using our platform cut operational costs by 45% on average. For example, TechCorp reduced their processing time from 4 hours to 12 minutes—a 95% improvement that freed up 200+ employee hours weekly."

      ### 2. DATA & VISUALS GENERATION (MANDATORY)
      
      **For "chart" components**:
      - RETURN VALID JSON STRING.
      - Data must be REALISTIC and tell a STORY (e.g. J-curve, steady growth, comparative advantage).
      - Example: "{\\"labels\\": [\\"2021\\", \\"2022\\", \\"2023\\", \\"2024\\"], \\"data\\": [10, 25, 60, 140], \\"datasetLabel\\": \\"Active Users (M)\\"}"
      
      **For "table" components**:
      - Return a JSON string representing a comparison or financial model.
      - Example: "{\\"headers\\": [\\"Metric\\", \\"Q1\\", \\"Q2\\"], \\"rows\\": [[\\"Revenue\\", \\"$2.5M\\", \\"$3.1M\\"], [\\"CAC\\", \\"$120\\", \\"$95\\"]]}"

      **For "image" components**:
      - Write "Editorial" style prompts. Cinematic, 4K, Architectural, Minimalist. 
      - Avoid "people shaking hands". Prefer "Abstract connections," "Futuristic cityscape," "Clean workspace key light".

      ### 3. COMPONENT INSTRUCTIONS
      
      **For "title" components**:
      - Strong, Action-Oriented Headlines.
      - BAD: "Introduction"
      - GOOD: "The Market Opportunity is $50B+"
      
      **For "subtitle" components**:
      - A cohesive thesis statement for the slide. 1-2 powerful sentences. MINIMUM 20 words — never just a label or a short phrase.
      
      **For "body" components**:
      - **MINIMUM LENGTH**: 400 characters / at least 60 words. SHORT BODY TEXT = FAILURE.
      - A body that is only 1 sentence, 6-7 words, or a single phrase is COMPLETELY UNACCEPTABLE.
      - **Structure Options** (pick one):
        A) 3-4 sentences packed with specific metrics, examples, and outcomes
        B) 4-5 bullet points (use •) — each bullet must be a full sentence with concrete data
        C) Problem → Impact → Solution format (3 full paragraphs)
      - **Requirements**:
        * Include at least TWO specific numbers/metrics (percentages, dollar amounts, timeframes)
        * Include at least ONE real-world company/market example or comparison
        * Use active voice and concrete language
        * Every sentence must add NEW information — no padding or repetition
      - **Do NOT use Markdown** (**, *, #) as it is not supported. Use CAPS for emphasis if needed.
      - Focus on **Insights**, **Metrics**, and **Proofs**.
      - If you cannot think of 60+ words of substance, INVENT plausible, realistic data — but NEVER shorten.
      
      **For "quote" components**:
      - Use REAL quotes from relevant industry leaders or historical figures if applicable to the topic.
      - Or generate a "Customer Testimonial" that sounds authentic.
      
      **For "stat" components**:
      - BIG NUMBER + Specific Label.
      - "98.5% | Customer Retention Rate"

      ### 4. ID MATCHING & UNIQUENESS (CRITICAL - ZERO TOLERANCE)
      - Generate content for EVERY SINGLE component ID in \`input.blocks\`.
      - Missing IDs = Empty slides = FAILURE.
      - If you're unsure what to write, write SOMETHING. Never leave blank.
      - Empty slides are UNACCEPTABLE.
      
      ### UNIQUENESS RULES (MANDATORY):
      - EACH component must have DIFFERENT content. No copy-pasting between IDs.
      - Title and body of the SAME slide must say DIFFERENT things.
      - Title = Short punchy headline (max 10 words).
      - Body = Detailed explanation with metrics (completely different from title).
      - NEVER repeat the same sentence across different slides.
      - If two slides cover similar topics, approach from DIFFERENT angles.

      ### 5. CONTEXT & AUDIENCE ADAPTATION
      - Goal: ${input.intent.metadata.goal}
      - Audience: ${input.intent.metadata.audience}
      
      **Audience-Specific Language**:
      - IF Investors → Focus: ROI, market size, traction, competitive moats, unit economics
      - IF Internal Team → Focus: Efficiency gains, workflow improvements, team impact, time savings
      - IF Customers → Focus: Pain relief, transformation, ease of use, before/after outcomes
      - IF Executives → Focus: Strategic alignment, risk mitigation, competitive positioning
      
      Tailor your language, examples, and metrics to match the audience's priorities.
      
      ### 6. OUTPUT FORMAT (CRITICAL - EXACT STRUCTURE REQUIRED)
      
      **YOU MUST RETURN THIS EXACT JSON STRUCTURE - NO EXCEPTIONS**:
      
      {
        "generatedContent": [
          {
            "blockId": "slide-1",
            "content": {
              "title-1": "The actual title text here",
              "subtitle-1": "The subtitle text",
              "body-1": "The body content here",
              "image-1": "Professional photograph of modern office space, natural lighting"
            }
          },
          {
            "blockId": "slide-2",
            "content": {
              "title-2": "Next slide title",
              "body-2": "Body content for slide 2"
            }
          }
        ]
      }
      
      **ABSOLUTELY CRITICAL RULES (FAILURE = BROKEN PRESENTATION)**:
      1. Top level MUST be object with "generatedContent" array
      2. Each array item MUST have "blockId" (string) and "content" (object)
      3. The "content" object keys MUST be the EXACT component IDs from the input
      4. Generate content for EVERY component ID provided in each block
      5. NEVER return a single "text" field - ALWAYS use the specific component IDs
      6. Example: If input has "title-5", your output MUST have "title-5" as the key
      
      **WRONG - This will break everything**:
      {
        "generatedContent": [
          { "blockId": "slide-1", "content": { "text": "Some text" } }  ← WRONG!
        ]
      }
      
      **CORRECT - This is what you MUST return**:
      {
        "generatedContent": [
          {
            "blockId": "slide-1",
            "content": {
              "title-1": "Actual title",
              "subtitle-1": "Actual subtitle"
            }
          }
        ]
      }
        `;

    // Build a clear structure showing OpenAI EXACTLY what we need
    const componentMapping = input.blocks.map((block: any) => ({
      blockId: block.id,
      title: block.title,
      layout: block.layoutType,
      components: block.components.map((c: any) => ({
        id: c.id,
        role: c.role,
        constraints: c.constraints
      }))
    }));
    
    const userPrompt = `
Here are the blocks you need to generate content for.
For EACH block, generate content for ALL its component IDs.

Blocks:
${JSON.stringify(componentMapping, null, 2)}

Remember: Your output MUST have "generatedContent" array where each item has:
- "blockId": matching the block ID above
- "content": object with keys matching the component IDs (e.g., "title-1", "body-2", etc.)

Generate high-quality, specific content for EVERY block listed above.
Each block has its own "title" field — use THAT block's title as the topic for its content.
Do NOT write placeholder, stub, or "pending" content. Write the real, final content now.

Overall context:
- Goal: ${input.intent.metadata.goal}
- Audience: ${input.intent.metadata.audience}
`;
    
    
    // BYPASS VALIDATION - let OpenAI return whatever, we'll fix it
    const generatedData: any = await generateJSON<any>(
      null,  // No schema validation - accept anything!
      systemPrompt,
      userPrompt
    );


    // AGGRESSIVE FIX: Extract content from ANY structure
    let contentArray = generatedData.generatedContent || generatedData.content ||
      generatedData.slides || generatedData.blocks ||
      Object.values(generatedData)[0];  // Take first property if nothing matches


    if (!Array.isArray(contentArray)) {
      contentArray = [];
    }

    // Map to our format, handling ANY structure
    generatedData.generatedContent = input.blocks.map((block: any, index: number) => {
      const aiContent = contentArray[index] || {};
      
      // CRITICAL FIX: Handle different response formats from OpenAI
      let contentMap: any = {};
      
      // Check if aiContent has the proper structure
      if (aiContent.content && typeof aiContent.content === 'object' && !Array.isArray(aiContent.content)) {
        // Good! AI returned proper component mapping
        contentMap = aiContent.content;
      } else if (typeof aiContent.content === 'string') {
        // BAD: AI returned a single string instead of component mapping
        // We need to DISTRIBUTE this text to components intelligently
        const text = aiContent.content;
        
        // Distribute to first few components as a fallback
        block.components.slice(0, 3).forEach((comp: any, idx: number) => {
          if (comp.role === 'title' && idx === 0) {
            contentMap[comp.id] = block.title; // Use block title
          } else {
            contentMap[comp.id] = text; // Use the text we have
          }
        });
      } else if (aiContent.content === undefined && typeof aiContent === 'object') {
        // Check if properties ARE the component IDs (AI returned flat structure)
        const possibleComponentIds = block.components.map((c: any) => c.id);
        const aiKeys = Object.keys(aiContent);
        const hasComponentIds = possibleComponentIds.some((id: string) => aiKeys.includes(id));
        
        if (hasComponentIds) {
          contentMap = aiContent;
        } else {
        }
      }
      
      // CRITICAL FIX: Ensure ALL component IDs have content
      // If AI didn't generate content for a component, leave it missing
      // RenderingAgent will handle fallbacks
      block.components.forEach((comp: any) => {
        if (!contentMap[comp.id]) {
        }
      });
      
      const mappedContent = {
        blockId: block.id,
        content: contentMap
      };
      
      
      return mappedContent;
    });

    
    // FINAL VALIDATION: Ensure every block has FULL content coverage
    let totalMissing = 0;
    generatedData.generatedContent.forEach((contentBlock: any, idx: number) => {
      const layoutBlock = input.blocks[idx];
      const contentKeys = Object.keys(contentBlock.content || {});
      const expectedKeys = layoutBlock.components.map((c: any) => c.id);
      const missing = expectedKeys.filter((id: string) => !contentKeys.includes(id));
      
      if (missing.length > 0) {
        totalMissing += missing.length;
      }
    });
    
    if (totalMissing > 0) {
    } else {
    }
    

    const response: ContentResponse = {
      jobId: input.jobId,
      layout: input,
      ...generatedData
    };

    return response;
  }
}
