/**
 * SESSION TRACKING MIDDLEWARE
 * 
 * Automatically tracks user sessions and activity
 * Attaches sessionId to requests for use in controllers
 */

import { Request, Response, NextFunction } from 'express';
import EventTrackingService from '../services/EventTracking.service';
import { v4 as uuidv4 } from 'uuid';

export interface SessionRequest extends Request {
  sessionId?: string;
  user?: any;
}

/**
 * Session Tracking Middleware
 * Tracks user sessions and attaches sessionId to request
 */
export const sessionTrackingMiddleware = () => {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
      // Get session ID from cookie or header
      let sessionId = req.cookies?.sessionId || req.headers['x-session-id'] as string;
      
      // Skip session creation for health check endpoints
      const skipPaths = ['/health', '/status', '/api/health'];
      if (skipPaths.includes(req.path)) {
        return next();
      }

      if (!sessionId) {
        // Start new session
        const session = await EventTrackingService.trackSessionStart({
          userId: req.user?.id,
          utmSource: req.query.utm_source as string,
          utmMedium: req.query.utm_medium as string,
          utmCampaign: req.query.utm_campaign as string,
          utmTerm: req.query.utm_term as string,
          utmContent: req.query.utm_content as string,
          referrer: req.headers.referer,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        });
        
        sessionId = session?.session_id || uuidv4();
        
        // Set cookie (24 hour expiry)
        res.cookie('sessionId', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'lax'
        });

        console.log(`📍 New session started: ${sessionId}`);
      } else {
        // Update existing session activity
        await EventTrackingService.updateSessionActivity(sessionId);
      }
      
      // Attach sessionId to request for use in controllers
      req.sessionId = sessionId;
      
      next();
    } catch (error) {
      console.error('❌ Session tracking middleware error:', error);
      // Don't block request on tracking errors
      next();
    }
  };
};

/**
 * Session End Middleware
 * Call this on logout to end the session
 */
export const endSessionMiddleware = () => {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.sessionId || req.cookies?.sessionId;
      
      if (sessionId) {
        await EventTrackingService.endSession(sessionId);
        
        // Clear session cookie
        res.clearCookie('sessionId');
        
        console.log(`📍 Session ended: ${sessionId}`);
      }
      
      next();
    } catch (error) {
      console.error('❌ End session middleware error:', error);
      next();
    }
  };
};

export default sessionTrackingMiddleware;
