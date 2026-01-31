import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to check if Supabase is actually set up (prevents crashes if keys are missing)
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.length > 0 &&
    typeof supabaseKey === 'string' &&
    supabaseKey.length > 0
  );
};

// Create the client only if configured, otherwise create a dummy client
// that won't crash the app but won't work either
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  console.warn(
    'Supabase environment variables are missing. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. ' +
    'Using static data fallback.'
  );
}

// Export the client (may be null if not configured)
export const supabase = supabaseInstance as SupabaseClient;