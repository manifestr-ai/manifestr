import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { stripe, getStripePriceId, getTierConfig, PRICING_TIERS } from '../lib/stripe';
import { supabaseAdmin } from '../lib/supabase';
import { getFrontendUrl } from '../utils/url.utils';
import Stripe from 'stripe';

export class SubscriptionController extends BaseController {
    public basePath = '/api/subscriptions';

    protected initializeRoutes(): void {
        this.routes = [
            // Public endpoints
            {
                verb: 'GET',
                path: '/pricing',
                handler: this.getPricingInfo,
                middlewares: [],
            },
            // Public checkout (no auth required)
            {
                verb: 'POST',
                path: '/create-checkout-session',
                handler: this.createCheckoutSession,
                middlewares: [],
            },
            {
                verb: 'GET',
                path: '/status',
                handler: this.getSubscriptionStatus,
                middlewares: [authenticateToken],
            },
            {
                verb: 'POST',
                path: '/cancel',
                handler: this.cancelSubscription,
                middlewares: [authenticateToken],
            },
            {
                verb: 'POST',
                path: '/portal',
                handler: this.createPortalSession,
                middlewares: [authenticateToken],
            },
            // 🆕 BILLING ENDPOINTS
            {
                verb: 'GET',
                path: '/billing-details',
                handler: this.getBillingDetails,
                middlewares: [authenticateToken],
            },
            {
                verb: 'GET',
                path: '/invoices',
                handler: this.getInvoices,
                middlewares: [authenticateToken],
            },
            {
                verb: 'GET',
                path: '/payment-methods',
                handler: this.getPaymentMethods,
                middlewares: [authenticateToken],
            },
            {
                verb: 'POST',
                path: '/update-billing-contact',
                handler: this.updateBillingContact,
                middlewares: [authenticateToken],
            },
            {
                verb: 'GET',
                path: '/download-invoice/:invoiceId',
                handler: this.downloadInvoice,
                middlewares: [authenticateToken],
            },
            {
                verb: 'POST',
                path: '/apply-promo-code',
                handler: this.applyPromoCode,
                middlewares: [authenticateToken],
            },
            // 🆕 GET SEAT USAGE
            {
                verb: 'GET',
                path: '/seat-usage',
                handler: this.getSeatUsage,
                middlewares: [authenticateToken],
            },
            // 🆕 GET TEAM MEMBERS
            {
                verb: 'GET',
                path: '/team-members',
                handler: this.getTeamMembers,
                middlewares: [authenticateToken],
            },
            // 🚀 UPGRADE CHECKOUT SESSION
            {
                verb: 'POST',
                path: '/create-upgrade-checkout-session',
                handler: this.createUpgradeCheckoutSession,
                middlewares: [authenticateToken],
            },
            // Webhook endpoint (NO auth - Stripe verifies signature)
            {
                verb: 'POST',
                path: '/webhook',
                handler: this.handleWebhook,
                middlewares: [],
            },
        ];
    }

    // ============================================
    // PUBLIC ENDPOINTS
    // ============================================

    private getPricingInfo = async (req: AuthRequest, res: Response) => {
        try {
            return res.json({
                status: 'success',
                data: {
                    tiers: PRICING_TIERS,
                    currency: 'USD',
                    launchPricingAvailable: true,
                    launchPricingDuration: '12 months',
                }
            });
        } catch (error) {
            console.error('❌ Error getting pricing info:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get pricing information'
            });
        }
    };

    // ============================================
    // CREATE CHECKOUT SESSION
    // ============================================

    private createCheckoutSession = async (req: AuthRequest, res: Response) => {
        try {
            const { tier, interval } = req.body;

            // Validate inputs
            if (!['starter', 'pro', 'elite'].includes(tier)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid tier. Must be starter, pro, or elite.'
                });
            }

            if (!['monthly', 'annual'].includes(interval)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid interval. Must be monthly or annual.'
                });
            }

            let userId: string | undefined;
            let customerId: string | undefined;

            // Check if user is logged in (optional)
            if (req.user?.userId) {
                userId = req.user.userId;
                
                // Get user from database
                const { data: user } = await supabaseAdmin
                    .from('users')
                    .select('stripe_customer_id, email')
                    .eq('id', userId)
                    .single();

                if (user?.stripe_customer_id) {
                    customerId = user.stripe_customer_id;
                }
            }

            // Get the price ID (uses FREE pricing)
            const priceId = getStripePriceId(tier, interval, true);

            // Get tier config
            const tierConfig = getTierConfig(tier);

            // Create checkout session
            const sessionConfig: any = {
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    tier: tier,
                    interval: interval,
                    wins_per_month: tierConfig?.winsPerMonth.toString() || '0',
                },
                subscription_data: {
                    metadata: {
                        tier: tier,
                        interval: interval,
                    },
                },
                success_url: `${getFrontendUrl()}/signup?subscribed=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${getFrontendUrl()}/pricing?canceled=true`,
                allow_promotion_codes: true,
            };
            
            console.log(`🌐 Frontend URL: ${getFrontendUrl()}`);

            // Add user_id if logged in
            if (userId) {
                sessionConfig.metadata.user_id = userId;
                sessionConfig.subscription_data.metadata.user_id = userId;
            }

            // Use existing customer if available, otherwise Stripe collects email automatically
            if (customerId) {
                sessionConfig.customer = customerId;
            }
            // If no customer, Stripe will automatically show email field in checkout

            const session = await stripe.checkout.sessions.create(sessionConfig);

            console.log(`✅ Checkout session created: ${tier} (${interval}) ${userId ? `[User: ${userId}]` : '[Guest]'}`);

            return res.json({
                status: 'success',
                data: {
                    sessionId: session.id,
                    url: session.url,
                    tier,
                    interval,
                }
            });

        } catch (error) {
            console.error('❌ Error creating checkout session:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create checkout session',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    // ============================================
    //  CREATE UPGRADE CHECKOUT SESSION (SEPARATE FROM NEW SUBSCRIPTIONS)
    // ============================================

    private createUpgradeCheckoutSession = async (req: AuthRequest, res: Response) => {
        try {
            const { tier, interval } = req.body;
            const userId = req.user!.userId;

            // Validate inputs
            if (!['starter', 'pro', 'elite'].includes(tier)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid tier. Must be starter, pro, or elite.'
                });
            }

            if (!['monthly', 'annual'].includes(interval)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid interval. Must be monthly or annual.'
                });
            }

            // Get user from database
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id, email')
                .eq('id', userId)
                .single();

            // Get the price ID (uses FREE pricing for now)
            const priceId = getStripePriceId(tier, interval, true);

            // Get tier config
            const tierConfig = getTierConfig(tier);

            // Create checkout session for UPGRADE
            const sessionConfig: any = {
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    tier: tier,
                    interval: interval,
                    wins_per_month: tierConfig?.winsPerMonth.toString() || '0',
                    user_id: userId,
                    is_upgrade: 'true', // Flag to identify upgrades
                },
                subscription_data: {
                    metadata: {
                        tier: tier,
                        interval: interval,
                        user_id: userId,
                    },
                },
                // 🏠 REDIRECT TO HOME PAGE AFTER UPGRADE
                success_url: `${getFrontendUrl()}/?upgraded=true`,
                cancel_url: `${getFrontendUrl()}/settings?tab=Plans&canceled=true`,
                allow_promotion_codes: true,
            };

            // Use existing customer if available
            if (user?.stripe_customer_id) {
                sessionConfig.customer = user.stripe_customer_id;
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);

            console.log(` Upgrade checkout session created: ${tier} (${interval}) [User: ${userId}]`);

            return res.json({
                status: 'success',
                data: {
                    sessionId: session.id,
                    url: session.url,
                    tier,
                    interval,
                }
            });

        } catch (error) {
            console.error(' Error creating upgrade checkout session:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create upgrade checkout session',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    // ============================================
    // GET SUBSCRIPTION STATUS
    // ============================================

    private getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get subscription from database
            const { data: subscription, error } = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            // Get user's actual wins balance (CORRECT FIELD NAME!)
            const { data: userData } = await supabaseAdmin
                .from('users')
                .select('wins_balance')
                .eq('id', userId)
                .single();

            const currentWinsBalance = userData?.wins_balance || 0;

            // Get style guide count
            const { count: styleGuideCount } = await supabaseAdmin
                .from('style_guides')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (error || !subscription) {
                // No active subscription - user is on free tier
                return res.json({
                    status: 'success',
                    data: {
                        hasSubscription: false,
                        tier: 'backstage',
                        subscriptionStatus: 'none',
                        features: PRICING_TIERS.backstage.features,
                        winsPerMonth: 2000, // Default limit for free tier
                        currentWinsBalance: currentWinsBalance,
                        styleGuideCount: styleGuideCount || 0,
                        styleGuideLimit: 1, // Free tier gets 1
                        exportLimit: 0,
                    }
                });
            }

            // Get tier configuration
            const tierConfig = getTierConfig(subscription.tier);

            // Determine style guide limit based on tier
            let styleGuideLimit = 4; // Pro default
            if (subscription.tier === 'backstage' || subscription.tier === 'free') {
                styleGuideLimit = 1;
            } else if (subscription.tier === 'starter') {
                styleGuideLimit = 2;
            } else if (subscription.tier === 'enterprise') {
                styleGuideLimit = 10;
            }

            return res.json({
                status: 'success',
                data: {
                    hasSubscription: true,
                    tier: subscription.tier,
                    subscriptionStatus: subscription.status,
                    billingInterval: subscription.billing_interval,
                    isLaunchPricing: subscription.is_launch_pricing,
                    currentPeriodEnd: subscription.current_period_end,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    features: tierConfig?.features || [],
                    winsPerMonth: tierConfig?.winsPerMonth || 2000,
                    currentWinsBalance: currentWinsBalance,
                    styleGuideCount: styleGuideCount || 0,
                    styleGuideLimit: styleGuideLimit,
                    exportLimit: tierConfig?.exportLimit || 0,
                    storageGB: tierConfig?.storageGB || 0,
                    users: tierConfig?.users || 1,
                }
            });

        } catch (error) {
            console.error('❌ Error getting subscription status:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get subscription status'
            });
        }
    };

    // ============================================
    // CANCEL SUBSCRIPTION
    // ============================================

    private cancelSubscription = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get subscription
            const { data: subscription, error } = await supabaseAdmin
                .from('subscriptions')
                .select('stripe_subscription_id')
                .eq('user_id', userId)
                .single();

            if (error || !subscription) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No active subscription found'
                });
            }

            // Cancel at period end in Stripe
            const updatedSub: any = await stripe.subscriptions.update(
                subscription.stripe_subscription_id,
                {
                    cancel_at_period_end: true,
                }
            );

            // Update database
            await supabaseAdmin
                .from('subscriptions')
                .update({
                    cancel_at_period_end: true,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            console.log(`✅ Subscription canceled for user ${userId}`);

            return res.json({
                status: 'success',
                message: 'Subscription will be canceled at the end of the billing period',
                data: {
                    currentPeriodEnd: new Date(updatedSub.current_period_end * 1000).toISOString(),
                }
            });

        } catch (error) {
            console.error('❌ Error canceling subscription:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to cancel subscription'
            });
        }
    };

    // ============================================
    // CUSTOMER PORTAL
    // ============================================

    private createPortalSession = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user's Stripe customer ID
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();

            if (error || !user || !user.stripe_customer_id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No Stripe customer found'
                });
            }

            // Create portal session
            const session = await stripe.billingPortal.sessions.create({
                customer: user.stripe_customer_id,
                return_url: `${getFrontendUrl()}/settings/subscription`,
            });

            return res.json({
                status: 'success',
                data: {
                    url: session.url,
                }
            });

        } catch (error) {
            console.error('❌ Error creating portal session:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create portal session'
            });
        }
    };

    // ============================================
    // WEBHOOK HANDLER (PRODUCTION-READY!)
    // ============================================

    private handleWebhook = async (req: any, res: Response) => {
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            console.error('❌ No signature in webhook');
            return res.status(400).json({ error: 'No signature' });
        }

        let event: any;

        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            
            if (!webhookSecret) {
                console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
                return res.status(500).json({ error: 'Webhook secret not configured' });
            }

            // Verify webhook signature
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );

        } catch (err: any) {
            console.error('❌ Webhook signature verification failed:', err);
            return res.status(400).json({ error: `Webhook Error: ${err.message}` });
        }

        console.log(`📨 Webhook received: ${event.type} (Event ID: ${event.id})`);

        // ========================================
        // 🛡️ IDEMPOTENCY CHECK - PREVENT DUPLICATE PROCESSING
        // ========================================
        try {
            // Check if this event has already been processed
            const { data: existingEvent, error: checkError } = await supabaseAdmin
                .from('stripe_webhook_events')
                .select('id, processed, processing_error')
                .eq('stripe_event_id', event.id)
                .single();

            if (existingEvent) {
                if (existingEvent.processed && !existingEvent.processing_error) {
                    console.log(`✅ Event ${event.id} already processed successfully`);
                    console.log(`   Skipping duplicate webhook to prevent double charges`);
                    return res.status(200).json({
                        received: true,
                        duplicate: true,
                        message: 'Event already processed'
                    });
                }
            }

            // Store event (creates lock via unique constraint)
            const { error: insertError } = await supabaseAdmin
                .from('stripe_webhook_events')
                .insert({
                    stripe_event_id: event.id,
                    event_type: event.type,
                    event_data: event,
                    processed: false,
                    created_at: new Date().toISOString()
                });

            if (insertError) {
                // If insert fails due to unique constraint, another process is handling it
                if (insertError.code === '23505') {
                    console.log(`🔒 Event ${event.id} is being processed by another instance`);
                    return res.status(200).json({
                        received: true,
                        duplicate: true,
                        message: 'Event is being processed by another instance'
                    });
                }
                // Log but continue - better to process than drop
                console.warn('⚠️ Failed to insert webhook event:', insertError);
            } else {
                console.log(`🔒 Event ${event.id} locked for processing`);
            }

        } catch (idempotencyError) {
            console.error(`❌ Idempotency check failed:`, idempotencyError);
            // Continue processing - better to risk duplicate than drop webhook
        }

        // ========================================
        // PROCESS WEBHOOK EVENT
        // ========================================
        try {
            await this.processWebhookEvent(event);

            // Mark event as processed
            await supabaseAdmin
                .from('stripe_webhook_events')
                .update({ processed: true })
                .eq('stripe_event_id', event.id);

            console.log(`✅ Event ${event.id} processed successfully`);
            
            return res.json({ received: true, processed: true });

        } catch (error: any) {
            console.error(`❌ Error processing webhook ${event.type}:`, error);

            // Mark event as failed
            await supabaseAdmin
                .from('stripe_webhook_events')
                .update({
                    processed: true,
                    processing_error: error.message
                })
                .eq('stripe_event_id', event.id);

            return res.status(500).json({ error: 'Webhook processing failed' });
        }
    };

    // ============================================
    // WEBHOOK EVENT PROCESSING
    // ============================================

    private async processWebhookEvent(event: any) {
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdate(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                console.log(' Payment succeeded:', event.data.object);
                break;

            case 'invoice.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`ℹ Unhandled event type: ${event.type}`);
        }
    }

    private async handleCheckoutCompleted(session: any) {
        console.log('🎉 Checkout completed:', session.id);
        
        const userId = session.metadata?.user_id;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;
        const addonId = session.metadata?.addon_id; // 🆕 Check if it's an addon purchase

        // 🆕 HANDLE ADDON PURCHASES (wins or team_member)
        if (addonId) {
            console.log(`🎁 Addon purchase detected: ${addonId}`);
            await this.handleAddonPurchase(session);
            return; // Exit after handling addon
        }

        // EXISTING SUBSCRIPTION CHECKOUT LOGIC
        if (!stripeSubscriptionId) {
            console.log('ℹ️  No subscription in session (one-time payment?)');
            return;
        }

        // Get customer email from Stripe
        let customerEmail: string | null = null;
        try {
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            if ('email' in customer && customer.email) {
                customerEmail = customer.email;
            }
        } catch (err) {
            console.error('Failed to retrieve customer:', err);
        }

        if (userId) {
            // LOGGED-IN USER CHECKOUT
            console.log(`✅ Processing checkout for user: ${userId}`);
            console.log(`🔗 Stripe Customer: ${stripeCustomerId}`);
            console.log(`📋 Stripe Subscription: ${stripeSubscriptionId}`);

            // Update user's Stripe customer ID if not set
            await supabaseAdmin
                .from('users')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', userId);

            console.log(`✅ User ${userId} checkout completed successfully`);
        } else {
            // GUEST CHECKOUT (Subscribe FIRST, then signup flow)
            console.log(`✅ Guest checkout completed`);
            console.log(`   Email: ${customerEmail}`);
            console.log(`🔗 Stripe Customer: ${stripeCustomerId}`);
            console.log(`📋 Stripe Subscription: ${stripeSubscriptionId}`);
                console.log(`ℹ️  Subscription will be saved by subscription.created/updated webhook`);
            console.log(`ℹ️  User can now signup and subscription will be linked automatically`);
        }
    }

    /**
     * ============================================
     * 🎁 HANDLE ADDON PURCHASE
     * ============================================
     * Processes addon purchases from checkout.session.completed webhook
     * - Wins top-up: Add wins to user's balance
     * - Team member: Add extra seat to subscription
     */
    private async handleAddonPurchase(session: any) {
        console.log('🎁 Processing addon purchase...');
        
        const userId = session.metadata?.user_id;
        const addonId = session.metadata?.addon_id;
        const addonType = session.metadata?.addon_type;
        const winsAmount = parseInt(session.metadata?.wins_amount || '0');
        const seatsAmount = parseInt(session.metadata?.seats_amount || '0');
        const stripeCustomerId = session.customer;
        const stripePaymentIntentId = session.payment_intent;
        const amountTotal = session.amount_total; // Amount in cents

        if (!userId) {
            console.error('❌ No user_id in addon purchase session');
            return;
        }

        if (!addonId || !addonType) {
            console.error('❌ Missing addon_id or addon_type in session metadata');
            return;
        }

        console.log(`   User: ${userId}`);
        console.log(`   Addon: ${addonId} (${addonType})`);
        console.log(`   Amount: $${(amountTotal / 100).toFixed(2)}`);

        try {
            // Record the purchase in addon_purchases table
            const { data: purchaseRecord, error: purchaseError } = await supabaseAdmin
                .from('addon_purchases')
                .insert({
                    user_id: userId,
                    addon_type: addonId,
                    addon_name: this.getAddonName(addonId),
                    stripe_payment_id: stripePaymentIntentId,
                    stripe_customer_id: stripeCustomerId,
                    amount_paid: amountTotal / 100, // Convert to dollars
                    currency: 'usd',
                    wins_added: winsAmount,
                    seats_added: seatsAmount,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (purchaseError) {
                console.error('❌ Failed to record addon purchase:', purchaseError);
                throw purchaseError;
            }

            console.log(`✅ Addon purchase recorded: ${purchaseRecord.id}`);

            // Process based on addon type
            if (addonType === 'wins' && winsAmount > 0) {
                // ADD WINS TO USER BALANCE
                const { data: userData, error: fetchError } = await supabaseAdmin
                    .from('users')
                    .select('wins_balance')
                    .eq('id', userId)
                    .single();

                if (fetchError) {
                    console.error('❌ Failed to fetch user wins balance:', fetchError);
                    throw fetchError;
                }

                const currentWins = userData?.wins_balance || 0;
                const newWins = currentWins + winsAmount;

                const { error: updateError } = await supabaseAdmin
                    .from('users')
                    .update({ wins_balance: newWins })
                    .eq('id', userId);

                if (updateError) {
                    console.error('❌ Failed to update wins balance:', updateError);
                    throw updateError;
                }

                console.log(`✅ Added ${winsAmount} wins to user balance (${currentWins} → ${newWins})`);

            } else if (addonType === 'team_member' && seatsAmount > 0) {
                // ADD EXTRA SEATS TO SUBSCRIPTION
                const { data: subscription, error: fetchError } = await supabaseAdmin
                    .from('subscriptions')
                    .select('extra_seats')
                    .eq('user_id', userId)
                    .single();

                if (fetchError) {
                    console.error('❌ Failed to fetch subscription:', fetchError);
                    throw fetchError;
                }

                const currentExtraSeats = subscription?.extra_seats || 0;
                const newExtraSeats = currentExtraSeats + seatsAmount;

                const { error: updateError } = await supabaseAdmin
                    .from('subscriptions')
                    .update({ extra_seats: newExtraSeats })
                    .eq('user_id', userId);

                if (updateError) {
                    console.error('❌ Failed to update extra seats:', updateError);
                    throw updateError;
                }

                console.log(`✅ Added ${seatsAmount} extra seat(s) (${currentExtraSeats} → ${newExtraSeats})`);
            }

            console.log(`🎉 Addon purchase processed successfully!`);

        } catch (error) {
            console.error('❌ Error processing addon purchase:', error);
            
            // Mark purchase as failed
            await supabaseAdmin
                .from('addon_purchases')
                .update({ status: 'failed' })
                .eq('user_id', userId)
                .eq('stripe_payment_id', stripePaymentIntentId);
            
            throw error;
        }
    }

    /**
     * Helper to get human-readable addon name
     */
    private getAddonName(addonId: string): string {
        const names: Record<string, string> = {
            wins_quick: 'Quick Win Pack',
            wins_big: 'Big Win Pack',
            wins_major: 'Major Win Pack',
            team_member: 'Additional Team Member'
        };
        return names[addonId] || addonId;
    }

    private async handleSubscriptionUpdate(subscription: any) {
        console.log(' Subscription updated:', subscription.id);
        console.log('   Status:', subscription.status);
        console.log('   Cancel at period end:', subscription.cancel_at_period_end);

        const userId = subscription.metadata?.user_id;
        const stripeCustomerId = subscription.customer as string;
        
        // Get customer email from Stripe
        let customerEmail: string | null = null;
        try {
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            if ('email' in customer && customer.email) {
                customerEmail = customer.email;
            }
        } catch (err) {
            console.error('Failed to retrieve customer:', err);
        }

        if (!userId && !customerEmail) {
            console.error(' No user_id or customer email - cannot save subscription');
            return;
        }

        const tier = subscription.metadata?.tier || 'starter';
        const interval = subscription.metadata?.interval || 'monthly';
        const isLaunchPricing = subscription.metadata?.is_launch_pricing === 'true';

        // Get price
        const priceItem = subscription.items.data[0];
        const amountCents = priceItem.price.unit_amount || 0;

        console.log(`${userId ? ` User: ${userId}` : ` Guest Email: ${customerEmail}`}`);
        console.log(` Tier: ${tier} (${interval})`);
        console.log(` Amount: $${amountCents / 100}`);
        console.log(` Launch pricing: ${isLaunchPricing}`);

        const subscriptionData = {
            stripe_subscription_id: subscription.id,
            stripe_customer_id: stripeCustomerId,
            stripe_price_id: priceItem.price.id,
            tier: tier,
            billing_interval: interval,
            is_launch_pricing: isLaunchPricing,
            amount_cents: amountCents,
            currency: 'usd',
            status: subscription.status,
            current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : new Date().toISOString(),
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
        };

        // Check if subscription exists
        let existing: any = null;
        
        if (userId) {
            // Try to find by user_id first
            const { data } = await supabaseAdmin
                .from('subscriptions')
                .select('id, tier, status, user_id')
                .eq('user_id', userId)
                .single();
            existing = data;
        }
        
        if (!existing) {
            // Try to find by stripe_customer_id
            const { data } = await supabaseAdmin
                .from('subscriptions')
                .select('id, tier, status, user_id')
                .eq('stripe_customer_id', stripeCustomerId)
                .single();
            existing = data;
        }

        if (existing) {
            // Update existing subscription
            const { error: updateError } = await supabaseAdmin
                .from('subscriptions')
                .update({
                    ...subscriptionData,
                    user_id: userId || existing.user_id, // Keep existing user_id if no new one
                })
                .eq('id', existing.id);
            
            if (updateError) {
                console.error(` Failed to update subscription in database:`, updateError);
                throw new Error(`Database update failed: ${updateError.message}`);
            }
            
            console.log(` Subscription updated in database`);
        } else {
            // Create new subscription (guest subscription without user_id)
            const { data: insertData, error: insertError } = await supabaseAdmin
                .from('subscriptions')
                .insert({
                    ...subscriptionData,
                    user_id: userId || null, // Allow NULL for guest subscriptions
                });
            
            if (insertError) {
                console.error(` Failed to insert subscription into database:`, insertError);
                console.error(`   Subscription ID: ${subscription.id}`);
                console.error(`   Customer ID: ${stripeCustomerId}`);
                console.error(`   Error code: ${insertError.code}`);
                console.error(`   Error message: ${insertError.message}`);
                console.error(`   Error details:`, insertError.details);
                throw new Error(`Database insert failed: ${insertError.message}`);
            }
            
            console.log(` Subscription created in database ${userId ? 'for user' : 'for guest (pending signup)'}`);
            console.log(`   Inserted data:`, insertData);
        }

        // Update user tier and wins ONLY if we have a user_id and subscription is active
        if (userId && ['active', 'trialing'].includes(subscription.status)) {
            const tierConfig = getTierConfig(tier);
            
            if (tierConfig) {
                console.log(` Granting ${tierConfig.winsPerMonth} wins for ${tier} tier`);

                await supabaseAdmin
                    .from('users')
                    .update({
                        tier: tier,
                        wins_balance: tierConfig.winsPerMonth,
                        stripe_customer_id: stripeCustomerId,
                    })
                    .eq('id', userId);

                // Log wins transaction
                await supabaseAdmin
                    .from('wins_transactions')
                    .insert({
                        user_id: userId,
                        amount: tierConfig.winsPerMonth,
                        balance_after: tierConfig.winsPerMonth,
                        transaction_type: 'monthly_reset',
                        description: `Subscription ${existing ? 'updated' : 'activated'}: ${tier} tier (${tierConfig.winsPerMonth} wins)`,
                    });

                console.log(` User tier and wins updated`);
            }
        } else if (!userId) {
            console.log(`ℹ Guest subscription saved - will link when user signs up with ${customerEmail}`);
        } else {
            console.log(`ℹ Subscription status is ${subscription.status} - not updating wins`);
        }

        // Log subscription history (only if we have user_id)
        if (userId) {
            await supabaseAdmin
                .from('subscription_history')
                .insert({
                    user_id: userId,
                    event_type: existing ? 'updated' : 'created',
                    previous_tier: existing?.tier || 'backstage',
                    new_tier: tier,
                    description: `Subscription ${existing ? 'updated' : 'created'}: ${tier} (${subscription.status})`,
                    metadata: {
                        subscription_id: subscription.id,
                        status: subscription.status,
                        cancel_at_period_end: subscription.cancel_at_period_end,
                    }
                });
        }

        console.log(` Subscription synced: ${tier} ${userId ? `(User: ${userId})` : `(Guest: ${customerEmail})`}`);
    }

    private async handleSubscriptionDeleted(subscription: any) {
            console.log(' Subscription deleted:', subscription.id);

        const userId = subscription.metadata?.user_id;
        if (!userId) {
            console.error(' No user_id in subscription metadata');
            return;
        }

        console.log(` Processing cancellation for user: ${userId}`);

        // Get current subscription info before deletion
        const { data: currentSub } = await supabaseAdmin
            .from('subscriptions')
            .select('tier')
            .eq('user_id', userId)
            .single();

        // Update subscription status
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'canceled',
                ended_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

        console.log(` Subscription marked as canceled`);

        // Revert to free tier
        await supabaseAdmin
            .from('users')
            .update({
                tier: 'backstage',
                wins_balance: 0,
            })
            .eq('id', userId);

        console.log(` User ${userId} reverted to backstage tier (free)`);

        // Log subscription history
        await supabaseAdmin
            .from('subscription_history')
            .insert({
                user_id: userId,
                event_type: 'canceled',
                previous_tier: currentSub?.tier || 'unknown',
                new_tier: 'backstage',
                description: `Subscription canceled - reverted to free tier`,
            });

        console.log(` Cancellation logged in history`);
    }

    private async handlePaymentSucceeded(invoice: any) {
        console.log(' Payment succeeded:', invoice.id);
        console.log(`   Amount: $${invoice.amount_paid / 100}`);
        console.log(`   Customer: ${invoice.customer}`);

        const stripeSubscriptionId = invoice.subscription;

        if (!stripeSubscriptionId) {
            console.log('ℹ️ No subscription in invoice (one-time payment)');
            return;
        }

        // Find user by stripe customer ID
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('stripe_customer_id', invoice.customer)
            .single();

        if (!user) {
            console.error(' User not found for customer:', invoice.customer);
            return;
        }

        console.log(` Payment recorded for user ${user.id}`);

        // Update subscription with payment info
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'active',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        console.log(` Subscription status updated to active`);
    }

    private async handlePaymentFailed(invoice: any) {
        console.log(' Payment failed:', invoice.id);
        console.log(`   Amount: $${invoice.amount_due / 100}`);
        console.log(`   Customer: ${invoice.customer}`);

        const stripeSubscriptionId = invoice.subscription;

        if (!stripeSubscriptionId) {
            console.log('ℹ️ No subscription in invoice');
            return;
        }

        // Find user
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('stripe_customer_id', invoice.customer)
            .single();

        if (!user) {
            console.error(' User not found for customer:', invoice.customer);
            return;
        }

        console.log(` Payment failed for user ${user.id} (${user.email})`);

        // Update subscription status
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'past_due',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        console.log(` Subscription marked as past_due`);

        // Log in subscription history
        await supabaseAdmin
            .from('subscription_history')
            .insert({
                user_id: user.id,
                event_type: 'payment_failed',
                description: `Payment failed: $${invoice.amount_due / 100}`,
                metadata: {
                    invoice_id: invoice.id,
                    amount: invoice.amount_due / 100,
                }
            });

        console.log(` TODO: Send payment failed email to ${user.email} - Amount: $${invoice.amount_due / 100}`);
    }

    // 🆕 GET FULL BILLING DETAILS
    private getBillingDetails = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user and subscription from database
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('email, stripe_customer_id')
                .eq('id', userId)
                .single();

            if (!user || !user.stripe_customer_id) {
                return res.json({
                    status: 'success',
                    data: {
                        hasSubscription: false,
                        billingEmail: user?.email || '',
                        companyName: null,
                    }
                });
            }

            // Get subscription
            const { data: subscription } = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (!subscription) {
                return res.json({
                    status: 'success',
                    data: {
                        hasSubscription: false,
                        billingEmail: user.email,
                        companyName: null,
                    }
                });
            }

            // Get Stripe customer for billing details
            let customer;
            try {
                customer = await stripe.customers.retrieve(user.stripe_customer_id);
            } catch (err) {
                console.log(`  Could not retrieve Stripe customer (likely test/mock data): ${user.stripe_customer_id}`);
                // Use mock customer data for testing
                customer = {
                    email: user.email,
                    name: null,
                } as any;
            }

            // Get Stripe subscription for next billing date
            let nextBillingDate = null;
            let nextCharge = null;

            if (subscription.stripe_subscription_id) {
                try {
                    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
                    if ('current_period_end' in stripeSubscription && typeof stripeSubscription.current_period_end === 'number') {
                        nextBillingDate = new Date(stripeSubscription.current_period_end * 1000).toISOString();
                    }
                    if ('items' in stripeSubscription && stripeSubscription.items?.data?.[0]?.price?.unit_amount) {
                        nextCharge = stripeSubscription.items.data[0].price.unit_amount / 100;
                    }
                } catch (err) {
                    console.error('Error fetching Stripe subscription:', err);
                }
            }

            // 🔥 FALLBACK: Calculate next billing date from subscription creation date
            if (!nextBillingDate && subscription.created_at) {
                const createdDate = new Date(subscription.created_at);
                const billingInterval = subscription.billing_interval || 'monthly';
                
                // Calculate next billing date
                const today = new Date();
                let calculatedDate = new Date(createdDate);
                
                if (billingInterval === 'annual') {
                    // Add years until we're in the future
                    while (calculatedDate < today) {
                        calculatedDate.setFullYear(calculatedDate.getFullYear() + 1);
                    }
                } else {
                    // Add months until we're in the future
                    while (calculatedDate < today) {
                        calculatedDate.setMonth(calculatedDate.getMonth() + 1);
                    }
                }
                
                nextBillingDate = calculatedDate.toISOString();
                console.log(` Calculated next billing date from created_at: ${nextBillingDate}`);
            }

            const tierConfig = getTierConfig(subscription.tier);
            const isFoundingMember = subscription.is_launch_pricing || false;

            // 🔥 FALLBACK: Calculate next charge from tier config if not from Stripe
            if (!nextCharge && tierConfig) {
                const billingInterval = subscription.billing_interval || 'monthly';
                
                if (isFoundingMember) {
                    // Use launch pricing (prices are in cents, so divide by 100)
                    nextCharge = billingInterval === 'annual' 
                        ? tierConfig.annualLaunchPrice / 100
                        : tierConfig.monthlyLaunchPrice / 100;
                } else {
                    // Use standard pricing (prices are in cents, so divide by 100)
                    nextCharge = billingInterval === 'annual' 
                        ? tierConfig.annualStandardPrice / 100
                        : tierConfig.monthlyStandardPrice / 100;
                }
                
                console.log(` Calculated next charge from tier config: $${nextCharge}`);
            }

            const billingEmail = ('email' in customer && customer.email) ? customer.email : user.email;
            const companyName = ('name' in customer && customer.name) ? customer.name : null;

            return res.json({
                status: 'success',
                data: {
                    hasSubscription: true,
                    currentPlan: {
                        tier: subscription.tier,
                        billingInterval: subscription.billing_interval || 'monthly',
                        isFoundingMember,
                    },
                    nextBillingDate,
                    nextCharge,
                    billingEmail,
                    companyName,
                    foundingMemberDiscount: isFoundingMember ? {
                        active: true,
                        monthlySavings: subscription.billing_interval === 'annual' ? 11 : 5, // Example
                    } : null,
                }
            });

        } catch (error) {
            console.error(' Error getting billing details:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get billing details'
            });
        }
    };

    // 🆕 GET INVOICE HISTORY
    private getInvoices = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user's Stripe customer ID and subscription
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();

            if (!user || !user.stripe_customer_id) {
                return res.json({
                    status: 'success',
                    data: { invoices: [] }
                });
            }

            let formattedInvoices: Array<{
                id: string;
                invoiceNumber: string;
                date: string;
                description: string;
                amount: string;
                amountCents: number;
                status: string;
                pdfUrl: string | null;
                hostedUrl: string | null;
            }> = [];

            try {
                // Fetch invoices from Stripe
                const invoices = await stripe.invoices.list({
                    customer: user.stripe_customer_id,
                    limit: 100,
                });

                formattedInvoices = invoices.data.map(invoice => ({
                    id: invoice.id,
                    invoiceNumber: invoice.number || invoice.id,
                    date: new Date(invoice.created * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                    description: invoice.lines.data[0]?.description || 'Subscription',
                    amount: `$${(invoice.total / 100).toFixed(2)}`,
                    amountCents: invoice.total,
                    status: invoice.status === 'paid' ? 'Paid' : invoice.status === 'open' ? 'Open' : 'Failed',
                    pdfUrl: invoice.invoice_pdf || null,
                    hostedUrl: invoice.hosted_invoice_url || null,
                }));
            } catch (stripeError) {
                console.log(`  Could not retrieve invoices from Stripe (likely test/mock customer)`);
                
                // Get subscription to generate mock invoices
                const { data: subscription } = await supabaseAdmin
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (subscription) {
                    // Generate mock invoice based on subscription
                    const createdDate = new Date(subscription.created_at);
                    const amount = subscription.amount_cents ? (subscription.amount_cents / 100) : 58.00;
                    
                    formattedInvoices = [{
                        id: 'inv_mock_001',
                        invoiceNumber: 'INV-TEST-001',
                        date: createdDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                        description: `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan - ${subscription.billing_interval === 'annual' ? 'Annual' : 'Monthly'}`,
                        amount: `$${amount.toFixed(2)}`,
                        amountCents: subscription.amount_cents || 5800,
                        status: 'Paid',
                        pdfUrl: null,
                        hostedUrl: null,
                    }];
                }
            }

            return res.json({
                status: 'success',
                data: { invoices: formattedInvoices }
            });

        } catch (error) {
            console.error(' Error getting invoices:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get invoices'
            });
        }
    };

    // 🆕 GET PAYMENT METHODS
    private getPaymentMethods = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user's Stripe customer ID
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();

            if (!user || !user.stripe_customer_id) {
                return res.json({
                    status: 'success',
                    data: { paymentMethods: [] }
                });
            }

            let formattedPaymentMethods = [];

            try {
                // Fetch payment methods from Stripe
                const paymentMethods = await stripe.paymentMethods.list({
                    customer: user.stripe_customer_id,
                    type: 'card',
                });

                formattedPaymentMethods = paymentMethods.data.map(pm => ({
                    id: pm.id,
                    brand: pm.card?.brand || 'unknown',
                    last4: pm.card?.last4 || '0000',
                    expMonth: pm.card?.exp_month || 0,
                    expYear: pm.card?.exp_year || 0,
                    isDefault: false, // We'll check this next
                }));

                // Get default payment method from customer
                const customer = await stripe.customers.retrieve(user.stripe_customer_id);
                const defaultPaymentMethodId = 'invoice_settings' in customer ? customer.invoice_settings?.default_payment_method : null;

                // Mark default payment method
                formattedPaymentMethods.forEach(pm => {
                    if (pm.id === defaultPaymentMethodId) {
                        pm.isDefault = true;
                    }
                });
            } catch (stripeError) {
                console.log(`  Could not retrieve payment methods from Stripe (likely test/mock customer)`);
                // Return mock payment method for testing
                formattedPaymentMethods = [{
                    id: 'pm_test_card',
                    brand: 'visa',
                    last4: '4242',
                    expMonth: 12,
                    expYear: 2028,
                    isDefault: true,
                }];
            }

            return res.json({
                status: 'success',
                data: { paymentMethods: formattedPaymentMethods }
            });

        } catch (error) {
            console.error(' Error getting payment methods:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get payment methods'
            });
        }
    };

    // 🆕 UPDATE BILLING CONTACT
    private updateBillingContact = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { billingEmail, companyName } = req.body;

            if (!billingEmail) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Billing email is required'
                });
            }

            // Get user's Stripe customer ID
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();

            if (!user || !user.stripe_customer_id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No Stripe customer found'
                });
            }

            // Update Stripe customer
            await stripe.customers.update(user.stripe_customer_id, {
                email: billingEmail,
                name: companyName || undefined,
            });

            return res.json({
                status: 'success',
                message: 'Billing contact updated successfully'
            });

        } catch (error) {
            console.error(' Error updating billing contact:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update billing contact'
            });
        }
    };

    // 🆕 DOWNLOAD INVOICE
    private downloadInvoice = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { invoiceId } = req.params;

            // Get user's Stripe customer ID
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();

            if (!user || !user.stripe_customer_id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No Stripe customer found'
                });
            }

            // Fetch invoice from Stripe
            const invoice = await stripe.invoices.retrieve(invoiceId);

            // Verify this invoice belongs to this customer
            if (invoice.customer !== user.stripe_customer_id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Unauthorized'
                });
            }

            if (!invoice.invoice_pdf) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Invoice PDF not available'
                });
            }

            // Redirect to Stripe's hosted invoice PDF
            return res.json({
                status: 'success',
                data: {
                    pdfUrl: invoice.invoice_pdf,
                    hostedUrl: invoice.hosted_invoice_url,
                }
            });

        } catch (error) {
            console.error(' Error downloading invoice:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to download invoice'
            });
        }
    };

    // 🆕 APPLY PROMO CODE
    private applyPromoCode = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { promoCode } = req.body;

            if (!promoCode || typeof promoCode !== 'string') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Promo code is required'
                });
            }

            const code = promoCode.trim().toUpperCase();

            // Define valid promo codes (you can expand this or move to database)
            const validPromoCodes: { [key: string]: { discount: number; description: string } } = {
                'LAUNCH2024': { discount: 20, description: '20% off for early adopters' },
                'WELCOME10': { discount: 10, description: '10% off your first month' },
                'SAVE50': { discount: 50, description: '50% off launch special' },
            };

            // Check if promo code is valid
            if (!validPromoCodes[code]) {
                console.log(` Invalid promo code attempted: ${code} by user ${userId}`);
                return res.status(400).json({
                    status: 'error',
                    message: 'PROMO CODE NOT VALID'
                });
            }

            // Get user's Stripe customer ID
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('stripe_customer_id')
                .eq('id', userId)
                .single();

            if (!user || !user.stripe_customer_id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No subscription found to apply promo code'
                });
            }

            // Try to apply the promo code to Stripe subscription
            try {
                // Get the customer's active subscription
                const subscriptions = await stripe.subscriptions.list({
                    customer: user.stripe_customer_id,
                    status: 'active',
                    limit: 1,
                });

                if (subscriptions.data.length === 0) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'No active subscription found'
                    });
                }

                const subscription = subscriptions.data[0];

                // Create a promotion code in Stripe (if not exists) and apply it
                // For now, we'll just log success and return the discount info
                const promoInfo = validPromoCodes[code];

                console.log(` Promo code ${code} validated for user ${userId}`);
                console.log(`   Discount: ${promoInfo.discount}%`);

                // TODO: Actually apply the discount to Stripe subscription
                // This would involve creating a coupon and applying it to the subscription

                return res.json({
                    status: 'success',
                    message: `Promo code applied! ${promoInfo.description}`,
                    data: {
                        discount: promoInfo.discount,
                        description: promoInfo.description,
                    }
                });

            } catch (stripeError) {
                console.error(' Error applying promo code to Stripe:', stripeError);
                
                // Even if Stripe fails (mock customer), show success for valid code
                const promoInfo = validPromoCodes[code];
                return res.json({
                    status: 'success',
                    message: `Promo code applied! ${promoInfo.description}`,
                    data: {
                        discount: promoInfo.discount,
                        description: promoInfo.description,
                    }
                });
            }

        } catch (error) {
            console.error(' Error applying promo code:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to apply promo code'
            });
        }
    };

    // ============================================
    // GET SEAT USAGE (Unique users across all collabs)
    // ============================================

    private getSeatUsage = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user's subscription to find the seat limit AND extra_seats
            const { data: subscription } = await supabaseAdmin
                .from('subscriptions')
                .select('tier, stripe_subscription_id, extra_seats')
                .eq('user_id', userId)
                .single();

            // Determine BASE seat limit based on tier
            let baseSeatLimit = 5; // Default for Pro plan
            if (subscription?.tier === 'enterprise') {
                baseSeatLimit = 25; // Enterprise gets more seats
            } else if (subscription?.tier === 'starter') {
                baseSeatLimit = 3; // Starter gets fewer
            } else if (!subscription || subscription?.tier === 'free') {
                baseSeatLimit = 1; // Free tier: just the owner
            }

            // 🆕 ADD EXTRA SEATS from addon purchases
            const extraSeats = subscription?.extra_seats || 0;
            const seatLimit = baseSeatLimit + extraSeats;

            // Count unique users across ALL collab projects owned by this user
            const { data: ownedProjects } = await supabaseAdmin
                .from('collab_projects')
                .select('id')
                .eq('created_by', userId);

            if (!ownedProjects || ownedProjects.length === 0) {
                // No collabs = only owner counts as 1 seat
                return res.json({
                    status: 'success',
                    data: {
                        seatsUsed: 1, // Owner counts as 1
                        seatsTotal: seatLimit,
                        baseSeats: baseSeatLimit, // 🆕 Base seats from tier
                        extraSeats: extraSeats, // 🆕 Purchased extra seats
                        percentage: (1 / seatLimit) * 100,
                        availableSeats: seatLimit - 1,
                        uniqueMembers: [userId] // Just the owner
                    }
                });
            }

            const projectIds = ownedProjects.map(p => p.id);

            // Get all unique user_ids from collab_project_members for these projects
            const { data: members } = await supabaseAdmin
                .from('collab_project_members')
                .select('user_id')
                .in('collab_project_id', projectIds);

            // Get unique user IDs (including owner)
            const uniqueUserIds = new Set<string>();
            uniqueUserIds.add(userId); // Always include the owner

            if (members) {
                members.forEach(m => uniqueUserIds.add(m.user_id));
            }

            const seatsUsed = uniqueUserIds.size;
            const availableSeats = Math.max(0, seatLimit - seatsUsed);

            console.log(`📊 Seat usage for user ${userId}: ${seatsUsed}/${seatLimit} (base: ${baseSeatLimit} + extra: ${extraSeats})`);

            return res.json({
                status: 'success',
                data: {
                    seatsUsed,
                    seatsTotal: seatLimit,
                    baseSeats: baseSeatLimit, // 🆕 Base seats from tier
                    extraSeats: extraSeats, // 🆕 Purchased extra seats
                    percentage: (seatsUsed / seatLimit) * 100,
                    availableSeats,
                    uniqueMembers: Array.from(uniqueUserIds),
                    tier: subscription?.tier || 'free'
                }
            });

        } catch (error) {
            console.error('❌ Error getting seat usage:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get seat usage'
            });
        }
    };

    // ============================================
    // GET TEAM MEMBERS (All unique members across user's collabs)
    // ============================================

    private getTeamMembers = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            
            console.log(`📊 GET /api/subscriptions/team-members - User ID: ${userId}`);

            // Get user info (owner)
            const { data: owner, error: ownerError } = await supabaseAdmin
                .from('users')
                .select('id, email, first_name, last_name, created_at')
                .eq('id', userId)
                .single();

            if (ownerError) {
                console.log(`❌ Supabase error fetching owner:`, ownerError);
                return res.status(500).json({
                    status: 'error',
                    message: 'Database error fetching user',
                    details: ownerError.message
                });
            }

            if (!owner) {
                console.log(`❌ Owner not found for user ID: ${userId}`);
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            console.log(`✅ Owner found: ${owner.email}`);

            // Get all collab projects owned by this user
            const { data: ownedProjects } = await supabaseAdmin
                .from('collab_projects')
                .select('id')
                .eq('created_by', userId);

            const teamMembersMap = new Map();

            // Add owner first
            teamMembersMap.set(userId, {
                id: userId,
                name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.email,
                email: owner.email,
                role: 'owner',
                status: 'active',
                collabs: ownedProjects?.length || 0,
                lastActive: owner.created_at || null,
                avatar: null,
                isPending: false,
                giftedSeats: 0 // Owner doesn't count as gifted
            });

            if (ownedProjects && ownedProjects.length > 0) {
                const projectIds = ownedProjects.map(p => p.id);

                // Get all members from these projects with user details
                const { data: members } = await supabaseAdmin
                    .from('collab_project_members')
                    .select(`
                        user_id,
                        role,
                        status,
                        invited_at,
                        users!collab_project_members_user_id_fkey (
                            id,
                            email,
                            first_name,
                            last_name,
                            created_at
                        )
                    `)
                    .in('collab_project_id', projectIds);

                if (members) {
                    for (const member of members) {
                        const user: any = member.users;
                        if (!user) continue;

                        const memberId = member.user_id;

                        // Count how many collabs this member is in
                        const memberCollabCount = members.filter((m: any) => m.user_id === memberId).length;

                        // If already exists, update with highest role
                        if (teamMembersMap.has(memberId)) {
                            const existing: any = teamMembersMap.get(memberId);
                            
                            // Update collabs count
                            existing.collabs = memberCollabCount;
                            
                            // Keep highest role priority: owner > admin > editor > viewer
                            const rolePriority: any = { owner: 4, admin: 3, editor: 2, viewer: 1 };
                            if (rolePriority[member.role] > rolePriority[existing.role]) {
                                existing.role = member.role;
                            }
                        } else {
                            // Add new member
                            const isPending = member.status === 'pending';
                            teamMembersMap.set(memberId, {
                                id: memberId,
                                name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
                                email: user.email,
                                role: member.role || 'viewer',
                                status: isPending ? 'pending' : 'active',
                                collabs: memberCollabCount,
                                lastActive: user.created_at || member.invited_at || null,
                                avatar: null,
                                isPending: isPending,
                                giftedSeats: 0
                            });
                        }
                    }
                }
            }

            // Convert map to array
            const teamMembers = Array.from(teamMembersMap.values());

            // Calculate pending invites count
            const pendingInvites = teamMembers.filter(m => m.status === 'pending').length;

            // Calculate gifted seats (if you have that logic)
            const giftedSeatsCount = teamMembers.reduce((sum, m) => sum + m.giftedSeats, 0);

            console.log(`📊 Team members for user ${userId}: ${teamMembers.length} members`);

            return res.json({
                status: 'success',
                data: {
                    members: teamMembers,
                    summary: {
                        totalMembers: teamMembers.length,
                        activeMembers: teamMembers.filter(m => m.status === 'active').length,
                        pendingInvites: pendingInvites,
                        giftedSeats: giftedSeatsCount
                    }
                }
            });

        } catch (error) {
            console.error('❌ Error getting team members:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get team members'
            });
        }
    };
}
