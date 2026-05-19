-- Create stripe_webhook_events table for idempotency
-- This prevents duplicate webhook processing

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id BIGSERIAL PRIMARY KEY,
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_stripe_event_id 
    ON stripe_webhook_events(stripe_event_id);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_created_at 
    ON stripe_webhook_events(created_at);

-- Comment
COMMENT ON TABLE stripe_webhook_events IS 'Tracks Stripe webhook events to prevent duplicate processing';
