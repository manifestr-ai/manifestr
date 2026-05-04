/**
 * ANALYTICS ROUTES
 * 
 * Routes for event tracking and analytics
 */

import express from 'express';
import analyticsController from '../controllers/analytics.controller';

const router = express.Router();

// ===== PUBLIC ROUTES =====
// These can be called without authentication (but will track anonymous users)

/**
 * POST /api/analytics/track
 * Track any event from frontend
 * 
 * Body:
 * {
 *   eventName: string;
 *   eventCategory: 'growth' | 'retention' | 'product_usage' | 'ai_performance' | 'feature_adoption' | 'lifecycle';
 *   eventAction: string;
 *   resourceId?: string;
 *   resourceType?: string;
 *   properties?: Record<string, any>;
 * }
 */
router.post('/track', analyticsController.trackEvent);

/**
 * POST /api/analytics/track-feature
 * Track feature usage from frontend
 * 
 * Body:
 * {
 *   featureName: string;
 *   action: string;
 *   resourceId?: string;
 *   resourceType?: string;
 *   properties?: Record<string, any>;
 * }
 */
router.post('/track-feature', analyticsController.trackFeatureUsage);

// ===== PROTECTED ROUTES =====
// These require authentication - apply your auth middleware here

/**
 * GET /api/analytics/events?limit=100
 * Get user's event history
 * Query Params:
 * - limit: number (default: 100)
 */
router.get('/events', analyticsController.getUserEvents);

/**
 * GET /api/analytics/activation-status
 * Get user's activation status and milestones
 */
router.get('/activation-status', analyticsController.getActivationStatus);

/**
 * GET /api/analytics/sessions
 * Get user's active sessions
 */
router.get('/sessions', analyticsController.getUserSessions);

/**
 * GET /api/analytics/stats
 * Get analytics statistics
 * Query Params:
 * - eventName?: string
 * - eventCategory?: string
 * - startDate?: string (ISO date)
 * - endDate?: string (ISO date)
 * - userId?: string (admin only)
 */
router.get('/stats', analyticsController.getAnalyticsStats);

export default router;
