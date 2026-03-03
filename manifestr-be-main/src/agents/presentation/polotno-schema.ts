/**
 * Polotno Schema Extractor
 * Analyzes example Polotno JSONs and extracts complete structure
 * Loads once at startup, caches forever
 */

import * as fs from 'fs';
import * as path from 'path';

interface PolotnoSchema {
    rootDefaults: any;
    pageDefaults: any;
    imageDefaults: any;
    textDefaults: any;
    figureDefaults: any;
    examples: any[];
}

class PolotnoSchemaExtractor {
    private static instance: PolotnoSchema | null = null;
    private static examplesPath = path.join(__dirname, 'examples');

    /**
     * Load and analyze all example Polotno JSONs (runs once)
     */
    static loadSchema(): PolotnoSchema {
        if (this.instance) {
            return this.instance;
        }


        try {
            const files = fs.readdirSync(this.examplesPath)
                .filter(f => f.endsWith('.json'))
                .sort();


            const examples = files.map(file => {
                const filePath = path.join(this.examplesPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                return data;
            });

            // Extract root-level defaults from first example
            const firstExample = examples[0];

            // Extract component defaults
            const allPages = examples.flatMap(ex => ex.pages || []);
            const allComponents = allPages.flatMap(page => page.children || []);

            const imageExample = allComponents.find(c => c.type === 'image') || {};
            const textExample = allComponents.find(c => c.type === 'text') || {};
            const figureExample = allComponents.find(c => c.type === 'figure') || {};

            this.instance = {
                rootDefaults: {
                    width: firstExample.width || 1920,
                    height: firstExample.height || 1080,
                    dpi: firstExample.dpi || 72,
                    unit: firstExample.unit || 'px',
                    schemaVersion: firstExample.schemaVersion || 1,
                    fonts: firstExample.fonts || [],
                    audios: firstExample.audios || [],
                    custom: firstExample.custom || {}
                },
                pageDefaults: {
                    width: allPages[0]?.width || 1920,
                    height: allPages[0]?.height || 1080,
                    background: allPages[0]?.background || '#000',
                    bleed: allPages[0]?.bleed || 0,
                    duration: allPages[0]?.duration || 5000
                },
                imageDefaults: this.extractDefaults(imageExample, 'image'),
                textDefaults: this.extractDefaults(textExample, 'text'),
                figureDefaults: this.extractDefaults(figureExample, 'figure'),
                examples
            };


            return this.instance;

        } catch (error) {
            // Return minimal defaults if loading fails
            return this.getMinimalDefaults();
        }
    }

    /**
     * Extract all fields from an example component with their default values
     */
    private static extractDefaults(example: any, type: string): any {
        if (!example || !example.type) {
            return this.getMinimalComponentDefaults(type);
        }

        // Return complete object with all fields
        return {
            ...example,
            // Ensure critical fields have safe defaults
            id: example.id || 'element-id',
            type: type,
            name: example.name || `${type}-1`,
            opacity: example.opacity ?? 1,
            visible: example.visible ?? true,
            selectable: example.selectable ?? true,
            removable: example.removable ?? true,
            alwaysOnTop: example.alwaysOnTop ?? false,
            showInExport: example.showInExport ?? true,
            x: example.x ?? 0,
            y: example.y ?? 0,
            width: example.width ?? 100,
            height: example.height ?? 100,
            rotation: example.rotation ?? 0,
            animations: example.animations || [],
            draggable: example.draggable ?? true,
            resizable: example.resizable ?? true,
        };
    }

    /**
     * Minimal defaults if examples fail to load
     */
    private static getMinimalDefaults(): PolotnoSchema {
        return {
            rootDefaults: {
                width: 1920,
                height: 1080,
                dpi: 72,
                unit: 'px',
                schemaVersion: 1,
                fonts: [],
                audios: [],
                custom: {}
            },
            pageDefaults: {
                width: 1920,
                height: 1080,
                background: '#000',
                bleed: 0,
                duration: 5000
            },
            imageDefaults: this.getMinimalComponentDefaults('image'),
            textDefaults: this.getMinimalComponentDefaults('text'),
            figureDefaults: this.getMinimalComponentDefaults('figure'),
            examples: []
        };
    }

    /**
     * Minimal component defaults
     */
    private static getMinimalComponentDefaults(type: string): any {
        const base = {
            id: 'element-id',
            type: type,
            name: `${type}-1`,
            opacity: 1,
            visible: true,
            selectable: true,
            removable: true,
            alwaysOnTop: false,
            showInExport: true,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotation: 0,
            animations: [],
            draggable: true,
            resizable: true,
            contentEditable: true,
            styleEditable: true,
        };

        if (type === 'text') {
            return {
                ...base,
                text: '',
                fontSize: 32,
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fill: '#000000',
                align: 'left',
                verticalAlign: 'top',
                lineHeight: 1.2,
                letterSpacing: 0,
                textDecoration: '',
                textTransform: 'none',
                strokeWidth: 0,
                stroke: 'black'
            };
        } else if (type === 'image') {
            return {
                ...base,
                src: '',
                cropX: 0,
                cropY: 0,
                cropWidth: 1,
                cropHeight: 1,
                cornerRadius: 0,
                flipX: false,
                flipY: false,
                borderColor: 'black',
                borderSize: 0
            };
        } else if (type === 'figure') {
            return {
                ...base,
                subType: 'rect',
                fill: '#000000'
            };
        }

        return base;
    }

    /**
     * Get the cached schema
     */
    static getSchema(): PolotnoSchema {
        if (!this.instance) {
            return this.loadSchema();
        }
        return this.instance;
    }

    /**
     * Create a complete Polotno element with all required fields
     */
    static createCompleteElement(type: 'text' | 'image' | 'figure', overrides: any = {}): any {
        const schema = this.getSchema();
        let defaults;

        switch (type) {
            case 'text':
                defaults = schema.textDefaults;
                break;
            case 'image':
                defaults = schema.imageDefaults;
                break;
            case 'figure':
                defaults = schema.figureDefaults;
                break;
        }

        // Merge defaults with overrides
        return {
            ...defaults,
            ...overrides,
            // Ensure type is correct
            type: type
        };
    }
}

// Load schema at module import (runs once)
PolotnoSchemaExtractor.loadSchema();

export default PolotnoSchemaExtractor;
