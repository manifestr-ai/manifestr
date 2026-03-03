import { appendLog } from './GenerationLogger';

/**
 * DECK ANALYZER SERVICE
 * 
 * Parses a selected deck JSON and logs complete structure analysis:
 * - Background images per slide
 * - Text elements: content, fontSize, character count, position (x, y)
 * - Image elements: dimensions, position
 * 
 * This runs BEFORE AI content replacement to show the original
 * template structure that will be used.
 */

interface TextElement {
    id: string;
    content: string;
    fontSize: number;
    fontWeight: string;
    charCount: number;
    position: { x: number; y: number };
    opacity: number;
}

interface ImageElement {
    id: string;
    src: string;
    width: number;
    height: number;
    position: { x: number; y: number };
}

interface SlideAnalysis {
    slideNumber: number;
    slideId: string;
    background: string;
    textElements: TextElement[];
    imageElements: ImageElement[];
}

/**
 * Recursively collect all text elements from a page and its children
 */
function collectTextElements(element: any, collected: TextElement[] = []): TextElement[] {
    if (element.type === 'text') {
        collected.push({
            id: element.id || 'unknown',
            content: (element.text || '').substring(0, 80),
            fontSize: element.fontSize || 0,
            fontWeight: element.fontWeight || 'normal',
            charCount: (element.text || '').length,
            position: {
                x: Math.round(element.x || 0),
                y: Math.round(element.y || 0)
            },
            opacity: element.opacity ?? 1
        });
    }
    
    if (element.children && Array.isArray(element.children)) {
        element.children.forEach((child: any) => collectTextElements(child, collected));
    }
    
    return collected;
}

/**
 * Recursively collect all image elements from a page and its children
 */
function collectImageElements(element: any, collected: ImageElement[] = []): ImageElement[] {
    if (element.type === 'image') {
        collected.push({
            id: element.id || 'unknown',
            src: (element.src || '').substring(0, 60) + '...',
            width: Math.round(element.width || 0),
            height: Math.round(element.height || 0),
            position: {
                x: Math.round(element.x || 0),
                y: Math.round(element.y || 0)
            }
        });
    }
    
    if (element.children && Array.isArray(element.children)) {
        element.children.forEach((child: any) => collectImageElements(child, collected));
    }
    
    return collected;
}

/**
 * Analyze a complete deck and return structured data for all slides
 */
export function analyzeDeck(deck: any): SlideAnalysis[] {
    const pages = deck.pages || [];
    const analyses: SlideAnalysis[] = [];
    
    pages.forEach((page: any, index: number) => {
        const textElements: TextElement[] = [];
        const imageElements: ImageElement[] = [];
        
        // Collect from all children
        (page.children || []).forEach((child: any) => {
            collectTextElements(child, textElements);
            collectImageElements(child, imageElements);
        });
        
        analyses.push({
            slideNumber: index + 1,
            slideId: page.id || `slide-${index}`,
            background: page.background || 'none',
            textElements,
            imageElements
        });
    });
    
    return analyses;
}

/**
 * Log the complete deck analysis to file with beautiful formatting
 */
export function logDeckAnalysis(deckFilename: string, analyses: SlideAnalysis[]): void {
    appendLog('\n');
    appendLog('╔════════════════════════════════════════════════════════════════════╗');
    appendLog('║              📋 DECK TEMPLATE STRUCTURE ANALYSIS                ║');
    appendLog('╚════════════════════════════════════════════════════════════════════╝');
    appendLog(`\n🎨 TEMPLATE FILE: ${deckFilename}`);
    appendLog(`📊 TOTAL SLIDES: ${analyses.length}`);
    appendLog('\n' + '═'.repeat(70) + '\n');
    
    analyses.forEach((slide) => {
        appendLog(`┌─ SLIDE ${slide.slideNumber} ${'─'.repeat(60 - String(slide.slideNumber).length)}`);
        appendLog(`│`);
        appendLog(`│ 🎨 BACKGROUND: ${slide.background}`);
        appendLog(`│`);
        
        // Text Elements
        if (slide.textElements.length > 0) {
            appendLog(`│ 📝 TEXT ELEMENTS (${slide.textElements.length}):`);
            slide.textElements.forEach((text, idx) => {
                appendLog(`│   ${idx + 1}. "${text.content}${text.content.length === 80 ? '...' : ''}"`);
                appendLog(`│      ├─ Font Size: ${text.fontSize}px | Weight: ${text.fontWeight}`);
                appendLog(`│      ├─ Characters: ${text.charCount}`);
                appendLog(`│      ├─ Position: (x: ${text.position.x}, y: ${text.position.y})`);
                appendLog(`│      └─ Opacity: ${text.opacity}`);
            });
            appendLog(`│`);
        } else {
            appendLog(`│ 📝 TEXT ELEMENTS: None`);
            appendLog(`│`);
        }
        
        // Image Elements
        if (slide.imageElements.length > 0) {
            appendLog(`│ 🖼️  IMAGE ELEMENTS (${slide.imageElements.length}):`);
            slide.imageElements.forEach((img, idx) => {
                const isBackground = img.width > 1800 && img.height > 900;
                appendLog(`│   ${idx + 1}. ${isBackground ? '🌄 [FULL-BLEED BACKGROUND]' : '🖼️  [IMAGE]'}`);
                appendLog(`│      ├─ Dimensions: ${img.width}px × ${img.height}px`);
                appendLog(`│      ├─ Position: (x: ${img.position.x}, y: ${img.position.y})`);
                appendLog(`│      └─ Source: ${img.src}`);
            });
        } else {
            appendLog(`│ 🖼️  IMAGE ELEMENTS: None`);
        }
        
        appendLog(`└${'─'.repeat(69)}\n`);
    });
    
    appendLog('═'.repeat(70));
    appendLog(`\n✅ Deck analysis complete. Ready for AI content replacement.\n`);
}
