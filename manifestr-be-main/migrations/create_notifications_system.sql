-- =====================================================
-- NOTIFICATIONS SYSTEM MIGRATION
-- Created: 2026-05-18
-- Description: Creates tables for the notification system
-- =====================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Notification type and priority
    type TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical', 'important', 'normal')),
    
    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Action
    action_url TEXT,
    action_text TEXT,
    
    -- Resource linking
    resource_id UUID,
    resource_type TEXT,
    
    -- Actor (who triggered this notification)
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name TEXT,
    actor_avatar TEXT,
    
    -- Metadata (flexible JSON for additional data)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_archived BOOLEAN DEFAULT false,
    archived_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Email notifications
    email_collab_invite BOOLEAN DEFAULT true,
    email_thread_mention BOOLEAN DEFAULT true,
    email_wins_low BOOLEAN DEFAULT true,
    email_important_only BOOLEAN DEFAULT false,
    
    -- In-app notifications
    app_collaboration BOOLEAN DEFAULT true,
    app_threads BOOLEAN DEFAULT true,
    app_wins BOOLEAN DEFAULT true,
    
    -- Digest settings
    enable_daily_digest BOOLEAN DEFAULT false,
    digest_time TIME DEFAULT '09:00:00',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================

-- Index for fetching user's notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Index for unread notifications count
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Index for filtering by priority
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

-- Index for archived notifications
CREATE INDEX IF NOT EXISTS idx_notifications_archived ON public.notifications(user_id, is_archived) WHERE is_archived = false;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Notifications: Users can update their own notifications (mark as read, archive, etc.)
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Notifications: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Notifications: System can insert notifications for any user (service role)
CREATE POLICY "Service role can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- Notification Preferences: Users can view their own preferences
CREATE POLICY "Users can view their own preferences"
    ON public.notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

-- Notification Preferences: Users can insert their own preferences
CREATE POLICY "Users can insert their own preferences"
    ON public.notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Notification Preferences: Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
    ON public.notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp for notifications
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Auto-update updated_at timestamp for notification_preferences
CREATE TRIGGER trigger_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- =====================================================
-- CLEANUP: Auto-delete expired notifications
-- =====================================================

-- Create a function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM public.notifications
    WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE NOTIFICATION TYPES (for reference)
-- =====================================================

-- Collaboration: collab_invite, collab_invite_accepted, collab_invite_declined,
--                collab_added, collab_removed, collab_role_changed,
--                collab_session_joined, collab_session_left,
--                collab_project_invite, collab_project_member_added

-- Wins & Usage: wins_low, wins_depleted, wins_added,
--               wins_monthly_reset, wins_large_deduction

-- Threads: thread_created, thread_message, thread_reply,
--          thread_mention, thread_assigned, thread_resolved,
--          thread_reaction, thread_status_changed

-- Generic: document_shared, document_deleted, access_revoked

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;

-- Grant permissions to service role
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.notification_preferences TO service_role;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON TABLE public.notifications IS 'Stores user notifications for collaboration, wins, threads, and system events';
COMMENT ON TABLE public.notification_preferences IS 'Stores user preferences for notification delivery and settings';
