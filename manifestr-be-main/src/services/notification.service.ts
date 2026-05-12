/**
 * Notification Service
 * 
 * Centralized service for creating and managing notifications
 * Used across all controllers to trigger notifications
 */

import { supabaseAdmin } from '../lib/supabase';

export type NotificationType = 
    // Collaboration
    | 'collab_invite' | 'collab_invite_accepted' | 'collab_invite_declined'
    | 'collab_added' | 'collab_removed' | 'collab_role_changed'
    | 'collab_session_joined' | 'collab_session_left'
    | 'collab_project_invite' | 'collab_project_member_added'
    // Wins & Usage
    | 'wins_low' | 'wins_depleted' | 'wins_added' 
    | 'wins_monthly_reset' | 'wins_large_deduction'
    // Threads & Comments
    | 'thread_created' | 'thread_message' | 'thread_reply'
    | 'thread_mention' | 'thread_assigned' | 'thread_resolved'
    | 'thread_reaction' | 'thread_status_changed'
    // Generic
    | 'document_shared' | 'document_deleted' | 'access_revoked';

export type NotificationPriority = 'critical' | 'important' | 'normal';

export interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    priority?: NotificationPriority;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    resourceId?: string;
    resourceType?: 'document' | 'generation_job' | 'thread' | 'subscription' | 'collab_project';
    actorId?: string;
    actorName?: string;
    actorAvatar?: string;
    metadata?: Record<string, any>;
    expiresAt?: Date;
}

export class NotificationService {
    /**
     * Create a new notification
     */
    static async create(params: CreateNotificationParams): Promise<{ success: boolean; notificationId?: string; error?: string }> {
        try {
            // Check if user has this notification type enabled
            const prefsEnabled = await this.isNotificationEnabled(params.userId, params.type);
            if (!prefsEnabled) {
                console.log(`⏭️  Notification ${params.type} disabled for user ${params.userId}`);
                return { success: true }; // Silently skip
            }

            const { data, error } = await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: params.userId,
                    type: params.type,
                    priority: params.priority || 'normal',
                    title: params.title,
                    message: params.message,
                    action_url: params.actionUrl,
                    action_text: params.actionText,
                    resource_id: params.resourceId,
                    resource_type: params.resourceType,
                    actor_id: params.actorId,
                    actor_name: params.actorName,
                    actor_avatar: params.actorAvatar,
                    metadata: params.metadata || {},
                    expires_at: params.expiresAt?.toISOString(),
                })
                .select('id')
                .single();

            if (error) {
                console.error('❌ Error creating notification:', error);
                return { success: false, error: error.message };
            }

            console.log(`✅ Notification created: ${params.type} for user ${params.userId}`);
            return { success: true, notificationId: data.id };

        } catch (error: any) {
            console.error('❌ Notification service error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create notifications for multiple users at once (batch)
     */
    static async createBatch(users: string[], baseParams: Omit<CreateNotificationParams, 'userId'>): Promise<{ success: boolean; count?: number; error?: string }> {
        try {
            const notifications = users.map(userId => ({
                user_id: userId,
                type: baseParams.type,
                priority: baseParams.priority || 'normal',
                title: baseParams.title,
                message: baseParams.message,
                action_url: baseParams.actionUrl,
                action_text: baseParams.actionText,
                resource_id: baseParams.resourceId,
                resource_type: baseParams.resourceType,
                actor_id: baseParams.actorId,
                actor_name: baseParams.actorName,
                actor_avatar: baseParams.actorAvatar,
                metadata: baseParams.metadata || {},
                expires_at: baseParams.expiresAt?.toISOString(),
            }));

            const { data, error } = await supabaseAdmin
                .from('notifications')
                .insert(notifications)
                .select('id');

            if (error) {
                console.error('❌ Error creating batch notifications:', error);
                return { success: false, error: error.message };
            }

            console.log(`✅ ${data.length} notifications created`);
            return { success: true, count: data.length };

        } catch (error: any) {
            console.error('❌ Batch notification error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get notifications for a user
     */
    static async getForUser(
        userId: string, 
        options?: { 
            unreadOnly?: boolean; 
            limit?: number; 
            offset?: number;
            types?: NotificationType[];
        }
    ) {
        try {
            let query = supabaseAdmin
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (options?.unreadOnly) {
                query = query.eq('is_read', false);
            }

            if (options?.types && options.types.length > 0) {
                query = query.in('type', options.types);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            if (options?.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
            }

            const { data, error } = await query;

            if (error) {
                console.error('❌ Error fetching notifications:', error);
                return { success: false, error: error.message };
            }

            return { success: true, data };

        } catch (error: any) {
            console.error('❌ Get notifications error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get unread count for a user
     */
    static async getUnreadCount(userId: string): Promise<number> {
        try {
            const { count, error } = await supabaseAdmin
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) {
                console.error('❌ Error getting unread count:', error);
                return 0;
            }

            return count || 0;

        } catch (error) {
            console.error('❌ Unread count error:', error);
            return 0;
        }
    }

    /**
     * Mark notification(s) as read
     */
    static async markAsRead(notificationIds: string | string[]): Promise<{ success: boolean; error?: string }> {
        try {
            const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

            const { error } = await supabaseAdmin
                .from('notifications')
                .update({ 
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .in('id', ids);

            if (error) {
                console.error('❌ Error marking as read:', error);
                return { success: false, error: error.message };
            }

            console.log(`✅ Marked ${ids.length} notification(s) as read`);
            return { success: true };

        } catch (error: any) {
            console.error('❌ Mark as read error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Mark all notifications as read for a user
     */
    static async markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabaseAdmin
                .from('notifications')
                .update({ 
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) {
                console.error('❌ Error marking all as read:', error);
                return { success: false, error: error.message };
            }

            console.log(`✅ Marked all notifications as read for user ${userId}`);
            return { success: true };

        } catch (error: any) {
            console.error('❌ Mark all as read error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Archive notification(s)
     */
    static async archive(notificationIds: string | string[]): Promise<{ success: boolean; error?: string }> {
        try {
            const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

            const { error } = await supabaseAdmin
                .from('notifications')
                .update({ 
                    is_archived: true,
                    archived_at: new Date().toISOString()
                })
                .in('id', ids);

            if (error) {
                console.error('❌ Error archiving:', error);
                return { success: false, error: error.message };
            }

            console.log(`✅ Archived ${ids.length} notification(s)`);
            return { success: true };

        } catch (error: any) {
            console.error('❌ Archive error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete notification(s)
     */
    static async delete(notificationIds: string | string[]): Promise<{ success: boolean; error?: string }> {
        try {
            const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

            const { error } = await supabaseAdmin
                .from('notifications')
                .delete()
                .in('id', ids);

            if (error) {
                console.error('❌ Error deleting:', error);
                return { success: false, error: error.message };
            }

            console.log(`✅ Deleted ${ids.length} notification(s)`);
            return { success: true };

        } catch (error: any) {
            console.error('❌ Delete error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check if notification type is enabled for user
     */
    private static async isNotificationEnabled(userId: string, type: NotificationType): Promise<boolean> {
        try {
            const { data, error } = await supabaseAdmin
                .from('notification_preferences')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error || !data) {
                // If no preferences found, assume all enabled (default)
                return true;
            }

            // Map notification types to preference columns
            if (type.startsWith('collab_')) {
                return data.app_collaboration !== false;
            }
            if (type.startsWith('thread_')) {
                return data.app_threads !== false;
            }
            if (type.startsWith('wins_')) {
                return data.app_wins !== false;
            }

            // Default: enabled
            return true;

        } catch (error) {
            // On error, assume enabled (fail-open)
            return true;
        }
    }

    /**
     * Helper: Create collaboration invite notification
     */
    static async notifyCollabInvite(params: {
        recipientId: string;
        documentId: string;
        documentTitle: string;
        inviterName: string;
        inviterId: string;
        role: string;
    }) {
        return this.create({
            userId: params.recipientId,
            type: 'collab_invite',
            priority: 'critical',
            title: 'New Collaboration Invite',
            message: `${params.inviterName} invited you to collaborate on "${params.documentTitle}" as ${params.role}`,
            actionUrl: `/docs-editor?id=${params.documentId}`,
            actionText: 'View Document',
            resourceId: params.documentId,
            resourceType: 'document',
            actorId: params.inviterId,
            actorName: params.inviterName,
        });
    }

    /**
     * Helper: Create low wins warning notification
     */
    static async notifyLowWins(params: {
        userId: string;
        currentBalance: number;
        threshold: number;
    }) {
        return this.create({
            userId: params.userId,
            type: 'wins_low',
            priority: 'critical',
            title: 'Low Wins Balance',
            message: `You have ${params.currentBalance} wins remaining. Consider purchasing more to continue using premium features.`,
            actionUrl: '/pricing',
            actionText: 'Buy Wins',
            metadata: {
                balance: params.currentBalance,
                threshold: params.threshold,
            },
        });
    }

    /**
     * Helper: Create thread reply notification
     */
    static async notifyThreadReply(params: {
        recipientId: string;
        threadId: string;
        documentId: string;
        threadTitle: string;
        replierName: string;
        replierId: string;
        message: string;
    }) {
        return this.create({
            userId: params.recipientId,
            type: 'thread_reply',
            priority: 'important',
            title: 'New Reply to Thread',
            message: `${params.replierName} replied to "${params.threadTitle}": ${params.message.substring(0, 100)}...`,
            actionUrl: `/docs-editor?id=${params.documentId}#thread-${params.threadId}`,
            actionText: 'View Thread',
            resourceId: params.threadId,
            resourceType: 'thread',
            actorId: params.replierId,
            actorName: params.replierName,
        });
    }
}

export default NotificationService;
