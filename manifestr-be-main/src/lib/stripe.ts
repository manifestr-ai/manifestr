import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('❌ STRIPE_SECRET_KEY is not set in environment variables');
}

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
});

// Pricing configuration
export const PRICING_TIERS = {
    backstage: {
        tier: 'backstage',
        displayName: 'Backstage Access',
        description: 'Free (Invite Only) - View-only access for collaborators',
        monthlyLaunchPrice: 0,
        monthlyStandardPrice: 0,
        annualLaunchPrice: 0,
        annualStandardPrice: 0,
        features: [
            'View-only access to shared Collabs',
            'Commenting enabled',
            'No creation access',
            'Export shared files individually',
            'Invitation-only onboarding'
        ],
        winsPerMonth: 0,
        exportLimit: 0,
        storageGB: 0,
        users: 1
    },
    starter: {
        tier: 'starter',
        displayName: 'Starter',
        description: 'For freelancers, creators, and independent operators',
        monthlyLaunchPrice: 2900, // $29.00
        monthlyStandardPrice: 4900, // $49.00
        annualLaunchPrice: 34800, // $348/year
        annualStandardPrice: 58800, // $588/year
        features: [
            '1 user included',
            'Access to core workflows (The Deck + The Briefcase)',
            '500 Wins/month',
            'Included exports, then flexible pay-per-export',
            'Shared Vault access',
            'Workflow automations included',
            'Help Center & Email support'
        ],
        winsPerMonth: 500,
        exportLimit: 10,
        storageGB: 5,
        users: 1
    },
    pro: {
        tier: 'pro',
        displayName: 'Pro',
        description: 'For consultants, strategists, marketers, and founders',
        monthlyLaunchPrice: 6900, // $69.00
        monthlyStandardPrice: 12900, // $129.00
        annualLaunchPrice: 82800, // $828/year
        annualStandardPrice: 154800, // $1548/year
        features: [
            'Everything in Starter',
            'Full access to all MANIFESTR tools',
            '2,000 Wins/month',
            'Increased storage',
            'Viewer logs & collaboration insights',
            'Up to 5 Brand Style Guides',
            'Custom branding templates',
            'Standard email/chat support',
            'Live Presentation Mode'
        ],
        winsPerMonth: 2000,
        exportLimit: 50,
        storageGB: 20,
        users: 1
    },
    elite: {
        tier: 'elite',
        displayName: 'Elite',
        description: 'For agencies, scaling teams, and power users',
        monthlyLaunchPrice: 9900, // $99.00
        monthlyStandardPrice: 29900, // $299.00
        annualLaunchPrice: 118800, // $1,188/year
        annualStandardPrice: 358800, // $3,588/year
        features: [
            'Everything in Pro',
            '5 users included (expandable)',
            'Multi-brand support',
            'Full multi-tool automations',
            'Unlimited exports',
            '7,500 Wins/month + rollover',
            'Expanded Vault storage',
            'Full engagement dashboards',
            'VIP onboarding & concierge support',
            'Advanced collaboration infrastructure'
        ],
        winsPerMonth: 7500,
        exportLimit: 'unlimited' as const,
        storageGB: 100,
        users: 5
    }
};

// Helper function to get Price ID based on tier, interval, and pricing type
export function getStripePriceId(
    tier: 'starter' | 'pro' | 'elite',
    interval: 'monthly' | 'annual',
    isLaunchPricing: boolean
): string {
    const pricingType = isLaunchPricing ? 'LAUNCH' : 'STANDARD';
    const intervalType = interval === 'monthly' ? 'MONTHLY' : 'ANNUAL';
    const envKey = `STRIPE_PRICE_${tier.toUpperCase()}_${intervalType}_${pricingType}`;
    
    const priceId = process.env[envKey];
    
    if (!priceId) {
        throw new Error(`Missing price ID for: ${envKey}`);
    }
    
    return priceId;
}

// Helper function to get tier configuration
export function getTierConfig(tier: string) {
    return PRICING_TIERS[tier as keyof typeof PRICING_TIERS] || null;
}

console.log('✅ Stripe initialized successfully');
