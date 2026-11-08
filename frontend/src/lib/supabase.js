import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://edlljnfcfynbiarwrzlv.supabase.co';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  envKey &&
    envKey.trim() !== '' &&
    envKey !== 'your-anon-key-here' &&
    !envKey.includes('your-anon-key')
);

// Gunakan placeholder key jika belum diisi agar createClient tidak throw exception saat startup
const supabaseAnonKey = isSupabaseConfigured
  ? envKey.trim()
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
