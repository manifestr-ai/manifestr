-- =============================================
-- CLEANUP ORPHANED IDENTITIES
-- =============================================
-- This script fixes the "Database error checking email" issue
-- that occurs when auth.identities has records without 
-- corresponding users in auth.users.
--
-- WHEN TO USE THIS:
-- - When you see "Database error checking email" during signup
-- - When a user was deleted but their identity record remains
-- - As part of regular database maintenance
-- =============================================

-- Step 1: Find orphaned identities (for review)
SELECT 
    i.id,
    i.email,
    i.user_id,
    i.provider,
    i.created_at
FROM auth.identities i
LEFT JOIN auth.users u ON i.user_id = u.id
WHERE u.id IS NULL
ORDER BY i.created_at DESC;

-- Step 2: Count orphaned identities
SELECT COUNT(*) as orphaned_count
FROM auth.identities i
LEFT JOIN auth.users u ON i.user_id = u.id
WHERE u.id IS NULL;

-- Step 3: Delete orphaned identities (UNCOMMENT TO EXECUTE)
-- WARNING: This will permanently delete orphaned identity records
-- DELETE FROM auth.identities
-- WHERE id IN (
--     SELECT i.id
--     FROM auth.identities i
--     LEFT JOIN auth.users u ON i.user_id = u.id
--     WHERE u.id IS NULL
-- );

-- Step 4: Delete orphaned identity for a specific email (RECOMMENDED)
-- Replace 'user@example.com' with the actual email address
-- DELETE FROM auth.identities 
-- WHERE email = 'user@example.com' 
-- AND user_id NOT IN (SELECT id FROM auth.users);

-- =============================================
-- PREVENTION: Create a trigger to auto-cleanup
-- =============================================
-- This trigger automatically deletes identity records 
-- when a user is deleted from auth.users

CREATE OR REPLACE FUNCTION cleanup_orphaned_identities()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete all identities associated with the deleted user
    DELETE FROM auth.identities WHERE user_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_cleanup_identities ON auth.users;

-- Create trigger that runs BEFORE user deletion
CREATE TRIGGER trigger_cleanup_identities
    BEFORE DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_orphaned_identities();

-- Verify trigger is created
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_cleanup_identities';

-- ✅ Done! This trigger will prevent orphaned identities in the future.
