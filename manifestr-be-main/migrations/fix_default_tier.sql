-- =============================================
-- FIX DEFAULT TIER NAME
-- Change 'free' to 'backstage' to match pricing tiers
-- =============================================

-- Update the default value for new users
ALTER TABLE users ALTER COLUMN tier SET DEFAULT 'backstage';

-- Update existing users with 'free' tier to 'backstage'
UPDATE users 
SET tier = 'backstage' 
WHERE tier = 'free' OR tier IS NULL;

-- Verify the change
SELECT COUNT(*) as backstage_users 
FROM users 
WHERE tier = 'backstage';

SELECT '✅ Default tier updated to backstage' as result;
