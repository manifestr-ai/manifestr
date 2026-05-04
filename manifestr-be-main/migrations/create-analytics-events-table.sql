-- =============================================
-- ANALYTICS EVENTS TABLE - Comprehensive Event Tracking
-- Run this in Supabase SQL Editor
-- =============================================

-- ===== ANALYTICS EVENTS TABLE =====
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    
    -- Event Information
    event_name VARCHAR(255) NOT NULL,
    event_category VARCHAR(100) NOT NULL, -- 'growth', 'retention', 'product_usage', 'ai_performance', 'feature_adoption', 'lifecycle'
    event_action VARCHAR(255) NOT NULL,
    
    -- Session Information
    session_id UUID,
    
    -- Acquisition Tracking
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    referrer TEXT,
    
    -- Device & Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    
    -- AI Performance Metrics
    ai_model VARCHAR(100),
    duration_ms INTEGER,
    tokens_used INTEGER,
    cost_usd DECIMAL(10, 6),
    
    -- Event Properties (flexible JSONB for additional data)
    properties JSONB DEFAULT '{}',
    
    -- Metadata
    resource_id UUID, -- Reference to vault_item, generation_job, style_guide, etc.
    resource_type VARCHAR(50), -- 'vault_item', 'generation_job', 'style_guide', etc.
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for fast querying
    CONSTRAINT chk_event_category CHECK (
        event_category IN (
            'growth', 'retention', 'product_usage', 
            'ai_performance', 'feature_adoption', 'lifecycle'
        )
    )
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_resource ON analytics_events(resource_id, resource_type);

-- ===== USER SESSIONS TABLE =====
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID UNIQUE NOT NULL,
    
    -- Session Information
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    
    -- Acquisition
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    referrer TEXT,
    
    -- Device Info
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    
    -- Activity Metrics
    events_count INTEGER DEFAULT 0,
    features_used JSONB DEFAULT '[]',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES FOR SESSIONS =====
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active) WHERE is_active = true;

-- ===== USER ACTIVATION TABLE =====
-- Tracks when users complete their activation milestones
CREATE TABLE IF NOT EXISTS user_activations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activation Milestones
    first_generation_at TIMESTAMPTZ,
    first_generation_type VARCHAR(50), -- 'presentation', 'document', 'spreadsheet', 'image'
    
    onboarding_completed_at TIMESTAMPTZ,
    style_guide_created_at TIMESTAMPTZ,
    first_share_at TIMESTAMPTZ,
    
    -- Activation Status
    is_activated BOOLEAN DEFAULT false,
    activated_at TIMESTAMPTZ,
    activation_duration_seconds INTEGER, -- Time from signup to activation
    
    -- Counts
    total_generations INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES FOR ACTIVATIONS =====
CREATE INDEX IF NOT EXISTS idx_user_activations_user_id ON user_activations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activations_is_activated ON user_activations(is_activated);

-- ===== AUTO-UPDATE TRIGGER FOR SESSIONS =====
CREATE TRIGGER update_user_sessions_updated_at 
BEFORE UPDATE ON user_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_activations_updated_at 
BEFORE UPDATE ON user_activations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== VIEWS FOR ANALYTICS =====

-- Daily Active Users View
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as dau
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Feature Usage View
CREATE OR REPLACE VIEW feature_usage_stats AS
SELECT 
    event_name,
    event_category,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    DATE(created_at) as date
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_name, event_category, DATE(created_at)
ORDER BY date DESC, event_count DESC;

-- User Activation Funnel View
CREATE OR REPLACE VIEW activation_funnel AS
SELECT 
    COUNT(DISTINCT u.id) as total_signups,
    COUNT(DISTINCT ua.user_id) FILTER (WHERE ua.onboarding_completed_at IS NOT NULL) as onboarding_completed,
    COUNT(DISTINCT ua.user_id) FILTER (WHERE ua.first_generation_at IS NOT NULL) as first_generation,
    COUNT(DISTINCT ua.user_id) FILTER (WHERE ua.is_activated = true) as activated_users,
    ROUND(
        COUNT(DISTINCT ua.user_id) FILTER (WHERE ua.is_activated = true)::numeric / 
        NULLIF(COUNT(DISTINCT u.id), 0) * 100, 
        2
    ) as activation_rate
FROM users u
LEFT JOIN user_activations ua ON u.id = ua.user_id
WHERE u.created_at >= NOW() - INTERVAL '30 days';

-- AI Performance Metrics View
CREATE OR REPLACE VIEW ai_performance_metrics AS
SELECT 
    event_name,
    ai_model,
    COUNT(*) as total_calls,
    AVG(duration_ms) as avg_duration_ms,
    SUM(tokens_used) as total_tokens,
    SUM(cost_usd) as total_cost_usd,
    AVG(cost_usd) as avg_cost_usd,
    DATE(created_at) as date
FROM analytics_events
WHERE event_category = 'ai_performance'
    AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_name, ai_model, DATE(created_at)
ORDER BY date DESC;

-- DONE!
SELECT '✅ ANALYTICS TABLES CREATED! Ready for event tracking!' as result;
