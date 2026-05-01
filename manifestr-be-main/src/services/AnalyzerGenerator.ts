import Anthropic from '@anthropic-ai/sdk';
import { AnalyzerTemplate } from './AnalyzerCatalogService';

export interface AnalyzerGenerationResult {
    templateId: string;
    templateName: string;
    chartType: string;
    data: any;
    config: any;
    title: string;
    description?: string;
}

export class AnalyzerGenerator {
    private claude: Anthropic;

    constructor() {
        this.claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
    }

    /**
     * Generate chart data based on template and prompt
     */
    async generateChartData(
        prompt: string,
        template: AnalyzerTemplate
    ): Promise<AnalyzerGenerationResult> {
        console.log(`\n📊 Generating analyzer chart: ${template.template_name}`);

        // Build AI prompt based on chart type
        const aiPrompt = this.buildGenerationPrompt(prompt, template);

        // Call Claude to generate the data
        const response = await this.claude.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            temperature: 0.7,
            messages: [{
                role: 'user',
                content: aiPrompt
            }]
        });

        // Extract JSON from response
        const content = response.content[0];
        const textContent = content.type === 'text' ? content.text : '';
        
        // Parse the JSON response
        let generatedData;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                             textContent.match(/```\n([\s\S]*?)\n```/) ||
                             [null, textContent];
            
            generatedData = JSON.parse(jsonMatch[1] || textContent);
        } catch (error) {
            console.error('❌ Failed to parse AI response:', error);
            console.error('Response:', textContent);
            throw new Error('Failed to parse chart data from AI response');
        }

        // Merge with template config
        const finalConfig = {
            ...template.config_template,
            ...generatedData.config
        };

        return {
            templateId: template.template_id,
            templateName: template.template_name,
            chartType: template.chart_type,
            data: generatedData.data,
            config: finalConfig,
            title: generatedData.title || template.template_name,
            description: generatedData.description
        };
    }

    /**
     * Build the AI generation prompt based on template
     */
    private buildGenerationPrompt(userPrompt: string, template: AnalyzerTemplate): string {
        const dataStructureStr = JSON.stringify(template.data_structure, null, 2);
        const configStr = JSON.stringify(template.config_template, null, 2);

        return `You are a data visualization expert. Generate realistic chart data based on the user's request.

USER REQUEST: "${userPrompt}"

CHART TYPE: ${template.chart_type}
TEMPLATE: ${template.template_name}
DESCRIPTION: ${template.description}

EXPECTED DATA STRUCTURE:
${dataStructureStr}

DEFAULT CONFIG:
${configStr}

INSTRUCTIONS:
1. Analyze the user's request and extract the context/domain (e.g., sales, marketing, project, finance)
2. Generate realistic, contextually appropriate data that matches the data structure
3. Create a clear, descriptive title for the chart
4. Optionally provide a brief description
5. You can customize the config if needed

RESPONSE FORMAT (JSON only, no markdown):
{
  "title": "Clear chart title",
  "description": "Optional brief description",
  "data": {
    // Match the expected data structure exactly
  },
  "config": {
    // Any config overrides (optional)
  }
}

EXAMPLES FOR ${template.chart_type}:

${this.getExampleForChartType(template.chart_type)}

Generate realistic data now:`;
    }

    /**
     * Get example data for specific chart type
     */
    private getExampleForChartType(chartType: string): string {
        const examples: Record<string, string> = {
            funnel: `{
  "title": "Sales Conversion Funnel Q1 2024",
  "description": "Quarterly sales pipeline conversion rates",
  "data": {
    "stages": ["Website Visitors", "Leads", "Qualified", "Proposals", "Closed"],
    "values": [10000, 2500, 800, 300, 150],
    "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FDCB6E"]
  }
}`,
            bar: `{
  "title": "Monthly Sales by Region",
  "data": {
    "categories": ["North", "South", "East", "West"],
    "values": [45000, 38000, 52000, 41000],
    "series": ["Q1 Sales"]
  }
}`,
            pie: `{
  "title": "Market Share Distribution",
  "data": {
    "labels": ["Company A", "Company B", "Company C", "Others"],
    "values": [35, 28, 22, 15],
    "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
  }
}`,
            line: `{
  "title": "Revenue Growth Trend",
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "datasets": [{
      "label": "Revenue",
      "data": [12000, 15000, 14500, 18000, 19500, 22000]
    }]
  }
}`,
            scatter: `{
  "title": "Sales vs Marketing Spend",
  "data": {
    "xAxis": [5000, 7500, 10000, 12500, 15000],
    "yAxis": [25000, 35000, 45000, 52000, 65000],
    "labels": ["Q1", "Q2", "Q3", "Q4", "Q5"]
  }
}`,
            gantt: `{
  "title": "Project Timeline Q2 2024",
  "data": {
    "tasks": [
      {"name": "Planning", "start": "2024-04-01", "end": "2024-04-15", "progress": 100},
      {"name": "Development", "start": "2024-04-15", "end": "2024-05-30", "progress": 60},
      {"name": "Testing", "start": "2024-05-20", "end": "2024-06-15", "progress": 30},
      {"name": "Launch", "start": "2024-06-10", "end": "2024-06-30", "progress": 0}
    ]
  }
}`,
            composite: `{
  "title": "Q1 2024 KPI Dashboard",
  "data": {
    "metrics": [
      {"name": "Revenue", "value": 125000, "target": 150000, "unit": "$"},
      {"name": "New Customers", "value": 247, "target": 250, "unit": ""},
      {"name": "Satisfaction", "value": 4.2, "target": 4.5, "unit": "/5"},
      {"name": "Growth Rate", "value": 23, "target": 25, "unit": "%"}
    ]
  }
}`
        };

        return examples[chartType] || examples['bar'];
    }

    /**
     * Generate sample data for testing (no AI call)
     */
    generateSampleData(template: AnalyzerTemplate): AnalyzerGenerationResult {
        const sampleData = this.getSampleDataForChartType(template.chart_type);

        return {
            templateId: template.template_id,
            templateName: template.template_name,
            chartType: template.chart_type,
            data: sampleData,
            config: template.config_template || {},
            title: `Sample ${template.template_name}`,
            description: 'Auto-generated sample data'
        };
    }

    /**
     * Get hardcoded sample data for chart type
     */
    private getSampleDataForChartType(chartType: string): any {
        const samples: Record<string, any> = {
            funnel: {
                stages: ["Awareness", "Interest", "Consideration", "Decision", "Purchase"],
                values: [1000, 750, 500, 300, 150],
                colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FDCB6E"]
            },
            bar: {
                categories: ["Product A", "Product B", "Product C", "Product D"],
                values: [45, 62, 38, 71],
                series: ["Sales"]
            },
            pie: {
                labels: ["Category A", "Category B", "Category C", "Category D"],
                values: [35, 28, 22, 15],
                colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
            },
            line: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{
                    label: "Metric",
                    data: [12, 19, 15, 25, 22, 30]
                }]
            }
        };

        return samples[chartType] || samples['bar'];
    }
}
