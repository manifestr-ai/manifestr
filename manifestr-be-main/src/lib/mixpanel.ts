import Mixpanel from 'mixpanel';

// Initialize Mixpanel
const mixpanel = process.env.MIXPANEL_TOKEN 
  ? Mixpanel.init(process.env.MIXPANEL_TOKEN, {
      protocol: 'https',
      debug: process.env.NODE_ENV !== 'production',
    })
  : null;

// Warn if Mixpanel token is not configured
if (!process.env.MIXPANEL_TOKEN) {
  console.warn('⚠️  Mixpanel token not configured. Analytics will not be tracked.');
}

/**
 * Track an event in Mixpanel
 * @param eventName - Name of the event to track
 * @param userId - User ID (optional, can be email or unique identifier)
 * @param properties - Additional properties for the event
 */
export const trackEvent = (
  eventName: string,
  userId?: string,
  properties?: Record<string, any>
) => {
  if (!mixpanel) {
    console.log('[Mixpanel Mock]', eventName, { userId, ...properties });
    return;
  }

  try {
    const eventData = {
      distinct_id: userId || 'anonymous',
      ...properties,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };

    mixpanel.track(eventName, eventData);
    console.log(`✅ Tracked event: ${eventName}`, eventData);
  } catch (error) {
    console.error('Error tracking Mixpanel event:', error);
  }
};

/**
 * Set user profile properties
 * @param userId - User ID
 * @param properties - User properties to set
 */
export const setUserProfile = (
  userId: string,
  properties: Record<string, any>
) => {
  if (!mixpanel) return;

  try {
    mixpanel.people.set(userId, {
      ...properties,
      $last_seen: new Date().toISOString(),
    });
    console.log(`✅ Set user profile: ${userId}`, properties);
  } catch (error) {
    console.error('Error setting Mixpanel user profile:', error);
  }
};

/**
 * Increment a user profile property
 * @param userId - User ID
 * @param property - Property name to increment
 * @param value - Value to increment by (default: 1)
 */
export const incrementUserProperty = (
  userId: string,
  property: string,
  value: number = 1
) => {
  if (!mixpanel) return;

  try {
    mixpanel.people.increment(userId, property, value);
    console.log(`✅ Incremented user property: ${userId}.${property} by ${value}`);
  } catch (error) {
    console.error('Error incrementing Mixpanel user property:', error);
  }
};

/**
 * Track a revenue event
 * @param userId - User ID
 * @param amount - Revenue amount
 * @param properties - Additional properties
 */
export const trackRevenue = (
  userId: string,
  amount: number,
  properties?: Record<string, any>
) => {
  if (!mixpanel) return;

  try {
    mixpanel.people.track_charge(userId, amount, {
      ...properties,
      $time: new Date().toISOString(),
    });
    console.log(`✅ Tracked revenue: ${userId} - $${amount}`, properties);
  } catch (error) {
    console.error('Error tracking Mixpanel revenue:', error);
  }
};

/**
 * Common event tracking helpers
 */
export const MixpanelEvents = {
  // User Events
  USER_SIGNED_UP: 'User Signed Up',
  USER_LOGGED_IN: 'User Logged In',
  USER_LOGGED_OUT: 'User Logged Out',
  USER_PROFILE_UPDATED: 'User Profile Updated',
  
  // Document Events
  DOCUMENT_CREATED: 'Document Created',
  DOCUMENT_GENERATED: 'Document Generated',
  DOCUMENT_MODIFIED: 'Document Modified',
  DOCUMENT_DELETED: 'Document Deleted',
  DOCUMENT_SHARED: 'Document Shared',
  DOCUMENT_DOWNLOADED: 'Document Downloaded',
  
  // Presentation Events
  PRESENTATION_CREATED: 'Presentation Created',
  PRESENTATION_GENERATED: 'Presentation Generated',
  PRESENTATION_MODIFIED: 'Presentation Modified',
  PRESENTATION_DELETED: 'Presentation Deleted',
  PRESENTATION_SHARED: 'Presentation Shared',
  PRESENTATION_DOWNLOADED: 'Presentation Downloaded',
  
  // Spreadsheet Events
  SPREADSHEET_CREATED: 'Spreadsheet Created',
  SPREADSHEET_GENERATED: 'Spreadsheet Generated',
  SPREADSHEET_MODIFIED: 'Spreadsheet Modified',
  SPREADSHEET_DELETED: 'Spreadsheet Deleted',
  SPREADSHEET_SHARED: 'Spreadsheet Shared',
  SPREADSHEET_DOWNLOADED: 'Spreadsheet Downloaded',
  
  // Image Events
  IMAGE_CREATED: 'Image Created',
  IMAGE_GENERATED: 'Image Generated',
  IMAGE_MODIFIED: 'Image Modified',
  IMAGE_DELETED: 'Image Deleted',
  IMAGE_SHARED: 'Image Shared',
  IMAGE_DOWNLOADED: 'Image Downloaded',
  
  // Chart Events
  CHART_CREATED: 'Chart Created',
  CHART_GENERATED: 'Chart Generated',
  CHART_MODIFIED: 'Chart Modified',
  CHART_DELETED: 'Chart Deleted',
  
  // Style Guide Events
  STYLE_GUIDE_CREATED: 'Style Guide Created',
  STYLE_GUIDE_APPLIED: 'Style Guide Applied',
  STYLE_GUIDE_DELETED: 'Style Guide Deleted',
  
  // AI Events
  AI_PROMPT_SENT: 'AI Prompt Sent',
  AI_GENERATION_STARTED: 'AI Generation Started',
  AI_GENERATION_COMPLETED: 'AI Generation Completed',
  AI_GENERATION_FAILED: 'AI Generation Failed',
  
  // Collaboration Events
  COLLAB_SESSION_STARTED: 'Collaboration Session Started',
  COLLAB_SESSION_ENDED: 'Collaboration Session Ended',
  COLLAB_USER_JOINED: 'Collaboration User Joined',
  COLLAB_USER_LEFT: 'Collaboration User Left',
  
  // Vault Events
  VAULT_ITEM_SAVED: 'Vault Item Saved',
  VAULT_ITEM_ACCESSED: 'Vault Item Accessed',
  VAULT_ITEM_DELETED: 'Vault Item Deleted',
  
  // Upload Events
  FILE_UPLOADED: 'File Uploaded',
  FILE_UPLOAD_FAILED: 'File Upload Failed',
  
  // Error Events
  ERROR_OCCURRED: 'Error Occurred',
  API_ERROR: 'API Error',
};

export default mixpanel;
