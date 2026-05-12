/**
 * Notification Controller
 * 
 * API endpoints for managing notifications:
 * - GET notifications
 * - Mark as read
 * - Delete/archive
 * - Get unread count
 * - Update preferences
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthRequest, authenticateToken } from '../middleware/auth.middleware';
import NotificationService, { NotificationType } from '../services/notification.service';
import { supabaseAdmin } from '../lib/supabase';

export class NotificationController extends BaseController {
    public basePath = '/api/notifications';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            // Get user's notifications
            {
                verb: 'GET',
                path: '/',
                handler: this.getNotifications,
                middlewares: [authenticateToken],
            },
            // Get unread count
            {
                verb: 'GET',
                path: '/unread-count',
                handler: this.getUnreadCount,
                middlewares: [authenticateToken],
            },
            // Mark notification(s) as read
            {
                verb: 'POST',
                path: '/mark-read',
                handler: this.markAsRead,
                middlewares: [authenticateToken],
            },
            // Mark all as read
            {
                verb: 'POST',
                path: '/mark-all-read',
                handler: this.markAllAsRead,
                middlewares: [authenticateToken],
            },
            // Archive notification(s)
            {
                verb: 'POST',
                path: '/archive',
                handler: this.archive,
                middlewares: [authenticateToken],
            },
            // Change priority (for dismiss action)
            {
                verb: 'POST',
                path: '/change-priority',
                handler: this.changePriority,
                middlewares: [authenticateToken],
            },
            // Delete notification(s)
            {
                verb: 'DELETE',
                path: '/',
                handler: this.delete,
                middlewares: [authenticateToken],
            },
            // Get notification preferences
            {
                verb: 'GET',
                path: '/preferences',
                handler: this.getPreferences,
                middlewares: [authenticateToken],
            },
            // Update notification preferences
            {
                verb: 'PUT',
                path: '/preferences',
                handler: this.updatePreferences,
                middlewares: [authenticateToken],
            },
        ];
    }

    /**
     * GET /api/notifications
     * Get user's notifications with filtering
     */
    private getNotifications = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { 
                unread_only, 
                limit = 50, 
                offset = 0,
                types 
            } = req.query;

            const options = {
                unreadOnly: unread_only === 'true',
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
                types: types ? (types as string).split(',') as NotificationType[] : undefined,
            };

            const result = await NotificationService.getForUser(userId, options);

            if (!result.success) {
                return res.status(500).json({
                    status: 'error',
                    message: result.error || 'Failed to fetch notifications'
                });
            }

            return res.json({
                status: 'success',
                data: {
                    notifications: result.data || [],
                    count: result.data?.length || 0,
                }
            });

        } catch (error: any) {
            console.error('❌ Get notifications error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch notifications'
            });
        }
    };

    /**
     * GET /api/notifications/unread-count
     * Get unread notification count for badge
     */
    private getUnreadCount = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const count = await NotificationService.getUnreadCount(userId);

            return res.json({
                status: 'success',
                data: { count }
            });

        } catch (error: any) {
            console.error('❌ Get unread count error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get unread count'
            });
        }
    };

    /**
     * POST /api/notifications/mark-read
     * Mark one or more notifications as read
     * Body: { notificationIds: string[] }
     */
    private markAsRead = async (req: AuthRequest, res: Response) => {
        try {
            const { notificationIds } = req.body;

            if (!notificationIds || !Array.isArray(notificationIds)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'notificationIds array is required'
                });
            }

            const result = await NotificationService.markAsRead(notificationIds);

            if (!result.success) {
                return res.status(500).json({
                    status: 'error',
                    message: result.error || 'Failed to mark as read'
                });
            }

            return res.json({
                status: 'success',
                message: 'Notifications marked as read'
            });

        } catch (error: any) {
            console.error('❌ Mark as read error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to mark as read'
            });
        }
    };

    /**
     * POST /api/notifications/mark-all-read
     * Mark all notifications as read for the user
     */
    private markAllAsRead = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            const result = await NotificationService.markAllAsRead(userId);

            if (!result.success) {
                return res.status(500).json({
                    status: 'error',
                    message: result.error || 'Failed to mark all as read'
                });
            }

            return res.json({
                status: 'success',
                message: 'All notifications marked as read'
            });

        } catch (error: any) {
            console.error('❌ Mark all as read error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to mark all as read'
            });
        }
    };

    /**
     * POST /api/notifications/archive
     * Archive one or more notifications
     * Body: { notificationIds: string[] }
     */
    private archive = async (req: AuthRequest, res: Response) => {
        try {
            const { notificationIds } = req.body;

            if (!notificationIds || !Array.isArray(notificationIds)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'notificationIds array is required'
                });
            }

            const result = await NotificationService.archive(notificationIds);

            if (!result.success) {
                return res.status(500).json({
                    status: 'error',
                    message: result.error || 'Failed to archive'
                });
            }

            return res.json({
                status: 'success',
                message: 'Notifications archived'
            });

        } catch (error: any) {
            console.error('❌ Archive error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to archive'
            });
        }
    };

    /**
     * POST /api/notifications/change-priority
     * Change notification priority (for dismiss action)
     * Body: { notificationIds: string[], priority: 'normal' | 'important' | 'critical' }
     */
    private changePriority = async (req: AuthRequest, res: Response) => {
        try {
            const { notificationIds, priority = 'normal' } = req.body;

            if (!notificationIds || !Array.isArray(notificationIds)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'notificationIds array is required'
                });
            }

            if (!['normal', 'important', 'critical'].includes(priority)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'priority must be normal, important, or critical'
                });
            }

            // Update priority in database
            const { error } = await supabaseAdmin
                .from('notifications')
                .update({ priority: priority })
                .in('id', notificationIds);

            if (error) {
                console.error('❌ Error changing priority:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to change priority'
                });
            }

            console.log(`✅ Changed ${notificationIds.length} notification(s) to ${priority}`);

            return res.json({
                status: 'success',
                message: `Priority changed to ${priority}`
            });

        } catch (error: any) {
            console.error('❌ Change priority error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to change priority'
            });
        }
    };

    /**
     * DELETE /api/notifications
     * Delete one or more notifications
     * Body: { notificationIds: string[] }
     */
    private delete = async (req: AuthRequest, res: Response) => {
        try {
            const { notificationIds } = req.body;

            if (!notificationIds || !Array.isArray(notificationIds)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'notificationIds array is required'
                });
            }

            const result = await NotificationService.delete(notificationIds);

            if (!result.success) {
                return res.status(500).json({
                    status: 'error',
                    message: result.error || 'Failed to delete'
                });
            }

            return res.json({
                status: 'success',
                message: 'Notifications deleted'
            });

        } catch (error: any) {
            console.error('❌ Delete error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete'
            });
        }
    };

    /**
     * GET /api/notifications/preferences
     * Get user's notification preferences
     */
    private getPreferences = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            const { data, error } = await supabaseAdmin
                .from('notification_preferences')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('❌ Get preferences error:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to fetch preferences'
                });
            }

            // If no preferences exist, return defaults
            if (!data) {
                return res.json({
                    status: 'success',
                    data: {
                        email_collab_invite: true,
                        email_thread_mention: true,
                        email_wins_low: true,
                        email_important_only: false,
                        app_collaboration: true,
                        app_threads: true,
                        app_wins: true,
                        enable_daily_digest: false,
                        digest_time: '09:00:00',
                    }
                });
            }

            return res.json({
                status: 'success',
                data
            });

        } catch (error: any) {
            console.error('❌ Get preferences error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch preferences'
            });
        }
    };

    /**
     * PUT /api/notifications/preferences
     * Update user's notification preferences
     */
    private updatePreferences = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const updates = req.body;

            // Validate allowed fields
            const allowedFields = [
                'email_collab_invite',
                'email_thread_mention',
                'email_wins_low',
                'email_important_only',
                'app_collaboration',
                'app_threads',
                'app_wins',
                'enable_daily_digest',
                'digest_time',
            ];

            const filteredUpdates: any = {};
            for (const field of allowedFields) {
                if (updates[field] !== undefined) {
                    filteredUpdates[field] = updates[field];
                }
            }

            if (Object.keys(filteredUpdates).length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No valid fields to update'
                });
            }

            // Upsert preferences
            const { data, error } = await supabaseAdmin
                .from('notification_preferences')
                .upsert({
                    user_id: userId,
                    ...filteredUpdates,
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Update preferences error:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to update preferences'
                });
            }

            console.log(`✅ Notification preferences updated for user ${userId}`);

            return res.json({
                status: 'success',
                message: 'Preferences updated successfully',
                data
            });

        } catch (error: any) {
            console.error('❌ Update preferences error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update preferences'
            });
        }
    };
}

export default NotificationController;
