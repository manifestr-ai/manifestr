import { supabaseAdmin } from '../lib/supabase';

export type NotificationCategory = 'approvals' | 'due-soon' | 'mentions' | 'access' | 'system';
export type NotificationSeverity = 'critical' | 'important' | 'normal';

export interface CreateNotificationInput {
    userId: string;
    actorUserId?: string | null;
    type: string;
    category?: NotificationCategory;
    severity?: NotificationSeverity;
    title: string;
    body?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    actionUrl?: string | null;
    metadata?: Record<string, any>;
}

class NotificationService {
    async createNotification(input: CreateNotificationInput) {
        if (!input.userId || !input.title || !input.type) {
            return null;
        }

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: input.userId,
                actor_user_id: input.actorUserId || null,
                type: input.type,
                category: input.category || 'system',
                severity: input.severity || 'normal',
                title: input.title,
                body: input.body || null,
                entity_type: input.entityType || null,
                entity_id: input.entityId || null,
                action_url: input.actionUrl || null,
                metadata: input.metadata || {},
            })
            .select()
            .single();

        if (error) {
            console.error('⚠️ Failed to create notification:', error.message);
            return null;
        }

        return data;
    }

    async createBulkNotifications(inputs: CreateNotificationInput[]) {
        const rows = inputs
            .filter((input) => input.userId && input.title && input.type)
            .map((input) => ({
                user_id: input.userId,
                actor_user_id: input.actorUserId || null,
                type: input.type,
                category: input.category || 'system',
                severity: input.severity || 'normal',
                title: input.title,
                body: input.body || null,
                entity_type: input.entityType || null,
                entity_id: input.entityId || null,
                action_url: input.actionUrl || null,
                metadata: input.metadata || {},
            }));

        if (rows.length === 0) {
            return [];
        }

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert(rows)
            .select();

        if (error) {
            console.error('⚠️ Failed to create notifications:', error.message);
            return [];
        }

        return data || [];
    }

    async getNotifications(userId: string, options: { status?: string; category?: string; severity?: string; limit?: number } = {}) {
        let query = supabaseAdmin
            .from('notifications')
            .select(`
                *,
                actor:users!notifications_actor_user_id_fkey (
                    id,
                    email,
                    first_name,
                    last_name
                )
            `)
            .eq('user_id', userId)
            .is('dismissed_at', null)
            .order('created_at', { ascending: false })
            .limit(Math.min(Math.max(options.limit || 50, 1), 100));

        if (options.status === 'unread') {
            query = query.is('read_at', null);
        } else if (options.status === 'read') {
            query = query.not('read_at', 'is', null);
        }

        if (options.category && options.category !== 'all') {
            query = query.eq('category', options.category);
        }

        if (options.severity && options.severity !== 'all') {
            query = query.eq('severity', options.severity);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return data || [];
    }

    async getCounts(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('read_at, category, severity')
            .eq('user_id', userId)
            .is('dismissed_at', null);

        if (error) {
            throw error;
        }

        const rows = data || [];

        return {
            all: rows.length,
            unread: rows.filter((row) => !row.read_at).length,
            critical: rows.filter((row) => row.severity === 'critical').length,
            important: rows.filter((row) => row.severity === 'important').length,
            normal: rows.filter((row) => row.severity === 'normal').length,
            approvals: rows.filter((row) => row.category === 'approvals').length,
            dueSoon: rows.filter((row) => row.category === 'due-soon').length,
            mentions: rows.filter((row) => row.category === 'mentions').length,
            access: rows.filter((row) => row.category === 'access').length,
            system: rows.filter((row) => row.category === 'system').length,
        };
    }

    async markRead(userId: string, notificationId: string) {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', notificationId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async markAllRead(userId: string) {
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('user_id', userId)
            .is('read_at', null)
            .is('dismissed_at', null);

        if (error) {
            throw error;
        }
    }

    async dismiss(userId: string, notificationId: string) {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .update({ dismissed_at: new Date().toISOString() })
            .eq('id', notificationId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}

export default new NotificationService();
