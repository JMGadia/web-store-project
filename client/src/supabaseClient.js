import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If these are undefined, the app will crash with "supabaseUrl is required"
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase missing in Client! Check client/.env and restart Vite.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)