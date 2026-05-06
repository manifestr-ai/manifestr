/**
 * EVENT TRACKING SERVICE
 * 
 * Generic, reusable service for tracking all user activities and events
 * Can be used anywhere in the app to track events and store them in the database
 * 
 * Usage Examples:
 * 
 * // Track a simple event
 * await EventTrackingService.track({
 *   userId: 'user-123',
 *   eventName: 'Document Created',
 *   eventCategory: 'product_usage',
 *   eventAction: 'create_document'
 * });
 * 
 * // Track AI generation with performance metrics
 * await EventTrackingService.trackAIGeneration({
 *   userId: 'user-123',
 *   eventName: 'AI Generation Completed',
 *   aiModel: 'claude-sonnet-4-20250514',
 *   durationMs: 1500,
 *   tokensUsed: 2000,
 *   costUsd: 0.05,
 *   resourceId: 'job-id',
 *   resourceType: 'generation_job'
 * });
 * 
 * // Track user activation
 * await EventTrackingService.trackActivation({
 *   userId: 'user-123',
 *   activationType: 'first_generation',
 *   generationType: 'presentation'
 * });
 */

import { supabaseAdmin } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export type EventCategory = 
  | 'growth'              // Signups, acquisition
  | 'retention'           // Sessions, returning users
  | 'product_usage'       // Feature usage
  | 'ai_performance'      // AI metrics
  | 'feature_adoption'    // Feature adoption metrics
  | 'lifecycle';          // Onboarding, activation

export interface TrackEventOptions {
  // Required
  eventName: string;
  eventCategory: EventCategory;
  eventAction: string;
  
  // User Info
  userId?: string;
  userEmail?: string;
  
  // Session
  sessionId?: string;
  
  // Acquisition
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  
  // Device Info
  ipAddress?: string;
  userAgent?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  
  // AI Performance
  aiModel?: string;
  durationMs?: number;
  tokensUsed?: number;
  costUsd?: number;
  
  // Resource Reference
  resourceId?: string;
  resourceType?: string;
  
  // Additional Properties
  properties?: Record<string, any>;
}

export interface SessionData {
  userId?: string;
  sessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

export class EventTrackingService {
  /**
   * Track any event - Main generic method
   */
  static async track(options: TrackEventOptions): Promise<any> {
    try {
      const eventData = {
        id: uuidv4(),
        user_id: options.userId || null,
        user_email: options.userEmail || null,
        event_name: options.eventName,
        event_category: options.eventCategory,
        event_action: options.eventAction,
        session_id: options.sessionId || null,
        
        // Acquisition
        utm_source: options.utmSource || null,
        utm_medium: options.utmMedium || null,
        utm_campaign: options.utmCampaign || null,
        utm_term: options.utmTerm || null,
        utm_content: options.utmContent || null,
        referrer: options.referrer || null,
        
        // Device
        ip_address: options.ipAddress || null,
        user_agent: options.userAgent || null,
        device_type: options.deviceType || null,
        browser: options.browser || null,
        os: options.os || null,
        
        // AI Performance
        ai_model: options.aiModel || null,
        duration_ms: options.durationMs || null,
        tokens_used: options.tokensUsed || null,
        cost_usd: options.costUsd || null,
        
        // Resource
        resource_id: options.resourceId || null,
        resource_type: options.resourceType || null,
        
        // Properties
        properties: options.properties || {},
        
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabaseAdmin
        .from('analytics_events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to track event:', error);
        throw error;
      }

      console.log(`✅ Event tracked: ${options.eventName} (${options.eventCategory})`);
      return data;
    } catch (error) {
      console.error('❌ Error tracking event:', error);
      // Don't throw - we don't want event tracking to break the app
      return null;
    }
  }

  /**
   * Track AI Generation Events with Performance Metrics
   */
  static async trackAIGeneration(options: {
    userId?: string;
    userEmail?: string;
    eventName: string;
    aiModel: string;
    durationMs: number;
    tokensUsed: number;
    costUsd: number;
    resourceId?: string;
    resourceType?: string;
    properties?: Record<string, any>;
  }) {
    return await this.track({
      ...options,
      eventCategory: 'ai_performance',
      eventAction: 'ai_generation',
    });
  }

  /**
   * Track User Signup
   */
  static async trackSignup(options: {
    userId: string;
    userEmail: string;
    sessionId?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referrer?: string;
    ipAddress?: string;
    userAgent?: string;
    properties?: Record<string, any>;
  }) {
    return await this.track({
      ...options,
      eventName: 'User Signed Up',
      eventCategory: 'growth',
      eventAction: 'signup',
    });
  }

  /**
   * Track User Login
   */
  static async trackLogin(options: {
    userId: string;
    userEmail: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    properties?: Record<string, any>;
  }) {
    return await this.track({
      ...options,
      eventName: 'User Logged In',
      eventCategory: 'retention',
      eventAction: 'login',
    });
  }

  /**
   * Track Session Start
   */
  static async trackSessionStart(sessionData: SessionData) {
    // Create session in database
    const sessionId = sessionData.sessionId || uuidv4();
    
    try {
      const { data, error } = await supabaseAdmin
        .from('user_sessions')
        .insert({
          user_id: sessionData.userId || null,
          session_id: sessionId,
          utm_source: sessionData.utmSource || null,
          utm_medium: sessionData.utmMedium || null,
          utm_campaign: sessionData.utmCampaign || null,
          utm_term: sessionData.utmTerm || null,
          utm_content: sessionData.utmContent || null,
          referrer: sessionData.referrer || null,
          ip_address: sessionData.ipAddress || null,
          user_agent: sessionData.userAgent || null,
          device_type: sessionData.deviceType || null,
          browser: sessionData.browser || null,
          os: sessionData.os || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Track event
      await this.track({
        userId: sessionData.userId,
        sessionId: sessionId,
        eventName: 'Session Started',
        eventCategory: 'retention',
        eventAction: 'session_start',
        utmSource: sessionData.utmSource,
        utmMedium: sessionData.utmMedium,
        utmCampaign: sessionData.utmCampaign,
        utmTerm: sessionData.utmTerm,
        utmContent: sessionData.utmContent,
        referrer: sessionData.referrer,
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        deviceType: sessionData.deviceType as 'desktop' | 'mobile' | 'tablet' | undefined,
        browser: sessionData.browser,
        os: sessionData.os
      });

      console.log(`✅ Session started: ${sessionId}`);
      return data;
    } catch (error) {
      console.error('❌ Error starting session:', error);
      return null;
    }
  }

  /**
   * Update Session Activity
   */
  static async updateSessionActivity(sessionId: string, featureUsed?: string) {
    try {
      const updates: any = {
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Increment events count
      const { data: session } = await supabaseAdmin
        .from('user_sessions')
        .select('events_count, features_used')
        .eq('session_id', sessionId)
        .single();

      if (session) {
        updates.events_count = (session.events_count || 0) + 1;

        // Add feature to features_used array if provided
        if (featureUsed) {
          const featuresUsed = session.features_used || [];
          if (!featuresUsed.includes(featureUsed)) {
            updates.features_used = [...featuresUsed, featureUsed];
          }
        }
      }

      await supabaseAdmin
        .from('user_sessions')
        .update(updates)
        .eq('session_id', sessionId);

    } catch (error) {
      console.error('❌ Error updating session activity:', error);
    }
  }

  /**
   * End Session
   */
  static async endSession(sessionId: string) {
    try {
      const { data: session } = await supabaseAdmin
        .from('user_sessions')
        .select('started_at')
        .eq('session_id', sessionId)
        .single();

      if (session) {
        const startTime = new Date(session.started_at).getTime();
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - startTime) / 1000);

        await supabaseAdmin
          .from('user_sessions')
          .update({
            ended_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);

        console.log(`✅ Session ended: ${sessionId} (${durationSeconds}s)`);
      }
    } catch (error) {
      console.error('❌ Error ending session:', error);
    }
  }

  /**
   * Track Feature Usage
   */
  static async trackFeatureUsage(options: {
    userId?: string;
    userEmail?: string;
    sessionId?: string;
    featureName: string;
    action: string;
    resourceId?: string;
    resourceType?: string;
    properties?: Record<string, any>;
  }) {
    // Update session if sessionId provided
    if (options.sessionId) {
      await this.updateSessionActivity(options.sessionId, options.featureName);
    }

    return await this.track({
      ...options,
      eventName: options.featureName,
      eventCategory: 'feature_adoption',
      eventAction: options.action,
    });
  }

  /**
   * Read `feature_adoption` rows from `analytics_events` (same store as {@link trackFeatureUsage}).
   * Used by admin dashboards; keep limit bounded for API latency.
   */
  static async getFeatureAdoptionAnalyticsRows(
    startIso: string,
    endIsoExclusive?: string,
    limit = 15000,
  ): Promise<
    Array<{
      user_id: string | null;
      event_name: string;
      event_action: string;
    }>
  > {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("user_id, event_name, event_action")
      .eq("event_category", "feature_adoption")
      .gte("created_at", startIso)
      .limit(limit);
    if (endIsoExclusive) {
      q = q.lt("created_at", endIsoExclusive);
    }
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Array<{
      user_id: string | null;
      event_name: string;
      event_action: string;
    }>;
  }

  /**
   * Track User Activation Milestones
   */
  static async trackActivation(options: {
    userId: string;
    activationType: 'first_generation' | 'onboarding_completed' | 'style_guide_created' | 'first_share';
    generationType?: 'presentation' | 'document' | 'spreadsheet' | 'image' | 'chart';
  }) {
    try {
      // Get or create user activation record
      let { data: activation } = await supabaseAdmin
        .from('user_activations')
        .select('*')
        .eq('user_id', options.userId)
        .single();

      const now = new Date().toISOString();
      const updates: any = {};

      // Update specific milestone
      switch (options.activationType) {
        case 'first_generation':
          if (!activation?.first_generation_at) {
            updates.first_generation_at = now;
            updates.first_generation_type = options.generationType;
            updates.total_generations = 1;
          } else {
            updates.total_generations = (activation.total_generations || 0) + 1;
          }
          break;
        
        case 'onboarding_completed':
          if (!activation?.onboarding_completed_at) {
            updates.onboarding_completed_at = now;
          }
          break;
        
        case 'style_guide_created':
          if (!activation?.style_guide_created_at) {
            updates.style_guide_created_at = now;
          }
          break;
        
        case 'first_share':
          if (!activation?.first_share_at) {
            updates.first_share_at = now;
          }
          break;
      }

      // Check if user should be marked as activated
      // Activation = first generation completed
      if (options.activationType === 'first_generation' && !activation?.is_activated) {
        updates.is_activated = true;
        updates.activated_at = now;

        // Calculate activation duration
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('created_at')
          .eq('id', options.userId)
          .single();

        if (user) {
          const signupTime = new Date(user.created_at).getTime();
          const activationTime = new Date(now).getTime();
          updates.activation_duration_seconds = Math.floor((activationTime - signupTime) / 1000);
        }
      }

      // Upsert activation record
      if (!activation) {
        await supabaseAdmin
          .from('user_activations')
          .insert({
            user_id: options.userId,
            ...updates
          });
      } else {
        await supabaseAdmin
          .from('user_activations')
          .update(updates)
          .eq('user_id', options.userId);
      }

      // Track event
      await this.track({
        userId: options.userId,
        eventName: `User ${options.activationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        eventCategory: 'lifecycle',
        eventAction: options.activationType,
        properties: { generation_type: options.generationType }
      });

      console.log(`✅ Activation tracked: ${options.activationType} for user ${options.userId}`);
    } catch (error) {
      console.error('❌ Error tracking activation:', error);
    }
  }

  /**
   * Track Document/Presentation/Spreadsheet Creation
   */
  static async trackContentCreation(options: {
    userId: string;
    userEmail?: string;
    sessionId?: string;
    contentType: 'presentation' | 'document' | 'spreadsheet' | 'image' | 'chart';
    action: 'created' | 'generated' | 'modified' | 'deleted' | 'shared' | 'downloaded';
    resourceId: string;
    properties?: Record<string, any>;
  }) {
    const eventNameMap = {
      presentation: 'Presentation',
      document: 'Document',
      spreadsheet: 'Spreadsheet',
      image: 'Image',
      chart: 'Chart'
    };

    const actionMap = {
      created: 'Created',
      generated: 'Generated',
      modified: 'Modified',
      deleted: 'Deleted',
      shared: 'Shared',
      downloaded: 'Downloaded'
    };

    const eventName = `${eventNameMap[options.contentType]} ${actionMap[options.action]}`;

    // Track activation on first generation
    if (options.action === 'generated') {
      await this.trackActivation({
        userId: options.userId,
        activationType: 'first_generation',
        generationType: options.contentType
      });
    }

    return await this.track({
      userId: options.userId,
      userEmail: options.userEmail,
      sessionId: options.sessionId,
      eventName,
      eventCategory: 'product_usage',
      eventAction: `${options.contentType}_${options.action}`,
      resourceId: options.resourceId,
      resourceType: options.contentType,
      properties: options.properties
    });
  }

  /**
   * Get User Events
   */
  static async getUserEvents(userId: string, limit: number = 100) {
    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Get Event Analytics
   */
  static async getEventAnalytics(options: {
    eventName?: string;
    eventCategory?: EventCategory;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }) {
    let query = supabaseAdmin
      .from('analytics_events')
      .select('*');

    if (options.eventName) {
      query = query.eq('event_name', options.eventName);
    }

    if (options.eventCategory) {
      query = query.eq('event_category', options.eventCategory);
    }

    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options.startDate) {
      query = query.gte('created_at', options.startDate);
    }

    if (options.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get Active Sessions
   */
  static async getActiveSessions(userId?: string) {
    let query = supabaseAdmin
      .from('user_sessions')
      .select('*')
      .eq('is_active', true);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get User Activation Status
   */
  static async getUserActivationStatus(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('user_activations')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}

export default EventTrackingService;
