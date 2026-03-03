import * as fs from 'fs';
import * as path from 'path';
import { claude } from '../../lib/claude';
import { appendLog } from './GenerationLogger';

/**
 * TEMPLATE SELECTOR AGENT
 * 
 * Analyzes user's prompt and metadata to intelligently select
 * the optimal deck template from the 8 available options.
 * 
 * NO RANDOMNESS — same input always picks the same template.
 */

interface DeckMetadata {
    filename: string;
    pageCount: number;
    layoutPatterns: string[];
    slideTypes: string[];
    primaryDomains?: string[];
    secondaryDomains?: string[];
    domains?: string[];
    industries: string[];
    presentationTypes: string[];
    audiences: string[];
    contentFocus: string[];
    whenToUse: string;
    avoidWhen: string;
}

interface SelectionResult {
    selectedDeck: string;
    deckIndex: number;
    reasoning: string;
    matchScore: number;
    alternativeDecks: string[];
}

let _metadata: Record<string, DeckMetadata> | null = null;

function loadDeckMetadata(): Record<string, DeckMetadata> {
    if (_metadata) return _metadata;
    const p = path.join(__dirname, 'examples/summarized_agent.json');
    _metadata = JSON.parse(fs.readFileSync(p, 'utf-8'));
    return _metadata!;
}

/**
 * Intelligently selects the best deck template using AI analysis.
 */
export async function selectTemplate(
    userPrompt: string,
    metadata: any
): Promise<SelectionResult> {
    
    const deckMetadata = loadDeckMetadata();
    
    // Build a concise summary for AI to reason about
    const deckSummaries = Object.entries(deckMetadata).map(([key, deck]) => {
        const primary = deck.primaryDomains || deck.domains?.slice(0, 3) || [];
        return `${key} (${deck.filename}, ${deck.pageCount} pages):
  PRIMARY: ${primary.join(', ')}
  PRESENTATION TYPES: ${deck.presentationTypes.slice(0, 5).join(', ')}
  AUDIENCES: ${deck.audiences.slice(0, 3).join(', ')}
  CONTENT FOCUS: ${deck.contentFocus.slice(0, 3).join(', ')}
  WHEN TO USE: ${deck.whenToUse}
  AVOID WHEN: ${deck.avoidWhen}`;
    }).join('\n\n');

    const prompt = `You are a presentation template selector. Analyze the user's request and select the SINGLE BEST deck template.

USER REQUEST:
"${userPrompt}"

USER METADATA:
${JSON.stringify(metadata, null, 2)}

AVAILABLE DECK TEMPLATES:
${deckSummaries}

SELECTION CRITERIA:
1. Match presentation type (investor pitch? update? product launch? data review?)
2. Match audience (executives? investors? internal team? customers?)
3. Match content focus (data-heavy? narrative? comparison? timeline?)
4. Match domain if applicable
5. Check "WHEN TO USE" / "AVOID WHEN" directives

Return STRICT JSON:
{
  "selectedDeck": "deck1" | "deck2" | "deck3" | "deck4" | "deck5" | "deck6" | "deck7" | "deck8",
  "reasoning": "2-3 sentence explanation of why this deck is the best match, citing specific matching criteria",
  "matchScore": 0.0-1.0 (confidence score),
  "alternativeDecks": ["deck2", "deck5"] (array of 1-2 runner-up options)
}

CRITICAL:
- If user says "investor pitch" or "fundraising" → deck6 (investor pitch specialist)
- If user says "product launch" or "demo" → deck3 (product launch specialist)
- If user says "metrics" or "data" or "quarterly review" → deck4 (data-heavy specialist)
- If user says "quick update" or "5 minute" → deck7 (6 pages only)
- If user says "executive briefing" or "strategic overview" → deck1 (executive focus)
- If user says "comprehensive" or needs ALL slide types → deck2 (19 pages, most complete)
- If user says "earnings" or "shareholder" or "formal" → deck8 (formal corporate)
- If user says "internal update" or "progress report" → deck5 (internal update focus)

BE DECISIVE. Pick ONE deck confidently.`;

    try {
        const response = await claude.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            temperature: 0.2,
            system: 'You are a presentation template selector. Respond with ONLY valid JSON, no explanations.',
            messages: [{ role: 'user', content: prompt }],
        });

        const textBlock: any = response.content.find((block: any) => block.type === 'text');
        const result = JSON.parse(textBlock?.text || '{}');
        
        // Map deck key to index for PresentationEngine
        const deckKey = result.selectedDeck || 'deck1';
        const deckIndex = parseInt(deckKey.replace('deck', '')) - 1;
        
        appendLog('\n╔══════════════════════════════════════════════════════════╗');
        appendLog('║          TEMPLATE SELECTOR AGENT - DECISION          ║');
        appendLog('╚══════════════════════════════════════════════════════════╝');
        appendLog(`\n📊 USER REQUEST: "${userPrompt.substring(0, 80)}..."`);
        appendLog(`\n🎯 SELECTED TEMPLATE: ${deckKey.toUpperCase()} → ${deckMetadata[deckKey].filename}`);
        appendLog(`   Pages: ${deckMetadata[deckKey].pageCount}`);
        appendLog(`   Primary Focus: ${(deckMetadata[deckKey].primaryDomains || deckMetadata[deckKey].domains?.slice(0, 2) || []).join(', ')}`);
        appendLog(`\n💡 REASONING:\n   ${result.reasoning}`);
        appendLog(`\n📈 CONFIDENCE SCORE: ${(result.matchScore * 100).toFixed(0)}%`);
        appendLog(`\n🔄 ALTERNATIVES: ${(result.alternativeDecks || []).join(', ')}`);
        appendLog('\n══════════════════════════════════════════════════════════\n');

        return {
            selectedDeck: deckMetadata[deckKey].filename,
            deckIndex,
            reasoning: result.reasoning,
            matchScore: result.matchScore || 0.85,
            alternativeDecks: result.alternativeDecks || [],
        };
        
    } catch (err) {
        appendLog(`❌ Template selection failed: ${err}`);
        // Fallback to deck1
        return {
            selectedDeck: deckMetadata.deck1.filename,
            deckIndex: 0,
            reasoning: 'Fallback selection due to analysis error',
            matchScore: 0.5,
            alternativeDecks: [],
        };
    }
}
