import { createClient } from '@supabase/supabase-js'

// MUST use import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This will help you find the problem in the console
if (!supabaseUrl) {
    console.error("DEBUG: VITE_SUPABASE_URL is missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey)