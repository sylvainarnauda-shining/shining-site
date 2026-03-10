import { createClient } from '@supabase/supabase-js';

// Client-side Supabase (anon key, safe for browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;
