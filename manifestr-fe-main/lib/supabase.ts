/**
 * Supabase Client (Frontend)
 * For real-time collaboration features
 * 
 * SAFE: NEW file for collaboration only
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://buhxshqfkypquptmmdyy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1aHhzaHFma3lwcXVwdG1tZHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODQzOTcsImV4cCI6MjA4NjE2MDM5N30.bwq3APDcwvqu8ZYyONhjI-SNNShuCGQcxe71rJubEu0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
