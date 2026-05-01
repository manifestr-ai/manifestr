import { AnalyzerCatalogService, AnalyzerTemplate } from './AnalyzerCatalogService';

export interface ClassificationResult {
    isAnalyzer: boolean;
    confidence: number;
    matchedTemplate: AnalyzerTemplate | null;
    reasoning: string;
}

export class AnalyzerClassifier {
    private catalogService: AnalyzerCatalogService;

    // Specific keywords that STRONGLY indicate analyzer request
    private readonly STRONG_ANALYZER_KEYWORDS = [
        'funnel chart', 'funnel graph',
        'kpi dashboard', 'kpi dash',
        'scatter plot', 'scatter chart', 'scatter graph',
        'gantt chart', 'gantt timeline',
        'bar chart', 'bar graph',
        'pie chart', 'pie graph', 'donut chart',
        'line chart', 'line graph',
        'heatmap', 'heat map',
        'radar chart', 'spider chart',
        'waterfall chart', 'bridge chart',
        'stacked area', 'area chart',
        'bubble chart', 'bubble plot',
        'sankey diagram', 'flow diagram',
        'treemap', 'tree map',
        'gauge chart', 'gauge meter', 'speedometer'
    ];

    // Weak indicators (only count if combined with other signals)
    private readonly WEAK_ANALYZER_KEYWORDS = [
        'visualization', 'visualize',
        'chart', 'graph',
        'dashboard',
        'plot', 'diagram'
    ];

    // Keywords that indicate NOT an analyzer request
    private readonly DOCUMENT_KEYWORDS = [
        'document', 'proposal', 'report', 'letter',
        'memo', 'contract', 'agreement', 'policy',
        'plan', 'strategy', 'roadmap', 'business plan',
        'essay', 'article', 'blog', 'post'
    ];

    private readonly SPREADSHEET_KEYWORDS = [
        'spreadsheet', 'excel', 'budget',
        'expense tracker', 'financial model',
        'data table', 'grid', 'rows and columns'
    ];

    private readonly PRESENTATION_KEYWORDS = [
        'presentation', 'slides', 'pitch deck',
        'powerpoint', 'deck', 'slideshow'
    ];

    constructor() {
        this.catalogService = AnalyzerCatalogService.getInstance();
    }

    /**
     * Classify whether a prompt is requesting analyzer functionality
     */
    async classify(prompt: string): Promise<ClassificationResult> {
        const promptLower = prompt.toLowerCase();

        // Step 1: Check for strong disqualifiers (document/spreadsheet/presentation)
        const hasDocumentKeyword = this.DOCUMENT_KEYWORDS.some(kw => promptLower.includes(kw));
        const hasSpreadsheetKeyword = this.SPREADSHEET_KEYWORDS.some(kw => promptLower.includes(kw));
        const hasPresentationKeyword = this.PRESENTATION_KEYWORDS.some(kw => promptLower.includes(kw));

        if (hasDocumentKeyword || hasSpreadsheetKeyword || hasPresentationKeyword) {
            return {
                isAnalyzer: false,
                confidence: 0.95,
                matchedTemplate: null,
                reasoning: 'Prompt contains document/spreadsheet/presentation keywords - not an analyzer request'
            };
        }

        // Step 2: Check for strong analyzer keywords
        const hasStrongKeyword = this.STRONG_ANALYZER_KEYWORDS.some(kw => promptLower.includes(kw));

        if (hasStrongKeyword) {
            // Try to find matching template
            const matchedTemplate = await this.catalogService.findBestMatch(prompt);

            if (matchedTemplate) {
                return {
                    isAnalyzer: true,
                    confidence: 0.95,
                    matchedTemplate,
                    reasoning: `Strong match: Found specific chart type "${matchedTemplate.template_name}"`
                };
            } else {
                return {
                    isAnalyzer: true,
                    confidence: 0.85,
                    matchedTemplate: null,
                    reasoning: 'Strong analyzer keyword detected, but no specific template match'
                };
            }
        }

        // Step 3: Check for weak keywords (need multiple signals)
        const weakKeywordCount = this.WEAK_ANALYZER_KEYWORDS.filter(kw => 
            promptLower.includes(kw)
        ).length;

        if (weakKeywordCount >= 2) {
            // Multiple weak signals - try to find template match
            const matchedTemplate = await this.catalogService.findBestMatch(prompt);

            if (matchedTemplate) {
                return {
                    isAnalyzer: true,
                    confidence: 0.75,
                    matchedTemplate,
                    reasoning: 'Multiple visualization keywords and template match found'
                };
            } else {
                return {
                    isAnalyzer: false,
                    confidence: 0.60,
                    matchedTemplate: null,
                    reasoning: 'Weak visualization keywords but no clear template match - likely not analyzer'
                };
            }
        }

        // Step 4: Try template matching as last resort
        const matchedTemplate = await this.catalogService.findBestMatch(prompt);

        if (matchedTemplate) {
            return {
                isAnalyzer: true,
                confidence: 0.70,
                matchedTemplate,
                reasoning: 'No explicit keywords but found template match through semantic search'
            };
        }

        // Default: Not an analyzer request
        return {
            isAnalyzer: false,
            confidence: 0.90,
            matchedTemplate: null,
            reasoning: 'No analyzer indicators detected'
        };
    }

    /**
     * Quick check if prompt is likely an analyzer request (without template matching)
     */
    isLikelyAnalyzer(prompt: string): boolean {
        const promptLower = prompt.toLowerCase();

        // Quick disqualify
        const hasDocumentKeyword = this.DOCUMENT_KEYWORDS.some(kw => promptLower.includes(kw));
        const hasSpreadsheetKeyword = this.SPREADSHEET_KEYWORDS.some(kw => promptLower.includes(kw));
        const hasPresentationKeyword = this.PRESENTATION_KEYWORDS.some(kw => promptLower.includes(kw));

        if (hasDocumentKeyword || hasSpreadsheetKeyword || hasPresentationKeyword) {
            return false;
        }

        // Quick qualify
        const hasStrongKeyword = this.STRONG_ANALYZER_KEYWORDS.some(kw => promptLower.includes(kw));
        return hasStrongKeyword;
    }

    /**
     * Extract chart type hint from prompt (e.g., "funnel", "bar", "pie")
     */
    extractChartTypeHint(prompt: string): string | null {
        const promptLower = prompt.toLowerCase();

        const chartTypes = [
            'funnel', 'bar', 'pie', 'donut', 'line', 'scatter',
            'gantt', 'heatmap', 'radar', 'spider', 'waterfall',
            'area', 'bubble', 'sankey', 'treemap', 'gauge'
        ];

        for (const type of chartTypes) {
            if (promptLower.includes(type)) {
                return type;
            }
        }

        return null;
    }
}
