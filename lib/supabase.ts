import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key missing in environment variables');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

export const getAppLogoUrl = () => {
    const { data } = supabase.storage
        .from('marketplace')
        .getPublicUrl('app/logo.png');

    // Add cache busting timestamp to ensure new uploads reflect immediately
    return `${data.publicUrl}?t=${new Date().getTime()}`;
};
