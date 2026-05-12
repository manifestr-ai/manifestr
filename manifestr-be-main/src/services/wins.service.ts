/**
 * Wins Management Service
 * 
 * Handles all wins-related operations:
 * - Deducting wins
 * - Adding wins
 * - Checking balance
 * - Monthly resets
 */

import { supabaseAdmin } from '../lib/supabase';
import { getTierConfig } from '../lib/stripe';
import NotificationService from './notification.service';

export class WinsService {
    /**
     * Deduct wins from user's balance
     * 
     * @example
     * await WinsService.deduct(userId, 50, 'document_generation', 'Generated pitch deck');
     */
    static async deduct(
        userId: string,
        amount: number,
        operationType: string,
        description: string,
        resourceId?: string
    ): Promise<{
        success: boolean;
        newBalance: number;
        error?: string;
    }> {
        try {
            // Get current balance
            const { data: user, error: userError } = await supabaseAdmin
                .from('users')
                .select('wins_balance, tier')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                return {
                    success: false,
                    newBalance: 0,
                    error: 'User not found'
                };
            }

            const currentBalance = user.wins_balance || 0;

            // Check if user has enough wins
            if (currentBalance < amount) {
                // 📢 SEND CRITICAL NOTIFICATION - INSUFFICIENT WINS
                try {
                    await NotificationService.create({
                        userId: userId,
                        type: 'wins_depleted',
                        priority: 'critical',
                        title: 'Insufficient Wins',
                        message: `You need ${amount} wins but only have ${currentBalance}. Purchase more to continue.`,
                        actionUrl: '/pricing',
                        actionText: 'Buy Wins',
                        metadata: {
                            required: amount,
                            available: currentBalance,
                        },
                    });
                    console.log(`📢 Insufficient wins alert sent to user ${userId}`);
                } catch (notifError) {
                    console.error('⚠️ Failed to send notification:', notifError);
                }

                return {
                    success: false,
                    newBalance: currentBalance,
                    error: `Insufficient wins. Required: ${amount}, Available: ${currentBalance}`
                };
            }

            // Deduct wins
            const newBalance = currentBalance - amount;

            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({ wins_balance: newBalance })
                .eq('id', userId);

            if (updateError) {
                console.error('❌ Error updating wins balance:', updateError);
                return {
                    success: false,
                    newBalance: currentBalance,
                    error: 'Failed to update wins balance'
                };
            }

            // Log transaction
            await supabaseAdmin
                .from('wins_transactions')
                .insert({
                    user_id: userId,
                    amount: -amount,
                    balance_after: newBalance,
                    transaction_type: 'deduction',
                    operation_type: operationType,
                    description: description,
                    resource_id: resourceId,
                });

            console.log(`✅ Deducted ${amount} wins from user ${userId}. New balance: ${newBalance}`);

            // 📢 CHECK FOR LOW WINS WARNING (< 100)
            try {
                if (newBalance < 100 && newBalance >= 0) {
                    await NotificationService.create({
                        userId: userId,
                        type: 'wins_low',
                        priority: 'critical',
                        title: 'Low Wins Balance',
                        message: `You have ${newBalance} wins remaining. Consider purchasing more to continue using premium features.`,
                        actionUrl: '/pricing',
                        actionText: 'Buy Wins',
                        metadata: {
                            balance: newBalance,
                            threshold: 100,
                        },
                    });
                    console.log(`📢 Low wins warning sent to user ${userId}`);
                }

                // 📢 DEPLETED WINS WARNING (= 0)
                if (newBalance === 0) {
                    await NotificationService.create({
                        userId: userId,
                        type: 'wins_depleted',
                        priority: 'critical',
                        title: 'Wins Balance Depleted',
                        message: 'Your wins balance is 0. Purchase more to continue using AI features.',
                        actionUrl: '/pricing',
                        actionText: 'Buy Wins',
                        metadata: {
                            balance: 0,
                        },
                    });
                    console.log(`📢 Wins depleted alert sent to user ${userId}`);
                }
            } catch (notifError) {
                console.error('⚠️ Failed to send wins notification:', notifError);
                // Continue anyway - notification is not critical
            }

            return {
                success: true,
                newBalance: newBalance
            };

        } catch (error) {
            console.error('❌ Error deducting wins:', error);
            return {
                success: false,
                newBalance: 0,
                error: 'Failed to deduct wins'
            };
        }
    }

    /**
     * Add wins to user's balance
     * 
     * @example
     * await WinsService.add(userId, 500, 'purchase', 'Purchased 500 wins');
     */
    static async add(
        userId: string,
        amount: number,
        transactionType: 'purchase' | 'refund' | 'bonus' | 'monthly_reset' | 'rollover',
        description: string,
        stripePaymentIntentId?: string
    ): Promise<{
        success: boolean;
        newBalance: number;
        error?: string;
    }> {
        try {
            // Get current balance
            const { data: user, error: userError } = await supabaseAdmin
                .from('users')
                .select('wins_balance')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                return {
                    success: false,
                    newBalance: 0,
                    error: 'User not found'
                };
            }

            const currentBalance = user.wins_balance || 0;
            const newBalance = currentBalance + amount;

            // Update balance
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({ wins_balance: newBalance })
                .eq('id', userId);

            if (updateError) {
                console.error('❌ Error updating wins balance:', updateError);
                return {
                    success: false,
                    newBalance: currentBalance,
                    error: 'Failed to update wins balance'
                };
            }

            // Log transaction
            await supabaseAdmin
                .from('wins_transactions')
                .insert({
                    user_id: userId,
                    amount: amount,
                    balance_after: newBalance,
                    transaction_type: transactionType,
                    description: description,
                    stripe_payment_intent_id: stripePaymentIntentId,
                });

            console.log(`✅ Added ${amount} wins to user ${userId}. New balance: ${newBalance}`);

            return {
                success: true,
                newBalance: newBalance
            };

        } catch (error) {
            console.error('❌ Error adding wins:', error);
            return {
                success: false,
                newBalance: 0,
                error: 'Failed to add wins'
            };
        }
    }

    /**
     * Get user's current wins balance
     */
    static async getBalance(userId: string): Promise<number> {
        try {
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('wins_balance')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return 0;
            }

            return user.wins_balance || 0;
        } catch (error) {
            console.error('❌ Error getting wins balance:', error);
            return 0;
        }
    }

    /**
     * Check if user has sufficient wins
     */
    static async hasSufficientWins(userId: string, requiredAmount: number): Promise<boolean> {
        const balance = await this.getBalance(userId);
        return balance >= requiredAmount;
    }

    /**
     * Get wins transaction history for user
     */
    static async getTransactionHistory(
        userId: string,
        limit: number = 50
    ): Promise<any[]> {
        try {
            const { data, error } = await supabaseAdmin
                .from('wins_transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('❌ Error getting transaction history:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error getting transaction history:', error);
            return [];
        }
    }

    /**
     * Reset monthly wins for a user
     * Called by cron job at start of each month
     */
    static async resetMonthlyWins(userId: string): Promise<boolean> {
        try {
            // Get user's tier
            const { data: user, error: userError } = await supabaseAdmin
                .from('users')
                .select('tier, wins_balance')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                console.error(`❌ User ${userId} not found for wins reset`);
                return false;
            }

            const tierConfig = getTierConfig(user.tier);

            if (!tierConfig) {
                console.error(`❌ Invalid tier config for user ${userId}`);
                return false;
            }

            // Elite tier gets rollover
            let newBalance = tierConfig.winsPerMonth;

            if (user.tier === 'elite') {
                // Elite: rollover unused wins (up to monthly amount)
                const rolloverAmount = Math.min(user.wins_balance, tierConfig.winsPerMonth);
                newBalance = tierConfig.winsPerMonth + rolloverAmount;

                console.log(`✅ Elite rollover: ${rolloverAmount} wins for user ${userId}`);
            }

            // Update balance
            await supabaseAdmin
                .from('users')
                .update({ wins_balance: newBalance })
                .eq('id', userId);

            // Log transaction
            await supabaseAdmin
                .from('wins_transactions')
                .insert({
                    user_id: userId,
                    amount: tierConfig.winsPerMonth,
                    balance_after: newBalance,
                    transaction_type: 'monthly_reset',
                    description: `Monthly wins reset for ${user.tier} tier (${tierConfig.winsPerMonth} wins)`,
                });

            console.log(`✅ Reset wins for user ${userId}: ${newBalance}`);
            return true;

        } catch (error) {
            console.error(`❌ Error resetting wins for user ${userId}:`, error);
            return false;
        }
    }

    /**
     * Reset wins for ALL active subscribers
     * Called by cron job on 1st of each month
     */
    static async resetAllMonthlyWins(): Promise<{
        success: number;
        failed: number;
    }> {
        try {
            console.log('🔄 Starting monthly wins reset for all users...');

            // Get all active subscriptions
            const { data: subscriptions, error } = await supabaseAdmin
                .from('subscriptions')
                .select('user_id, tier')
                .eq('status', 'active');

            if (error) {
                console.error('❌ Error fetching subscriptions:', error);
                return { success: 0, failed: 0 };
            }

            if (!subscriptions || subscriptions.length === 0) {
                console.log('ℹ️ No active subscriptions found');
                return { success: 0, failed: 0 };
            }

            let successCount = 0;
            let failedCount = 0;

            for (const sub of subscriptions) {
                const result = await this.resetMonthlyWins(sub.user_id);
                if (result) {
                    successCount++;
                } else {
                    failedCount++;
                }
            }

            console.log(`✅ Monthly wins reset complete: ${successCount} success, ${failedCount} failed`);

            return {
                success: successCount,
                failed: failedCount
            };

        } catch (error) {
            console.error('❌ Error in resetAllMonthlyWins:', error);
            return { success: 0, failed: 0 };
        }
    }
}

/**
 * Wins cost constants
 * These match the values in src/lib/stripe.ts
 */
export const WINS_COSTS = {
    document_generation: 50,
    presentation_generation: 75,
    spreadsheet_generation: 50,
    chart_generation: 40,
    image_generation: 100,
    export_pdf: 10,
    export_pptx: 15,
    export_docx: 10,
    export_xlsx: 10,
    ai_query: 5,
    ai_analysis: 30,
    ai_strategy: 60,
};
