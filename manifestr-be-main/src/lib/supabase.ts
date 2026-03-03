import { createClient } from '@supabase/supabase-js';

// Environment variables should be loaded by index.ts before this module is imported
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Use anon key for auth operations

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Admin client for backend operations (bypasses RLS, full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Regular client for auth operations (triggers emails, webhooks, etc.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export default supabaseAdmin;

