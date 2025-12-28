const { createClient } = require('@supabase/supabase-js')
// Note: Do NOT use require('dotenv').config() here.
// Do it in your main index.js so it covers the whole server.

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase missing in Server! Check server/.env file.")
}

const supabase = createClient(supabaseUrl, supabaseKey)
module.exports = supabase