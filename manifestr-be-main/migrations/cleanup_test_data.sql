-- 🔥 NUCLEAR CLEANUP - DELETES EVERYTHING!
-- Automatically detects and deletes from ALL TABLES (skips views)

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Disable foreign key constraints
    SET session_replication_role = replica;
    
    RAISE NOTICE 'Starting cleanup...';
    
    -- Delete from all tables in public schema (automatically skips views)
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
    ) LOOP
        BEGIN
            EXECUTE 'DELETE FROM ' || quote_ident(r.tablename);
            RAISE NOTICE 'Deleted from table: %', r.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped (error): %', r.tablename;
        END;
    END LOOP;
    
    -- Delete from auth.users
    DELETE FROM auth.users;
    RAISE NOTICE 'Deleted from: auth.users';
    
    -- Re-enable foreign key constraints
    SET session_replication_role = DEFAULT;
    
    RAISE NOTICE '🔥 DATABASE COMPLETELY WIPED!';
END $$;

-- Show counts to verify
SELECT 
    'auth.users' as table_name, 
    COUNT(*) as remaining 
FROM auth.users
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'users', COUNT(*) FROM users;

