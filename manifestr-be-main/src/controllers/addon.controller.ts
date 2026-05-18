/**
 * ============================================
 * ADDON CONTROLLER
 * ============================================
 * 
 * Handles addon purchases:
 * - Wins top-up packs (one-time payments)
 * - Team member seats (recurring subscriptions)
 * 
 * Completely separate from main subscription flow
 * ============================================
 */

import { Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth.middleware';
import { BaseController } from './base.controller';
import { stripe } from '../lib/stripe';
import { supabaseAdmin } from '../lib/supabase';
import { getAddonConfig, isValidAddonId } from '../utils/addon-config';

// Frontend URL helper
const getFrontendUrl = () => {
    return process.env.FRONTEND_URL || 'http://localhost:3001';
};

export class AddonController extends BaseController {
    public basePath = '/api/addons';

    constructor() {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes() {
        this.routes = [
            {
                verb: 'POST',
                path: '/create-checkout-session',
                handler: this.createAddonCheckoutSession,
                middlewares: [authenticateToken],
            },
            {
                verb: 'GET',
                path: '/available',
                handler: this.getAvailableAddons,
                middlewares: [authenticateToken],
            },
            {
                verb: 'GET',
                path: '/purchase-history',
                handler: this.getPurchaseHistory,
                middlewares: [authenticateToken],
            },
            {
                verb: 'GET',
                path: '/process-success',
                handler: this.processSuccessfulPurchase,
                middlewares: [authenticateToken],
            },
        ];
    }

    /**
     * ============================================
     * CREATE ADDON CHECKOUT SESSION
     * ============================================
     * Separate endpoint for addon purchases
     */
    private createAddonCheckoutSession = async (req: AuthRequest, res: Response) => {
        try {
            const { addon_id } = req.body;
            const userId = req.user!.userId;

            // Validate addon ID
            if (!isValidAddonId(addon_id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid addon ID. Must be wins_quick, wins_big, wins_major, or team_member.'
                });
            }

            // Get addon configuration
            const addonConfig = getAddonConfig(addon_id);
            if (!addonConfig) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Addon configuration not found.'
                });
            }

            // Get user info
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id, email')
                .eq('id', userId)
                .single();

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found.'
                });
            }

            // Use TEST prices (all $0) for development
            const priceId = addonConfig.priceTest;

            console.log(`🎁 Creating addon checkout: ${addonConfig.name} for user ${userId}`);

            // Create checkout session config
            const sessionConfig: any = {
                mode: addonConfig.mode, // 'payment' for wins, 'subscription' for team_member
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    addon_id: addon_id,
                    addon_type: addonConfig.type,
                    user_id: userId,
                    wins_amount: addonConfig.wins?.toString() || '0',
                    seats_amount: addonConfig.seats?.toString() || '0',
                },
                success_url: `${getFrontendUrl()}/settings?tab=Plans&addon_success=true&type=${addon_id}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${getFrontendUrl()}/settings?tab=Plans&addon_canceled=true`,
                allow_promotion_codes: true,
            };

            // Add subscription metadata if it's a recurring addon
            if (addonConfig.mode === 'subscription') {
                sessionConfig.subscription_data = {
                    metadata: {
                        addon_id: addon_id,
                        user_id: userId,
                        seats_amount: addonConfig.seats?.toString() || '0',
                    },
                };
            }

            // Use existing customer if available
            if (user.stripe_customer_id) {
                sessionConfig.customer = user.stripe_customer_id;
            } else {
                // Pre-fill email
                sessionConfig.customer_email = user.email;
            }

            // Create Stripe checkout session
            const session = await stripe.checkout.sessions.create(sessionConfig);

            console.log(`✅ Addon checkout session created: ${session.id} - ${addonConfig.name}`);

            return res.json({
                status: 'success',
                data: {
                    sessionId: session.id,
                    url: session.url,
                    addon_id: addon_id,
                    addon_name: addonConfig.name,
                }
            });

        } catch (error) {
            console.error('❌ Error creating addon checkout session:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create addon checkout session',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * ============================================
     * GET AVAILABLE ADDONS
     * ============================================
     * Returns list of available addons for purchase
     */
    private getAvailableAddons = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user's current subscription to show relevant addons
            const { data: subscription } = await supabaseAdmin
                .from('subscriptions')
                .select('tier, extra_seats')
                .eq('user_id', userId)
                .single();

            // Return addon configs (without exposing Stripe price IDs)
            const addons = [
                {
                    id: 'wins_quick',
                    name: 'Quick Win Pack',
                    description: '25 AI Wins',
                    wins: 25,
                    price: '$4.99',
                    type: 'wins',
                },
                {
                    id: 'wins_big',
                    name: 'Big Win Pack',
                    description: '50 AI Wins',
                    wins: 50,
                    price: '$5.99',
                    type: 'wins',
                    badge: 'Popular'
                },
                {
                    id: 'wins_major',
                    name: 'Major Win Pack',
                    description: '100 AI Wins',
                    wins: 100,
                    price: '$9.00',
                    type: 'wins',
                    badge: 'Best Value'
                },
                {
                    id: 'team_member',
                    name: 'Additional Team Member',
                    description: 'Add 1 extra seat',
                    seats: 1,
                    price: '$12.00/month',
                    type: 'team_member',
                    current_extra_seats: subscription?.extra_seats || 0
                },
            ];

            return res.json({
                status: 'success',
                data: addons
            });

        } catch (error) {
            console.error('❌ Error getting available addons:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get available addons',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * ============================================
     * GET PURCHASE HISTORY
     * ============================================
     * Returns user's addon purchase history
     */
    private getPurchaseHistory = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get purchase history from database
            const { data: purchases, error } = await supabaseAdmin
                .from('addon_purchases')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return res.json({
                status: 'success',
                data: purchases || []
            });

        } catch (error) {
            console.error('❌ Error getting purchase history:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get purchase history',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * ============================================
     * PROCESS SUCCESSFUL PURCHASE
     * ============================================
     * Called when user returns from successful checkout
     * Retrieves session and processes payment manually
     */
    private processSuccessfulPurchase = async (req: AuthRequest, res: Response) => {
        try {
            const { session_id } = req.query;
            const userId = req.user!.userId;

            if (!session_id || typeof session_id !== 'string') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing session_id parameter'
                });
            }

            console.log(`🎁 Processing addon purchase for session: ${session_id}`);

            // Retrieve session from Stripe
            const session = await stripe.checkout.sessions.retrieve(session_id);

            if (!session) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Checkout session not found'
                });
            }

            // Verify this session belongs to the user
            if (session.metadata?.user_id !== userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Unauthorized access to session'
                });
            }

            // Check if payment was successful
            if (session.payment_status !== 'paid') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Payment not completed'
                });
            }

            const addonId = session.metadata?.addon_id;
            const addonType = session.metadata?.addon_type;
            const winsAmount = parseInt(session.metadata?.wins_amount || '0');
            const seatsAmount = parseInt(session.metadata?.seats_amount || '0');

            if (!addonId || !addonType) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid session metadata'
                });
            }

            console.log(`   User: ${userId}`);
            console.log(`   Addon: ${addonId} (${addonType})`);

            // Check if already processed
            const { data: existingPurchase } = await supabaseAdmin
                .from('addon_purchases')
                .select('id')
                .eq('user_id', userId)
                .eq('stripe_payment_id', session.payment_intent as string)
                .single();

            if (existingPurchase) {
                console.log(`✅ Purchase already processed: ${existingPurchase.id}`);
                return res.json({
                    status: 'success',
                    message: 'Purchase already processed',
                    data: { already_processed: true }
                });
            }

            // Record the purchase
            const { data: purchaseRecord, error: purchaseError } = await supabaseAdmin
                .from('addon_purchases')
                .insert({
                    user_id: userId,
                    addon_type: addonId,
                    addon_name: this.getAddonName(addonId),
                    stripe_payment_id: session.payment_intent as string,
                    stripe_customer_id: session.customer as string,
                    amount_paid: (session.amount_total || 0) / 100,
                    currency: 'usd',
                    wins_added: winsAmount,
                    seats_added: seatsAmount,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (purchaseError) {
                console.error('❌ Failed to record purchase:', purchaseError);
                throw purchaseError;
            }

            console.log(`✅ Purchase recorded: ${purchaseRecord.id}`);

            // Process based on addon type
            if (addonType === 'wins' && winsAmount > 0) {
                // ADD WINS
                const { data: userData } = await supabaseAdmin
                    .from('users')
                    .select('wins_balance')
                    .eq('id', userId)
                    .single();

                const currentWins = userData?.wins_balance || 0;
                const newWins = currentWins + winsAmount;

                const { error: updateError } = await supabaseAdmin
                    .from('users')
                    .update({ wins_balance: newWins })
                    .eq('id', userId);

                if (updateError) {
                    console.error('❌ Failed to update wins:', updateError);
                    throw updateError;
                }

                console.log(`✅ Added ${winsAmount} wins (${currentWins} → ${newWins})`);

            } else if (addonType === 'team_member' && seatsAmount > 0) {
                // ADD EXTRA SEATS
                const { data: subscription } = await supabaseAdmin
                    .from('subscriptions')
                    .select('extra_seats')
                    .eq('user_id', userId)
                    .single();

                const currentExtra = subscription?.extra_seats || 0;
                const newExtra = currentExtra + seatsAmount;

                const { error: updateError } = await supabaseAdmin
                    .from('subscriptions')
                    .update({ extra_seats: newExtra })
                    .eq('user_id', userId);

                if (updateError) {
                    console.error('❌ Failed to update seats:', updateError);
                    throw updateError;
                }

                console.log(`✅ Added ${seatsAmount} extra seat(s) (${currentExtra} → ${newExtra})`);
            }

            console.log(`🎉 Addon purchase processed successfully!`);

            return res.json({
                status: 'success',
                message: 'Purchase processed successfully',
                data: {
                    addon_id: addonId,
                    wins_added: winsAmount,
                    seats_added: seatsAmount
                }
            });

        } catch (error) {
            console.error('❌ Error processing purchase:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to process purchase',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    private getAddonName(addonId: string): string {
        const names: Record<string, string> = {
            wins_quick: 'Quick Win Pack',
            wins_big: 'Big Win Pack',
            wins_major: 'Major Win Pack',
            team_member: 'Additional Team Member'
        };
        return names[addonId] || addonId;
    }
}
