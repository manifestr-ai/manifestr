import { supabaseAdmin } from "../lib/supabase";
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

export interface AnalyzerTemplate {
    id?: number;
    template_id: string;
    template_name: string;
    category: string;
    subcategory?: string;
    chart_type: string;
    description?: string;
    use_cases?: string;
    keywords: string[];
    data_structure?: any;
    config_template?: any;
    is_active?: boolean;
}

export class AnalyzerCatalogService {
    private static instance: AnalyzerCatalogService;
    private catalogLoaded: boolean = false;

    private constructor() {}

    static getInstance(): AnalyzerCatalogService {
        if (!AnalyzerCatalogService.instance) {
            AnalyzerCatalogService.instance = new AnalyzerCatalogService();
        }
        return AnalyzerCatalogService.instance;
    }

    /**
     * Load catalog from CSV into database (run once on setup)
     */
    async loadCatalogFromCSV(): Promise<void> {
        const csvPath = path.join(__dirname, '../../data/analyzer-catalog.csv');
        
        if (!fs.existsSync(csvPath)) {
            console.error('❌ CSV file not found:', csvPath);
            return;
        }

        const templates: AnalyzerTemplate[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (row: any) => {
                    try {
                        const template: AnalyzerTemplate = {
                            template_id: row.template_id,
                            template_name: row.template_name,
                            category: row.category,
                            subcategory: row.subcategory || null,
                            chart_type: row.chart_type,
                            description: row.description || null,
                            use_cases: row.use_cases || null,
                            keywords: row.keywords ? row.keywords.split(',').map((k: string) => k.trim()) : [],
                            data_structure: row.data_structure ? JSON.parse(row.data_structure) : null,
                            config_template: row.config_template ? JSON.parse(row.config_template) : null,
                            is_active: true
                        };
                        templates.push(template);
                    } catch (err) {
                        console.error('Error parsing row:', row, err);
                    }
                })
                .on('end', async () => {
                    console.log(`✅ Parsed ${templates.length} templates from CSV`);
                    
                    // Insert into database
                    try {
                        for (const template of templates) {
                            await this.upsertTemplate(template);
                        }
                        this.catalogLoaded = true;
                        console.log(`✅ Successfully loaded ${templates.length} templates into database`);
                        resolve();
                    } catch (error) {
                        console.error('❌ Error inserting templates:', error);
                        reject(error);
                    }
                })
                .on('error', (error: any) => {
                    console.error('❌ Error reading CSV:', error);
                    reject(error);
                });
        });
    }

    /**
     * Upsert a template (insert or update if exists)
     */
    private async upsertTemplate(template: AnalyzerTemplate): Promise<void> {
        const { data, error } = await supabaseAdmin
            .from('analyzer_catalog')
            .upsert({
                template_id: template.template_id,
                template_name: template.template_name,
                category: template.category,
                subcategory: template.subcategory,
                chart_type: template.chart_type,
                description: template.description,
                use_cases: template.use_cases,
                keywords: template.keywords,
                data_structure: template.data_structure,
                config_template: template.config_template,
                is_active: template.is_active,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'template_id'
            });

        if (error) {
            console.error(`❌ Error upserting template ${template.template_id}:`, error);
            throw error;
        }
    }

    /**
     * Get all active templates
     */
    async getAllTemplates(): Promise<AnalyzerTemplate[]> {
        const { data, error } = await supabaseAdmin
            .from('analyzer_catalog')
            .select('*')
            .eq('is_active', true)
            .order('category', { ascending: true });

        if (error) {
            console.error('❌ Error fetching templates:', error);
            return [];
        }

        return data as AnalyzerTemplate[];
    }

    /**
     * Get templates by category
     */
    async getTemplatesByCategory(category: string): Promise<AnalyzerTemplate[]> {
        const { data, error } = await supabaseAdmin
            .from('analyzer_catalog')
            .select('*')
            .eq('category', category)
            .eq('is_active', true);

        if (error) {
            console.error('❌ Error fetching templates by category:', error);
            return [];
        }

        return data as AnalyzerTemplate[];
    }

    /**
     * Search templates by keywords
     */
    async searchTemplates(query: string): Promise<AnalyzerTemplate[]> {
        const queryLower = query.toLowerCase();

        const { data, error } = await supabaseAdmin
            .from('analyzer_catalog')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('❌ Error searching templates:', error);
            return [];
        }

        // Filter by keywords match
        const templates = data as AnalyzerTemplate[];
        return templates.filter(template => {
            // Check if query matches any keyword
            const keywordMatch = template.keywords.some(keyword => 
                keyword.toLowerCase().includes(queryLower) || 
                queryLower.includes(keyword.toLowerCase())
            );

            // Check if query matches template name or description
            const nameMatch = template.template_name.toLowerCase().includes(queryLower);
            const descMatch = template.description?.toLowerCase().includes(queryLower) || false;

            return keywordMatch || nameMatch || descMatch;
        });
    }

    /**
     * Get template by ID
     */
    async getTemplateById(templateId: string): Promise<AnalyzerTemplate | null> {
        const { data, error } = await supabaseAdmin
            .from('analyzer_catalog')
            .select('*')
            .eq('template_id', templateId)
            .single();

        if (error) {
            console.error('❌ Error fetching template:', error);
            return null;
        }

        return data as AnalyzerTemplate;
    }

    /**
     * Get templates by chart type
     */
    async getTemplatesByChartType(chartType: string): Promise<AnalyzerTemplate[]> {
        const { data, error } = await supabaseAdmin
            .from('analyzer_catalog')
            .select('*')
            .eq('chart_type', chartType)
            .eq('is_active', true);

        if (error) {
            console.error('❌ Error fetching templates by chart type:', error);
            return [];
        }

        return data as AnalyzerTemplate[];
    }

    /**
     * Find best matching template for a prompt
     */
    async findBestMatch(prompt: string): Promise<AnalyzerTemplate | null> {
        const searchResults = await this.searchTemplates(prompt);
        
        if (searchResults.length === 0) {
            return null;
        }

        // Score each template based on keyword matches
        const scored = searchResults.map(template => {
            let score = 0;
            const promptLower = prompt.toLowerCase();

            // Count keyword matches
            template.keywords.forEach(keyword => {
                if (promptLower.includes(keyword.toLowerCase())) {
                    score += 2; // Exact keyword match gets higher score
                }
            });

            // Check template name match
            if (promptLower.includes(template.template_name.toLowerCase())) {
                score += 3;
            }

            // Check chart type match
            if (promptLower.includes(template.chart_type.toLowerCase())) {
                score += 2;
            }

            return { template, score };
        });

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Return highest scoring template
        return scored[0].score > 0 ? scored[0].template : null;
    }

    /**
     * Check if catalog is loaded
     */
    isCatalogLoaded(): boolean {
        return this.catalogLoaded;
    }
}
