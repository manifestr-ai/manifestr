import * as fs   from 'fs';
import * as path from 'path';
import { generateJSON } from '../../../lib/claude';
import { fetchUnsplashImage } from '../../../utils/image.util';
import { ContentResponse } from '../../protocols/types';
import { analyzeDeck, logDeckAnalysis } from '../../presentation/DeckAnalyzer';
import { appendLog, finalizeLog } from '../../presentation/GenerationLogger';

// ─────────────────────────────────────────────────────────────
// ALL DECK TEMPLATES
// ─────────────────────────────────────────────────────────────
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

let _decks: any[] | null = null;

function getAllDecks(): any[] {
    if (_decks) return _decks;
    const dir = path.join(__dirname, '../../presentation/examples');
    _decks = DECK_FILES.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')));
    return _decks;
}

function hashString(s: string): number {
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function selectTemplateDeck(seed: string): any {
    const decks = getAllDecks();
    return decks[hashString(seed) % decks.length];
}

// Deep-clone a page and assign fresh unique IDs
function clonePage(page: any, newId: string): any {
    const clone = JSON.parse(JSON.stringify(page));
    clone.id = newId;
    const reId = (el: any) => {
        el.id = `${newId}_${Math.random().toString(36).slice(2, 8)}`;
        (el.children || []).forEach(reId);
    };
    (clone.children || []).forEach(reId);
    return clone;
}

/**
 * 🧹 CLEAN TEXT HELPER
 * Removes AI artifacts like [TAGS], leading dashes, or instructional text.
 */
function cleanGeneratedText(text: string): string {
    if (!text) return "";
    return text
        .replace(/\[.*?\]/g, "")          // Remove [BODY], [HEADING], [SLIDE_ROLE]
        .replace(/^[\s\–\-\—]+/, "")      // Remove leading "– ", "- "
        .replace(/^(Title|Subtitle|Body|Header|Caption)[:\s\-]+/i, "") // Remove "Title: " prefixes
        .replace(/(Left|Right|Center)\s+(column|side)[:\s-]*/gi, "")   // Remove "Left column", "Right side"
        .trim();
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export const PresentationEngine = {
    async render(input: ContentResponse): Promise<any> {
        
        appendLog('\n\n╔════════════════════════════════════════════════════════════════════╗');
        appendLog('║          📋 TEMPLATE-ONLY MODE - NO AI GENERATION              ║');
        appendLog('╚════════════════════════════════════════════════════════════════════╝\n');

        // Get the pre-selected template filename
        const selectedTemplateFile = input.layout?.intent?.metadata?.selectedTemplate || 'Deck.1.polotno.json';
        
        const decks = getAllDecks();
        const deckFiles = DECK_FILES;
        const idx = deckFiles.indexOf(selectedTemplateFile as any);
        const template = idx >= 0 ? decks[idx] : decks[0];
        
        appendLog(`\n🎨 SELECTED TEMPLATE: ${selectedTemplateFile}`);
        appendLog(`📊 Template contains ${template.pages?.length || 0} slides`);

        // ─────────────────────────────────────────────────────────────
        // 🤖 AI TEXT & IMAGE TRACING (Slides 1-15)
        // ─────────────────────────────────────────────────────────────
        if (template.pages && Array.isArray(template.pages)) {
            // Process up to first 15 slides
            const slidesToProcess = template.pages.slice(0, 15);
            const textElements: any[] = [];
            const imageElements: any[] = []; // 📸 TRACE IMAGES
            
            // 1. Gather elements (RECURSIVE)
            const collectElements = (elements: any[], slideIndex: number) => {
                // Filter out SVG and Logo text first
                const initialCount = elements.length;
                const filtered = elements.filter((el: any) => {
                    if (el.type === 'svg') return false;
                    if (el.type === 'text' && el.text && /logo/i.test(el.text)) return false;
                    return true;
                });
                
                // Mutate the original array to remove filtered items (for the reference passed in)
                if (filtered.length !== initialCount) {
                    elements.length = 0;
                    elements.push(...filtered);
                    appendLog(`\n🗑️ Removed ${initialCount - filtered.length} Element(s) (SVG or 'Logo') from Slide ${slideIndex + 1}`);
                }

                elements.forEach((el: any) => {
                    // RECURSE into Groups
                    if (el.group || (el.children && Array.isArray(el.children))) {
                        collectElements(el.children, slideIndex);
                    }

                    // TEXT
                    if (el.type === 'text') {
                        if (el.fontSize) {
                            el.fontSize = Math.min(Math.max(1, el.fontSize - 2), 220);
                        }
                        if (el.text && el.text.trim().length > 0) {
                            textElements.push({
                                slideIndex: slideIndex,
                                id: el.id,
                                original: el.text,
                                charCount: el.text.length
                            });
                        }
                    }
                    // IMAGE
                    else if (el.type === 'image') {
                        imageElements.push({
                            slideIndex: slideIndex,
                            id: el.id,
                            src: el.src,
                            width: Math.round(el.width),
                            height: Math.round(el.height)
                        });
                    }
                });
            };

            slidesToProcess.forEach((page: any, pageIndex: number) => {
                if (page.children && Array.isArray(page.children)) {
                    collectElements(page.children, pageIndex);
                }
            });

            // LOG IMAGE TRACE RESULTS
            if (imageElements.length > 0) {
                appendLog(`\n📸 FOUND ${imageElements.length} IMAGES in Slides 1-${slidesToProcess.length} (Including nested groups)`);
                appendLog(`   ℹ️ These images are ready for AI replacement if enabled.`);
            }

            // 2. Send TEXT to AI
            if (textElements.length > 0) {
                appendLog(`\n🤖 GENERATING AI REPLACEMENTS for Slides 1-${slidesToProcess.length} (Topic: "${input.layout?.intent?.originalPrompt || 'General'}")`);
                
                const userTopic = input.layout?.intent?.originalPrompt || "General Presentation";
                
                const systemPrompt = `
                You are a precise copy editor. Your task is to rewrite text to match a new topic: "${userTopic}".
                
                ### CRITICAL CONSTRAINTS
                1. **CHARACTER COUNT**: You must match the "charCount" of the original text EXACTLY or within ±2 chars.
                   - If original is 10 chars, new text MUST be 8-12 chars.
                   - This is to ensure the design layout does not break.
                2. **STYLE**: Maintain the same casing (UPPERCASE, Title Case, etc.) and tone.
                3. **CONTENT**: The new text must be relevant to the topic.
                4. **UNIQUENESS**: 
                   - NO two text replacements should be identical. 
                   - Do NOT use generic placeholder text like "This section explains...". 
                   - Make every piece of content unique and specific to the slide's context.
                
                Return JSON: { "replacements": [ { "id": "...", "newText": "..." } ] }
                `;

                const prompt = `
                Replace these text items for a presentation about "${userTopic}".
                Items:
                ${JSON.stringify(textElements, null, 2)}
                `;

                try {
                    const result = await generateJSON<any>(null, systemPrompt, prompt);
                    
                    if (result && result.replacements && Array.isArray(result.replacements)) {
                        // Create a recursive finder
                        const applyTextReplacement = (elements: any[], id: string, newText: string) => {
                            for (const el of elements) {
                                if (el.id === id) {
                                    const oldText = el.text;
                                    el.text = cleanGeneratedText(newText);
                                    appendLog(`   ✨ Replaced (${oldText.length}ch -> ${el.text.length}ch): "${oldText.substring(0, 20)}..." -> "${el.text.substring(0, 20)}..."`);
                                    return true;
                                }
                                if (el.children && Array.isArray(el.children)) {
                                    if (applyTextReplacement(el.children, id, newText)) return true;
                                }
                            }
                            return false;
                        };

                        result.replacements.forEach((rep: any) => {
                            let found = false;
                            for (const page of slidesToProcess) {
                                if (!page.children) continue;
                                if (applyTextReplacement(page.children, rep.id, rep.newText)) {
                                    found = true;
                                    break;
                                }
                            }
                        });
                    }
                } catch (err) {
                    appendLog(`    AI Replacement Failed: ${err}`);
                }
            } else {
                appendLog(`   ℹ️ No text elements found on Slides 1-15 to replace.`);
            }

            // 3. Send IMAGES to AI
            if (imageElements.length > 0) {
                appendLog(`\n🤖 GENERATING AI IMAGES for Slides 1-${slidesToProcess.length}...`);
                const userTopic = input.layout?.intent?.originalPrompt || "General Presentation";
                
                const imagePrompt = `
                You are an art director. For the following image placeholders, generate a specific, high-quality Unsplash search query.
                Topic: "${userTopic}"
                
                ### RULES
                1. **VARIETY**: Generate a UNIQUE search query for every single image. NO DUPLICATES.
                2. **CONTEXT**: Infer the context from the image dimensions (wide = banner, tall = portrait).
                3. **RELEVANCE**: Queries must be strictly relevant to "${userTopic}".
                
                Items:
                ${JSON.stringify(imageElements.map(img => ({ id: img.id, width: img.width, height: img.height })), null, 2)}
                
                Return JSON: { "replacements": [ { "id": "...", "searchQuery": "..." } ] }
                `;

                try {
                    const imgResult = await generateJSON<any>(null, "You are an image search specialist.", imagePrompt);
                    
                    if (imgResult && imgResult.replacements) {
                        const usedQueries = new Set<string>();

                        for (const rep of imgResult.replacements) {
                            // Enforce Uniqueness logic
                            let query = rep.searchQuery;
                            if (usedQueries.has(query)) {
                                query = `${query} ${Math.floor(Math.random() * 1000)}`; // Add random suffix to force variation
                            }
                            usedQueries.add(query);

                            const applyImageReplacement = async (elements: any[], id: string, query: string) => {
                                for (const el of elements) {
                                    if (el.id === id) {
                                        const newUrl = await fetchUnsplashImage(query);
                                        if (newUrl && newUrl !== el.src) {
                                            el.src = newUrl;
                                            appendLog(`   🖼️ Replaced Image (${Math.round(el.width)}x${Math.round(el.height)}): "${query}"`);
                                        }
                                        return true;
                                    }
                                    if (el.children && Array.isArray(el.children)) {
                                        if (await applyImageReplacement(el.children, id, query)) return true;
                                    }
                                }
                                return false;
                            };

                            for (const page of slidesToProcess) {
                                if (!page.children) continue;
                                if (await applyImageReplacement(page.children, rep.id, query)) break;
                            }
                        }
                    }
                } catch (err) {
                    appendLog(`   ❌ Image Replacement Failed: ${err}`);
                }
            }
        }

        appendLog(`✅ Returning template EXACTLY AS-IS (ZERO modifications)\n`);

        // ─────────────────────────────────────────────────────────────
        // LOG SLIDE STRUCTURE (Detailed Analysis)
        // ─────────────────────────────────────────────────────────────
        appendLog('\n╔════════════════════════════════════════════════════════════════════╗');
        appendLog('║               🔍 SLIDE STRUCTURE ANALYSIS                      ║');
        appendLog('╚════════════════════════════════════════════════════════════════════╝\n');

        const logElement = (element: any, depth: number = 0) => {
             const indent = '   '.repeat(depth + 1);
             let typeStr = element.type ? element.type.toUpperCase() : 'UNKNOWN';
             let details = `${indent}• [${typeStr.padEnd(8)}] ID: ${element.id}`;
             
             if (element.type === 'text') {
                 const textContent = (element.text || '');
                 const wordCount = textContent.trim() === '' ? 0 : textContent.trim().split(/\s+/).length;
                 const charCount = textContent.length;
                 const color = element.fill || 'UNKNOWN';
                 const fontSize = element.fontSize ? `${element.fontSize}px` : 'UNKNOWN';

                 // "TEXT : HELLO WORLD ( 2 WORDS 10 CHARACTERS COLOR WHIOTE, FONTSIZE:12PX)"
                 details += `\n${indent}  └─ TEXT : ${textContent.replace(/\n/g, ' ').substring(0, 100)}${textContent.length > 100 ? '...' : ''} (${wordCount} WORDS ${charCount} CHARACTERS COLOR ${color}, FONTSIZE:${fontSize})`;
             } else if (element.type === 'image') {
                 details += `\n${indent}  └─ IMAGE : ${element.src ? (element.src.substring(0, 40) + '...') : 'Missing'}`;
                 if (element.width) details += ` (Size: ${Math.round(element.width)}x${Math.round(element.height)})`;
             } else {
                  const props = Object.keys(element).filter(k => !['id', 'type', 'x', 'y', 'width', 'height', 'rotation', 'children'].includes(k)).join(', ');
                  if (props) details += ` | Props: ${props}`;
             }
             
             appendLog(details);

             // Recurse for groups
             if (element.children && Array.isArray(element.children)) {
                 element.children.forEach((child: any) => logElement(child, depth + 1));
             }
        };

        if (template.pages && Array.isArray(template.pages)) {
            template.pages.forEach((page: any, index: number) => {
                appendLog(`\n📄 SLIDE ${index + 1} (ID: ${page.id})`);
                appendLog('─'.repeat(60));
                
                if (page.children && Array.isArray(page.children)) {
                    page.children.forEach((element: any) => {
                        logElement(element);
                    });
                } else {
                    appendLog('   (Empty Slide)');
                }
            });
        }
        appendLog('\n' + '═'.repeat(68) + '\n');

        // Finalize log file
        finalizeLog(input.jobId);

        // Return the COMPLETE template exactly as it is
        // This includes ALL pages, images, text, layouts, fonts, colors
        // NOTHING is modified - pure template
        return template;
    },
};
