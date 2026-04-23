
-- =============================================
-- MANIFESTR - Is Admin SCHEMA
-- Run this ONCE in Supabase SQL Editor
-- =============================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
