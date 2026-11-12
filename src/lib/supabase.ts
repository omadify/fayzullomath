import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default / fallback Supabase credentials (or process.env / import.meta.env values)
const getSupabaseCredentials = () => {
  let url = '';
  let key = '';

  if (typeof process !== 'undefined' && process.env) {
    url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  }

  if (!url && typeof window !== 'undefined') {
    url = (window as any).env?.VITE_SUPABASE_URL || localStorage.getItem('supabase_url') || '';
    key = (window as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';
  }

  return { url, key };
};

const { url: initialUrl, key: initialKey } = getSupabaseCredentials();

// Project fallback URL and anon key if not explicitly set in environment
export const SUPABASE_URL = initialUrl || 'https://gysicpcivqmwwcjayvid.supabase.co';
export const SUPABASE_ANON_KEY = initialKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5c2ljcGNpdnFtd3djamF5dmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NTk3NDcsImV4cCI6MjEwODAzNTc0N30.ChfZqE4IKIU3efjkAhi-y_5qyKZIcYi_kKJxUiu82gY';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getCustomSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url, key);
}
