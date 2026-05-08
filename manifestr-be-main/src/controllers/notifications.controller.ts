import { Response } from 'express';
import { BaseController } from './base.controller';
import { AuthRequest, authenticateToken } from '../middleware/auth.middleware';
import notificationService from '../services/NotificationService';

export class NotificationsController extends BaseController {
    public basePath = '/notifications';

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'GET',
                path: '/',
                middlewares: [authenticateToken],
                handler: this.getNotifications.bind(this),
            },
            {
                verb: 'GET',
                path: '/counts',
                middlewares: [authenticateToken],
                handler: this.getCounts.bind(this),
            },
            {
                verb: 'PATCH',
                path: '/read-all',
                middlewares: [authenticateToken],
                handler: this.markAllRead.bind(this),
            },
            {
                verb: 'PATCH',
                path: '/:notificationId/read',
                middlewares: [authenticateToken],
                handler: this.markRead.bind(this),
            },
            {
                verb: 'PATCH',
                path: '/:notificationId/dismiss',
                middlewares: [authenticateToken],
                handler: this.dismiss.bind(this),
            },
        ];
    }

    private async getNotifications(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { status, category, severity, limit } = req.query;

            const notifications = await notificationService.getNotifications(userId, {
                status: typeof status === 'string' ? status : undefined,
                category: typeof category === 'string' ? category : undefined,
                severity: typeof severity === 'string' ? severity : undefined,
                limit: typeof limit === 'string' ? Number(limit) : undefined,
            });

            return res.json({
                status: 'success',
                data: notifications,
            });
        } catch (error: any) {
            console.error('❌ Failed to fetch notifications:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch notifications',
                details: error.message,
            });
        }
    }

    private async getCounts(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const counts = await notificationService.getCounts(userId);

            return res.json({
                status: 'success',
                data: counts,
            });
        } catch (error: any) {
            console.error('❌ Failed to fetch notification counts:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch notification counts',
                details: error.message,
            });
        }
    }

    private async markRead(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { notificationId } = req.params;
            const notification = await notificationService.markRead(userId, notificationId);

            return res.json({
                status: 'success',
                data: notification,
            });
        } catch (error: any) {
            console.error('❌ Failed to mark notification read:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to mark notification read',
                details: error.message,
            });
        }
    }

    private async markAllRead(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            await notificationService.markAllRead(userId);

            return res.json({
                status: 'success',
                message: 'Notifications marked as read',
            });
        } catch (error: any) {
            console.error('❌ Failed to mark all notifications read:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to mark all notifications read',
                details: error.message,
            });
        }
    }

    private async dismiss(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { notificationId } = req.params;
            const notification = await notificationService.dismiss(userId, notificationId);

            return res.json({
                status: 'success',
                data: notification,
            });
        } catch (error: any) {
            console.error('❌ Failed to dismiss notification:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to dismiss notification',
                details: error.message,
            });
        }
    }
}

export default NotificationsController;
