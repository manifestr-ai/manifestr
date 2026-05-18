/**
 * ============================================
 * ADDON CONFIGURATION
 * ============================================
 * 
 * Centralized configuration for addon products:
 * - Wins top-up packs (Quick, Big, Major)
 * - Team member seats
 * 
 * Handles both TEST ($0) and PRODUCTION prices
 * ============================================
 */

export interface AddonConfig {
    id: string;
    name: string;
    description: string;
    type: 'wins' | 'team_member';
    wins?: number;
    seats?: number;
    priceTest: string;
    priceProd: string;
    displayPrice: string;
    mode: 'payment' | 'subscription';
}

/**
 * Get addon price ID based on environment
 */
export function getAddonPriceId(addonId: string, useTestPrices: boolean = true): string {
    const addon = ADDON_CONFIGS.find(a => a.id === addonId);
    if (!addon) {
        throw new Error(`Unknown addon ID: ${addonId}`);
    }
    return useTestPrices ? addon.priceTest : addon.priceProd;
}

/**
 * Get addon configuration by ID
 */
export function getAddonConfig(addonId: string): AddonConfig | undefined {
    return ADDON_CONFIGS.find(a => a.id === addonId);
}

/**
 * Validate addon ID
 */
export function isValidAddonId(addonId: string): boolean {
    return ADDON_CONFIGS.some(a => a.id === addonId);
}

/**
 * All available addons
 */
export const ADDON_CONFIGS: AddonConfig[] = [
    // ============================================
    // WINS TOP-UP PACKS
    // ============================================
    {
        id: 'wins_quick',
        name: 'Quick Win Pack',
        description: '25 AI Wins to power your MANIFESTR experience',
        type: 'wins',
        wins: 25,
        priceTest: process.env.STRIPE_ADDON_WINS_QUICK_TEST || '',
        priceProd: process.env.STRIPE_ADDON_WINS_QUICK_PROD || '',
        displayPrice: '$4.99',
        mode: 'payment', // One-time payment
    },
    {
        id: 'wins_big',
        name: 'Big Win Pack',
        description: '50 AI Wins to power your MANIFESTR experience',
        type: 'wins',
        wins: 50,
        priceTest: process.env.STRIPE_ADDON_WINS_BIG_TEST || '',
        priceProd: process.env.STRIPE_ADDON_WINS_BIG_PROD || '',
        displayPrice: '$5.99',
        mode: 'payment', // One-time payment
    },
    {
        id: 'wins_major',
        name: 'Major Win Pack',
        description: '100 AI Wins to power your MANIFESTR experience',
        type: 'wins',
        wins: 100,
        priceTest: process.env.STRIPE_ADDON_WINS_MAJOR_TEST || '',
        priceProd: process.env.STRIPE_ADDON_WINS_MAJOR_PROD || '',
        displayPrice: '$9.00',
        mode: 'payment', // One-time payment
    },
    
    // ============================================
    // TEAM MEMBER ADDON
    // ============================================
    {
        id: 'team_member',
        name: 'Additional Team Member',
        description: 'Add one extra team member seat to your workspace',
        type: 'team_member',
        seats: 1,
        priceTest: process.env.STRIPE_ADDON_TEAM_MEMBER_TEST || '',
        priceProd: process.env.STRIPE_ADDON_TEAM_MEMBER_PROD || '',
        displayPrice: '$12.00/month',
        mode: 'subscription', // Recurring payment
    },
];

/**
 * Addon types for TypeScript
 */
export type AddonId = 'wins_quick' | 'wins_big' | 'wins_major' | 'team_member';
export type AddonType = 'wins' | 'team_member';
