-- Notifications for in-app user activity.
-- Run this in Supabase SQL Editor before using the live notification UI.

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(80) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT 'system',
    severity VARCHAR(20) NOT NULL DEFAULT 'normal',
    title VARCHAR(255) NOT NULL,
    body TEXT,
    entity_type VARCHAR(80),
    entity_id UUID,
    action_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    read_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON notifications(user_id, read_at)
    WHERE read_at IS NULL AND dismissed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_category
    ON notifications(user_id, category);

CREATE INDEX IF NOT EXISTS idx_notifications_entity
    ON notifications(entity_type, entity_id);
