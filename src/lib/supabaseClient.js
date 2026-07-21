import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env and fill in your project URL and anon key.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Keeps the user logged in across page reloads, so they don't have to log in again.
    persistSession: true,
    // Automatically refreshes the session token before it expires, so the user doesn't get logged out in the middle of a session.
    autoRefreshToken: true,
    // When true, Supabase will check the URL for a session when the page loads
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})
