import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { stripe } from '../lib/stripe';
import { supabaseAdmin } from '../lib/supabase';
import { ADDON_CONFIGS, getAddonPriceId, AddonId } from '../utils/addon-config';

/**
 * ============================================
 * ADDON CONTROLLER
 * ============================================
 * Handles purchases of add-on products:
 * - Wins top-up packs (Quick, Big, Major)
 * - Additional team member seats
 */
export class AddonController extends BaseController {
    public basePath = '/api/addons';

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/create-checkout-session',
                handler: this.createCheckoutSession,
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
                handler: this.processSuccess,
                middlewares: [authenticateToken],
            },
        ];
    }

    /**
     * ============================================
     * CREATE ADDON CHECKOUT SESSION
     * ============================================
     * Creates a Stripe checkout session for addon purchases
     */
    private createCheckoutSession = async (req: AuthRequest, res: Response) => {
        try {
            const { addon_id } = req.body;
            const userId = req.user!.userId;

            // Validate addon_id
            const addon = ADDON_CONFIGS.find(a => a.id === addon_id);
            if (!addon) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid addon ID'
                });
            }

            // Get user from database
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id, email')
                .eq('id', userId)
                .single();

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Get price ID (use test prices for development)
            const isDevelopment = process.env.NODE_ENV !== 'production';
            const priceId = getAddonPriceId(addon_id, isDevelopment);

            // Create checkout session configuration
            const sessionConfig: any = {
                mode: addon.mode, // 'payment' for one-time, 'subscription' for recurring
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    addon_id: addon.id,
                    addon_type: addon.type,
                    user_id: userId,
                    wins_amount: addon.wins?.toString() || '0',
                    seats_amount: addon.seats?.toString() || '0',
                },
                // 🔒 HARDCODED PRODUCTION URL - DO NOT CHANGE
                success_url: `https://dashboard.manifestr.ai/settings?tab=Plans&addon_success=true&type=${addon.id}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `https://dashboard.manifestr.ai/settings?tab=Plans&canceled=true`,
            };

            // Use existing customer if available
            if (user.stripe_customer_id) {
                sessionConfig.customer = user.stripe_customer_id;
            } else {
                sessionConfig.customer_email = user.email;
            }

            // For subscription-based addons (team members), add subscription data
            if (addon.mode === 'subscription') {
                sessionConfig.subscription_data = {
                    metadata: {
                        addon_id: addon.id,
                        addon_type: addon.type,
                        user_id: userId,
                    },
                };
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);

            console.log(`🎁 Addon checkout session created: ${addon.name} [User: ${userId}]`);

            return res.json({
                status: 'success',
                data: {
                    sessionId: session.id,
                    url: session.url,
                    addon_id: addon.id,
                    addon_name: addon.name,
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
     * Returns list of purchasable addons
     */
    private getAvailableAddons = async (req: AuthRequest, res: Response) => {
        try {
            const addons = ADDON_CONFIGS.map(addon => ({
                id: addon.id,
                name: addon.name,
                description: addon.description,
                type: addon.type,
                displayPrice: addon.displayPrice,
                wins: addon.wins,
                seats: addon.seats,
            }));

            return res.json({
                status: 'success',
                data: { addons }
            });
        } catch (error) {
            console.error('❌ Error getting available addons:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get available addons'
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

            const { data: purchases, error } = await supabaseAdmin
                .from('addon_purchases')
                .select('*')
                .eq('user_id', userId)
                .order('purchased_at', { ascending: false });

            if (error) throw error;

            return res.json({
                status: 'success',
                data: { purchases: purchases || [] }
            });
        } catch (error) {
            console.error('❌ Error getting purchase history:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get purchase history'
            });
        }
    };

    /**
     * ============================================
     * PROCESS SUCCESS (MANUAL FALLBACK)
     * ============================================
     * Manually processes successful checkout when webhooks are unreliable
     * Used in development/testing when Stripe webhooks don't reach localhost
     */
    private processSuccess = async (req: AuthRequest, res: Response) => {
        try {
            const { session_id } = req.query;
            const userId = req.user!.userId;

            if (!session_id || typeof session_id !== 'string') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing session_id'
                });
            }

            console.log(`🔄 Manual processing of addon checkout: ${session_id}`);

            // Retrieve the session from Stripe
            const session = await stripe.checkout.sessions.retrieve(session_id);

            // Verify session belongs to this user
            if (session.metadata?.user_id !== userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Session does not belong to this user'
                });
            }

            // Check if payment was successful
            if (session.payment_status !== 'paid') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Payment not completed'
                });
            }

            // Check if already processed
            const { data: existingPurchase } = await supabaseAdmin
                .from('addon_purchases')
                .select('id')
                .eq('stripe_payment_id', session.payment_intent)
                .single();

            if (existingPurchase) {
                console.log('✅ Addon purchase already processed');
                return res.json({
                    status: 'success',
                    message: 'Already processed',
                    alreadyProcessed: true
                });
            }

            // Process the addon purchase
            const addonId = session.metadata?.addon_id;
            const addonType = session.metadata?.addon_type;
            const winsAmount = parseInt(session.metadata?.wins_amount || '0');
            const seatsAmount = parseInt(session.metadata?.seats_amount || '0');

            if (!addonId || !addonType) {
                throw new Error('Missing addon metadata in session');
            }

            // Record the purchase
            const { error: insertError } = await supabaseAdmin
                .from('addon_purchases')
                .insert({
                    user_id: userId,
                    addon_type: addonType,
                    addon_id: addonId,
                    wins_added: winsAmount,
                    seats_added: seatsAmount,
                    amount_cents: session.amount_total || 0,
                    currency: 'usd',
                    stripe_payment_id: session.payment_intent,
                    status: 'completed',
                });

            if (insertError) throw insertError;

            // Update user's wins balance if it's a wins addon
            if (addonType === 'wins' && winsAmount > 0) {
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

                if (updateError) throw updateError;

                console.log(`✅ Added ${winsAmount} wins (${currentWins} → ${newWins})`);
            }

            // Update extra seats if it's a team member addon
            if (addonType === 'team_member' && seatsAmount > 0) {
                const { data: subData } = await supabaseAdmin
                    .from('subscriptions')
                    .select('extra_seats')
                    .eq('user_id', userId)
                    .single();

                const currentExtraSeats = subData?.extra_seats || 0;
                const newExtraSeats = currentExtraSeats + seatsAmount;

                const { error: updateError } = await supabaseAdmin
                    .from('subscriptions')
                    .update({ extra_seats: newExtraSeats })
                    .eq('user_id', userId);

                if (updateError) throw updateError;

                console.log(`✅ Added ${seatsAmount} extra seat(s) (${currentExtraSeats} → ${newExtraSeats})`);
            }

            console.log(`🎉 Addon purchase processed successfully!`);

            return res.json({
                status: 'success',
                message: 'Addon purchase processed successfully',
                data: {
                    addon_id: addonId,
                    wins_added: winsAmount,
                    seats_added: seatsAmount,
                }
            });

        } catch (error) {
            console.error('❌ Error processing addon success:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to process addon purchase',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}
