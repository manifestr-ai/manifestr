/**
 * Tier-Based Access Control Middleware
 * 
 * Use this to restrict endpoints to specific subscription tiers
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { supabaseAdmin } from '../lib/supabase';
import { getTierConfig } from '../lib/stripe';

/**
 * Require specific tier(s) to access endpoint
 * 
 * @example
 * router.post('/design-studio', authenticateToken, requireTier(['pro', 'elite']), handler);
 */
export const requireTier = (allowedTiers: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;

            // Get user's current tier
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('tier')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const currentTier = user.tier || 'backstage';

            // Check if user's tier is in allowed list
            if (!allowedTiers.includes(currentTier)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'This feature requires a higher subscription tier',
                    currentTier: currentTier,
                    requiredTiers: allowedTiers,
                    upgradeUrl: '/pricing'
                });
            }

            // User has access
            next();
        } catch (error) {
            console.error('❌ Error checking tier access:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to verify subscription access'
            });
        }
    };
};

/**
 * Check if user has sufficient wins for an operation
 * 
 * @example
 * router.post('/generate', authenticateToken, requireWins(50), handler);
 */
export const requireWins = (requiredWins: number) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;

            // Get user's wins balance
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('wins_balance, tier')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const currentBalance = user.wins_balance || 0;

            // Check if user has enough wins
            if (currentBalance < requiredWins) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Insufficient wins balance',
                    required: requiredWins,
                    current: currentBalance,
                    deficit: requiredWins - currentBalance,
                    upgradeUrl: '/pricing',
                    purchaseWinsUrl: '/wins/purchase'
                });
            }

            // User has enough wins
            next();
        } catch (error) {
            console.error('❌ Error checking wins balance:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to verify wins balance'
            });
        }
    };
};

/**
 * Check export limit for user's tier
 * 
 * @example
 * router.post('/export', authenticateToken, checkExportLimit, handler);
 */
export const checkExportLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get user's tier
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('tier')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const tierConfig = getTierConfig(user.tier);

        if (!tierConfig) {
            return res.status(500).json({
                status: 'error',
                message: 'Invalid tier configuration'
            });
        }

        // If unlimited, allow
        if (tierConfig.exportLimit === 'unlimited') {
            return next();
        }

        // Count exports this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count, error: countError } = await supabaseAdmin
            .from('exports')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', startOfMonth.toISOString());

        if (countError) {
            console.error('❌ Error counting exports:', countError);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to check export limit'
            });
        }

        const exportsUsed = count || 0;

        // Check if limit reached
        if (exportsUsed >= tierConfig.exportLimit) {
            return res.status(403).json({
                status: 'error',
                message: 'Monthly export limit reached',
                limit: tierConfig.exportLimit,
                used: exportsUsed,
                upgradeUrl: '/pricing',
                tier: user.tier
            });
        }

        // User has exports remaining
        next();
    } catch (error) {
        console.error('❌ Error checking export limit:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to verify export limit'
        });
    }
};

/**
 * Attach user's tier info to request for use in handlers
 * 
 * @example
 * router.get('/dashboard', authenticateToken, attachTierInfo, handler);
 * // In handler: req.tierInfo.tier, req.tierInfo.winsBalance, etc.
 */
export const attachTierInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('tier, wins_balance')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const tierConfig = getTierConfig(user.tier);

        // Attach tier info to request
        (req as any).tierInfo = {
            tier: user.tier,
            winsBalance: user.wins_balance,
            winsPerMonth: tierConfig?.winsPerMonth || 0,
            exportLimit: tierConfig?.exportLimit || 0,
            features: tierConfig?.features || [],
        };

        next();
    } catch (error) {
        console.error('❌ Error attaching tier info:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to load user subscription info'
        });
    }
};
