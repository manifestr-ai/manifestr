import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { stripe, getStripePriceId, getTierConfig, PRICING_TIERS } from '../lib/stripe';
import { supabaseAdmin } from '../lib/supabase';
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
                success_url: `${process.env.FRONTEND_URL}/signup?subscribed=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
                allow_promotion_codes: true,
            };

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

            if (error || !subscription) {
                // No active subscription - user is on free tier
                return res.json({
                    status: 'success',
                    data: {
                        hasSubscription: false,
                        tier: 'backstage',
                        subscriptionStatus: 'none',
                        features: PRICING_TIERS.backstage.features,
                        winsPerMonth: 0,
                        exportLimit: 0,
                    }
                });
            }

            // Get tier configuration
            const tierConfig = getTierConfig(subscription.tier);

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
                    winsPerMonth: tierConfig?.winsPerMonth || 0,
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
                return_url: `${process.env.FRONTEND_URL}/settings/subscription`,
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
                console.log('✅ Payment succeeded:', event.data.object);
                break;

            case 'invoice.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }
    }

    private async handleCheckoutCompleted(session: any) {
        console.log('🎉 Checkout completed:', session.id);
        
        const userId = session.metadata?.user_id;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;

        if (!stripeSubscriptionId) {
            console.log('ℹ️ No subscription in session (one-time payment?)');
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
            console.log(`👤 Processing checkout for user: ${userId}`);
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
            console.log(`📧 Guest checkout completed`);
            console.log(`   Email: ${customerEmail}`);
            console.log(`🔗 Stripe Customer: ${stripeCustomerId}`);
            console.log(`📋 Stripe Subscription: ${stripeSubscriptionId}`);
            console.log(`ℹ️  Subscription will be saved by subscription.created/updated webhook`);
            console.log(`ℹ️  User can now signup and subscription will be linked automatically`);
        }
    }

    private async handleSubscriptionUpdate(subscription: any) {
        console.log('🔄 Subscription updated:', subscription.id);
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
            console.error('❌ No user_id or customer email - cannot save subscription');
            return;
        }

        const tier = subscription.metadata?.tier || 'starter';
        const interval = subscription.metadata?.interval || 'monthly';
        const isLaunchPricing = subscription.metadata?.is_launch_pricing === 'true';

        // Get price
        const priceItem = subscription.items.data[0];
        const amountCents = priceItem.price.unit_amount || 0;

        console.log(`${userId ? `👤 User: ${userId}` : `📧 Guest Email: ${customerEmail}`}`);
        console.log(`🎯 Tier: ${tier} (${interval})`);
        console.log(`💰 Amount: $${amountCents / 100}`);
        console.log(`🚀 Launch pricing: ${isLaunchPricing}`);

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
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
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
            await supabaseAdmin
                .from('subscriptions')
                .update({
                    ...subscriptionData,
                    user_id: userId || existing.user_id, // Keep existing user_id if no new one
                })
                .eq('id', existing.id);
            
            console.log(` Subscription updated in database`);
        } else {
            // Create new subscription (guest subscription without user_id)
            await supabaseAdmin
                .from('subscriptions')
                .insert({
                    ...subscriptionData,
                    user_id: userId || null, // Allow NULL for guest subscriptions
                });
            
            console.log(` Subscription created in database ${userId ? 'for user' : 'for guest (pending signup)'}`);
        }

        // Update user tier and wins ONLY if we have a user_id and subscription is active
        if (userId && ['active', 'trialing'].includes(subscription.status)) {
            const tierConfig = getTierConfig(tier);
            
            if (tierConfig) {
                console.log(`🏆 Granting ${tierConfig.winsPerMonth} wins for ${tier} tier`);

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
        console.log('🗑️ Subscription deleted:', subscription.id);

        const userId = subscription.metadata?.user_id;
        if (!userId) {
            console.error('❌ No user_id in subscription metadata');
            return;
        }

        console.log(`👤 Processing cancellation for user: ${userId}`);

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

        console.log(`✅ Subscription marked as canceled`);

        // Revert to free tier
        await supabaseAdmin
            .from('users')
            .update({
                tier: 'backstage',
                wins_balance: 0,
            })
            .eq('id', userId);

        console.log(`✅ User ${userId} reverted to backstage tier (free)`);

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

        console.log(`📋 Cancellation logged in history`);
    }

    private async handlePaymentSucceeded(invoice: any) {
        console.log('💳 Payment succeeded:', invoice.id);
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
            console.error('❌ User not found for customer:', invoice.customer);
            return;
        }

        console.log(`✅ Payment recorded for user ${user.id}`);

        // Update subscription with payment info
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'active',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        console.log(`✅ Subscription status updated to active`);
    }

    private async handlePaymentFailed(invoice: any) {
        console.log('❌ Payment failed:', invoice.id);
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
            console.error('❌ User not found for customer:', invoice.customer);
            return;
        }

        console.log(`⚠️ Payment failed for user ${user.id} (${user.email})`);

        // Update subscription status
        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'past_due',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        console.log(`✅ Subscription marked as past_due`);

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

        console.log(`📧 TODO: Send payment failed email to ${user.email} - Amount: $${invoice.amount_due / 100}`);
    }
}
