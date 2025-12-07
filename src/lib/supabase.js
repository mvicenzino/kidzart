import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Database features will not work.');
}

/**
 * Supabase Client for KidzArt
 * 
 * Usage:
 * import { supabase } from './lib/supabase';
 * 
 * const { data, error } = await supabase.from('artworks').select('*');
 */
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
