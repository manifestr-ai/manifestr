/**
 * ANALYTICS CONTROLLER
 * 
 * Endpoints for tracking events from frontend and retrieving analytics data
 */

import { Response } from 'express';
import EventTrackingService, { EventCategory } from '../services/EventTracking.service';
import { AuthRequest, optionalAuth } from '../middleware/auth.middleware';
import { BaseController } from './base.controller';

function resolveTrackingUser(req: AuthRequest): {
  userId?: string;
  email?: string;
} {
  if (!req.user || req.user.userId === 'anonymous') {
    return {};
  }
  return { userId: req.user.userId, email: req.user.email };
}

/**
 * POST /api/analytics/track
 * Track an event from frontend
 */
export const trackEvent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      eventName,
      eventCategory,
      eventAction,
      resourceId,
      resourceType,
      properties
    } = req.body;

    // Validate required fields
    if (!eventName || !eventCategory || !eventAction) {
      return res.status(400).json({
        error: 'Missing required fields: eventName, eventCategory, eventAction'
      });
    }

    const { userId, email } = resolveTrackingUser(req);

    // Track event
    const event = await EventTrackingService.track({
      userId,
      userEmail: email,
      sessionId: (req as AuthRequest & { sessionId?: string }).sessionId,
      eventName,
      eventCategory,
      eventAction,
      resourceId,
      resourceType,
      properties,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      eventId: event?.id
    });
  } catch (error: any) {
    console.error('❌ Error tracking event:', error);
    res.status(500).json({
      error: 'Failed to track event',
      message: error.message
    });
  }
};

/**
 * POST /api/analytics/track-feature
 * Track feature usage from frontend
 */
export const trackFeatureUsage = async (req: AuthRequest, res: Response) => {
  try {
    const {
      featureName,
      action,
      resourceId,
      resourceType,
      properties
    } = req.body;

    if (!featureName || !action) {
      return res.status(400).json({
        error: 'Missing required fields: featureName, action'
      });
    }

    const { userId, email } = resolveTrackingUser(req);

    const event = await EventTrackingService.trackFeatureUsage({
      userId,
      userEmail: email,
      sessionId: (req as AuthRequest & { sessionId?: string }).sessionId,
      featureName,
      action,
      resourceId,
      resourceType,
      properties
    });

    res.json({
      success: true,
      eventId: event?.id
    });
  } catch (error: any) {
    console.error('❌ Error tracking feature usage:', error);
    res.status(500).json({
      error: 'Failed to track feature usage',
      message: error.message
    });
  }
};

/**
 * GET /api/analytics/events
 * Get user's events (for debugging or user dashboard)
 */
export const getUserEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.userId === 'anonymous') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 100;
    
    const events = await EventTrackingService.getUserEvents(req.user.userId, limit);

    res.json({
      success: true,
      events,
      count: events.length
    });
  } catch (error: any) {
    console.error('❌ Error fetching user events:', error);
    res.status(500).json({
      error: 'Failed to fetch events',
      message: error.message
    });
  }
};

/**
 * GET /api/analytics/activation-status
 * Get user's activation status
 */
export const getActivationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.userId === 'anonymous') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const activation = await EventTrackingService.getUserActivationStatus(req.user.userId);

    res.json({
      success: true,
      activation: activation || {
        is_activated: false,
        total_generations: 0,
        total_sessions: 0
      }
    });
  } catch (error: any) {
    console.error('❌ Error fetching activation status:', error);
    res.status(500).json({
      error: 'Failed to fetch activation status',
      message: error.message
    });
  }
};

/**
 * GET /api/analytics/sessions
 * Get user's sessions
 */
export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.userId === 'anonymous') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sessions = await EventTrackingService.getActiveSessions(req.user.userId);

    res.json({
      success: true,
      sessions,
      count: sessions?.length || 0
    });
  } catch (error: any) {
    console.error('❌ Error fetching sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions',
      message: error.message
    });
  }
};

/**
 * GET /api/analytics/stats
 * Get analytics statistics (requires admin or specific permissions)
 */
export const getAnalyticsStats = async (req: AuthRequest, res: Response) => {
  try {
    const {
      eventName,
      eventCategory,
      startDate,
      endDate,
      userId
    } = req.query;

    // If userId not provided, use authenticated user's ID
    const targetUserId =
      (userId as string) ||
      (req.user?.userId !== 'anonymous' ? req.user?.userId : undefined);

    const events = await EventTrackingService.getEventAnalytics({
      eventName: eventName as string,
      eventCategory: eventCategory as EventCategory,
      startDate: startDate as string,
      endDate: endDate as string,
      userId: targetUserId
    });

    // Calculate stats
    const stats = {
      total_events: events.length,
      unique_users: new Set(events.map(e => e.user_id)).size,
      events_by_category: events.reduce((acc: any, e) => {
        acc[e.event_category] = (acc[e.event_category] || 0) + 1;
        return acc;
      }, {}),
      events_by_name: events.reduce((acc: any, e) => {
        acc[e.event_name] = (acc[e.event_name] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      stats,
      events: events.slice(0, 50) // Return only first 50 events
    });
  } catch (error: any) {
    console.error('❌ Error fetching analytics stats:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics stats',
      message: error.message
    });
  }
};

/**
 * Mounted at /analytics — POST /track and /track-feature accept optional auth
 * (logged-in users get user_id on events; anonymous calls are ignored for user_id).
 */
export class AnalyticsApiController extends BaseController {
  public basePath = '/analytics';

  protected initializeRoutes(): void {
    this.routes = [
      {
        verb: 'POST',
        path: '/track',
        handler: trackEvent,
        middlewares: [optionalAuth],
      },
      {
        verb: 'POST',
        path: '/track-feature',
        handler: trackFeatureUsage,
        middlewares: [optionalAuth],
      },
    ];
  }
}

export default {
  trackEvent,
  trackFeatureUsage,
  getUserEvents,
  getActivationStatus,
  getUserSessions,
  getAnalyticsStats
};
