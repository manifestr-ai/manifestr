import * as fs from 'fs';
import * as path from 'path';
import { openai } from '../lib/openai';

/**
 * DECK TEMPLATE ANALYZER
 * 
 * Analyzes all 8 Polotno deck templates and generates AI-powered
 * categorization for EXACTLY what each deck should be used for.
 * 
 * Output: deck-metadata.json with strict domain/industry/use-case mappings
 */

const DECK_FILES = [
    'Deck.1.polotno.json',
    'Deck.2.polotno.json',
    'Deck.5.poltno.json',
    'Deck.6.polotno.json',
    'Deck.7.poltno.json',
    'Deck.8.polotno.json',
    'Deck.11.poltno.json',
    'Deck.15.polotno.json',
] as const;

interface DeckMetadata {
    filename: string;
    pageCount: number;
    layoutPatterns: string[];
    slideTypes: string[];
    domains: string[];
    industries: string[];
    presentationTypes: string[];
    audiences: string[];
    contentFocus: string[];
    whenToUse: string;
    avoidWhen: string;
}

function extractDeckStructure(deck: any, filename: string): any {
    const pages = deck.pages || [];
    
    // Collect all text content
    const allTexts: string[] = [];
    const collectText = (el: any) => {
        if (el.type === 'text' && el.text && el.text.trim()) {
            const t = el.text.trim();
            // Skip long placeholder sentences
            if (!/^This\s+(section|first|second)/i.test(t) && t.length < 100) {
                allTexts.push(t);
            }
        }
        (el.children || []).forEach(collectText);
    };
    
    pages.forEach((page: any) => {
        (page.children || []).forEach(collectText);
    });
    
    // Detect layout patterns
    const layoutPatterns: string[] = [];
    const hasColumns = pages.some((p: any) => 
        p.children?.filter((c: any) => c.type === 'text' && c.x > 960).length > 2
    );
    const hasTimeline = allTexts.some(t => /week\s+\d|step\s+\d|phase\s+\d|roadmap/i.test(t));
    const hasDataViz = allTexts.some(t => /chart|data|graph/i.test(t));
    const hasComparison = allTexts.some(t => /comparison|option|vs\.|versus/i.test(t));
    
    if (hasColumns) layoutPatterns.push('multi-column');
    if (hasTimeline) layoutPatterns.push('timeline/roadmap');
    if (hasDataViz) layoutPatterns.push('data-visualization');
    if (hasComparison) layoutPatterns.push('comparison');
    
    // Detect structural slide types
    const slideTypes = allTexts
        .filter(t => /SLIDE_\w+|\[SLIDE.?ROLE\]/i.test(t))
        .map(t => t.replace(/SLIDE_|^\[SLIDE.?ROLE\]\s*/i, '').toLowerCase().trim())
        .filter(Boolean);
    
    return {
        filename,
        pageCount: pages.length,
        sampleTexts: allTexts.slice(0, 25),
        layoutPatterns,
        slideTypes: [...new Set(slideTypes)],
    };
}

async function analyzeDeckWithAI(deckData: any): Promise<Partial<DeckMetadata>> {
    const prompt = `You are analyzing a presentation template to categorize EXACTLY what domains, industries, and scenarios it should be used for.

DECK: ${deckData.filename}
- Pages: ${deckData.pageCount}
- Layout patterns: ${deckData.layoutPatterns.join(', ') || 'standard'}
- Available slide types: ${deckData.slideTypes.join(', ') || 'general'}

STRUCTURAL LABELS FROM DECK:
${deckData.sampleTexts.join('\n')}

Analyze the slide types and structure to determine PRECISELY what this deck is optimized for.

RETURN STRICT JSON - ALL FIELDS REQUIRED:

{
  "domains": [
    "Array of 8-15 HIGHLY SPECIFIC domain categories this deck excels at.",
    "Examples: 'artificial intelligence', 'machine learning operations', 'cloud infrastructure', 'cybersecurity', 'blockchain/web3', 'fintech payments', 'biotechnology research', 'pharmaceutical development', 'e-commerce platforms', 'SaaS B2B products', 'manufacturing automation', 'supply chain optimization', 'HR tech', 'marketing analytics', 'legal compliance', 'real estate investment', 'edtech platforms', 'renewable energy', 'automotive technology', 'agriculture tech', etc.",
    "BE RUTHLESSLY SPECIFIC - not 'technology' but 'cloud infrastructure', 'AI/ML', 'cybersecurity' as separate entries."
  ],
  
  "industries": [
    "Array of 6-10 broad industry verticals.",
    "Examples: 'technology/software', 'financial services', 'healthcare/pharma', 'retail/e-commerce', 'manufacturing', 'education', 'government/public sector', 'nonprofit/NGO', 'media/entertainment', 'energy/utilities', 'telecommunications', 'real estate', 'consulting', 'legal services', 'hospitality', 'transportation/logistics'"
  ],
  
  "presentationTypes": [
    "Array of 10-15 EXACT presentation scenarios.",
    "Examples: 'Series A/B investor pitch', 'product launch keynote', 'quarterly earnings call', 'board of directors meeting', 'enterprise sales deck', 'customer success presentation', 'employee onboarding', 'technical architecture review', 'conference workshop', 'partnership proposal', 'RFP response', 'annual strategy review', 'competitive market analysis', 'research paper presentation', 'grant funding proposal', 'crisis communication', 'merger/acquisition announcement', 'project kickoff', 'retrospective review', 'policy briefing'"
  ],
  
  "audiences": [
    "Array of 4-6 target audience types.",
    "Examples: 'C-suite/executives', 'venture capital investors', 'engineering/technical teams', 'sales prospects/clients', 'existing customers', 'employees/internal', 'board members', 'academic/research peers', 'government regulators', 'media/press', 'partners/vendors', 'general public'"
  ],
  
  "contentFocus": [
    "Array of 4-6 content types this deck structure handles BEST.",
    "Examples: 'heavy quantitative data/metrics', 'narrative storytelling', 'problem-solution frameworks', 'side-by-side comparisons', 'multi-phase timelines', 'technical specifications', 'financial models/projections', 'case study walkthroughs', 'process diagrams', 'research methodology', 'competitive positioning', 'feature demonstrations'"
  ],
  
  "whenToUse": "One clear directive sentence: Use this deck when [specific need/scenario].",
  
  "avoidWhen": "One clear directive sentence: Avoid this deck when [specific mismatch scenario]."
}

CRITICAL: Be HYPER-SPECIFIC in domains and presentationTypes. Output MUST be valid JSON.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: 1500,
        });
        
        return JSON.parse(response.choices[0].message.content || '{}');
    } catch (err) {
        console.error(`Failed to analyze ${deckData.filename}:`, err);
        return {
            domains: ['general'],
            industries: ['general'],
            presentationTypes: ['general'],
            audiences: ['general'],
            contentFocus: ['general'],
            whenToUse: 'Analysis pending',
            avoidWhen: 'Analysis pending'
        };
    }
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
async function main() {
    console.log('🔍 Analyzing deck templates for domain/use-case categorization...\n');
    
    const examplesDir = path.join(__dirname, '../agents/presentation/examples');
    const results: DeckMetadata[] = [];
    
    for (const filename of DECK_FILES) {
        console.log(`Analyzing ${filename}...`);
        
        const filepath = path.join(examplesDir, filename);
        const deck = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        
        // 1. Extract structural data
        const structure = extractDeckStructure(deck, filename);
        
        // 2. Get AI categorization
        const aiAnalysis = await analyzeDeckWithAI(structure);
        
        // 3. Merge
        results.push({
            ...structure,
            ...aiAnalysis,
        } as DeckMetadata);
        
        console.log(`  ✓ Domains: ${(aiAnalysis.domains || []).slice(0, 3).join(', ')}`);
        console.log(`  ✓ Best for: ${(aiAnalysis.presentationTypes || []).slice(0, 3).join(', ')}\n`);
        
        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Save single JSON file with all deck summaries
    const outputPath = path.join(examplesDir, 'summarized_agent.json');
    
    // Format as object with clean keys
    const formatted: Record<string, any> = {};
    results.forEach((r, idx) => {
        const deckKey = `deck${idx + 1}`;
        formatted[deckKey] = {
            filename: r.filename,
            pageCount: r.pageCount,
            layoutPatterns: r.layoutPatterns,
            slideTypes: r.slideTypes,
            domains: r.domains,
            industries: r.industries,
            presentationTypes: r.presentationTypes,
            audiences: r.audiences,
            contentFocus: r.contentFocus,
            whenToUse: r.whenToUse,
            avoidWhen: r.avoidWhen
        };
    });
    
    fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2), 'utf-8');
    console.log(`\n✅ Saved to: ${outputPath}\n`);
    console.log(`═══════════════════════════════════════════════════════════`);
    console.log(`DECK CATEGORIZATION SUMMARY`);
    console.log(`═══════════════════════════════════════════════════════════\n`);
    
    results.forEach((r, idx) => {
        console.log(`${idx + 1}. ${r.filename} (${r.pageCount} pages)`);
        console.log(`   DOMAINS: ${(r.domains || []).join(', ')}`);
        console.log(`   INDUSTRIES: ${(r.industries || []).join(', ')}`);
        console.log(`   PRESENTATION TYPES: ${(r.presentationTypes || []).slice(0, 6).join(', ')}`);
        console.log(`   AUDIENCES: ${(r.audiences || []).join(', ')}`);
        console.log(`   CONTENT FOCUS: ${(r.contentFocus || []).join(', ')}`);
        console.log(`   ✓ WHEN TO USE: ${r.whenToUse}`);
        console.log(`   ✗ AVOID WHEN: ${r.avoidWhen}\n`);
    });
}

main().catch(console.error);